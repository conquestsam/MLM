import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color: 'blue' | 'green' | 'purple' | 'red' | 'yellow';
  isLoading?: boolean;
}

const colorVariants = {
  blue: {
    bg: 'from-blue-500/20 to-blue-600/20',
    border: 'border-blue-500/30',
    icon: 'text-blue-400',
    text: 'text-blue-400',
  },
  green: {
    bg: 'from-green-500/20 to-green-600/20',
    border: 'border-green-500/30',
    icon: 'text-green-400',
    text: 'text-green-400',
  },
  purple: {
    bg: 'from-purple-500/20 to-purple-600/20',
    border: 'border-purple-500/30',
    icon: 'text-purple-400',
    text: 'text-purple-400',
  },
  red: {
    bg: 'from-red-500/20 to-red-600/20',
    border: 'border-red-500/30',
    icon: 'text-red-400',
    text: 'text-red-400',
  },
  yellow: {
    bg: 'from-yellow-500/20 to-yellow-600/20',
    border: 'border-yellow-500/30',
    icon: 'text-yellow-400',
    text: 'text-yellow-400',
  },
};

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color,
  isLoading = false,
}: StatsCardProps) {
  const variant = colorVariants[color];

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ type: "spring", stiffness: 300 }}
      className={`
        relative overflow-hidden rounded-2xl border backdrop-blur-xl
        bg-gradient-to-br ${variant.bg} ${variant.border}
        p-6 shadow-xl hover:shadow-2xl transition-all duration-300
      `}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
      </div>

      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl bg-slate-800/50 ${variant.icon}`}>
            <Icon size={24} />
          </div>
          {trend && (
            <div className={`text-sm font-medium ${trend.isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {trend.isPositive ? '+' : ''}{trend.value}%
            </div>
          )}
        </div>

        <div className="space-y-2">
          <h3 className="text-slate-300 text-sm font-medium">{title}</h3>
          
          {isLoading ? (
            <div className="animate-pulse">
              <div className="h-8 bg-slate-700 rounded w-3/4" />
            </div>
          ) : (
            <p className="text-white text-3xl font-bold">
              {typeof value === 'number' && value > 999 
                ? `${(value / 1000).toFixed(1)}k` 
                : value
              }
            </p>
          )}
          
          {subtitle && (
            <p className="text-slate-400 text-sm">{subtitle}</p>
          )}
        </div>

        {/* Decorative elements */}
        <div className={`absolute -top-2 -right-2 w-20 h-20 bg-gradient-to-br ${variant.bg} rounded-full opacity-20`} />
        <div className={`absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-tr ${variant.bg} rounded-full opacity-10`} />
      </div>
    </motion.div>
  );
}