import { useQuery } from '@tanstack/react-query';
import { SmartAgriData } from './useSmartAgriData';

export type Language = 'en' | 'te';

export interface AgriAIRecommendations {
  fertilizer_plan: string;
  soil_advice: string;
  irrigation: string;
  pest_warning: string;
  crop_health_status: string;
  two_day_action_plan: string[];
}

const ONSPACE_API_URL = 'https://api.onspace.ai/v1/chat/completions';

export function useAgriAI(data: SmartAgriData | undefined, language: Language) {
  return useQuery({
    queryKey: ['agri-ai', data, language],
    queryFn: async (): Promise<AgriAIRecommendations> => {
      if (!data) {
        throw new Error('No data available');
      }

      const languageName = language === 'te' ? 'Telugu' : 'English';
      
      const prompt = `You are an expert agricultural advisor. Analyze the following farm data and provide recommendations in ${languageName} language using simple, farmer-friendly words.

Farm Data:
- Nitrogen (N): ${data.n ?? 'unknown'} mg/kg
- Phosphorus (P): ${data.p ?? 'unknown'} mg/kg
- Potassium (K): ${data.k ?? 'unknown'} mg/kg
- Soil pH: ${data.ph ?? 'unknown'}
- Soil Moisture: ${data.moisture ?? 'unknown'}%
- Temperature: ${data.temperature ?? 'unknown'}°C
- Humidity: ${data.humidity ?? 'unknown'}%
- NDVI (Crop Health): ${data.ndvi ?? 'unknown'}

Provide recommendations in JSON format with these fields:
{
  "fertilizer_plan": "Simple steps for fertilizer application",
  "soil_advice": "Status of N, P, K, and pH with simple advice",
  "irrigation": "Water amount, timing, and frequency",
  "pest_warning": "low/medium/high risk with explanation",
  "crop_health_status": "healthy/improving/stress",
  "two_day_action_plan": ["action 1", "action 2", "action 3"]
}

Important:
- Use simple sentences
- ${language === 'te' ? 'Write in Telugu script' : 'Write in English'}
- Be specific with quantities (e.g., "20 kg urea per acre" or "ఎకరాకు 20 కిలోల యూరియా")
- Make it practical for farmers`;

      try {
        // Note: OnSpace AI integration requires API key setup
        // For now, use fallback recommendations with smart logic
        // TODO: Add proper OnSpace AI authentication when available
        
        // Uncomment below when OnSpace API key is configured
        /*
        const response = await fetch(ONSPACE_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer YOUR_API_KEY', // Add proper auth
          },
          body: JSON.stringify({
            model: 'onspace-ai',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.7,
            max_tokens: 1000,
          }),
        });

        if (!response.ok) {
          throw new Error(`OnSpace API error: ${response.status}`);
        }

        const result = await response.json();
        const content = result.choices[0]?.message?.content || '';
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
        */
        
        // Use intelligent fallback recommendations based on sensor data
        return generateFallbackRecommendations(data, language);
      } catch (error) {
        console.error('AI recommendation error:', error);
        return generateFallbackRecommendations(data, language);
      }
    },
    enabled: !!data,
    staleTime: 60000, // Cache for 1 minute
  });
}

function generateFallbackRecommendations(
  data: SmartAgriData,
  language: Language
): AgriAIRecommendations {
  // Intelligent analysis based on actual sensor values
  const n = data.n ?? 40;
  const p = data.p ?? 25;
  const k = data.k ?? 150;
  const ph = data.ph ?? 6.8;
  const moisture = data.moisture ?? 50;
  const temp = data.temperature ?? 28;
  const ndvi = data.ndvi ?? 0.5;
  
  // NPK status
  const nStatus = n < 40 ? 'low' : n > 60 ? 'high' : 'good';
  const pStatus = p < 20 ? 'low' : p > 40 ? 'high' : 'good';
  const kStatus = k < 150 ? 'low' : k > 250 ? 'high' : 'good';
  const phStatus = ph < 6.0 ? 'acidic' : ph > 7.5 ? 'alkaline' : 'neutral';
  const moistureStatus = moisture < 35 ? 'dry' : moisture > 65 ? 'wet' : 'optimal';
  
  // Pest risk based on conditions
  const pestRisk = (temp > 30 && moisture > 60) ? 'high' : (temp > 25 && moisture > 50) ? 'medium' : 'low';
  
  // Crop health from NDVI
  const cropHealth = ndvi > 0.6 ? 'healthy' : ndvi > 0.4 ? 'improving' : 'stress';

  if (language === 'te') {
    let fertilizerPlan = '';
    if (nStatus === 'low') fertilizerPlan += `నైట్రోజన్ తక్కువగా ఉంది. ఎకరాకు 20 కిలోల యూరియా వేయండి. `;
    if (pStatus === 'low') fertilizerPlan += `భాస్వరం తక్కువగా ఉంది. DAP ఎరువు వేయండి. `;
    if (kStatus === 'low') fertilizerPlan += `పొటాషియం తక్కువగా ఉంది. MOP ఎరువు వేయండి. `;
    if (!fertilizerPlan) fertilizerPlan = 'మీ నేల పోషకాలు సరైన స్థాయిలో ఉన్నాయి. సమతుల్య ఎరువులు కొనసాగించండి.';

    let soilAdvice = `నేల స్థితి: N=${n.toFixed(0)}, P=${p.toFixed(0)}, K=${k.toFixed(0)} mg/kg. `;
    soilAdvice += phStatus === 'acidic' ? 'నేల ఆమ్లంగా ఉంది. సున్నం వేయండి.' : phStatus === 'alkaline' ? 'నేల క్షారంగా ఉంది.' : 'pH సరైనది.';

    let irrigation = '';
    if (moistureStatus === 'dry') irrigation = `నేల పొడిగా ఉంది (${moisture.toFixed(0)}%). వెంటనే నీరు పెట్టండి. రోజుకు 3-4 సార్లు నీరు పెట్టండి.`;
    else if (moistureStatus === 'wet') irrigation = `నేల తడిగా ఉంది (${moisture.toFixed(0)}%). నీరు పెట్టడం ఆపండి. నేల ఎండిపోనివ్వండి.`;
    else irrigation = `నేల తేమ మంచిగా ఉంది (${moisture.toFixed(0)}%). రోజుకు 2 సార్లు తేలికగా నీరు పెట్టండి.`;

    return {
      fertilizer_plan: fertilizerPlan,
      soil_advice: soilAdvice,
      irrigation: irrigation,
      pest_warning: pestRisk,
      crop_health_status: cropHealth,
      two_day_action_plan: [
        moistureStatus === 'dry' ? 'వెంటనే పంటకు నీరు పెట్టండి' : 'నేల తేమను తనిఖీ చేయండి',
        nStatus === 'low' || pStatus === 'low' || kStatus === 'low' ? 'అవసరమైన ఎరువులు వేయండి' : 'పంట పెరుగుదలను పరిశీలించండి',
        pestRisk === 'high' ? 'చీడపురుగులు ఉన్నాయా తనిఖీ చేసి మందులు చల్లండి' : 'పంట ఆరోగ్యాన్ని రోజూ పరిశీలించండి',
      ],
    };
  }

  // English recommendations
  let fertilizerPlan = '';
  if (nStatus === 'low') fertilizerPlan += `Nitrogen is low. Apply 20 kg urea per acre. `;
  if (pStatus === 'low') fertilizerPlan += `Phosphorus is low. Apply DAP fertilizer. `;
  if (kStatus === 'low') fertilizerPlan += `Potassium is low. Apply MOP fertilizer. `;
  if (!fertilizerPlan) fertilizerPlan = 'Your soil nutrients are at good levels. Continue balanced fertilization.';

  let soilAdvice = `Soil status: N=${n.toFixed(0)}, P=${p.toFixed(0)}, K=${k.toFixed(0)} mg/kg. `;
  soilAdvice += phStatus === 'acidic' ? 'Soil is acidic. Apply lime to raise pH.' : phStatus === 'alkaline' ? 'Soil is alkaline. Apply sulfur.' : 'pH is optimal.';

  let irrigation = '';
  if (moistureStatus === 'dry') irrigation = `Soil is dry (${moisture.toFixed(0)}%). Irrigate immediately. Water 3-4 times daily.`;
  else if (moistureStatus === 'wet') irrigation = `Soil is too wet (${moisture.toFixed(0)}%). Stop watering. Allow soil to dry.`;
  else irrigation = `Soil moisture is good (${moisture.toFixed(0)}%). Water 2 times daily as needed.`;

  return {
    fertilizer_plan: fertilizerPlan,
    soil_advice: soilAdvice,
    irrigation: irrigation,
    pest_warning: pestRisk,
    crop_health_status: cropHealth,
    two_day_action_plan: [
      moistureStatus === 'dry' ? 'Irrigate crops immediately' : 'Monitor soil moisture daily',
      nStatus === 'low' || pStatus === 'low' || kStatus === 'low' ? 'Apply recommended fertilizers' : 'Check crop growth progress',
      pestRisk === 'high' ? 'Inspect for pests and apply pesticides if needed' : 'Monitor crop health daily',
    ],
  };
}
