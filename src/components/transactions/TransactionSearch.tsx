import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

export interface TransactionFilters {
  searchQuery: string;
  status: string;
  currency: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
}

interface TransactionSearchProps {
  onFilterChange: (filters: TransactionFilters) => void;
}

export default function TransactionSearch({ onFilterChange }: TransactionSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [currency, setCurrency] = useState("all");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const handleSearch = () => {
    onFilterChange({
      searchQuery,
      status,
      currency,
      startDate,
      endDate
    });
  };

  const handleReset = () => {
    setSearchQuery("");
    setStatus("all");
    setCurrency("all");
    setStartDate(undefined);
    setEndDate(undefined);
    
    onFilterChange({
      searchQuery: "",
      status: "all",
      currency: "all",
      startDate: undefined,
      endDate: undefined
    });
  };

  return (
    <div className="mb-6 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Search & Filter Transactions</h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Search
          </label>
          <Input
            id="search"
            type="text"
            placeholder="Search wallet address or counterparty"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Status
          </label>
          <Select
            value={status}
            onValueChange={setStatus}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label htmlFor="currency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Currency
          </label>
          <Select
            value={currency}
            onValueChange={setCurrency}
          >
            <SelectTrigger id="currency">
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Currencies</SelectItem>
              <SelectItem value="USDC">USDC</SelectItem>
              <SelectItem value="USDT">USDT</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label htmlFor="date-range" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Date Range
          </label>
          <div className="flex space-x-2">
            <div className="flex-1">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "MMM d, yyyy") : "Start Date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex-1">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "MMM d, yyyy") : "End Date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end mt-4 space-x-3">
        <Button variant="outline" onClick={handleReset}>
          Reset
        </Button>
        <Button 
          className="bg-amber-gold hover:bg-amber-600"
          onClick={handleSearch}
        >
          Search
        </Button>
      </div>
    </div>
  );
}