import { SatelliteData, WeatherData } from '@/types/agriculture';

export const generateSatelliteData = (): SatelliteData[] => {
  const data: SatelliteData[] = [];
  const today = new Date();
  
  for (let i = 14; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      ndvi: 0.5 + Math.random() * 0.4,
      soilMoisture: 20 + Math.random() * 40,
      temperature: 18 + Math.random() * 12,
    });
  }
  
  return data;
};

export const getMockWeatherData = (): WeatherData => {
  const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Rainy'];
  
  return {
    current: {
      temp: 24 + Math.random() * 8,
      humidity: 50 + Math.random() * 30,
      rainfall: Math.random() * 10,
      condition: conditions[Math.floor(Math.random() * conditions.length)],
      windSpeed: 5 + Math.random() * 15,
    },
    forecast: Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i + 1);
      
      return {
        date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        temp: 20 + Math.random() * 10,
        rainfall: Math.random() * 15,
        condition: conditions[Math.floor(Math.random() * conditions.length)],
      };
    }),
  };
};

export const analyzeCropImage = (file: File): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const diseases = [
        { name: 'Healthy', status: 'healthy' as const, confidence: 92 },
        { name: 'Early Blight', status: 'warning' as const, confidence: 78 },
        { name: 'Late Blight', status: 'critical' as const, confidence: 85 },
        { name: 'Leaf Spot', status: 'warning' as const, confidence: 71 },
        { name: 'Powdery Mildew', status: 'warning' as const, confidence: 88 },
      ];
      
      const result = diseases[Math.floor(Math.random() * diseases.length)];
      
      const recommendations = result.status === 'healthy'
        ? ['Continue regular monitoring', 'Maintain current irrigation schedule', 'Apply balanced fertilizer monthly']
        : result.status === 'warning'
        ? ['Apply fungicide treatment', 'Increase monitoring frequency', 'Remove affected leaves', 'Improve air circulation']
        : ['Immediate fungicide application required', 'Isolate affected plants', 'Consult agricultural expert', 'Consider crop rotation'];
      
      resolve({
        status: result.status,
        disease: result.status === 'healthy' ? null : result.name,
        confidence: result.confidence,
        recommendations,
      });
    }, 1500);
  });
};
