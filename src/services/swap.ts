import { useQuery, useMutation } from "@tanstack/react-query";
import { ApiResponse, SwapRate } from "@/types/api";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface SwapHistory {
  id: number;
  fromAmount: number;
  fromCurrency: string;
  toAmount: number;
  toCurrency: string;
  rate: number;
  date: string;
}

interface SwapRequest {
  fromAmount: number;
  fromCurrency: string;
  toCurrency: string;
  toAmount: number;
}

export function useSwapRate(
  fromCurrency: string,
  toCurrency: string
) {
  return useQuery<ApiResponse<SwapRate>>({
    queryKey: [`/api/swap/rate?from=${fromCurrency}&to=${toCurrency}`],
    enabled: fromCurrency !== toCurrency
  });
}

export function usePerformSwap() {
  return useMutation({
    mutationFn: async (data: SwapRequest) => {
      const response = await apiRequest('POST', '/api/swap', data);
      return response.json() as Promise<ApiResponse<{ success: boolean }>>;
    },
    onSuccess: () => {
      // Invalidate queries that would be affected by this swap
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['/api/swap/history'] });
    }
  });
}

export function useSwapHistory() {
  return useQuery<ApiResponse<SwapHistory[]>>({
    queryKey: ['/api/swap/history'],
  });
}
