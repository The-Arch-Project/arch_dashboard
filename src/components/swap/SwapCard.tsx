import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useSwapRate, usePerformSwap } from "@/services/swap";

const swapFormSchema = z.object({
  fromAmount: z.number().positive("Amount must be positive"),
  fromCurrency: z.enum(["USDC", "USDT"]),
  toCurrency: z.enum(["USDC", "USDT"]),
});

type SwapFormValues = z.infer<typeof swapFormSchema>;

export default function SwapCard() {
  const { toast } = useToast();
  const [fromCurrency, setFromCurrency] = useState<"USDC" | "USDT">("USDC");
  const [toCurrency, setToCurrency] = useState<"USDC" | "USDT">("USDT");
  const [fromAmount, setFromAmount] = useState<number>(1000);
  const [toAmount, setToAmount] = useState<number>(0);
  
  const { data: rateData, isLoading: isLoadingRate } = useSwapRate(fromCurrency, toCurrency);
  const { mutate: performSwap, isPending } = usePerformSwap();
  
  const { register, handleSubmit, formState: { errors } } = useForm<SwapFormValues>({
    resolver: zodResolver(swapFormSchema),
    defaultValues: {
      fromAmount: 1000,
      fromCurrency: "USDC",
      toCurrency: "USDT",
    },
  });

  // Update to amount whenever from amount or exchange rate changes
  useEffect(() => {
    if (rateData?.data) {
      const calculated = fromAmount * rateData.data.rate;
      setToAmount(Number(calculated.toFixed(2)));
    }
  }, [fromAmount, rateData]);

  // Switch currencies
  const handleSwitchCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const onSubmit = (data: SwapFormValues) => {
    if (data.fromCurrency === data.toCurrency) {
      toast({
        title: "Invalid swap",
        description: "Cannot swap the same currency",
        variant: "destructive",
      });
      return;
    }
    
    performSwap({
      fromAmount: data.fromAmount,
      fromCurrency: data.fromCurrency,
      toCurrency: data.toCurrency,
      toAmount: toAmount,
    }, {
      onSuccess: (response) => {
        toast({
          title: "Swap successful",
          description: `Swapped ${data.fromAmount} ${data.fromCurrency} to ${toAmount} ${data.toCurrency}`,
        });
        
        // Reset form
        setFromAmount(0);
        setToAmount(0);
      },
      onError: (error) => {
        toast({
          title: "Swap failed",
          description: error.message || "An error occurred during the swap",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Quick Swap</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <div>
            <label htmlFor="fromAmount" className="block text-sm font-medium text-gray-700 mb-1">
              From
            </label>
            <div className="flex items-center border border-gray-300 rounded-2xl focus-within:ring-1 focus-within:ring-amber-gold focus-within:border-amber-gold overflow-hidden">
              <div className="flex-1">
                <input
                  type="number"
                  id="fromAmount"
                  className="w-full px-4 py-2.5 border-0 focus:outline-none text-gray-900"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  {...register("fromAmount", { 
                    valueAsNumber: true,
                    onChange: (e) => setFromAmount(parseFloat(e.target.value) || 0)
                  })}
                />
              </div>
              <div className="px-2 border-l border-gray-300">
                <select
                  id="fromCurrency"
                  className="h-full py-2.5 pl-2 pr-7 border-0 bg-transparent text-gray-900 sm:text-sm focus:outline-none"
                  {...register("fromCurrency")}
                  onChange={(e) => setFromCurrency(e.target.value as "USDC" | "USDT")}
                  value={fromCurrency}
                >
                  <option value="USDC">USDC</option>
                  <option value="USDT">USDT</option>
                </select>
              </div>
            </div>
            {errors.fromAmount && (
              <p className="text-red-500 text-xs mt-1">{errors.fromAmount.message}</p>
            )}
          </div>

          <div className="flex justify-center">
            <button
              type="button"
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
              onClick={handleSwitchCurrencies}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
                />
              </svg>
            </button>
          </div>

          <div>
            <label htmlFor="toCurrency" className="block text-sm font-medium text-gray-700 mb-1">
              To
            </label>
            <div className="flex items-center border border-gray-300 rounded-2xl focus-within:ring-1 focus-within:ring-amber-gold focus-within:border-amber-gold overflow-hidden">
              <div className="flex-1">
                <input
                  type="number"
                  id="toAmount"
                  className="w-full px-4 py-2.5 border-0 focus:outline-none text-gray-900"
                  placeholder="0.00"
                  value={toAmount}
                  readOnly
                />
              </div>
              <div className="px-2 border-l border-gray-300">
                <select
                  id="toCurrency"
                  className="h-full py-2.5 pl-2 pr-7 border-0 bg-transparent text-gray-900 sm:text-sm focus:outline-none"
                  {...register("toCurrency")}
                  onChange={(e) => setToCurrency(e.target.value as "USDC" | "USDT")}
                  value={toCurrency}
                >
                  <option value="USDT">USDT</option>
                  <option value="USDC">USDC</option>
                </select>
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-500 py-2">
            <div className="flex justify-between">
              <span>Exchange Rate</span>
              <span>
                {isLoadingRate ? (
                  "Loading..."
                ) : rateData?.data ? (
                  `1 ${fromCurrency} = ${rateData.data.rate} ${toCurrency}`
                ) : (
                  "Rate unavailable"
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Network Fee</span>
              <span>
                {isLoadingRate ? (
                  "Loading..."
                ) : rateData?.data ? (
                  `~$${rateData.data.fee.toFixed(2)}`
                ) : (
                  "Fee unavailable"
                )}
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-amber-gold hover:bg-amber-600 text-white font-medium py-2.5 px-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isPending || fromCurrency === toCurrency || fromAmount <= 0 || isLoadingRate}
          >
            {isPending ? "Processing..." : "Swap Now"}
          </button>
        </div>
      </form>
    </div>
  );
}
