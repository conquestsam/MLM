import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from 'framer-motion';

interface CommissionChartProps {
  data: Array<{
    date: string;
    amount: number;
  }>;
  isLoading?: boolean;
}

export function CommissionChart({ data, isLoading }: CommissionChartProps) {
  if (isLoading) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-slate-700 rounded w-1/3" />
          <div className="h-64 bg-slate-700 rounded" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 p-6"
    >
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white mb-2">Commission Earnings</h3>
        <p className="text-slate-400 text-sm">Daily earnings over the last 30 days</p>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="commissionGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
            
            <XAxis 
              dataKey="date" 
              stroke="#64748B"
              fontSize={12}
              tickFormatter={(value) => {
                const date = new Date(value);
                return `${date.getMonth() + 1}/${date.getDate()}`;
              }}
            />
            
            <YAxis 
              stroke="#64748B"
              fontSize={12}
              tickFormatter={(value) => `$${value}`}
            />
            
            <Tooltip
              contentStyle={{
                backgroundColor: '#1E293B',
                border: '1px solid #334155',
                borderRadius: '12px',
                color: '#F1F5F9',
              }}
              formatter={(value: number) => [`$${value.toFixed(2)}`, 'Earnings']}
              labelFormatter={(label) => {
                const date = new Date(label);
                return date.toLocaleDateString();
              }}
            />
            
            <Area
              type="monotone"
              dataKey="amount"
              stroke="#3B82F6"
              strokeWidth={2}
              fill="url(#commissionGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}