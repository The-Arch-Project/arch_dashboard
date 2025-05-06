import { useState, useEffect } from "react";
import TransactionsTable from "@/components/dashboard/TransactionsTable";
import TransactionSearch, { TransactionFilters } from "@/components/transactions/TransactionSearch";
import TransactionDetail from "@/components/transactions/TransactionDetail";
import { useTransactions, useTransactionById } from "@/services/transactions";
import { Transaction } from "@shared/schema";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format, isAfter, isBefore, parseISO } from "date-fns";

export default function Transactions() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [selectedTransactionId, setSelectedTransactionId] = useState<number | undefined>(undefined);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [filters, setFilters] = useState<TransactionFilters>({
    searchQuery: "",
    status: "all",
    currency: "all",
    startDate: undefined,
    endDate: undefined
  });
  
  const { data: transactionsData, isLoading } = useTransactions(page, limit);
  const { data: transactionData, isLoading: isLoadingTransaction } = useTransactionById(selectedTransactionId);
  
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [isFiltering, setIsFiltering] = useState(false);

  useEffect(() => {
    if (transactionsData?.data && !isFiltering) {
      setFilteredTransactions(transactionsData.data);
    }
  }, [transactionsData, isFiltering]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleFilterChange = (newFilters: TransactionFilters) => {
    setFilters(newFilters);
    
    if (!transactionsData?.data) return;
    
    // Check if we need to do filtering
    const needsFiltering = 
      newFilters.searchQuery !== "" || 
      newFilters.status !== "all" || 
      newFilters.currency !== "all" || 
      newFilters.startDate !== undefined || 
      newFilters.endDate !== undefined;
    
    if (!needsFiltering) {
      setIsFiltering(false);
      setFilteredTransactions(transactionsData.data);
      return;
    }
    
    setIsFiltering(true);
    
    // Apply filters
    const filtered = transactionsData.data.filter(transaction => {
      // Filter by search query (counterparty or txId)
      if (
        newFilters.searchQuery !== "" &&
        !transaction.counterparty.toLowerCase().includes(newFilters.searchQuery.toLowerCase()) &&
        !transaction.txId.toLowerCase().includes(newFilters.searchQuery.toLowerCase())
      ) {
        return false;
      }
      
      // Filter by status
      if (newFilters.status !== "all" && transaction.status !== newFilters.status) {
        return false;
      }
      
      // Filter by currency
      if (newFilters.currency !== "all" && transaction.currency !== newFilters.currency) {
        return false;
      }
      
      // Filter by date range
      const txDate = new Date(transaction.date);
      if (newFilters.startDate && isBefore(txDate, newFilters.startDate)) {
        return false;
      }
      if (newFilters.endDate && isAfter(txDate, newFilters.endDate)) {
        return false;
      }
      
      return true;
    });
    
    setFilteredTransactions(filtered);
  };
  
  const handleRowClick = (transaction: Transaction) => {
    setSelectedTransactionId(transaction.id);
    setIsDetailOpen(true);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Transactions</h1>
      
      <TransactionSearch onFilterChange={handleFilterChange} />
      
      <TransactionsTable
        transactions={isFiltering ? filteredTransactions : (transactionsData?.data ?? [])}
        metadata={transactionsData?.metadata}
        isLoading={isLoading}
        onPageChange={handlePageChange}
        onRowClick={handleRowClick}
      />
      
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-3xl p-0">
          {isLoadingTransaction ? (
            <div className="flex items-center justify-center py-12">
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
          ) : transactionData?.data ? (
            <TransactionDetail 
              transaction={transactionData.data}
              onClose={() => setIsDetailOpen(false)}
            />
          ) : (
            <div className="p-6 text-center text-gray-500">
              Transaction not found
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
