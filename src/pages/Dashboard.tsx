import React from 'react';
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  Wallet,
  ArrowUpRight,
  Copy
} from 'lucide-react';
import { StatsCard } from '../components/Dashboard/StatsCard';
import { CommissionChart } from '../components/Dashboard/CommissionChart';
import { RecentActivity } from '../components/Dashboard/RecentActivity';
import { useAuth } from '../hooks/useAuth';
import { useCommissions } from '../hooks/useCommissions';
import { useReferrals } from '../hooks/useReferrals';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

export function Dashboard() {
  const { user } = useAuth();
  const { stats: commissionStats, getDailyCommissions, loading: commissionsLoading } = useCommissions(user?.id);
  const { stats: referralStats, generateReferralLink, loading: referralsLoading } = useReferrals(user?.id);

  const dailyCommissions = getDailyCommissions(30);

  const mockActivities = [
    {
      id: '1',
      type: 'commission' as const,
      description: 'Level 1 commission from referral',
      amount: 25.50,
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      user: 'john_doe',
    },
    {
      id: '2',
      type: 'referral' as const,
      description: 'New referral joined',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      user: 'alice_smith',
    },
    {
      id: '3',
      type: 'commission' as const,
      description: 'Level 2 commission bonus',
      amount: 12.75,
      timestamp: new Date(Date.now() - 10800000).toISOString(),
      user: 'bob_wilson',
    },
  ];

  const handleGenerateReferralLink = async () => {
    await generateReferralLink('Dashboard Quick Share');
  };

  const handleCopyReferralCode = async () => {
    if (user?.referral_code) {
      const baseUrl = window.location.origin;
      const referralUrl = `${baseUrl}/register?ref=${user.referral_code}`;
      await navigator.clipboard.writeText(referralUrl);
      toast.success('Referral link copied to clipboard!');
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold text-white mb-2">
          Welcome back, {user?.username || 'Member'}! 👋
        </h1>
        <p className="text-slate-400 text-lg">
          Here's your ZChain MLM performance overview
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Available Balance"
          value={`$${user?.available_balance?.toFixed(2) || '0.00'}`}
          subtitle="Ready for withdrawal"
          icon={Wallet}
          color="green"
          trend={{ value: 12.5, isPositive: true }}
          isLoading={commissionsLoading}
        />
        
        <StatsCard
          title="Total Earnings"
          value={`$${commissionStats.totalEarned.toFixed(2)}`}
          subtitle="All-time commissions"
          icon={DollarSign}
          color="blue"
          trend={{ value: 8.3, isPositive: true }}
          isLoading={commissionsLoading}
        />
        
        <StatsCard
          title="Active Referrals"
          value={referralStats.activeReferrals}
          subtitle={`${referralStats.totalReferrals} total referrals`}
          icon={Users}
          color="purple"
          trend={{ value: 15.2, isPositive: true }}
          isLoading={referralsLoading}
        />
        
        <StatsCard
          title="This Month"
          value={`$${commissionStats.thisMonth.toFixed(2)}`}
          subtitle="Monthly earnings"
          icon={TrendingUp}
          color="yellow"
          trend={{ value: commissionStats.averageDaily > 0 ? 25.4 : -5.2, isPositive: commissionStats.averageDaily > 0 }}
          isLoading={commissionsLoading}
        />
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 p-6"
      >
        <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGenerateReferralLink}
            className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white hover:shadow-lg transition-all"
          >
            <ArrowUpRight size={20} />
            <span className="font-medium">Generate Referral Link</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCopyReferralCode}
            className="flex items-center space-x-3 p-4 bg-slate-700/50 rounded-xl text-white hover:bg-slate-700 transition-all"
          >
            <Copy size={20} />
            <span className="font-medium">Copy Referral Code</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center space-x-3 p-4 bg-slate-700/50 rounded-xl text-white hover:bg-slate-700 transition-all"
          >
            <Wallet size={20} />
            <span className="font-medium">Request Withdrawal</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CommissionChart 
            data={dailyCommissions} 
            isLoading={commissionsLoading}
          />
        </div>
        
        <div>
          <RecentActivity 
            activities={mockActivities} 
            isLoading={false}
          />
        </div>
      </div>

      {/* Referral Code Display */}
      {user?.referral_code && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-xl rounded-2xl border border-green-500/30 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Your Referral Code</h3>
              <p className="text-slate-300">
                Share this code with friends to earn commissions
              </p>
              <p className="text-2xl font-bold text-green-400 mt-2">
                {user.referral_code}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCopyReferralCode}
              className="p-3 bg-green-600 hover:bg-green-700 rounded-xl text-white transition-colors"
            >
              <Copy size={24} />
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
}