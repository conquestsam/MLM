import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Bell, Settings, Menu, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { motion } from 'framer-motion';

interface HeaderProps {
  onMenuToggle?: () => void;
  isMenuOpen?: boolean;
}

export function Header({ onMenuToggle, isMenuOpen }: HeaderProps) {
  const { user, isAuthenticated } = useAuth();

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-slate-900/95 backdrop-blur-xl border-b border-slate-700 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Mobile Menu */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onMenuToggle}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">Z</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">ZChain</h1>
                <p className="text-xs text-slate-400">MLM Platform</p>
              </div>
            </motion.div>
          </div>

          {/* User Info and Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated && (
              <>
                {/* Notifications */}
                <button className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                  <Bell size={20} />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                    3
                  </span>
                </button>

                {/* Settings */}
                <button className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                  <Settings size={20} />
                </button>

                {/* User Info */}
                {user && (
                  <div className="hidden sm:flex items-center space-x-3">
                    <div className="text-right">
                      <p className="text-sm font-medium text-white">
                        {user.username || `${user.wallet_address.slice(0, 6)}...${user.wallet_address.slice(-4)}`}
                      </p>
                      <p className="text-xs text-slate-400">
                        Level {user.rank_level} • ${user.available_balance.toFixed(2)}
                      </p>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {(user.username || user.wallet_address).charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Wallet Connection */}
            <ConnectButton.Custom>
              {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                authenticationStatus,
                mounted,
              }) => {
                const ready = mounted && authenticationStatus !== 'loading';
                const connected =
                  ready &&
                  account &&
                  chain &&
                  (!authenticationStatus ||
                    authenticationStatus === 'authenticated');

                return (
                  <div
                    {...(!ready && {
                      'aria-hidden': true,
                      'style': {
                        opacity: 0,
                        pointerEvents: 'none',
                        userSelect: 'none',
                      },
                    })}
                  >
                    {(() => {
                      if (!connected) {
                        return (
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={openConnectModal}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                          >
                            Connect Wallet
                          </motion.button>
                        );
                      }

                      if (chain.unsupported) {
                        return (
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={openChainModal}
                            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                          >
                            Wrong network
                          </motion.button>
                        );
                      }

                      return (
                        <div className="flex items-center space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={openChainModal}
                            className="bg-slate-800 hover:bg-slate-700 text-white px-3 py-2 rounded-lg font-medium transition-colors text-sm"
                          >
                            {chain.hasIcon && (
                              <div className="w-5 h-5 mr-2 inline-block">
                                {chain.iconUrl && (
                                  <img
                                    alt={chain.name ?? 'Chain icon'}
                                    src={chain.iconUrl}
                                    className="w-5 h-5 rounded-full"
                                  />
                                )}
                              </div>
                            )}
                            {chain.name}
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={openAccountModal}
                            className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                          >
                            {account.displayName}
                            {account.displayBalance
                              ? ` (${account.displayBalance})`
                              : ''}
                          </motion.button>
                        </div>
                      );
                    })()}
                  </div>
                );
              }}
            </ConnectButton.Custom>
          </div>
        </div>
      </div>
    </motion.header>
  );
}