export interface SatelliteData {
  date: string;
  ndvi: number;
  soilMoisture: number;
  temperature: number;
}

export interface WeatherData {
  current: {
    temp: number;
    humidity: number;
    rainfall: number;
    condition: string;
    windSpeed: number;
    description?: string;
    feelsLike?: number;
    pressure?: number;
  };
  forecast: Array<{
    date: string;
    temp: number;
    rainfall: number;
    condition: string;
    humidity?: number;
    windSpeed?: number;
  }>;
  location?: {
    name: string;
    country: string;
  };
}

export interface CropHealthAnalysis {
  status: 'healthy' | 'warning' | 'critical';
  disease: string | null;
  confidence: number;
  recommendations: string[];
}

export interface AIRecommendations {
  fertilizerRecommendations: {
    nitrogen: { amount: string; timing: string; type: string };
    phosphorus: { amount: string; timing: string; type: string };
    potassium: { amount: string; timing: string; type: string };
    micronutrients: string[];
  };
  pestManagement: {
    commonPests: string[];
    preventiveMeasures: string[];
    organicSolutions: string[];
    chemicalOptions: string[];
    monitoringTips: string[];
  };
  irrigationAdvice: {
    frequency: string;
    amount: string;
    method: string;
    criticalStages: string[];
  };
  seasonalTips: string[];
  yieldPrediction: {
    expectedYield: string;
    factors: string[];
  };
  rawResponse?: string;
  error?: string;
}

export interface IrrigationRecommendation {
  waterNeeded: number;
  nextIrrigation: string;
  frequency: string;
  reason: string;
}
