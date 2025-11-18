import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

interface SatelliteData {
  date: string;
  ndvi: number;
  temperature: number;
}

export function useSatelliteData(bbox: number[], fromDate: string, toDate: string) {
  // Calculate center coordinates from bbox for the new satellite-ndvi Edge Function
  const centerLat = (bbox[1] + bbox[3]) / 2;
  const centerLon = (bbox[0] + bbox[2]) / 2;

  return useQuery({
    queryKey: ['satellite', bbox.join(','), fromDate, toDate],
    queryFn: async (): Promise<SatelliteData[]> => {
      // For now, get a single NDVI reading for current date
      const { data, error } = await supabase.functions.invoke('satellite-ndvi', {
        body: {
          latitude: centerLat,
          longitude: centerLon,
        },
      });

      if (error) {
        console.error('Satellite API error:', error);
        throw new Error(error.message || 'Failed to fetch satellite data');
      }

      if (!data || !data.success) {
        throw new Error(data?.error || 'Satellite API returned no data');
      }

      // Generate a time series for visualization (mock historical data)
      const result: SatelliteData[] = [];
      const days = 10;
      const currentNdvi = data.ndvi;
      
      for (let i = days; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        // Simulate gradual NDVI changes (±10% variation)
        const variation = (Math.random() - 0.5) * 0.2 * currentNdvi;
        const ndvi = Math.max(0, Math.min(1, currentNdvi + variation));
        
        result.push({
          date: date.toISOString().split('T')[0],
          ndvi: parseFloat(ndvi.toFixed(3)),
          temperature: 25 + Math.random() * 10, // Simulated temperature
        });
      }

      return result;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    retry: 2,
  });
}
