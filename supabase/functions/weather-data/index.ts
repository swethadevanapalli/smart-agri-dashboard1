import { corsHeaders } from "../_shared/cors.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { lat, lon } = await req.json();

    if (!lat || !lon) {
      throw new Error("GPS coordinates required.");
    }

    const apiKey = Deno.env.get("OPENWEATHER_API_KEY");

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    const response = await fetch(url);

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`OpenWeather error: ${text}`);
    }

    const json = await response.json();

    return new Response(
      JSON.stringify({
        temp: json.main.temp,
        humidity: json.main.humidity,
        wind: json.wind.speed,
        weather: json.weather[0].description,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { ...corsHeaders },
    });
  }
});
