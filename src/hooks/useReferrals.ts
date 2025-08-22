import { useState, useEffect } from 'react';
import { supabase, ReferralNetwork, UserProfile } from '../lib/supabase';
import { toast } from 'react-hot-toast';

export function useReferrals(userId?: string) {
  const [referrals, setReferrals] = useState<(ReferralNetwork & { user: UserProfile })[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalReferrals: 0,
    activeReferrals: 0,
    generationBreakdown: {} as Record<number, number>,
  });

  const fetchReferrals = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('referral_networks')
        .select(`
          *,
          user:user_profiles!referral_networks_user_id_fkey(*)
        `)
        .eq('referrer_id', userId)
        .order('generation_level', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;

      setReferrals(data || []);

      // Calculate stats
      const totalReferrals = data?.length || 0;
      const activeReferrals = data?.filter(r => r.is_active && r.user?.is_active).length || 0;
      
      const generationBreakdown = data?.reduce((acc, referral) => {
        acc[referral.generation_level] = (acc[referral.generation_level] || 0) + 1;
        return acc;
      }, {} as Record<number, number>) || {};

      setStats({
        totalReferrals,
        activeReferrals,
        generationBreakdown,
      });

    } catch (error: any) {
      console.error('Error fetching referrals:', error);
      toast.error('Failed to load referral data');
    } finally {
      setLoading(false);
    }
  };

  const generateReferralLink = async (campaignName?: string) => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('referral_links')
        .insert({
          user_id: userId,
          campaign_name: campaignName,
        })
        .select()
        .single();

      if (error) throw error;

      const baseUrl = window.location.origin;
      const referralUrl = `${baseUrl}/register?ref=${data.link_code}`;
      
      // Copy to clipboard
      await navigator.clipboard.writeText(referralUrl);
      toast.success('Referral link copied to clipboard!');
      
      return referralUrl;
    } catch (error: any) {
      console.error('Error generating referral link:', error);
      toast.error('Failed to generate referral link');
    }
  };

  const getReferralsByGeneration = (generation: number) => {
    return referrals.filter(r => r.generation_level === generation);
  };

  const getCommissionPotential = () => {
    return referrals.reduce((total, referral) => {
      // This would calculate based on referral activity
      // For now, return a placeholder calculation
      return total + (referral.commission_rate / 100) * 1000; // Assuming $1000 base
    }, 0);
  };

  useEffect(() => {
    if (userId) {
      fetchReferrals();

      // Set up real-time subscription
      const subscription = supabase
        .channel('referral_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'referral_networks',
            filter: `referrer_id=eq.${userId}`,
          },
          () => {
            fetchReferrals();
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [userId]);

  return {
    referrals,
    loading,
    stats,
    generateReferralLink,
    getReferralsByGeneration,
    getCommissionPotential,
    refresh: fetchReferrals,
  };
}