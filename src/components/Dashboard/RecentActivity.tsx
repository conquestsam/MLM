import React from 'react';
import { ArrowUpRight, ArrowDownRight, Users, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

interface Activity {
  id: string;
  type: 'referral' | 'commission' | 'withdrawal' | 'deposit';
  description: string;
  amount?: number;
  timestamp: string;
  user?: string;
}

interface RecentActivityProps {
  activities: Activity[];
  isLoading?: boolean;
}

const activityIcons = {
  referral: Users,
  commission: DollarSign,
  withdrawal: ArrowUpRight,
  deposit: ArrowDownRight,
};

const activityColors = {
  referral: 'text-blue-400',
  commission: 'text-green-400',
  withdrawal: 'text-red-400',
  deposit: 'text-purple-400',
};

export function RecentActivity({ activities, isLoading }: RecentActivityProps) {
  if (isLoading) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-slate-700 rounded w-1/3 mb-4" />
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-slate-700 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-700 rounded w-3/4" />
                  <div className="h-3 bg-slate-700 rounded w-1/2" />
                </div>
                <div className="h-4 bg-slate-700 rounded w-16" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 p-6"
    >
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white mb-2">Recent Activity</h3>
        <p className="text-slate-400 text-sm">Latest transactions and referrals</p>
      </div>

      <div className="space-y-4">
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="text-slate-400" size={24} />
            </div>
            <p className="text-slate-400">No recent activity</p>
          </div>
        ) : (
          activities.map((activity, index) => {
            const Icon = activityIcons[activity.type];
            const colorClass = activityColors[activity.type];

            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-4 p-3 rounded-xl hover:bg-slate-700/30 transition-colors"
              >
                <div className={`p-2 rounded-lg bg-slate-700/50 ${colorClass}`}>
                  <Icon size={20} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">
                    {activity.description}
                  </p>
                  {activity.user && (
                    <p className="text-slate-400 text-sm truncate">
                      from {activity.user}
                    </p>
                  )}
                  <p className="text-slate-500 text-xs">
                    {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                  </p>
                </div>

                {activity.amount && (
                  <div className="text-right">
                    <p className={`font-bold ${
                      activity.type === 'commission' || activity.type === 'deposit'
                        ? 'text-green-400'
                        : 'text-red-400'
                    }`}>
                      {activity.type === 'withdrawal' ? '-' : '+'}${activity.amount.toFixed(2)}
                    </p>
                  </div>
                )}
              </motion.div>
            );
          })
        )}
      </div>

      {activities.length > 0 && (
        <div className="mt-6 pt-4 border-t border-slate-700">
          <button className="w-full text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
            View all activity
          </button>
        </div>
      )}
    </motion.div>
  );
}