import SwapCard from "@/components/swap/SwapCard";
import { useCoinBalances } from "@/services/dashboard";
import { useSwapHistory } from "@/services/swap";
import { format } from "date-fns";

export default function Swap() {
  const { data: balances, isLoading: isLoadingBalances } = useCoinBalances();
  const { data: swapHistory, isLoading: isLoadingHistory } = useSwapHistory();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Stablecoin Swap</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SwapCard />
        
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Available Balance</h2>
          
          {isLoadingBalances ? (
            <div className="py-6 flex justify-center">
              <svg
                className="animate-spin h-6 w-6 text-amber-gold"
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
            <div className="space-y-4 mb-6">
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center mb-2">
                  <div className="w-6 h-6 mr-2">
                    <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="16" cy="16" r="16" fill="#2775CA"/>
                      <path d="M16 6C10.48 6 6 10.48 6 16C6 21.52 10.48 26 16 26C21.52 26 26 21.52 26 16C26 10.48 21.52 6 16 6ZM16.88 20.3V22.16H15.12V20.32C13.78 20.18 12.62 19.68 11.8 18.98L12.8 17.3C13.6 17.88 14.48 18.3 15.58 18.3C16.6 18.3 17.22 17.86 17.22 17.16C17.22 16.46 16.82 16.12 15.42 15.72C13.52 15.2 12.18 14.56 12.18 12.68C12.18 11 13.4 9.78 15.12 9.5V7.68H16.88V9.52C17.94 9.7 18.88 10.16 19.5 10.7L18.52 12.32C17.84 11.82 17 11.48 16.04 11.48C15.1 11.48 14.6 11.88 14.6 12.48C14.6 13.12 15.08 13.4 16.54 13.82C18.44 14.36 19.68 15.04 19.68 16.82C19.68 18.5 18.4 19.96 16.88 20.3Z" fill="white"/>
                    </svg>
                  </div>
                  <span className="font-medium">USDC Balance</span>
                </div>
                <div className="text-xl font-semibold">
                  {balances?.data?.usdcBalance.toLocaleString() ?? 0} USDC
                </div>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center mb-2">
                  <div className="w-6 h-6 mr-2">
                    <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="16" cy="16" r="16" fill="#26A17B"/>
                      <path d="M17.922 17.383v-.002c-.11.008-.677.042-1.942.042-1.01 0-1.721-.03-1.971-.042v.003c-3.888-.171-6.79-.848-6.79-1.658 0-.809 2.902-1.486 6.79-1.66v2.644c.254.018.982.061 1.988.061 1.207 0 1.812-.05 1.925-.06v-2.643c3.88.173 6.775.85 6.775 1.658 0 .81-2.895 1.485-6.775 1.657m0-3.59v-2.366h5.414V7.819H8.595v3.608h5.414v2.365c-4.4.202-7.709 1.074-7.709 2.118 0 1.044 3.309 1.915 7.709 2.118v7.582h3.913v-7.584c4.393-.202 7.694-1.073 7.694-2.116 0-1.043-3.301-1.914-7.694-2.117" fill="white"/>
                    </svg>
                  </div>
                  <span className="font-medium">USDT Balance</span>
                </div>
                <div className="text-xl font-semibold">
                  {balances?.data?.usdtBalance.toLocaleString() ?? 0} USDT
                </div>
              </div>
            </div>
          )}
          
          <h2 className="text-lg font-semibold mb-4">Recent Swaps</h2>
          
          {isLoadingHistory ? (
            <div className="py-6 flex justify-center">
              <svg
                className="animate-spin h-6 w-6 text-amber-gold"
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
          ) : swapHistory?.data?.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No swap history available.</p>
          ) : (
            <div className="space-y-2">
              {swapHistory?.data?.map((swap, index) => (
                <div key={index} className="p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="font-medium">
                        {swap.fromAmount} {swap.fromCurrency} → {swap.toAmount} {swap.toCurrency}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {format(new Date(swap.date), "MMM d, yyyy")}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Rate: 1 {swap.fromCurrency} = {swap.rate.toFixed(4)} {swap.toCurrency}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
