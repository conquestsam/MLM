import { useState, useEffect } from 'react';
import { supabase, CommissionRecord, UserProfile } from '../lib/supabase';
import { toast } from 'react-hot-toast';

export function useCommissions(userId?: string) {
  const [commissions, setCommissions] = useState<(CommissionRecord & { source_user: UserProfile })[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEarned: 0,
    pendingCommissions: 0,
    thisMonth: 0,
    averageDaily: 0,
  });

  const fetchCommissions = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('commission_records')
        .select(`
          *,
          source_user:user_profiles!commission_records_source_user_id_fkey(*)
        `)
        .eq('recipient_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setCommissions(data || []);

      // Calculate stats
      const totalEarned = data?.filter(c => c.status === 'completed')
        .reduce((sum, c) => sum + c.amount_usd, 0) || 0;
      
      const pendingCommissions = data?.filter(c => c.status === 'pending')
        .reduce((sum, c) => sum + c.amount_usd, 0) || 0;

      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const thisMonth = data?.filter(c => 
        c.status === 'completed' && 
        new Date(c.created_at) >= monthStart
      ).reduce((sum, c) => sum + c.amount_usd, 0) || 0;

      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      const averageDaily = thisMonth / now.getDate();

      setStats({
        totalEarned,
        pendingCommissions,
        thisMonth,
        averageDaily,
      });

    } catch (error: any) {
      console.error('Error fetching commissions:', error);
      toast.error('Failed to load commission data');
    } finally {
      setLoading(false);
    }
  };

  const getCommissionsByType = (type: CommissionRecord['commission_type']) => {
    return commissions.filter(c => c.commission_type === type);
  };

  const getCommissionsByGeneration = (generation: number) => {
    return commissions.filter(c => c.generation_level === generation);
  };

  const getMonthlyCommissions = () => {
    const monthlyData: Record<string, number> = {};
    
    commissions
      .filter(c => c.status === 'completed')
      .forEach(commission => {
        const date = new Date(commission.created_at);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        monthlyData[monthKey] = (monthlyData[monthKey] || 0) + commission.amount_usd;
      });

    return Object.entries(monthlyData)
      .map(([month, amount]) => ({ month, amount }))
      .sort((a, b) => a.month.localeCompare(b.month));
  };

  const getDailyCommissions = (days = 30) => {
    const dailyData: Record<string, number> = {};
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    commissions
      .filter(c => 
        c.status === 'completed' && 
        new Date(c.created_at) >= startDate
      )
      .forEach(commission => {
        const date = new Date(commission.created_at);
        const dayKey = date.toISOString().split('T')[0];
        dailyData[dayKey] = (dailyData[dayKey] || 0) + commission.amount_usd;
      });

    return Object.entries(dailyData)
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => a.date.localeCompare(b.date));
  };

  useEffect(() => {
    if (userId) {
      fetchCommissions();

      // Set up real-time subscription
      const subscription = supabase
        .channel('commission_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'commission_records',
            filter: `recipient_id=eq.${userId}`,
          },
          () => {
            fetchCommissions();
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [userId]);

  return {
    commissions,
    loading,
    stats,
    getCommissionsByType,
    getCommissionsByGeneration,
    getMonthlyCommissions,
    getDailyCommissions,
    refresh: fetchCommissions,
  };
}