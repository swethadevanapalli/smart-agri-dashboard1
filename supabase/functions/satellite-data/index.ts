import { corsHeaders } from "../_shared/cors.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { bbox } = await req.json();

    if (!bbox) {
      throw new Error("Bounding box is required");
    }

    const clientId = Deno.env.get("SENTINELHUB_CLIENT_ID");
    const clientSecret = Deno.env.get("SENTINELHUB_CLIENT_SECRET");

    if (!clientId || !clientSecret) {
      throw new Error("SentinelHub credentials missing.");
    }

    // 🔐 AUTH
    const tokenResponse = await fetch(
      "https://services.sentinel-hub.com/oauth/token",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body:
          `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`,
      },
    );

    const { access_token } = await tokenResponse.json();

    // 🟢 PROCESS API URL
    const url = "https://services.sentinel-hub.com/api/v1/process";

    // 🟢 FAST NDVI-only evalscript
    const evalscript = `
      //VERSION=3
      function setup() {
        return {
          input: [{ bands: ["B04", "B08"] }],
          output: [
            { id: "ndvi", bands: 1, sampleType: "FLOAT32" }
          ]
        };
      }

      function evaluatePixel(s) {
        let ndvi = (s.B08 - s.B04) / (s.B08 + s.B04);
        return { ndvi: [ndvi] };
      }
    `;

    // 🟢 Request body
    const body = {
      input: {
        bounds: {
          bbox,
        },
        data: [
          {
            type: "sentinel-2-l2a",
            dataFilter: {
              maxCloudCoverage: 20,
            },
          },
        ],
      },
      output: {
        width: 512,
        height: 512,
        responses: [
          { identifier: "ndvi", format: { type: "image/tiff" } },
        ],
      },
      evalscript,
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(err);
    }

    const arrayBuffer = await response.arrayBuffer();
    const ndviValues = new Float32Array(arrayBuffer);

    // Calculate avg NDVI
    let sum = 0;
    let count = 0;
    for (let v of ndviValues) {
      if (v > -1 && v < 1) {
        sum += v;
        count++;
      }
    }

    const avg = count > 0 ? sum / count : 0;

    return new Response(
      JSON.stringify({
        avgNDVI: Number(avg.toFixed(3)),
        timestamp: new Date().toISOString(),
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders },
    });
  }
});
