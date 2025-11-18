import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { latitude, longitude } = await req.json()

    if (!latitude || !longitude) {
      throw new Error('Latitude and longitude are required')
    }

    const clientId = Deno.env.get('SENTINELHUB_CLIENT_ID')!
    const clientSecret = Deno.env.get('SENTINELHUB_CLIENT_SECRET')!

    // Get OAuth token
    const tokenResponse = await fetch('https://services.sentinel-hub.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`,
    })

    const { access_token } = await tokenResponse.json()

    // Define bounding box (approximately 1km x 1km around the point)
    const offset = 0.005 // ~500m
    const bbox = [
      longitude - offset,
      latitude - offset,
      longitude + offset,
      latitude + offset,
    ]

    // Get current date and 10 days before for cloud-free imagery
    const toDate = new Date()
    const fromDate = new Date(toDate.getTime() - 10 * 24 * 60 * 60 * 1000)

    // SentinelHub Process API request for NDVI
    const processRequest = {
      input: {
        bounds: {
          bbox: bbox,
          properties: {
            crs: 'http://www.opengis.net/def/crs/EPSG/0/4326',
          },
        },
        data: [
          {
            type: 'sentinel-2-l2a',
            dataFilter: {
              timeRange: {
                from: fromDate.toISOString().split('T')[0] + 'T00:00:00Z',
                to: toDate.toISOString().split('T')[0] + 'T23:59:59Z',
              },
              maxCloudCoverage: 30,
            },
          },
        ],
      },
      output: {
        width: 100,
        height: 100,
        responses: [
          {
            identifier: 'default',
            format: {
              type: 'application/json',
            },
          },
        ],
      },
      evalscript: `
        //VERSION=3
        function setup() {
          return {
            input: ["B04", "B08", "dataMask"],
            output: { id: "default", bands: 1 }
          };
        }

        function evaluatePixel(sample) {
          let ndvi = (sample.B08 - sample.B04) / (sample.B08 + sample.B04);
          return [ndvi];
        }
      `,
    }

    const processResponse = await fetch('https://services.sentinel-hub.com/api/v1/process', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(processRequest),
    })

    if (!processResponse.ok) {
      const errorText = await processResponse.text()
      console.error('SentinelHub API error:', errorText)
      throw new Error(`SentinelHub API error: ${processResponse.status}`)
    }

    const ndviData = await processResponse.json()
    
    // Parse SentinelHub Process API response structure
    // Response format: { data: [{ default: [val1, val2, ...] }] }
    let avgNdvi = 0.5 // Default to moderate health
    
    try {
      if (ndviData && ndviData.data && Array.isArray(ndviData.data)) {
        const firstData = ndviData.data[0]
        if (firstData && firstData.default && Array.isArray(firstData.default)) {
          const values = firstData.default.filter((val: number) => 
            !isNaN(val) && val >= -1 && val <= 1
          )
          if (values.length > 0) {
            avgNdvi = values.reduce((sum: number, val: number) => sum + val, 0) / values.length
          }
        }
      }
    } catch (parseError) {
      console.error('Error parsing NDVI data:', parseError)
      // Keep default value of 0.5
    }

    // Normalize to 0-1 range (NDVI is typically -1 to 1)
    const normalizedNdvi = Math.max(0, Math.min(1, (avgNdvi + 1) / 2))

    return new Response(
      JSON.stringify({
        success: true,
        ndvi: parseFloat(normalizedNdvi.toFixed(3)),
        latitude,
        longitude,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        ndvi: 0.5, // Default fallback value
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200, // Return 200 with fallback data
      }
    )
  }
})
