import { useState } from "react";
import YieldFarmingCard from "@/components/yield/YieldFarmingCard";
import { useYieldFarmingInfo, useYieldHistory } from "@/services/yield";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format } from "date-fns";

export default function YieldFarming() {
  const { data: yieldInfo, isLoading: isLoadingYieldInfo } = useYieldFarmingInfo();
  const { data: yieldHistory, isLoading: isLoadingHistory } = useYieldHistory();

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM d");
  };

  const formatTooltipValue = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(value);
  };

  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
          <p className="text-sm text-gray-600 mb-1">{label}</p>
          <p className="text-sm font-semibold text-gray-900">
            {formatTooltipValue(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Yield Farming</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <YieldFarmingCard />
        
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-6">Yield Performance</h2>
          <div className="h-64">
            {isLoadingHistory ? (
              <div className="h-full flex items-center justify-center">
                <svg
                  className="animate-spin h-8 w-8 text-amber-gold"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={yieldHistory?.data || []}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorYield" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={formatDate}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#6B7280" }}
                    tickMargin={10}
                  />
                  <YAxis 
                    tickFormatter={(value) => `$${value}`}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#6B7280" }}
                    width={60}
                  />
                  <Tooltip content={customTooltip} />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="hsl(var(--primary))"
                    fillOpacity={1}
                    fill="url(#colorYield)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Current APY</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-amber-gold">
              {isLoadingYieldInfo ? "Loading..." : `${yieldInfo?.data?.apy.toFixed(1)}%`}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Total Staked Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {isLoadingYieldInfo 
                ? "Loading..." 
                : `${yieldInfo?.data?.stakedAmount.toLocaleString()} ${yieldInfo?.data?.currency}`}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Total Earned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {isLoadingYieldInfo 
                ? "Loading..." 
                : `${yieldInfo?.data?.earnedAmount.toLocaleString()} ${yieldInfo?.data?.currency}`}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-6 bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Yield Farming Info</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">How it Works</h3>
            <p className="text-sm text-gray-700">
              Yield farming allows you to earn passive income on your stablecoin holdings. When you deposit your coins into the liquidity pool, they are utilized to provide liquidity for various DeFi protocols, generating returns over time.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Terms & Conditions</h3>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              <li>Minimum deposit amount: 100 USDC/USDT</li>
              <li>Lock period: {isLoadingYieldInfo ? "Loading..." : `${yieldInfo?.data?.lockPeriod} days`}</li>
              <li>Early withdrawal fee: {isLoadingYieldInfo ? "Loading..." : `${yieldInfo?.data?.earlyWithdrawalFee}%`}</li>
              <li>APY is subject to market conditions and may vary</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
