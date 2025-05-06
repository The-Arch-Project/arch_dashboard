import { useQuery, useMutation } from "@tanstack/react-query";
import { ApiResponse, YieldFarmingInfo } from "@/types/api";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface YieldHistoryPoint {
  date: string;
  amount: number;
}

interface DepositRequest {
  amount: number;
  currency: string;
}

export function useYieldFarmingInfo() {
  return useQuery<ApiResponse<YieldFarmingInfo>>({
    queryKey: ['/api/yield/info'],
  });
}

export function useYieldHistory() {
  return useQuery<ApiResponse<YieldHistoryPoint[]>>({
    queryKey: ['/api/yield/history'],
  });
}

export function useDepositYield() {
  return useMutation({
    mutationFn: async (data: DepositRequest) => {
      const response = await apiRequest('POST', '/api/yield/deposit', data);
      return response.json() as Promise<ApiResponse<{ success: boolean }>>;
    },
    onSuccess: () => {
      // Invalidate queries that would be affected by this deposit
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['/api/yield/info'] });
      queryClient.invalidateQueries({ queryKey: ['/api/yield/history'] });
    }
  });
}

export function useWithdrawYield() {
  return useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/yield/withdraw', {});
      return response.json() as Promise<ApiResponse<{ success: boolean }>>;
    },
    onSuccess: () => {
      // Invalidate queries that would be affected by this withdrawal
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['/api/yield/info'] });
      queryClient.invalidateQueries({ queryKey: ['/api/yield/history'] });
    }
  });
}
