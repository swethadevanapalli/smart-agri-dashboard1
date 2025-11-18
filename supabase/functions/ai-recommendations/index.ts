import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { cropType, soilType, area, season } = await req.json();
    
    if (!cropType || !soilType) {
      throw new Error('Crop type and soil type are required');
    }

    const apiKey = Deno.env.get('ONSPACE_AI_API_KEY');
    const baseUrl = Deno.env.get('ONSPACE_AI_BASE_URL');
    
    if (!apiKey || !baseUrl) {
      throw new Error('OnSpace AI credentials not configured');
    }

    const prompt = `You are an expert agricultural consultant. Provide detailed fertilizer and pest management recommendations for the following scenario:

Crop Type: ${cropType}
Soil Type: ${soilType}
Area: ${area || 'Not specified'} hectares
Season: ${season || 'Current season'}

Please provide a comprehensive analysis in JSON format with the following structure:
{
  "fertilizerRecommendations": {
    "nitrogen": { "amount": "kg/hectare", "timing": "when to apply", "type": "recommended fertilizer type" },
    "phosphorus": { "amount": "kg/hectare", "timing": "when to apply", "type": "recommended fertilizer type" },
    "potassium": { "amount": "kg/hectare", "timing": "when to apply", "type": "recommended fertilizer type" },
    "micronutrients": ["list of recommended micronutrients with amounts"]
  },
  "pestManagement": {
    "commonPests": ["list of common pests for this crop"],
    "preventiveMeasures": ["list of preventive measures"],
    "organicSolutions": ["list of organic pest control methods"],
    "chemicalOptions": ["list of chemical options if needed"],
    "monitoringTips": ["list of monitoring recommendations"]
  },
  "irrigationAdvice": {
    "frequency": "irrigation frequency recommendation",
    "amount": "water amount recommendation",
    "method": "recommended irrigation method",
    "criticalStages": ["growth stages requiring more water"]
  },
  "seasonalTips": ["list of 5-7 actionable seasonal farming tips"],
  "yieldPrediction": {
    "expectedYield": "estimated yield range",
    "factors": ["key factors affecting yield"]
  }
}

Provide specific, actionable recommendations based on agricultural best practices.`;

    const aiResponse = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      throw new Error(`OnSpace AI error: ${errorText}`);
    }

    const aiData = await aiResponse.json();
    const responseText = aiData.choices[0].message.content;

    // Try to parse JSON from response
    let recommendations;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || 
                       responseText.match(/```\n([\s\S]*?)\n```/) ||
                       [null, responseText];
      recommendations = JSON.parse(jsonMatch[1]);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      // Return raw response if JSON parsing fails
      recommendations = {
        rawResponse: responseText,
        error: 'Response could not be parsed as structured data',
      };
    }

    return new Response(
      JSON.stringify(recommendations),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error('AI recommendations error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
