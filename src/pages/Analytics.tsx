import React, { useState } from 'react';
import { TrendingUp, Users, DollarSign, Target, Calendar, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useCommissions } from '../hooks/useCommissions';
import { useReferrals } from '../hooks/useReferrals';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

export function Analytics() {
  const { user } = useAuth();
  const { stats: commissionStats, getDailyCommissions, getMonthlyCommissions } = useCommissions(user?.id);
  const { stats: referralStats } = useReferrals(user?.id);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  const dailyData = getDailyCommissions(timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365);
  const monthlyData = getMonthlyCommissions();

  // Mock data for advanced analytics
  const performanceData = [
    { name: 'Jan', earnings: 1200, referrals: 8, conversion: 24 },
    { name: 'Feb', earnings: 1800, referrals: 12, conversion: 28 },
    { name: 'Mar', earnings: 2400, referrals: 15, conversion: 32 },
    { name: 'Apr', earnings: 2100, referrals: 13, conversion: 29 },
    { name: 'May', earnings: 2800, referrals: 18, conversion: 35 },
    { name: 'Jun', earnings: 3200, referrals: 22, conversion: 38 },
  ];

  const commissionBreakdown = [
    { name: 'Level 1', value: 45, color: '#3B82F6' },
    { name: 'Level 2', value: 25, color: '#8B5CF6' },
    { name: 'Level 3', value: 15, color: '#10B981' },
    { name: 'Level 4', value: 10, color: '#F59E0B' },
    { name: 'Level 5', value: 5, color: '#EF4444' },
  ];

  const projectionData = [
    { month: 'Jul', actual: 3200, projected: 3500 },
    { month: 'Aug', actual: null, projected: 3800 },
    { month: 'Sep', actual: null, projected: 4200 },
    { month: 'Oct', actual: null, projected: 4600 },
    { month: 'Nov', actual: null, projected: 5000 },
    { month: 'Dec', actual: null, projected: 5500 },
  ];

  const timeRanges = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
    { value: '1y', label: '1 Year' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-white mb-2">Analytics Dashboard</h1>
        <p className="text-slate-400 text-lg">
          Deep insights into your MLM performance and growth trends
        </p>
      </motion.div>

      {/* Time Range Selector */}
      <div className="flex justify-center">
        <div className="flex space-x-1 bg-slate-800/50 backdrop-blur-xl rounded-xl p-1">
          {timeRanges.map((range) => (
            <button
              key={range.value}
              onClick={() => setTimeRange(range.value as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                timeRange === range.value
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-xl rounded-2xl border border-blue-500/30 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-slate-800/50 text-blue-400">
              <TrendingUp size={24} />
            </div>
            <span className="text-sm text-green-400 font-medium">+15.2%</span>
          </div>
          <h3 className="text-slate-300 text-sm font-medium mb-2">Growth Rate</h3>
          <p className="text-white text-3xl font-bold">15.2%</p>
          <p className="text-slate-400 text-sm">Monthly growth</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-xl rounded-2xl border border-green-500/30 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-slate-800/50 text-green-400">
              <Target size={24} />
            </div>
            <span className="text-sm text-green-400 font-medium">+8.3%</span>
          </div>
          <h3 className="text-slate-300 text-sm font-medium mb-2">Conversion Rate</h3>
          <p className="text-white text-3xl font-bold">24.5%</p>
          <p className="text-slate-400 text-sm">Referral to signup</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-xl rounded-2xl border border-purple-500/30 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-slate-800/50 text-purple-400">
              <DollarSign size={24} />
            </div>
            <span className="text-sm text-green-400 font-medium">+12.7%</span>
          </div>
          <h3 className="text-slate-300 text-sm font-medium mb-2">Avg Commission</h3>
          <p className="text-white text-3xl font-bold">$127.50</p>
          <p className="text-slate-400 text-sm">Per referral</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 backdrop-blur-xl rounded-2xl border border-yellow-500/30 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-slate-800/50 text-yellow-400">
              <Users size={24} />
            </div>
            <span className="text-sm text-green-400 font-medium">+25.4%</span>
          </div>
          <h3 className="text-slate-300 text-sm font-medium mb-2">Network Size</h3>
          <p className="text-white text-3xl font-bold">{referralStats.totalReferrals}</p>
          <p className="text-slate-400 text-sm">Total referrals</p>
        </motion.div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Earnings Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 p-6"
        >
          <h3 className="text-xl font-bold text-white mb-4">Earnings Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyData}>
                <defs>
                  <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
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
                <YAxis stroke="#64748B" fontSize={12} tickFormatter={(value) => `$${value}`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E293B',
                    border: '1px solid #334155',
                    borderRadius: '12px',
                    color: '#F1F5F9',
                  }}
                  formatter={(value: number) => [`$${value.toFixed(2)}`, 'Earnings']}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  fill="url(#earningsGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Commission Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 p-6"
        >
          <h3 className="text-xl font-bold text-white mb-4">Commission by Level</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={commissionBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {commissionBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E293B',
                    border: '1px solid #334155',
                    borderRadius: '12px',
                    color: '#F1F5F9',
                  }}
                  formatter={(value: number) => [`${value}%`, 'Commission']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {commissionBreakdown.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-300 text-sm">{item.name}: {item.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Performance Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 p-6"
        >
          <h3 className="text-xl font-bold text-white mb-4">Performance Overview</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis dataKey="name" stroke="#64748B" fontSize={12} />
                <YAxis stroke="#64748B" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E293B',
                    border: '1px solid #334155',
                    borderRadius: '12px',
                    color: '#F1F5F9',
                  }}
                />
                <Bar dataKey="earnings" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="referrals" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Earnings Projection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 p-6"
        >
          <h3 className="text-xl font-bold text-white mb-4">Earnings Projection</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={projectionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis dataKey="month" stroke="#64748B" fontSize={12} />
                <YAxis stroke="#64748B" fontSize={12} tickFormatter={(value) => `$${value}`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E293B',
                    border: '1px solid #334155',
                    borderRadius: '12px',
                    color: '#F1F5F9',
                  }}
                  formatter={(value: number) => [`$${value}`, value ? 'Actual' : 'Projected']}
                />
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                  connectNulls={false}
                />
                <Line
                  type="monotone"
                  dataKey="projected"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-br from-green-500/10 to-green-600/10 backdrop-blur-xl rounded-2xl border border-green-500/20 p-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 rounded-lg bg-green-500/20 text-green-400">
              <TrendingUp size={20} />
            </div>
            <h4 className="text-lg font-semibold text-white">Growth Insight</h4>
          </div>
          <p className="text-slate-300 mb-3">
            Your referral network is growing 15% faster than the platform average.
          </p>
          <p className="text-green-400 text-sm font-medium">
            Keep up the excellent work! 🚀
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 backdrop-blur-xl rounded-2xl border border-blue-500/20 p-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
              <Target size={20} />
            </div>
            <h4 className="text-lg font-semibold text-white">Optimization Tip</h4>
          </div>
          <p className="text-slate-300 mb-3">
            Focus on Level 2 referrals to maximize your commission potential.
          </p>
          <p className="text-blue-400 text-sm font-medium">
            Potential +$500/month increase 💡
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
              <BarChart3 size={20} />
            </div>
            <h4 className="text-lg font-semibold text-white">Performance</h4>
          </div>
          <p className="text-slate-300 mb-3">
            You're in the top 10% of performers this month.
          </p>
          <p className="text-purple-400 text-sm font-medium">
            Rank: Elite Member ⭐
          </p>
        </motion.div>
      </div>
    </div>
  );
}