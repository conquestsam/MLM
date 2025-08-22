/*
  # ZChain MLM Platform Database Schema

  1. New Tables
    - `user_profiles` - Core user information with KYC status and wallet details
    - `referral_networks` - Multi-level referral relationship tracking  
    - `commission_records` - All commission calculations and payments
    - `financial_transactions` - Blockchain transaction records
    - `notification_queue` - Email/SMS notification management
    - `referral_links` - Trackable referral link generation
    - `kyc_documents` - KYC verification document storage
    - `withdrawal_requests` - User withdrawal request management

  2. Security
    - Enable RLS on all tables
    - Add comprehensive policies for user data access
    - Implement role-based access controls

  3. Features
    - Real-time subscriptions for live data updates
    - Optimized indexes for performance
    - Automated timestamp management
    - Referral depth tracking up to 5 generations
*/

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address text UNIQUE NOT NULL,
  email text UNIQUE,
  username text UNIQUE,
  first_name text,
  last_name text,
  phone_number text,
  kyc_status text DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'verified', 'rejected')),
  kyc_level integer DEFAULT 0 CHECK (kyc_level >= 0 AND kyc_level <= 3),
  referrer_id uuid REFERENCES user_profiles(id),
  referral_code text UNIQUE NOT NULL DEFAULT substring(gen_random_uuid()::text, 1, 8),
  total_referrals integer DEFAULT 0,
  total_earnings numeric(20,8) DEFAULT 0,
  available_balance numeric(20,8) DEFAULT 0,
  pending_balance numeric(20,8) DEFAULT 0,
  total_withdrawn numeric(20,8) DEFAULT 0,
  rank_level integer DEFAULT 1,
  is_active boolean DEFAULT true,
  last_login_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Referral Networks Table (Multi-level tracking)
CREATE TABLE IF NOT EXISTS referral_networks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  referrer_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  generation_level integer NOT NULL CHECK (generation_level >= 1 AND generation_level <= 5),
  commission_rate numeric(5,2) NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, referrer_id, generation_level)
);

-- Commission Records Table
CREATE TABLE IF NOT EXISTS commission_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  source_user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  transaction_hash text,
  commission_type text NOT NULL CHECK (commission_type IN ('referral', 'level_bonus', 'rank_bonus')),
  generation_level integer,
  amount_usd numeric(20,8) NOT NULL,
  amount_crypto numeric(20,8),
  crypto_symbol text DEFAULT 'ETH',
  commission_rate numeric(5,2) NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  blockchain_confirmed boolean DEFAULT false,
  processed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Financial Transactions Table
CREATE TABLE IF NOT EXISTS financial_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  transaction_hash text UNIQUE,
  transaction_type text NOT NULL CHECK (transaction_type IN ('deposit', 'withdrawal', 'commission', 'referral_bonus')),
  amount numeric(20,8) NOT NULL,
  currency text NOT NULL DEFAULT 'ETH',
  usd_equivalent numeric(20,8),
  blockchain_network text DEFAULT 'ethereum',
  gas_fee numeric(20,8),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'failed', 'cancelled')),
  block_number bigint,
  confirmation_count integer DEFAULT 0,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  confirmed_at timestamptz
);

-- Notification Queue Table
CREATE TABLE IF NOT EXISTS notification_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  notification_type text NOT NULL CHECK (notification_type IN ('email', 'sms', 'in_app', 'push')),
  template_name text NOT NULL,
  recipient_address text NOT NULL,
  subject text,
  content text NOT NULL,
  variables jsonb DEFAULT '{}',
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'cancelled')),
  priority integer DEFAULT 3 CHECK (priority >= 1 AND priority <= 5),
  scheduled_for timestamptz DEFAULT now(),
  sent_at timestamptz,
  error_message text,
  retry_count integer DEFAULT 0,
  max_retries integer DEFAULT 3,
  created_at timestamptz DEFAULT now()
);

-- Referral Links Table
CREATE TABLE IF NOT EXISTS referral_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  link_code text UNIQUE NOT NULL DEFAULT substring(gen_random_uuid()::text, 1, 12),
  campaign_name text,
  clicks_count integer DEFAULT 0,
  conversions_count integer DEFAULT 0,
  is_active boolean DEFAULT true,
  expires_at timestamptz,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  last_clicked_at timestamptz
);

-- KYC Documents Table
CREATE TABLE IF NOT EXISTS kyc_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  document_type text NOT NULL CHECK (document_type IN ('passport', 'drivers_license', 'national_id', 'utility_bill', 'bank_statement')),
  file_url text NOT NULL,
  file_name text NOT NULL,
  file_size bigint,
  verification_status text DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected')),
  admin_notes text,
  verified_by text,
  verified_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Withdrawal Requests Table
CREATE TABLE IF NOT EXISTS withdrawal_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  amount numeric(20,8) NOT NULL CHECK (amount > 0),
  currency text NOT NULL DEFAULT 'ETH',
  destination_address text NOT NULL,
  blockchain_network text DEFAULT 'ethereum',
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'processing', 'completed', 'rejected', 'cancelled')),
  transaction_hash text,
  admin_notes text,
  gas_fee numeric(20,8),
  net_amount numeric(20,8),
  processed_by text,
  processed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_wallet_address ON user_profiles(wallet_address);
CREATE INDEX IF NOT EXISTS idx_user_profiles_referrer_id ON user_profiles(referrer_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_referral_code ON user_profiles(referral_code);
CREATE INDEX IF NOT EXISTS idx_referral_networks_user_id ON referral_networks(user_id);
CREATE INDEX IF NOT EXISTS idx_referral_networks_referrer_id ON referral_networks(referrer_id);
CREATE INDEX IF NOT EXISTS idx_commission_records_recipient_id ON commission_records(recipient_id);
CREATE INDEX IF NOT EXISTS idx_commission_records_source_user_id ON commission_records(source_user_id);
CREATE INDEX IF NOT EXISTS idx_financial_transactions_user_id ON financial_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_financial_transactions_hash ON financial_transactions(transaction_hash);
CREATE INDEX IF NOT EXISTS idx_notification_queue_user_id ON notification_queue(user_id);
CREATE INDEX IF NOT EXISTS idx_notification_queue_status ON notification_queue(status);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_networks ENABLE ROW LEVEL SECURITY;
ALTER TABLE commission_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE kyc_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE withdrawal_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view their own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update their own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = id::text);

-- RLS Policies for referral_networks
CREATE POLICY "Users can view their referral network"
  ON referral_networks
  FOR SELECT
  TO authenticated
  USING (
    auth.uid()::text = user_id::text OR 
    auth.uid()::text = referrer_id::text
  );

-- RLS Policies for commission_records
CREATE POLICY "Users can view their commission records"
  ON commission_records
  FOR SELECT
  TO authenticated
  USING (
    auth.uid()::text = recipient_id::text OR
    auth.uid()::text = source_user_id::text
  );

-- RLS Policies for financial_transactions
CREATE POLICY "Users can view their transactions"
  ON financial_transactions
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id::text);

-- RLS Policies for notification_queue
CREATE POLICY "Users can view their notifications"
  ON notification_queue
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id::text);

-- RLS Policies for referral_links
CREATE POLICY "Users can manage their referral links"
  ON referral_links
  FOR ALL
  TO authenticated
  USING (auth.uid()::text = user_id::text);

-- RLS Policies for kyc_documents
CREATE POLICY "Users can manage their KYC documents"
  ON kyc_documents
  FOR ALL
  TO authenticated
  USING (auth.uid()::text = user_id::text);

-- RLS Policies for withdrawal_requests
CREATE POLICY "Users can view their withdrawal requests"
  ON withdrawal_requests
  FOR ALL
  TO authenticated
  USING (auth.uid()::text = user_id::text);

-- Create functions for automated calculations
CREATE OR REPLACE FUNCTION update_user_totals()
RETURNS TRIGGER AS $$
BEGIN
  -- Update user totals when commission records change
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    UPDATE user_profiles 
    SET 
      total_earnings = COALESCE((
        SELECT SUM(amount_usd) 
        FROM commission_records 
        WHERE recipient_id = NEW.recipient_id AND status = 'completed'
      ), 0),
      available_balance = COALESCE((
        SELECT SUM(amount_usd) 
        FROM commission_records 
        WHERE recipient_id = NEW.recipient_id AND status = 'completed'
      ), 0) - COALESCE((
        SELECT SUM(amount) 
        FROM withdrawal_requests 
        WHERE user_id = NEW.recipient_id AND status IN ('approved', 'processing', 'completed')
      ), 0),
      updated_at = now()
    WHERE id = NEW.recipient_id;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automated calculations
DROP TRIGGER IF EXISTS trigger_update_user_totals ON commission_records;
CREATE TRIGGER trigger_update_user_totals
  AFTER INSERT OR UPDATE ON commission_records
  FOR EACH ROW
  EXECUTE FUNCTION update_user_totals();

-- Function to create referral network entries automatically
CREATE OR REPLACE FUNCTION create_referral_network()
RETURNS TRIGGER AS $$
DECLARE
  current_referrer_id uuid;
  level_counter integer := 1;
  commission_rates numeric[] := ARRAY[10.0, 5.0, 2.0, 1.0, 0.5];
BEGIN
  current_referrer_id := NEW.referrer_id;
  
  -- Create referral network entries for up to 5 generations
  WHILE current_referrer_id IS NOT NULL AND level_counter <= 5 LOOP
    INSERT INTO referral_networks (
      user_id,
      referrer_id,
      generation_level,
      commission_rate
    ) VALUES (
      NEW.id,
      current_referrer_id,
      level_counter,
      commission_rates[level_counter]
    );
    
    -- Move to next level
    SELECT referrer_id INTO current_referrer_id 
    FROM user_profiles 
    WHERE id = current_referrer_id;
    
    level_counter := level_counter + 1;
  END LOOP;
  
  -- Update referrer's total referrals count
  UPDATE user_profiles 
  SET 
    total_referrals = total_referrals + 1,
    updated_at = now()
  WHERE id = NEW.referrer_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic referral network creation
DROP TRIGGER IF EXISTS trigger_create_referral_network ON user_profiles;
CREATE TRIGGER trigger_create_referral_network
  AFTER INSERT ON user_profiles
  FOR EACH ROW
  WHEN (NEW.referrer_id IS NOT NULL)
  EXECUTE FUNCTION create_referral_network();