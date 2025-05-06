import { useMemo } from "react";
import { format } from "date-fns";
import { Transaction } from "@shared/schema";
import { ApiResponseMetadata } from "@/types/api";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/use-theme";

interface TransactionsTableProps {
  transactions: Transaction[];
  metadata?: ApiResponseMetadata;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  isCompact?: boolean;
  onRowClick?: (transaction: Transaction) => void;
}

export default function TransactionsTable({ 
  transactions, 
  metadata, 
  isLoading, 
  onPageChange,
  isCompact = false,
  onRowClick
}: TransactionsTableProps) {
  const { theme } = useTheme();
  const formatDate = (dateString: string | Date | null) => {
    if (!dateString) return "Unknown Date";
    const date = new Date(dateString);
    return format(date, "MMM d, yyyy");
  };

  const formatAmount = (amount: number, currency: string) => {
    const prefix = amount > 0 ? "+" : "";
    return `${prefix}${amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatTxId = (txId: string) => {
    if (txId.length <= 10) return txId;
    return `${txId.substring(0, 6)}...${txId.substring(txId.length - 4)}`;
  };

  const displayedTransactions = useMemo(() => {
    return isCompact && transactions.length > 5 ? transactions.slice(0, 5) : transactions;
  }, [transactions, isCompact]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden mb-6">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-lg font-semibold dark:text-white">
            {isCompact ? "Recent Transactions" : "Transactions"}
          </h2>
          {isCompact && (
            <Link href="/transactions" className="text-sm text-amber-gold hover:text-amber-600">
              View All
            </Link>
          )}
        </div>
      </div>
      
      {isLoading ? (
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
      ) : displayedTransactions.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-gray-500 dark:text-gray-400">No transactions found</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Transaction ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Currency
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Counterparty
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {displayedTransactions.map((transaction) => (
                  <tr 
                    key={transaction.id} 
                    className={cn(
                      "hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors",
                      onRowClick && "cursor-pointer"
                    )}
                    onClick={() => onRowClick && onRowClick(transaction)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                      {formatDate(transaction.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="text-gray-900 dark:text-gray-200 font-medium">
                        {formatTxId(transaction.txId)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                      {formatAmount(Number(transaction.amount), transaction.currency)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                      {transaction.currency}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          transaction.status === "completed"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : transaction.status === "pending"
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
                            : transaction.status === "failed"
                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                      {transaction.counterparty || "Unknown"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {metadata && (
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Showing <span className="font-medium dark:text-gray-300">{displayedTransactions.length}</span> of{" "}
                  <span className="font-medium dark:text-gray-300">{metadata.total}</span> transactions
                </div>
                {!isCompact && (
                  <div className="flex space-x-2">
                    <button
                      className={cn(
                        "px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium",
                        "text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600",
                        "disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      )}
                      disabled={metadata.page <= 1}
                      onClick={() => onPageChange(metadata.page - 1)}
                    >
                      Previous
                    </button>
                    <button
                      className={cn(
                        "px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium",
                        "text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600",
                        "disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      )}
                      disabled={metadata.page * metadata.limit >= metadata.total}
                      onClick={() => onPageChange(metadata.page + 1)}
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
