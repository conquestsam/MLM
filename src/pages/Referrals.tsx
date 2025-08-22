import React, { useState } from 'react';
import { Users, Copy, Share2, TrendingUp, Eye, Link as LinkIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useReferrals } from '../hooks/useReferrals';
import { toast } from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

export function Referrals() {
  const { user } = useAuth();
  const { referrals, stats, generateReferralLink, loading } = useReferrals(user?.id);
  const [activeTab, setActiveTab] = useState<'overview' | 'tree' | 'links'>('overview');

  const handleCopyReferralCode = async () => {
    if (user?.referral_code) {
      const baseUrl = window.location.origin;
      const referralUrl = `${baseUrl}/register?ref=${user.referral_code}`;
      await navigator.clipboard.writeText(referralUrl);
      toast.success('Referral link copied to clipboard!');
    }
  };

  const handleGenerateLink = async () => {
    await generateReferralLink('Custom Campaign');
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'tree', label: 'Network Tree', icon: Users },
    { id: 'links', label: 'Referral Links', icon: LinkIcon },
  ];

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
        <h1 className="text-4xl font-bold text-white mb-2">Referral Network</h1>
        <p className="text-slate-400 text-lg">
          Manage your referrals and track your network growth
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-xl rounded-2xl border border-blue-500/30 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-slate-800/50 text-blue-400">
              <Users size={24} />
            </div>
            <span className="text-sm text-green-400 font-medium">+12.5%</span>
          </div>
          <h3 className="text-slate-300 text-sm font-medium mb-2">Total Referrals</h3>
          <p className="text-white text-3xl font-bold">{stats.totalReferrals}</p>
          <p className="text-slate-400 text-sm">{stats.activeReferrals} active</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-xl rounded-2xl border border-green-500/30 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-slate-800/50 text-green-400">
              <TrendingUp size={24} />
            </div>
            <span className="text-sm text-green-400 font-medium">+8.3%</span>
          </div>
          <h3 className="text-slate-300 text-sm font-medium mb-2">Network Levels</h3>
          <p className="text-white text-3xl font-bold">
            {Object.keys(stats.generationBreakdown).length}
          </p>
          <p className="text-slate-400 text-sm">generations deep</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-xl rounded-2xl border border-purple-500/30 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-slate-800/50 text-purple-400">
              <Share2 size={24} />
            </div>
            <span className="text-sm text-green-400 font-medium">+15.2%</span>
          </div>
          <h3 className="text-slate-300 text-sm font-medium mb-2">Conversion Rate</h3>
          <p className="text-white text-3xl font-bold">24.5%</p>
          <p className="text-slate-400 text-sm">from referral links</p>
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
            {/* Referral Code Card */}
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 p-6">
              <h3 className="text-xl font-bold text-white mb-4">Your Referral Code</h3>
              <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-400">
                    {user?.referral_code}
                  </span>
                  <button
                    onClick={handleCopyReferralCode}
                    className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
                  >
                    <Copy size={18} />
                  </button>
                </div>
              </div>
              <p className="text-slate-400 text-sm mb-4">
                Share this code with friends to earn commissions on their activities.
              </p>
              <button
                onClick={handleGenerateLink}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-all"
              >
                Generate Custom Link
              </button>
            </div>

            {/* Generation Breakdown */}
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 p-6">
              <h3 className="text-xl font-bold text-white mb-4">Generation Breakdown</h3>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((level) => {
                  const count = stats.generationBreakdown[level] || 0;
                  const percentage = stats.totalReferrals > 0 ? (count / stats.totalReferrals) * 100 : 0;
                  
                  return (
                    <div key={level} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {level}
                        </div>
                        <span className="text-white">Level {level}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-24 bg-slate-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-slate-300 text-sm w-8">{count}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tree' && (
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 p-6">
            <h3 className="text-xl font-bold text-white mb-6">Network Tree Visualization</h3>
            
            {referrals.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-white mb-2">No Referrals Yet</h4>
                <p className="text-slate-400 mb-6">
                  Start sharing your referral code to build your network
                </p>
                <button
                  onClick={handleCopyReferralCode}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all"
                >
                  Copy Referral Code
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((level) => {
                  const levelReferrals = referrals.filter(r => r.generation_level === level);
                  if (levelReferrals.length === 0) return null;

                  return (
                    <div key={level} className="border-l-2 border-blue-500/30 pl-6">
                      <h4 className="text-lg font-semibold text-white mb-3">
                        Level {level} ({levelReferrals.length} referrals)
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {levelReferrals.map((referral) => (
                          <div
                            key={referral.id}
                            className="bg-slate-700/50 rounded-lg p-3 border border-slate-600"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                {referral.user.username?.charAt(0) || 'U'}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-white text-sm font-medium truncate">
                                  {referral.user.username || `User ${referral.user.wallet_address.slice(-6)}`}
                                </p>
                                <p className="text-slate-400 text-xs">
                                  {referral.commission_rate}% commission
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'links' && (
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Referral Links</h3>
              <button
                onClick={handleGenerateLink}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-all"
              >
                Generate New Link
              </button>
            </div>

            <div className="space-y-4">
              {/* Default referral link */}
              <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <LinkIcon className="text-blue-400" size={20} />
                    <div>
                      <h4 className="text-white font-medium">Default Referral Link</h4>
                      <p className="text-slate-400 text-sm">Your main referral code</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1 text-slate-400 text-sm">
                      <Eye size={14} />
                      <span>0 clicks</span>
                    </div>
                    <button
                      onClick={handleCopyReferralCode}
                      className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-3">
                  <code className="text-green-400 text-sm break-all">
                    {window.location.origin}/register?ref={user?.referral_code}
                  </code>
                </div>
              </div>

              {/* Placeholder for custom links */}
              <div className="text-center py-8 border-2 border-dashed border-slate-600 rounded-xl">
                <LinkIcon className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <h4 className="text-lg font-semibold text-white mb-2">No Custom Links Yet</h4>
                <p className="text-slate-400 mb-4">
                  Create custom referral links for different campaigns
                </p>
                <button
                  onClick={handleGenerateLink}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all"
                >
                  Create First Custom Link
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}