import React, { useState } from 'react';
import { Wallet as WalletIcon, Send, ArrowDownLeft, ArrowUpRight, Copy, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useAccount, useBalance } from 'wagmi';
import { formatEther } from 'viem';
import { toast } from 'react-hot-toast';

export function Wallet() {
  const { user } = useAuth();
  const { address } = useAccount();
  const { data: balance } = useBalance({ address });
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'withdraw'>('overview');

  const mockTransactions = [
    {
      id: '1',
      type: 'commission' as const,
      amount: 125.50,
      currency: 'USD',
      hash: '0x1234...5678',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      status: 'completed' as const,
    },
    {
      id: '2',
      type: 'withdrawal' as const,
      amount: 500.00,
      currency: 'USD',
      hash: '0x5678...9012',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      status: 'pending' as const,
    },
    {
      id: '3',
      type: 'deposit' as const,
      amount: 1000.00,
      currency: 'USD',
      hash: '0x9012...3456',
      timestamp: new Date(Date.now() - 10800000).toISOString(),
      status: 'completed' as const,
    },
  ];

  const handleCopyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      toast.success('Address copied to clipboard!');
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'commission': return ArrowDownLeft;
      case 'withdrawal': return ArrowUpRight;
      case 'deposit': return ArrowDownLeft;
      default: return WalletIcon;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'commission': return 'text-green-400';
      case 'withdrawal': return 'text-red-400';
      case 'deposit': return 'text-blue-400';
      default: return 'text-slate-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-400/20';
      case 'pending': return 'text-yellow-400 bg-yellow-400/20';
      case 'failed': return 'text-red-400 bg-red-400/20';
      default: return 'text-slate-400 bg-slate-400/20';
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: WalletIcon },
    { id: 'transactions', label: 'Transactions', icon: ArrowUpRight },
    { id: 'withdraw', label: 'Withdraw', icon: Send },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-white mb-2">Wallet Management</h1>
        <p className="text-slate-400 text-lg">
          Manage your crypto assets and withdrawals
        </p>
      </motion.div>

      {/* Wallet Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-xl rounded-2xl border border-green-500/30 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-slate-800/50 text-green-400">
              <WalletIcon size={24} />
            </div>
            <span className="text-sm text-green-400 font-medium">Available</span>
          </div>
          <h3 className="text-slate-300 text-sm font-medium mb-2">Platform Balance</h3>
          <p className="text-white text-3xl font-bold">${user?.available_balance?.toFixed(2) || '0.00'}</p>
          <p className="text-slate-400 text-sm">Ready for withdrawal</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-xl rounded-2xl border border-blue-500/30 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-slate-800/50 text-blue-400">
              <WalletIcon size={24} />
            </div>
            <span className="text-sm text-blue-400 font-medium">ETH</span>
          </div>
          <h3 className="text-slate-300 text-sm font-medium mb-2">Wallet Balance</h3>
          <p className="text-white text-3xl font-bold">
            {balance ? parseFloat(formatEther(balance.value)).toFixed(4) : '0.0000'}
          </p>
          <p className="text-slate-400 text-sm">Ethereum balance</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 backdrop-blur-xl rounded-2xl border border-yellow-500/30 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-slate-800/50 text-yellow-400">
              <WalletIcon size={24} />
            </div>
            <span className="text-sm text-yellow-400 font-medium">Pending</span>
          </div>
          <h3 className="text-slate-300 text-sm font-medium mb-2">Pending Balance</h3>
          <p className="text-white text-3xl font-bold">${user?.pending_balance?.toFixed(2) || '0.00'}</p>
          <p className="text-slate-400 text-sm">Processing commissions</p>
        </motion.div>
      </div>

      {/* Wallet Address */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 p-6"
      >
        <h3 className="text-xl font-bold text-white mb-4">Connected Wallet</h3>
        <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <WalletIcon className="text-white" size={24} />
            </div>
            <div>
              <p className="text-white font-medium">Ethereum Wallet</p>
              <p className="text-slate-400 text-sm font-mono">
                {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Not connected'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyAddress}
              className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
            >
              <Copy size={18} />
            </button>
            <button className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition-colors">
              <ExternalLink size={18} />
            </button>
          </div>
        </div>
      </motion.div>

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
            {/* Quick Actions */}
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 p-6">
              <h3 className="text-xl font-bold text-white mb-6">Quick Actions</h3>
              <div className="space-y-4">
                <button className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 rounded-xl text-white transition-all">
                  <div className="flex items-center space-x-3">
                    <ArrowUpRight size={20} />
                    <span className="font-medium">Withdraw Funds</span>
                  </div>
                  <span className="text-green-200">→</span>
                </button>
                
                <button className="w-full flex items-center justify-between p-4 bg-slate-700/50 hover:bg-slate-700 rounded-xl text-white transition-all">
                  <div className="flex items-center space-x-3">
                    <Send size={20} />
                    <span className="font-medium">Send Payment</span>
                  </div>
                  <span className="text-slate-400">→</span>
                </button>
                
                <button className="w-full flex items-center justify-between p-4 bg-slate-700/50 hover:bg-slate-700 rounded-xl text-white transition-all">
                  <div className="flex items-center space-x-3">
                    <ArrowDownLeft size={20} />
                    <span className="font-medium">View History</span>
                  </div>
                  <span className="text-slate-400">→</span>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 p-6">
              <h3 className="text-xl font-bold text-white mb-6">Recent Activity</h3>
              <div className="space-y-4">
                {mockTransactions.slice(0, 3).map((transaction) => {
                  const Icon = getTransactionIcon(transaction.type);
                  const colorClass = getTransactionColor(transaction.type);
                  
                  return (
                    <div key={transaction.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg bg-slate-800/50 ${colorClass}`}>
                          <Icon size={16} />
                        </div>
                        <div>
                          <p className="text-white font-medium capitalize">{transaction.type}</p>
                          <p className="text-slate-400 text-sm">{transaction.hash}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${transaction.type === 'withdrawal' ? 'text-red-400' : 'text-green-400'}`}>
                          {transaction.type === 'withdrawal' ? '-' : '+'}${transaction.amount.toFixed(2)}
                        </p>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(transaction.status)}`}>
                          {transaction.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Transaction History</h3>
              <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                <ExternalLink size={16} />
                <span>View on Explorer</span>
              </button>
            </div>

            <div className="space-y-3">
              {mockTransactions.map((transaction) => {
                const Icon = getTransactionIcon(transaction.type);
                const colorClass = getTransactionColor(transaction.type);
                
                return (
                  <div key={transaction.id} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl border border-slate-600 hover:bg-slate-700/50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg bg-slate-800/50 ${colorClass}`}>
                        <Icon size={20} />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="text-white font-medium capitalize">{transaction.type}</p>
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(transaction.status)}`}>
                            {transaction.status}
                          </span>
                        </div>
                        <p className="text-slate-400 text-sm font-mono">{transaction.hash}</p>
                        <p className="text-slate-500 text-xs">
                          {new Date(transaction.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${transaction.type === 'withdrawal' ? 'text-red-400' : 'text-green-400'}`}>
                        {transaction.type === 'withdrawal' ? '-' : '+'}${transaction.amount.toFixed(2)}
                      </p>
                      <p className="text-slate-400 text-sm">{transaction.currency}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'withdraw' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 p-6">
              <h3 className="text-xl font-bold text-white mb-6">Withdraw Funds</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">
                    Withdrawal Amount
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="0.00"
                      className="w-full bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                    />
                    <div className="absolute right-3 top-3 text-slate-400">USD</div>
                  </div>
                  <p className="text-slate-400 text-sm mt-2">
                    Available: ${user?.available_balance?.toFixed(2) || '0.00'}
                  </p>
                </div>

                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">
                    Destination Address
                  </label>
                  <input
                    type="text"
                    placeholder="0x..."
                    className="w-full bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">
                    Network
                  </label>
                  <select className="w-full bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none">
                    <option value="ethereum">Ethereum (ETH)</option>
                    <option value="polygon">Polygon (MATIC)</option>
                    <option value="bsc">Binance Smart Chain (BNB)</option>
                  </select>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-black text-xs font-bold">!</span>
                    </div>
                    <div>
                      <h4 className="text-yellow-400 font-medium mb-1">Important Notice</h4>
                      <p className="text-yellow-200 text-sm">
                        Withdrawals are processed within 24-48 hours. A small network fee will be deducted from your withdrawal amount.
                      </p>
                    </div>
                  </div>
                </div>

                <button className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 rounded-xl font-semibold transition-all">
                  Request Withdrawal
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}