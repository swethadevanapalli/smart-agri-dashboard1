import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const data = await req.json()

    // Build the insert object with only provided values
    const reading: any = {}
    
    if (data.n_value !== undefined && data.n_value !== null) reading.n_value = parseFloat(data.n_value)
    if (data.p_value !== undefined && data.p_value !== null) reading.p_value = parseFloat(data.p_value)
    if (data.k_value !== undefined && data.k_value !== null) reading.k_value = parseFloat(data.k_value)
    if (data.soil_ph !== undefined && data.soil_ph !== null) reading.soil_ph = parseFloat(data.soil_ph)
    if (data.soil_moisture !== undefined && data.soil_moisture !== null) reading.soil_moisture = parseFloat(data.soil_moisture)
    if (data.temperature !== undefined && data.temperature !== null) reading.temperature = parseFloat(data.temperature)
    if (data.humidity !== undefined && data.humidity !== null) reading.humidity = parseFloat(data.humidity)
    if (data.latitude !== undefined && data.latitude !== null) reading.latitude = parseFloat(data.latitude)
    if (data.longitude !== undefined && data.longitude !== null) reading.longitude = parseFloat(data.longitude)
    if (data.ndvi !== undefined && data.ndvi !== null) reading.ndvi = parseFloat(data.ndvi)

    // Insert data into Supabase
    const { data: insertedData, error } = await supabase
      .from('iot_readings')
      .insert([reading])
      .select()

    if (error) {
      throw error
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Data uploaded successfully',
        data: insertedData 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
