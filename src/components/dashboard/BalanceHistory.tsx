import { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { format, subDays, subMonths, subYears } from "date-fns";

interface BalanceHistoryProps {
  data: { date: string; amount: number }[];
}

type TimeRange = "30d" | "90d" | "1y" | "all";

export default function BalanceHistory({ data }: BalanceHistoryProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>("30d");

  const filteredData = useMemo(() => {
    const today = new Date();
    let cutoffDate: Date;

    switch (timeRange) {
      case "30d":
        cutoffDate = subDays(today, 30);
        break;
      case "90d":
        cutoffDate = subDays(today, 90);
        break;
      case "1y":
        cutoffDate = subMonths(today, 12);
        break;
      case "all":
      default:
        return data;
    }

    return data.filter(entry => new Date(entry.date) >= cutoffDate);
  }, [data, timeRange]);

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}k`;
    }
    return `$${value}`;
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
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 shadow-md rounded-md">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{label}</p>
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {formatTooltipValue(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (timeRange === "30d" || timeRange === "90d") {
      return format(date, "MMM d");
    } else if (timeRange === "1y") {
      return format(date, "MMM yyyy");
    }
    return format(date, "MMM yyyy");
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 lg:col-span-2">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold dark:text-white">Balance History</h2>
        <div>
          <select
            className="bg-white border border-gray-300 text-gray-700 text-sm rounded-2xl focus:ring-amber-gold focus:border-amber-gold px-3 py-1.5"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as TimeRange)}
          >
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last 12 Months</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={filteredData}
            margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0}
                />
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
              tickFormatter={formatCurrency}
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
              fill="url(#colorAmount)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
