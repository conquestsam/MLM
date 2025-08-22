# ZChain MLM Platform - Implementation Guide

## 🎯 Quick Start Checklist

### Phase 1: Environment Setup (30 minutes)

#### 1. Supabase Configuration
- [ ] Create new Supabase project at [supabase.com](https://supabase.com)
- [ ] Copy project URL and anon key
- [ ] Run the database migration file: `supabase/migrations/create_core_tables.sql`
- [ ] Verify all 8 tables are created with proper RLS policies
- [ ] Test database connection

#### 2. WalletConnect Setup
- [ ] Create project at [cloud.walletconnect.com](https://cloud.walletconnect.com)
- [ ] Copy Project ID
- [ ] Configure allowed domains

#### 3. RPC Providers Setup
- [ ] Create account at [Alchemy](https://alchemy.com) or [Infura](https://infura.io)
- [ ] Generate API keys for Ethereum, Polygon, and Sepolia
- [ ] Test RPC endpoints

#### 4. Environment Variables
Update `src/lib/supabase.ts` and `src/lib/web3.ts` with your actual credentials:

```typescript
// src/lib/supabase.ts
const supabaseUrl = 'https://your-project.supabase.co';
const supabaseKey = 'your-anon-key';

// src/lib/web3.ts
export const config = getDefaultConfig({
  projectId: 'your-walletconnect-project-id',
  // ... rest of config
});
```

### Phase 2: Development Setup (15 minutes)

#### 1. Install Dependencies
```bash
npm install
```

#### 2. Start Development Server
```bash
npm run dev
```

#### 3. Test Core Features
- [ ] Wallet connection works
- [ ] User profile creation
- [ ] Dashboard loads without errors
- [ ] Database queries execute properly

### Phase 3: Feature Implementation Priority

#### Immediate (Week 1)
1. **Complete Authentication Flow**
   - [ ] Implement proper error handling
   - [ ] Add loading states
   - [ ] Test with different wallets

2. **Referral System Core**
   - [ ] Implement referral link tracking
   - [ ] Add registration with referral codes
   - [ ] Test multi-level network creation

3. **Commission Calculations**
   - [ ] Implement commission triggers
   - [ ] Add real-time balance updates
   - [ ] Test percentage calculations

#### Short Term (Week 2-3)
1. **Complete Page Components**
   - [ ] Referrals page with tree visualization
   - [ ] Commissions history page
   - [ ] User profile management
   - [ ] Wallet management interface

2. **Notification System**
   - [ ] In-app notifications
   - [ ] Email notification templates
   - [ ] Real-time notification updates

#### Medium Term (Week 4-6)
1. **KYC System**
   - [ ] Document upload interface
   - [ ] Admin verification workflow
   - [ ] Status tracking and updates

2. **Advanced Analytics**
   - [ ] Performance charts
   - [ ] Earnings projections
   - [ ] Network growth analytics

3. **Withdrawal System**
   - [ ] Withdrawal request interface
   - [ ] Admin approval workflow
   - [ ] Blockchain transaction integration

#### Long Term (Month 2+)
1. **Smart Contract Integration**
   - [ ] Deploy commission distribution contracts
   - [ ] Integrate automated payouts
   - [ ] Add multi-chain support

2. **n8n Automation**
   - [ ] Set up n8n instance
   - [ ] Create workflow templates
   - [ ] Implement webhook integrations

3. **Mobile Optimization**
   - [ ] PWA implementation
   - [ ] Mobile-specific UI components
   - [ ] Offline functionality

## 🏗️ Architecture Overview

### Database Schema
```
user_profiles (Core user data)
├── referral_networks (Multi-level relationships)
├── commission_records (Earnings tracking)
├── financial_transactions (Blockchain records)
├── notification_queue (Communication)
├── referral_links (Link tracking)
├── kyc_documents (Verification)
└── withdrawal_requests (Payouts)
```

### Component Hierarchy
```
App
├── AuthenticatedApp (Protected routes)
├── Layout
│   ├── Header (Wallet connection + notifications)
│   └── Sidebar (Navigation + user stats)
└── Pages
    ├── Dashboard (Overview + quick actions)
    ├── Referrals (Network tree + link generation)
    ├── Commissions (Earnings history + analytics)
    └── [Other pages to implement]
```

### State Management
- **Zustand**: Global auth state
- **React Query**: Server state and caching
- **React Hooks**: Component-level state
- **Supabase Realtime**: Live data updates

## 📊 Database Query Examples

### Essential Queries for Implementation

#### 1. Get User with Referral Stats
```sql
SELECT 
  up.*,
  COUNT(DISTINCT rn.user_id) as direct_referrals,
  COUNT(DISTINCT CASE WHEN rn.generation_level <= 5 THEN rn.user_id END) as total_network,
  COALESCE(SUM(cr.amount_usd) FILTER (WHERE cr.status = 'completed'), 0) as total_earnings
FROM user_profiles up
LEFT JOIN referral_networks rn ON up.id = rn.referrer_id
LEFT JOIN commission_records cr ON up.id = cr.recipient_id
WHERE up.id = $1
GROUP BY up.id;
```

#### 2. Calculate Pending Commissions
```sql
SELECT 
  generation_level,
  COUNT(*) as referral_count,
  SUM(commission_rate) as potential_rate,
  AVG(commission_rate) as avg_rate
FROM referral_networks
WHERE referrer_id = $1 AND is_active = true
GROUP BY generation_level
ORDER BY generation_level;
```

#### 3. Recent Activity Feed
```sql
(SELECT 
  'referral' as type,
  up.username as description,
  rn.created_at,
  NULL as amount
FROM referral_networks rn
JOIN user_profiles up ON rn.user_id = up.id
WHERE rn.referrer_id = $1)

UNION ALL

(SELECT 
  'commission' as type,
  'Commission earned' as description,
  cr.created_at,
  cr.amount_usd as amount
FROM commission_records cr
WHERE cr.recipient_id = $1)

ORDER BY created_at DESC
LIMIT 10;
```

## 🔧 Critical Implementation Details

### 1. Wallet Authentication Security
```typescript
// Secure message signing
const message = `ZChain MLM Platform Authentication
Nonce: ${nonce}
Timestamp: ${Date.now()}
Address: ${address}`;

// Verify signature on server-side (future implementation)
const isValidSignature = await verifySignature(message, signature, address);
```

### 2. Commission Calculation Triggers
```sql
-- Auto-trigger commission calculations
CREATE OR REPLACE FUNCTION calculate_referral_commission()
RETURNS TRIGGER AS $$
BEGIN
  -- Calculate commissions for each generation level
  INSERT INTO commission_records (
    recipient_id, source_user_id, generation_level,
    amount_usd, commission_rate, commission_type
  )
  SELECT 
    rn.referrer_id, NEW.id, rn.generation_level,
    100.00 * (rn.commission_rate / 100), -- Example: $100 signup bonus
    rn.commission_rate, 'referral'
  FROM referral_networks rn
  WHERE rn.user_id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### 3. Real-time Subscriptions
```typescript
// Listen to commission updates
const subscription = supabase
  .channel('user_commissions')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'commission_records',
    filter: `recipient_id=eq.${userId}`,
  }, (payload) => {
    // Update UI in real-time
    setCommissions(prev => [payload.new, ...prev]);
    toast.success(`New commission earned: $${payload.new.amount_usd}`);
  })
  .subscribe();
```

### 4. Error Handling Best Practices
```typescript
const handleAsyncOperation = async () => {
  try {
    setLoading(true);
    const result = await riskyOperation();
    setData(result);
    toast.success('Operation completed successfully');
  } catch (error) {
    console.error('Operation failed:', error);
    toast.error(error.message || 'Operation failed');
  } finally {
    setLoading(false);
  }
};
```

## 🚨 Common Issues and Solutions

### Issue 1: Wallet Connection Fails
**Solution**: Check WalletConnect Project ID and network configuration
```typescript
// Ensure proper network configuration
const config = getDefaultConfig({
  appName: 'ZChain MLM Platform',
  projectId: 'YOUR_ACTUAL_PROJECT_ID', // Not placeholder
  chains: [mainnet, polygon], // Start with mainnet only
});
```

### Issue 2: Database Connection Errors
**Solution**: Verify Supabase URL and check RLS policies
```sql
-- Test basic connectivity
SELECT current_user, now();

-- Check RLS policies
SELECT schemaname, tablename, policyname, roles, cmd, qual
FROM pg_policies 
WHERE schemaname = 'public';
```

### Issue 3: Commission Calculations Not Working
**Solution**: Verify trigger functions and referral network creation
```sql
-- Check if triggers are active
SELECT event_object_table, trigger_name, action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'public';

-- Test referral network creation
SELECT * FROM referral_networks 
WHERE user_id = 'test_user_id';
```

### Issue 4: Real-time Updates Not Working
**Solution**: Enable realtime on Supabase and check subscriptions
```typescript
// Enable realtime in Supabase dashboard for required tables
// Then test subscription
const channel = supabase.channel('test');
console.log('Channel state:', channel.state);
```

## 📋 Testing Checklist

### Core Functionality Tests
- [ ] Wallet connects successfully
- [ ] User profile creates/updates correctly
- [ ] Referral codes generate properly
- [ ] Multi-level networks create automatically
- [ ] Commission calculations trigger correctly
- [ ] Real-time updates work
- [ ] Dashboard displays correct data

### UI/UX Tests
- [ ] Responsive design works on mobile
- [ ] Loading states display properly
- [ ] Error messages are user-friendly
- [ ] Navigation works smoothly
- [ ] Charts render correctly

### Security Tests
- [ ] RLS policies prevent unauthorized access
- [ ] Input validation works
- [ ] Signature verification is secure
- [ ] Environment variables are protected

## 🚀 Deployment Preparation

### Pre-deployment Checklist
- [ ] All environment variables configured
- [ ] Database migrations run successfully
- [ ] Security policies tested
- [ ] Performance optimization complete
- [ ] Error monitoring setup (Sentry recommended)

### Production Deployment Steps
1. **Frontend**: Deploy to Vercel/Netlify
2. **Database**: Upgrade Supabase to production tier
3. **Monitoring**: Set up error tracking and analytics
4. **SSL**: Ensure HTTPS everywhere
5. **Backups**: Configure automated database backups

### Post-deployment Monitoring
- [ ] Database performance metrics
- [ ] API response times
- [ ] Error rates and types
- [ ] User engagement analytics
- [ ] Wallet connection success rates

---

**Remember**: This is a foundational implementation. The platform is designed to be extended with additional features as your requirements evolve.

## 🆘 Need Help?

1. **Check the console** for error messages
2. **Review the database** for missing data
3. **Test API endpoints** individually
4. **Verify environment variables** are correct
5. **Check Supabase logs** for database issues

For additional support, refer to the component documentation and inline code comments throughout the application.