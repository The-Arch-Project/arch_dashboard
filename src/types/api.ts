export interface ApiResponse<T> {
  status: number;
  code: 'success' | 'error';
  message: string;
  data?: T;
  metadata?: ApiResponseMetadata;
}

export interface ApiResponseMetadata {
  page: number;
  limit: number;
  total: number;
}

export interface Balance {
  total: number;
  usdcBalance: number;
  usdtBalance: number;
  yieldEarned: number;
  growthRate: number;
  apy: number;
}

export interface BalanceHistoryPoint {
  date: string;
  amount: number;
}

export interface AssetDistribution {
  assetName: string;
  amount: number;
  percentage: number;
  color: string;
}

export interface SwapRate {
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  fee: number;
}

export interface YieldFarmingInfo {
  apy: number;
  stakedAmount: number;
  earnedAmount: number;
  lockPeriod: number;
  earlyWithdrawalFee: number;
  currency: string;
}
