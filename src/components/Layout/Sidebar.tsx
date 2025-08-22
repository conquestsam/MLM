import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Settings, 
  User,
  LogOut,
  Wallet,
  FileText,
  Bell
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Referrals', href: '/referrals', icon: Users },
  { name: 'Commissions', href: '/commissions', icon: DollarSign },
  { name: 'Analytics', href: '/analytics', icon: TrendingUp },
  { name: 'Wallet', href: '/wallet', icon: Wallet },
  { name: 'Documents', href: '/documents', icon: FileText },
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Notifications', href: '/notifications', icon: Bell },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    onClose?.();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: isOpen ? 0 : -280 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed left-0 top-0 z-50 h-full w-72 bg-slate-900/95 backdrop-blur-xl border-r border-slate-700 md:translate-x-0 md:static md:z-0"
      >
        <div className="flex flex-col h-full">
          {/* User Profile Section */}
          <div className="p-6 border-b border-slate-700">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {(user?.username || user?.wallet_address || 'U').charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-semibold text-white truncate">
                  {user?.username || 'Anonymous User'}
                </h2>
                <p className="text-sm text-slate-400 truncate">
                  Level {user?.rank_level || 1} Member
                </p>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-xs text-slate-400">Balance</p>
                <p className="text-lg font-bold text-green-400">
                  ${user?.available_balance?.toFixed(2) || '0.00'}
                </p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-xs text-slate-400">Referrals</p>
                <p className="text-lg font-bold text-blue-400">
                  {user?.total_referrals || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigation.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <NavLink
                  to={item.href}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                    )
                  }
                >
                  <item.icon size={20} />
                  <span>{item.name}</span>
                </NavLink>
              </motion.div>
            ))}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-slate-700">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-all duration-200"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </motion.button>
          </div>
        </div>
      </motion.aside>
    </>
  );
}