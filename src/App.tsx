import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Layout } from './components/Layout/Layout';
import { AuthForm } from './components/Auth/AuthForm';
import { Dashboard } from './pages/Dashboard';
import { Referrals } from './pages/Referrals';
import { Commissions } from './pages/Commissions';
import { Analytics } from './pages/Analytics';
import { Wallet } from './pages/Wallet';
import { useAuth } from './hooks/useAuth';
import toast from 'react-hot-toast';

function AuthenticatedApp() {
  const { isAuthenticated, loading, signIn, signUp, signOut } = useAuth();
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  const handleAuth = async (formData: any) => {
    try {
      setAuthLoading(true);
      setAuthError('');

      let result;
      if (authMode === 'signin') {
        result = await signIn(formData.email, formData.password);
      } else {
        result = await signUp(
          formData.email, 
          formData.password, 
          formData.username,
          formData.referralCode
        );
      }

      if (result.success) {
        toast.success(`Successfully ${authMode === 'signin' ? 'signed in' : 'created account'}!`);
      } else {
        setAuthError(result.error || 'Authentication failed');
      }
    } catch (error: any) {
      setAuthError(error.message || 'Authentication failed');
    } finally {
      setAuthLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl mx-auto mb-4 animate-pulse" />
          <p className="text-white text-lg">Loading ZChain Platform...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <AuthForm
          mode={authMode}
          onSubmit={handleAuth}
          loading={authLoading}
          error={authError}
          onModeChange={setAuthMode}
        />
      </div>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/referrals" element={<Referrals />} />
        <Route path="/commissions" element={<Commissions />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/documents" element={<div className="text-white">Documents Page (Coming Soon)</div>} />
        <Route path="/profile" element={<div className="text-white">Profile Page (Coming Soon)</div>} />
        <Route path="/notifications" element={<div className="text-white">Notifications Page (Coming Soon)</div>} />
        <Route path="/settings" element={<div className="text-white">Settings Page (Coming Soon)</div>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <Router>
      <AuthenticatedApp />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1E293B',
            color: '#F1F5F9',
            border: '1px solid #334155',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#F1F5F9',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#F1F5F9',
            },
          },
        }}
      />
    </Router>
  );
}

export default App;