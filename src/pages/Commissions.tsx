import React, { useState } from 'react';
import { DollarSign, TrendingUp, Calendar, Filter, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useCommissions } from '../hooks/useCommissions';
import { formatDistanceToNow } from 'date-fns';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, BarChart, Bar } from 'recharts';

export function Commissions() {
  const { user } = useAuth();
  const { commissions, stats, getMonthlyCommissions, getDailyCommissions, loading } = useCommissions(user?.id);
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'analytics'>('overview');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'pending'>('all');

  const monthlyData = getMonthlyCommissions();
  const dailyData = getDailyCommissions(30);

  const filteredCommissions = commissions.filter(commission => {
    if (filterStatus === 'all') return true;
    return commission.status === filterStatus;
  });

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'history', label: 'History', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: BarChart },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-400/20';
      case 'pending': return 'text-yellow-400 bg-yellow-400/20';
      case 'processing': return 'text-blue-400 bg-blue-400/20';
      case 'failed': return 'text-red-400 bg-red-400/20';
      default: return 'text-slate-400 bg-slate-400/20';
    }
  };

  const getCommissionTypeColor = (type: string) => {
    switch (type) {
      case 'referral': return 'text-blue-400';
      case 'level_bonus': return 'text-purple-400';
      case 'rank_bonus': return 'text-green-400';
      default: return 'text-slate-400';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-700 rounded w-1/3 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-slate-800 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-white mb-2">Commission Earnings</h1>
        <p className="text-slate-400 text-lg">
          Track your earnings and commission performance
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-xl rounded-2xl border border-green-500/30 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-slate-800/50 text-green-400">
              <DollarSign size={24} />
            </div>
          </div>
          <h3 className="text-slate-300 text-sm font-medium mb-2">Total Earned</h3>
          <p className="text-white text-3xl font-bold">${stats.totalEarned.toFixed(2)}</p>
          <p className="text-slate-400 text-sm">All-time earnings</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 backdrop-blur-xl rounded-2xl border border-yellow-500/30 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-slate-800/50 text-yellow-400">
              <Calendar size={24} />
            </div>
          </div>
          <h3 className="text-slate-300 text-sm font-medium mb-2">This Month</h3>
          <p className="text-white text-3xl font-bold">${stats.thisMonth.toFixed(2)}</p>
          <p className="text-slate-400 text-sm">Monthly earnings</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-xl rounded-2xl border border-blue-500/30 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-slate-800/50 text-blue-400">
              <TrendingUp size={24} />
            </div>
          </div>
          <h3 className="text-slate-300 text-sm font-medium mb-2">Daily Average</h3>
          <p className="text-white text-3xl font-bold">${stats.averageDaily.toFixed(2)}</p>
          <p className="text-slate-400 text-sm">This month</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-xl rounded-2xl border border-purple-500/30 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-slate-800/50 text-purple-400">
              <DollarSign size={24} />
            </div>
          </div>
          <h3 className="text-slate-300 text-sm font-medium mb-2">Pending</h3>
          <p className="text-white text-3xl font-bold">${stats.pendingCommissions.toFixed(2)}</p>
          <p className="text-slate-400 text-sm">Awaiting processing</p>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-slate-800/50 backdrop-blur-xl rounded-xl p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <tab.icon size={18} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Daily Earnings Chart */}
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 p-6">
              <h3 className="text-xl font-bold text-white mb-4">Daily Earnings (30 Days)</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dailyData}>
                    <defs>
                      <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
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
                      stroke="#10B981"
                      strokeWidth={2}
                      fill="url(#earningsGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Commission Breakdown */}
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 p-6">
              <h3 className="text-xl font-bold text-white mb-4">Commission Breakdown</h3>
              <div className="space-y-4">
                {[
                  { type: 'referral', label: 'Direct Referrals', rate: '10%', color: 'blue' },
                  { type: 'level_bonus', label: 'Level Bonuses', rate: '5-2%', color: 'purple' },
                  { type: 'rank_bonus', label: 'Rank Bonuses', rate: '1-0.5%', color: 'green' },
                ].map((item) => {
                  const typeCommissions = commissions.filter(c => c.commission_type === item.type && c.status === 'completed');
                  const total = typeCommissions.reduce((sum, c) => sum + c.amount_usd, 0);
                  const percentage = stats.totalEarned > 0 ? (total / stats.totalEarned) * 100 : 0;

                  return (
                    <div key={item.type} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full bg-${item.color}-500`} />
                        <div>
                          <p className="text-white font-medium">{item.label}</p>
                          <p className="text-slate-400 text-sm">{item.rate} commission</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-bold">${total.toFixed(2)}</p>
                        <p className="text-slate-400 text-sm">{percentage.toFixed(1)}%</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Commission History</h3>
              <div className="flex items-center space-x-3">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                </select>
                <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                  <Download size={16} />
                  <span>Export</span>
                </button>
              </div>
            </div>

            {filteredCommissions.length === 0 ? (
              <div className="text-center py-12">
                <DollarSign className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-white mb-2">No Commissions Yet</h4>
                <p className="text-slate-400">
                  Start referring users to earn your first commission
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredCommissions.map((commission) => (
                  <div
                    key={commission.id}
                    className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl border border-slate-600 hover:bg-slate-700/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-lg ${getCommissionTypeColor(commission.commission_type)} bg-slate-800/50`}>
                        <DollarSign size={20} />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="text-white font-medium">
                            {commission.commission_type.replace('_', ' ').toUpperCase()}
                          </p>
                          {commission.generation_level && (
                            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                              Level {commission.generation_level}
                            </span>
                          )}
                        </div>
                        <p className="text-slate-400 text-sm">
                          From {commission.source_user?.username || `User ${commission.source_user?.wallet_address?.slice(-6)}`}
                        </p>
                        <p className="text-slate-500 text-xs">
                          {formatDistanceToNow(new Date(commission.created_at), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold text-lg">
                        ${commission.amount_usd.toFixed(2)}
                      </p>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(commission.status)}`}>
                          {commission.status}
                        </span>
                        <span className="text-slate-400 text-xs">
                          {commission.commission_rate}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Trends */}
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 p-6">
              <h3 className="text-xl font-bold text-white mb-4">Monthly Trends</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
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
                      formatter={(value: number) => [`$${value.toFixed(2)}`, 'Earnings']}
                    />
                    <Bar dataKey="amount" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 p-6">
              <h3 className="text-xl font-bold text-white mb-4">Performance Metrics</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-300">Conversion Rate</span>
                    <span className="text-white font-bold">24.5%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full" style={{ width: '24.5%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-300">Average Commission</span>
                    <span className="text-white font-bold">
                      ${commissions.length > 0 ? (stats.totalEarned / commissions.length).toFixed(2) : '0.00'}
                    </span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{ width: '67%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-300">Growth Rate</span>
                    <span className="text-white font-bold">+15.2%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full" style={{ width: '85%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}