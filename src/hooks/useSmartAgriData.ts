import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface SmartAgriData {
  n: number | null;
  p: number | null;
  k: number | null;
  ph: number | null;
  moisture: number | null;
  temperature: number | null;
  humidity: number | null;
  ndvi: number | null;
  latitude: number | null;
  longitude: number | null;
  timestamp?: string;
}

const DEFAULT_COORDS = {
  latitude: 17.4065,
  longitude: 78.4772,
};

export function useSmartAgriData() {
  return useQuery({
    queryKey: ['smart-agri-data'],
    queryFn: async (): Promise<SmartAgriData> => {
      // 1. Fetch latest IoT reading from Supabase
      const { data: iotData, error } = await supabase
        .from('iot_readings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching IoT data:', error);
        // Don't throw - continue with API fallbacks
      }
      
      // Validate that we have meaningful sensor data (not all zeros/nulls)
      const hasValidData = iotData && (
        (iotData.n_value !== null && iotData.n_value > 0) ||
        (iotData.p_value !== null && iotData.p_value > 0) ||
        (iotData.temperature !== null && iotData.temperature > 0)
      );

      let mergedData: SmartAgriData = {
        n: hasValidData ? iotData.n_value : null,
        p: hasValidData ? iotData.p_value : null,
        k: hasValidData ? iotData.k_value : null,
        ph: hasValidData ? iotData.soil_ph : null,
        moisture: hasValidData ? iotData.soil_moisture : null,
        temperature: hasValidData ? iotData.temperature : null,
        humidity: hasValidData ? iotData.humidity : null,
        ndvi: hasValidData ? iotData.ndvi : null,
        latitude: hasValidData && iotData.latitude ? iotData.latitude : DEFAULT_COORDS.latitude,
        longitude: hasValidData && iotData.longitude ? iotData.longitude : DEFAULT_COORDS.longitude,
        timestamp: hasValidData ? iotData.created_at : undefined,
      };

      const coords = {
        latitude: mergedData.latitude ?? DEFAULT_COORDS.latitude,
        longitude: mergedData.longitude ?? DEFAULT_COORDS.longitude,
      };

      // 2. Fetch missing data from APIs
      const promises: Promise<any>[] = [];

      // Fetch weather data if temperature or humidity is missing
      if (mergedData.temperature === null || mergedData.humidity === null) {
        const weatherPromise = supabase.functions
          .invoke('weather-data', {
            body: coords,
          })
          .then(({ data, error }) => {
            if (!error && data?.success) {
              if (mergedData.temperature === null) mergedData.temperature = data.temperature;
              if (mergedData.humidity === null) mergedData.humidity = data.humidity;
            }
          })
          .catch((err) => console.error('Weather API error:', err));
        
        promises.push(weatherPromise);
      }

      // Fetch NDVI if missing
      if (mergedData.ndvi === null) {
        const ndviPromise = supabase.functions
          .invoke('satellite-ndvi', {
            body: coords,
          })
          .then(({ data, error }) => {
            if (!error && data?.success) {
              mergedData.ndvi = data.ndvi;
            }
          })
          .catch((err) => console.error('NDVI API error:', err));
        
        promises.push(ndviPromise);
      }

      // Wait for all API calls to complete
      await Promise.all(promises);

      return mergedData;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 15000,
  });
}
