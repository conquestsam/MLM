import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Database types
export interface UserProfile {
  id: string;
  wallet_address: string;
  email?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  kyc_status: 'pending' | 'verified' | 'rejected';
  kyc_level: number;
  referrer_id?: string;
  referral_code: string;
  total_referrals: number;
  total_earnings: number;
  available_balance: number;
  pending_balance: number;
  total_withdrawn: number;
  rank_level: number;
  is_active: boolean;
  last_login_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ReferralNetwork {
  id: string;
  user_id: string;
  referrer_id: string;
  generation_level: number;
  commission_rate: number;
  is_active: boolean;
  created_at: string;
}

export interface CommissionRecord {
  id: string;
  recipient_id: string;
  source_user_id: string;
  transaction_hash?: string;
  commission_type: 'referral' | 'level_bonus' | 'rank_bonus';
  generation_level?: number;
  amount_usd: number;
  amount_crypto?: number;
  crypto_symbol: string;
  commission_rate: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  blockchain_confirmed: boolean;
  processed_at?: string;
  created_at: string;
}

export interface FinancialTransaction {
  id: string;
  user_id: string;
  transaction_hash?: string;
  transaction_type: 'deposit' | 'withdrawal' | 'commission' | 'referral_bonus';
  amount: number;
  currency: string;
  usd_equivalent?: number;
  blockchain_network: string;
  gas_fee?: number;
  status: 'pending' | 'confirmed' | 'failed' | 'cancelled';
  block_number?: number;
  confirmation_count: number;
  metadata: Record<string, any>;
  created_at: string;
  confirmed_at?: string;
}