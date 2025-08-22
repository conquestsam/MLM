# ZChain MLM Platform

A comprehensive blockchain-powered MLM (Multi-Level Marketing) platform with wallet-based authentication, multi-generational referral tracking, automated commission calculations, and real-time financial dashboards.

## 🚀 Features

### Core Functionality
- **Wallet Authentication**: MetaMask/WalletConnect integration with Supabase user profiles
- **Multi-Level Referrals**: Track up to 5 generations with automated network mapping
- **Commission System**: Tiered payouts (10%/5%/2%/1%/0.5%) with blockchain integration
- **Real-time Dashboard**: Live earnings visualization and performance metrics
- **Financial Management**: Withdrawal requests, transaction history, and balance tracking
- **KYC Integration**: Document verification system with status tracking

### Technical Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS, Framer Motion
- **Blockchain**: Wagmi, RainbowKit, Viem for Web3 integration
- **Database**: Supabase with Row Level Security (RLS)
- **Charts**: Recharts for data visualization
- **State Management**: Zustand for global state
- **Notifications**: React Hot Toast for user feedback

## 📋 Prerequisites

Before setting up the project, ensure you have:

1. **Node.js** (v18 or higher)
2. **npm** or **yarn** package manager
3. **Supabase** account and project
4. **WalletConnect** Project ID
5. **Alchemy** or other RPC provider API keys

## ⚙️ Environment Setup

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# WalletConnect Configuration
VITE_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id

# Blockchain RPC URLs
VITE_ETHEREUM_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_API_KEY
VITE_POLYGON_RPC_URL=https://polygon-mainnet.g.alchemy.com/v2/YOUR_API_KEY
VITE_SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY

# Smart Contract Addresses (Update with deployed contracts)
VITE_COMMISSION_DISTRIBUTOR_ADDRESS=0x...
VITE_TOKEN_CONTRACT_ADDRESS=0x...
VITE_MLM_REGISTRY_ADDRESS=0x...
```

## 🗄️ Database Setup

1. **Create a new Supabase project** at [supabase.com](https://supabase.com)
2. **Run the migration file** located at `supabase/migrations/create_core_tables.sql`
3. **Enable realtime** for the tables you want to subscribe to
4. **Configure RLS policies** (included in migration file)

### Key Database Tables
- `user_profiles` - User account information and wallet addresses
- `referral_networks` - Multi-level referral relationship tracking
- `commission_records` - All commission calculations and payments
- `financial_transactions` - Blockchain transaction records
- `notification_queue` - Email/SMS notification management
- `withdrawal_requests` - User withdrawal request management

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd zchain-mlm-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables** (see Environment Setup section above)

4. **Start the development server**
   ```bash
   npm run dev
   ```

## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Dashboard/       # Dashboard-specific components
│   └── Layout/          # Layout components (Header, Sidebar, etc.)
├── hooks/               # Custom React hooks
│   ├── useAuth.ts       # Authentication logic
│   ├── useReferrals.ts  # Referral management
│   └── useCommissions.ts# Commission calculations
├── lib/                 # Utility libraries
│   ├── supabase.ts      # Database client and types
│   ├── web3.ts          # Blockchain configuration
│   └── utils.ts         # Helper functions
├── pages/               # Page components
├── store/               # Zustand state stores
└── App.tsx              # Main application component

supabase/
├── migrations/          # Database migration files
└── functions/           # Edge functions (future)
```

## 🔐 Authentication Flow

1. **Wallet Connection**: User connects MetaMask/WalletConnect
2. **Message Signing**: User signs authentication message
3. **User Creation/Login**: Profile created/updated in Supabase
4. **Session Management**: JWT tokens for authenticated requests
5. **Automatic Referral Network**: Multi-level relationships created on signup

## 💰 Commission System

### Commission Rates by Generation:
- **Level 1**: 10% (Direct referrals)
- **Level 2**: 5% (Second generation)
- **Level 3**: 2% (Third generation)
- **Level 4**: 1% (Fourth generation)
- **Level 5**: 0.5% (Fifth generation)

### Automated Calculations:
- Triggered by database triggers
- Real-time balance updates
- Blockchain transaction verification
- Automatic payout processing

## 📊 Database Queries

### Get User's Complete Referral Network
```sql
WITH RECURSIVE referral_tree AS (
  -- Base case: direct referrals
  SELECT 
    id, wallet_address, referrer_id, 1 as level, 
    ARRAY[id] as path
  FROM user_profiles 
  WHERE referrer_id = 'user_id_here'
  
  UNION ALL
  
  -- Recursive case: indirect referrals
  SELECT 
    up.id, up.wallet_address, up.referrer_id, 
    rt.level + 1, rt.path || up.id
  FROM user_profiles up
  JOIN referral_tree rt ON up.referrer_id = rt.id
  WHERE rt.level < 5
)
SELECT * FROM referral_tree ORDER BY level, wallet_address;
```

### Calculate Total Commission for User
```sql
SELECT 
  recipient_id,
  SUM(CASE WHEN status = 'completed' THEN amount_usd ELSE 0 END) as total_earned,
  SUM(CASE WHEN status = 'pending' THEN amount_usd ELSE 0 END) as pending_amount,
  COUNT(*) as total_commissions
FROM commission_records 
WHERE recipient_id = 'user_id_here'
GROUP BY recipient_id;
```

### Get Monthly Commission Breakdown
```sql
SELECT 
  DATE_TRUNC('month', created_at) as month,
  commission_type,
  SUM(amount_usd) as total_amount,
  COUNT(*) as transaction_count
FROM commission_records
WHERE recipient_id = 'user_id_here'
  AND status = 'completed'
  AND created_at >= CURRENT_DATE - INTERVAL '12 months'
GROUP BY month, commission_type
ORDER BY month DESC, commission_type;
```

## 🚀 Deployment

### Frontend Deployment (Vercel)
```bash
# Build the project
npm run build

# Deploy to Vercel (requires Vercel CLI)
vercel --prod
```

### Database Deployment
1. **Production Supabase project** setup
2. **Run migration files** in production
3. **Configure environment variables** with production values
4. **Set up database backups** and monitoring

## 🔮 Components Yet to be Implemented

### 1. Complete Page Components
- **Referrals Page**: Detailed referral tree visualization
- **Commissions Page**: Comprehensive commission history
- **Analytics Page**: Advanced charts and insights
- **Wallet Page**: Crypto wallet management
- **Profile Page**: User profile management with KYC
- **Documents Page**: KYC document upload and verification
- **Notifications Page**: In-app notification center
- **Settings Page**: Platform preferences and configurations

### 2. Advanced Features
- **KYC Verification System**: Document upload and admin approval workflow
- **Withdrawal Management**: Automated blockchain withdrawals
- **Email/SMS Notifications**: Template-based notification system
- **Admin Dashboard**: Platform management and user oversight
- **Mobile App**: React Native companion app
- **API Rate Limiting**: Protection against abuse
- **Advanced Analytics**: Machine learning insights

### 3. Blockchain Integration
- **Smart Contract Deployment**: Automated commission distribution contracts
- **Multi-chain Support**: Ethereum, Polygon, BSC integration
- **Token Integration**: Native platform token rewards
- **DeFi Features**: Staking and yield farming integration
- **NFT Rewards**: Gamification through collectibles

### 4. n8n Automation Workflows
- **User Onboarding**: Automated welcome sequences
- **Commission Processing**: Batch payment processing
- **Compliance Monitoring**: Automated KYC and AML checks
- **Marketing Automation**: Referral campaign management
- **Support Ticketing**: Customer service automation

### 5. Enterprise Features
- **Multi-tenant Architecture**: White-label platform support
- **Custom Branding**: Configurable themes and logos
- **Advanced Reporting**: Executive dashboards and exports
- **Compliance Tools**: Regulatory reporting features
- **API Gateway**: Third-party integration support

## 🧪 Testing

### Run Tests
```bash
# Unit tests
npm run test

# E2E tests (future implementation)
npm run test:e2e

# Coverage report
npm run test:coverage
```

### Testing Strategy
- **Unit Tests**: Component and utility function testing
- **Integration Tests**: Database and API interaction testing  
- **E2E Tests**: Complete user workflow testing
- **Performance Tests**: Load testing for high traffic scenarios

## 📈 Performance Optimization

### Current Optimizations
- **Code Splitting**: Route-based lazy loading
- **Image Optimization**: WebP format with fallbacks
- **Bundle Analysis**: Webpack bundle analyzer integration
- **Database Indexing**: Optimized queries with proper indexes
- **Caching Strategy**: React Query for API response caching

### Future Optimizations
- **Service Worker**: Offline functionality
- **CDN Integration**: Global asset distribution
- **Database Optimization**: Query optimization and connection pooling
- **Server-Side Rendering**: Next.js migration for better SEO
- **Progressive Web App**: Mobile app-like experience

## 🔒 Security Considerations

### Implemented Security
- **Row Level Security**: Supabase RLS policies
- **Input Validation**: Type-safe API interactions
- **Wallet Signature Verification**: Authentication security
- **Environment Variables**: Sensitive data protection
- **HTTPS Only**: Secure communication protocols

### Additional Security Measures Needed
- **Rate Limiting**: API abuse prevention
- **Input Sanitization**: XSS protection
- **SQL Injection Prevention**: Parameterized queries
- **Audit Logging**: Security event tracking
- **Penetration Testing**: Regular security assessments

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 🆘 Support

For support and questions:
- **Documentation**: Check this README and inline code comments
- **Issues**: Create GitHub issues for bugs and feature requests
- **Discussions**: Use GitHub Discussions for questions and ideas
- **Email**: Contact the development team for urgent matters

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Wagmi Documentation](https://wagmi.sh/)
- [RainbowKit Documentation](https://rainbowkit.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Query Documentation](https://tanstack.com/query/latest)

---

**Note**: This platform is designed for educational and development purposes. Ensure compliance with local regulations before deploying in production environments.