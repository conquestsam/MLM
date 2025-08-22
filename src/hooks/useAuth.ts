import { useState, useEffect } from 'react';
import { supabase, UserProfile } from '../lib/supabase';
import { generateReferralCode } from '../lib/utils';

export function useAuth() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const signUp = async (email: string, password: string, username: string, referralCode?: string) => {
    try {
      setLoading(true);

      // Check if referral code exists
      let referrerId = null;
      if (referralCode) {
        const { data: referrer } = await supabase
          .from('user_profiles')
          .select('id')
          .eq('referral_code', referralCode.toUpperCase())
          .single();
        
        if (!referrer) {
          throw new Error('Invalid referral code');
        }
        referrerId = referrer.id;
      }

      // Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            referral_code: referralCode,
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // Create user profile
        const newReferralCode = generateReferralCode();
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            id: authData.user.id,
            email,
            username,
            referral_code: newReferralCode,
            referred_by: referrerId,
            total_referrals: 0,
            total_commissions: 0,
            level: 1,
            status: 'active',
            last_login_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (profileError) throw profileError;

        // Create referral relationship if referred
        if (referrerId) {
          await supabase.from('referrals').insert({
            referrer_id: referrerId,
            referred_id: authData.user.id,
            level: 1,
            status: 'active',
          });

          // Update referrer's total referrals
          await supabase.rpc('increment_referrals', { user_id: referrerId });
        }

        setUser(profile);
        setIsAuthenticated(true);
        return { success: true, user: profile };
      }
    } catch (error: any) {
      console.error('Sign up error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);

      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // Get user profile
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', authData.user.id)
          .single();

        if (profileError) throw profileError;

        // Update last login
        await supabase
          .from('user_profiles')
          .update({ last_login_at: new Date().toISOString() })
          .eq('id', authData.user.id);

        setUser(profile);
        setIsAuthenticated(true);
        return { success: true, user: profile };
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setIsAuthenticated(false);
      return { success: true };
    } catch (error: any) {
      console.error('Sign out error:', error);
      return { success: false, error: error.message };
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return { success: false, error: 'No user logged in' };

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      
      setUser(data);
      return { success: true, user: data };
    } catch (error: any) {
      console.error('Profile update error:', error);
      return { success: false, error: error.message };
    }
  };

  const connectWallet = async (walletAddress: string) => {
    if (!user) return { success: false, error: 'No user logged in' };

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update({ wallet_address: walletAddress.toLowerCase() })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      
      setUser(data);
      return { success: true, user: data };
    } catch (error: any) {
      console.error('Wallet connection error:', error);
      return { success: false, error: error.message };
    }
  };

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (profile) {
            setUser(profile);
            setIsAuthenticated(true);
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (profile) {
            setUser(profile);
            setIsAuthenticated(true);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return {
    user,
    loading,
    isAuthenticated,
    signUp,
    signIn,
    signOut,
    updateProfile,
    connectWallet,
  };
}