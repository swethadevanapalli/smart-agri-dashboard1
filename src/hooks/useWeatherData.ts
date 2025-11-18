import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { WeatherData } from '@/types/agriculture';
import { FunctionsHttpError } from '@supabase/supabase-js';

export function useWeatherData(lat: number, lon: number) {
  return useQuery({
    queryKey: ['weather', lat, lon],
    queryFn: async (): Promise<WeatherData> => {
      const { data, error } = await supabase.functions.invoke('weather-data', {
        body: { lat, lon },
      });

      if (error) {
        let errorMessage = error.message;
        if (error instanceof FunctionsHttpError) {
          try {
            const statusCode = error.context?.status ?? 500;
            const textContent = await error.context?.text();
            errorMessage = `[Code: ${statusCode}] ${textContent || error.message || 'Unknown error'}`;
          } catch {
            errorMessage = `${error.message || 'Failed to fetch weather data'}`;
          }
        }
        throw new Error(errorMessage);
      }

      return data as WeatherData;
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
    retry: 2,
  });
}
