import { useEffect } from "react";
import { useLocation } from "wouter";
import BalanceCard from "@/components/dashboard/BalanceCard";
import StablecoinCard from "@/components/dashboard/StablecoinCard";
import YieldCard from "@/components/dashboard/YieldCard";
import BalanceHistory from "@/components/dashboard/BalanceHistory";
import AssetsDistribution from "@/components/dashboard/AssetsDistribution";
import TransactionsTable from "@/components/dashboard/TransactionsTable";
import SwapCard from "@/components/swap/SwapCard";
import YieldFarmingCard from "@/components/yield/YieldFarmingCard";
import { useDashboardData } from "@/services/dashboard";
import { useRecentTransactions } from "@/services/transactions";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { data: dashboardData, isLoading: isLoadingDashboard } = useDashboardData();
  const { data: transactionsData, isLoading: isLoadingTransactions } = useRecentTransactions(1, 5);

  // Assets distribution data
  const assetDistributionData = [
    {
      assetName: "USDC",
      amount: dashboardData?.data?.usdcBalance ?? 0,
      percentage: dashboardData?.data ? (dashboardData.data.usdcBalance / dashboardData.data.total) * 100 : 0,
      color: "#2775CA"
    },
    {
      assetName: "USDT",
      amount: dashboardData?.data?.usdtBalance ?? 0,
      percentage: dashboardData?.data ? (dashboardData.data.usdtBalance / dashboardData.data.total) * 100 : 0,
      color: "#26A17B"
    },
    {
      assetName: "Yield",
      amount: dashboardData?.data?.yieldEarned ?? 0,
      percentage: dashboardData?.data ? (dashboardData.data.yieldEarned / dashboardData.data.total) * 100 : 0,
      color: "#FFC107"
    },
    {
      assetName: "Other",
      amount: 0,
      percentage: 0,
      color: "#E9E9E9"
    }
  ];

  return (
    <>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <BalanceCard 
          totalBalance={dashboardData?.data?.total ?? 0} 
          growthRate={dashboardData?.data?.growthRate ?? 0} 
        />
        <StablecoinCard balance={dashboardData?.data?.usdcBalance ?? 0} symbol="USDC" />
        <StablecoinCard balance={dashboardData?.data?.usdtBalance ?? 0} symbol="USDT" />
        <YieldCard
          totalYield={dashboardData?.data?.yieldEarned ?? 0}
          apy={dashboardData?.data?.apy ?? 0}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <BalanceHistory 
          data={dashboardData?.data?.balanceHistory ?? []} 
        />
        <AssetsDistribution
          data={assetDistributionData}
          totalBalance={dashboardData?.data?.total ?? 0}
        />
      </div>

      {/* Transactions Table */}
      <TransactionsTable
        transactions={transactionsData?.data ?? []}
        metadata={transactionsData?.metadata}
        isLoading={isLoadingTransactions}
        onPageChange={(page) => setLocation("/transactions")}
        isCompact={true}
      />

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SwapCard />
        <YieldFarmingCard />
      </div>
    </>
  );
}
