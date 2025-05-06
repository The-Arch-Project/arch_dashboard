import { useQuery } from "@tanstack/react-query";
import { ApiResponse, Balance, BalanceHistoryPoint, AssetDistribution } from "@/types/api";

export function useDashboardData() {
  return useQuery<ApiResponse<Balance & { balanceHistory: BalanceHistoryPoint[] }>>({
    queryKey: ['/api/dashboard'],
  });
}

export function useBalanceHistory() {
  return useQuery<ApiResponse<BalanceHistoryPoint[]>>({
    queryKey: ['/api/dashboard/balance-history'],
  });
}

export function useAssetDistribution() {
  return useQuery<ApiResponse<AssetDistribution[]>>({
    queryKey: ['/api/dashboard/asset-distribution'],
  });
}

export function useCoinBalances() {
  return useQuery<ApiResponse<Pick<Balance, 'usdcBalance' | 'usdtBalance'>>>({
    queryKey: ['/api/dashboard/coin-balances'],
  });
}
