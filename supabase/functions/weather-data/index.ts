import { corsHeaders } from "../_shared/cors.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { latitude, longitude } = await req.json();

    if (!latitude || !longitude) {
      throw new Error("Latitude and longitude are required");
    }

    const apiKey = Deno.env.get("OPENWEATHER_API_KEY");
    
    if (!apiKey) {
      throw new Error("OPENWEATHER_API_KEY environment variable not set");
    }

    // Fetch current weather data
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
    const weatherResponse = await fetch(weatherUrl);

    if (!weatherResponse.ok) {
      const text = await weatherResponse.text();
      throw new Error(`OpenWeather error: ${text}`);
    }

    const weatherData = await weatherResponse.json();

    // Fetch forecast for rain chance
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
    const forecastResponse = await fetch(forecastUrl);
    
    let rainChance = 0;
    if (forecastResponse.ok) {
      const forecastData = await forecastResponse.json();
      // Calculate rain probability from next 24 hours
      const next24Hours = forecastData.list.slice(0, 8); // 8 x 3-hour intervals
      const rainyPeriods = next24Hours.filter((period: any) => 
        period.weather[0].main === 'Rain' || period.weather[0].main === 'Drizzle'
      );
      rainChance = Math.round((rainyPeriods.length / next24Hours.length) * 100);
    }

    const result = {
      success: true,
      temperature: Math.round(weatherData.main.temp),
      humidity: weatherData.main.humidity,
      rainChance: rainChance,
      wind: Math.round(weatherData.wind.speed * 3.6), // Convert m/s to km/h
      condition: weatherData.weather[0].description,
      latitude,
      longitude,
    };

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ 
      success: false,
      error: err.message 
    }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
