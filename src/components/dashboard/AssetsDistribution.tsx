import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface AssetsDistributionProps {
  data: {
    assetName: string;
    amount: number;
    percentage: number;
    color: string;
  }[];
  totalBalance: number;
}

export default function AssetsDistribution({ data, totalBalance }: AssetsDistributionProps) {
  const formattedTotalBalance = useMemo(() => {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }).format(totalBalance / totalBalance); // Always 100%
  }, [totalBalance]);

  const customTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
          <p className="text-sm font-semibold">{data.assetName}</p>
          <p className="text-sm text-gray-600">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 2
            }).format(data.amount)}
          </p>
          <p className="text-sm text-gray-600">
            {new Intl.NumberFormat("en-US", {
              style: "percent",
              minimumFractionDigits: 1,
              maximumFractionDigits: 1
            }).format(data.percentage / 100)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Assets Distribution</h2>
      </div>
      <div className="h-64 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="amount"
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={customTooltip} />
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-base font-bold"
            >
              {formattedTotalBalance}
            </text>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
        {data.map((asset, index) => (
          <div key={index} className="flex items-center">
            <div 
              className="w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: asset.color }}
            ></div>
            <span>
              {asset.assetName} ({asset.percentage.toFixed(1)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
