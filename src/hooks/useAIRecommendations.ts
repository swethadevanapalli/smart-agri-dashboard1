import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { AIRecommendations } from '@/types/agriculture';
import { FunctionsHttpError } from '@supabase/supabase-js';

interface RecommendationRequest {
  cropType: string;
  soilType: string;
  area?: number;
  season?: string;
}

export function useAIRecommendations() {
  return useMutation({
    mutationFn: async (request: RecommendationRequest): Promise<AIRecommendations> => {
      const { data, error } = await supabase.functions.invoke('ai-recommendations', {
        body: request,
      });

      if (error) {
        let errorMessage = error.message;
        if (error instanceof FunctionsHttpError) {
          try {
            const statusCode = error.context?.status ?? 500;
            const textContent = await error.context?.text();
            errorMessage = `[Code: ${statusCode}] ${textContent || error.message || 'Unknown error'}`;
          } catch {
            errorMessage = `${error.message || 'Failed to get AI recommendations'}`;
          }
        }
        throw new Error(errorMessage);
      }

      return data as AIRecommendations;
    },
  });
}
