import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { SatelliteData } from '@/types/agriculture';
import { FunctionsHttpError } from '@supabase/supabase-js';

export function useSatelliteData(bbox: number[], fromDate: string, toDate: string) {
  
  // ✅ FIX: ensure dates are ISO-8601 without milliseconds
  const cleanFrom = fromDate.replace(/\.\d+Z$/, "Z");
  const cleanTo = toDate.replace(/\.\d+Z$/, "Z");

  return useQuery({
    queryKey: ['satellite', bbox.join(','), cleanFrom, cleanTo],
    queryFn: async (): Promise<SatelliteData[]> => {
      const { data, error } = await supabase.functions.invoke('satellite-data', {
        body: {
          bbox,
          fromDate: cleanFrom,
          toDate: cleanTo,
        },
      });

      if (error) {
        let errorMessage = error.message;
        if (error instanceof FunctionsHttpError) {
          try {
            const statusCode = error.context?.status ?? 500;
            const textContent = await error.context?.text();
            errorMessage = `[Code: ${statusCode}] ${textContent || error.message || 'Unknown error'}`;
          } catch {
            errorMessage = `${error.message || 'Failed to fetch satellite data'}`;
          }
        }
        throw new Error(errorMessage);
      }

      return data.data as SatelliteData[];
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    retry: 2,
  });
}
