import { useState } from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Transaction } from "@shared/schema";

interface TransactionDetailProps {
  transaction: Transaction;
  onClose: () => void;
}

export default function TransactionDetail({ transaction, onClose }: TransactionDetailProps) {
  const [activeTab, setActiveTab] = useState<"details" | "json" | "logs">("details");
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "pending":
        return "bg-amber-gold";
      case "failed":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };
  
  const formatAmount = (amount: string | number, currency: string) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return `${numAmount > 0 ? '+' : ''}${numAmount.toLocaleString()} ${currency}`;
  };
  
  const formatDate = (date: Date | string | null) => {
    if (!date) return "Unknown Date";
    return format(new Date(date), "MMMM d, yyyy 'at' h:mm a");
  };
  
  const mockedOnChainLink = "https://solscan.io/tx/4Xf6tTzdsfZZiLGH5ktpRnCVV4qBYs98MyWBrTGmBs96wQrGWH2aoaK15eGUDgDXw15fNdRVgcezwZbUFVdtNDJo";
  
  const renderTransactionJSON = () => {
    return (
      <div className="bg-gray-900 rounded-lg p-4 overflow-auto">
        <pre className="text-gray-300 text-sm whitespace-pre-wrap">
          {JSON.stringify(
            {
              ...transaction,
              date: formatDate(transaction.date),
              metadata: {
                network: "Solana",
                block: 123456789,
                fee: "0.000005 SOL",
                nonce: 420,
                confirmations: 24,
                priority: "high"
              }
            },
            null,
            2
          )}
        </pre>
      </div>
    );
  };
  
  const renderEventLogs = () => {
    // Mocked event logs
    const logs = [
      { timestamp: "2023-08-20T10:15:22Z", level: "info", message: "Transaction initiated" },
      { timestamp: "2023-08-20T10:15:23Z", level: "info", message: "Validating wallet address" },
      { timestamp: "2023-08-20T10:15:24Z", level: "info", message: "Balance check passed" },
      { timestamp: "2023-08-20T10:15:25Z", level: "info", message: "Transaction submitted to network" },
      { timestamp: "2023-08-20T10:15:26Z", level: "info", message: "Waiting for blockchain confirmation" },
      { timestamp: "2023-08-20T10:15:32Z", level: "info", message: `Transaction confirmed with ${transaction.status === 'completed' ? 'success' : 'failure'}` }
    ];
    
    return (
      <div className="bg-gray-900 rounded-lg p-4 overflow-auto h-64">
        {logs.map((log, index) => (
          <div key={index} className="mb-2 text-sm">
            <span className="text-gray-400">[{format(new Date(log.timestamp), "HH:mm:ss")}]</span>
            <span className={`ml-2 ${log.level === 'error' ? 'text-red-400' : 'text-gray-300'}`}>
              {log.message}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold dark:text-white">Transaction Details</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="dark:text-gray-200 dark:hover:text-white">
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </Button>
        </div>
      </div>
      
      <div className="p-6">
        <div className="mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-sm text-gray-500 dark:text-gray-400">Transaction ID</h3>
              <p className="text-lg font-medium font-mono">{transaction.txId}</p>
            </div>
            <Badge className={`${getStatusColor(transaction.status)} text-white`}>
              {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-1">Amount</h3>
              <p className={`text-lg font-medium ${Number(transaction.amount) > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {formatAmount(transaction.amount, transaction.currency)}
              </p>
            </div>
            
            <div>
              <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-1">Date & Time</h3>
              <p className="text-base">{formatDate(transaction.date)}</p>
            </div>
            
            <div>
              <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-1">Counterparty</h3>
              <p className="text-base">{transaction.counterparty}</p>
            </div>
            
            <div>
              <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-1">On-chain Link</h3>
              <a
                href={mockedOnChainLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-gold hover:text-amber-600 flex items-center"
              >
                View on Solscan
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-4 h-4 ml-1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
        
        <div>
          <div className="border-b border-gray-200 dark:border-gray-700 mb-4">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab("details")}
                className={`py-2 px-1 border-b-2 -mb-px font-medium text-sm ${
                  activeTab === "details"
                    ? "border-amber-gold text-amber-gold"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                Details
              </button>
              <button
                onClick={() => setActiveTab("json")}
                className={`py-2 px-1 border-b-2 -mb-px font-medium text-sm ${
                  activeTab === "json"
                    ? "border-amber-gold text-amber-gold"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                JSON
              </button>
              <button
                onClick={() => setActiveTab("logs")}
                className={`py-2 px-1 border-b-2 -mb-px font-medium text-sm ${
                  activeTab === "logs"
                    ? "border-amber-gold text-amber-gold"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                Event Logs
              </button>
            </nav>
          </div>
          
          <div className="mt-4">
            {activeTab === "details" && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-medium mb-2 dark:text-white">Transaction Summary</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    This transaction represents a {Number(transaction.amount) > 0 ? "deposit into" : "withdrawal from"} your account
                    of {Math.abs(Number(transaction.amount)).toLocaleString()} {transaction.currency} {Number(transaction.amount) > 0 ? "from" : "to"} {transaction.counterparty || "Unknown"}.
                    The transaction was {transaction.status} on {formatDate(transaction.date)}.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-medium mb-2 dark:text-white">Additional Information</h3>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Network</span>
                      <p className="dark:text-gray-300">Solana</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Gas Fee</span>
                      <p className="dark:text-gray-300">0.000005 SOL</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Priority</span>
                      <p className="dark:text-gray-300">High</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Confirmations</span>
                      <p className="dark:text-gray-300">24</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === "json" && renderTransactionJSON()}
            
            {activeTab === "logs" && renderEventLogs()}
          </div>
        </div>
      </div>
    </div>
  );
}