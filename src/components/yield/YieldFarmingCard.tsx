import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useYieldFarmingInfo, useDepositYield, useWithdrawYield } from "@/services/yield";

const depositFormSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  currency: z.enum(["USDC", "USDT"]),
});

type DepositFormValues = z.infer<typeof depositFormSchema>;

export default function YieldFarmingCard() {
  const { toast } = useToast();
  const [currency, setCurrency] = useState<"USDC" | "USDT">("USDC");
  
  const { data: yieldInfo, isLoading: isLoadingYieldInfo } = useYieldFarmingInfo();
  const { mutate: depositYield, isPending: isDepositing } = useDepositYield();
  const { mutate: withdrawYield, isPending: isWithdrawing } = useWithdrawYield();
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<DepositFormValues>({
    resolver: zodResolver(depositFormSchema),
    defaultValues: {
      amount: 1000,
      currency: "USDC",
    },
  });

  const onDeposit = (data: DepositFormValues) => {
    depositYield({
      amount: data.amount,
      currency: data.currency,
    }, {
      onSuccess: () => {
        toast({
          title: "Deposit successful",
          description: `Successfully deposited ${data.amount} ${data.currency} into yield farming`,
        });
        reset();
      },
      onError: (error) => {
        toast({
          title: "Deposit failed",
          description: error.message || "An error occurred during the deposit",
          variant: "destructive",
        });
      }
    });
  };

  const handleWithdraw = () => {
    if (!yieldInfo?.data) return;
    
    withdrawYield(null, {
      onSuccess: () => {
        toast({
          title: "Withdrawal successful",
          description: "Successfully withdrew your funds from yield farming",
        });
      },
      onError: (error) => {
        toast({
          title: "Withdrawal failed",
          description: error.message || "An error occurred during the withdrawal",
          variant: "destructive",
        });
      }
    });
  };

  if (isLoadingYieldInfo) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Yield Farming</h2>
        <div className="py-12 flex justify-center items-center">
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
      </div>
    );
  }

  const info = yieldInfo?.data;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Yield Farming</h2>
      <div className="mb-6 p-4 bg-amber-gold/10 rounded-2xl">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Current APY</span>
          <span className="text-xl font-semibold text-amber-gold">
            {info ? `${info.apy.toFixed(1)}%` : "N/A"}
          </span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Your Staked Amount</span>
          <span className="text-lg font-semibold">
            {info ? `${info.stakedAmount.toLocaleString()} ${info.currency}` : "0"}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Earned So Far</span>
          <span className="text-lg font-semibold">
            {info ? `${info.earnedAmount.toLocaleString()} ${info.currency}` : "0"}
          </span>
        </div>
      </div>
      <form onSubmit={handleSubmit(onDeposit)}>
        <div className="space-y-4">
          <div>
            <label htmlFor="depositAmount" className="block text-sm font-medium text-gray-700 mb-1">
              Deposit Amount
            </label>
            <div className="flex items-center border border-gray-300 rounded-2xl focus-within:ring-1 focus-within:ring-amber-gold focus-within:border-amber-gold overflow-hidden">
              <div className="flex-1">
                <input
                  type="number"
                  id="depositAmount"
                  className="w-full px-4 py-2.5 border-0 focus:outline-none text-gray-900"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  {...register("amount", { valueAsNumber: true })}
                />
              </div>
              <div className="px-2 border-l border-gray-300">
                <select
                  id="depositCurrency"
                  className="h-full py-2.5 pl-2 pr-7 border-0 bg-transparent text-gray-900 sm:text-sm focus:outline-none"
                  {...register("currency")}
                  onChange={(e) => setCurrency(e.target.value as "USDC" | "USDT")}
                >
                  <option value="USDC">USDC</option>
                  <option value="USDT">USDT</option>
                </select>
              </div>
            </div>
            {errors.amount && (
              <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>
            )}
          </div>

          <div className="text-sm text-gray-500 py-2">
            <div className="flex justify-between">
              <span>Lock Period</span>
              <span>{info ? `${info.lockPeriod} Days` : "30 Days"}</span>
            </div>
            <div className="flex justify-between">
              <span>Early Withdrawal Fee</span>
              <span>{info ? `${info.earlyWithdrawalFee}%` : "1.5%"}</span>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              type="submit"
              className="flex-1 bg-amber-gold hover:bg-amber-600 text-white font-medium py-2.5 px-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isDepositing}
            >
              {isDepositing ? "Processing..." : "Deposit"}
            </button>
            <button
              type="button"
              className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2.5 px-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleWithdraw}
              disabled={isWithdrawing || !(info && info.stakedAmount > 0)}
            >
              {isWithdrawing ? "Processing..." : "Withdraw"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
