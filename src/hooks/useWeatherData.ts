import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

interface WeatherData {
  temperature: number;
  humidity: number;
  rainChance: number;
  wind: number;
  condition: string;
  weather: string;
  temp: number;
}

export function useWeatherData(
  lat?: number,
  lon?: number,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: ['weather', lat, lon],
    queryFn: async (): Promise<WeatherData> => {
      if (!lat || !lon) {
        throw new Error('Latitude and longitude are required');
      }

      const { data, error } = await supabase.functions.invoke('weather-data', {
        body: { latitude: lat, longitude: lon },
      });

      if (error) {
        console.error('Weather API error:', error);
        throw new Error(error.message || 'Failed to fetch weather data');
      }

      if (!data || !data.success) {
        throw new Error(data?.error || 'Weather API returned no data');
      }

      return {
        temperature: data.temperature,
        humidity: data.humidity,
        rainChance: data.rainChance,
        wind: data.wind,
        condition: data.condition,
        weather: data.condition,
        temp: data.temperature,
      };
    },
    enabled: options?.enabled ?? (lat !== undefined && lon !== undefined),
    staleTime: 1000 * 60 * 10, // 10 minutes
    retry: 2,
  });
}
