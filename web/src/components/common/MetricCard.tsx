import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface Props {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'cyan' | 'blue' | 'danger' | 'warning' | 'emerald' | 'slate';
  badge?: string;
}

export const MetricCard: React.FC<Props> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'blue',
  badge,
}) => {
  const variantStyles = {
    blue: {
      border: 'border-blue-500/20 hover:border-blue-500/40',
      iconBg: 'bg-blue-600/10 text-blue-400 border border-blue-500/20',
      glow: 'hover:shadow-blue-950/20',
    },
    cyan: {
      border: 'border-blue-500/20 hover:border-blue-500/40',
      iconBg: 'bg-blue-600/10 text-blue-400 border border-blue-500/20',
      glow: 'hover:shadow-blue-950/20',
    },
    danger: {
      border: 'border-rose-500/30 hover:border-rose-500/50',
      iconBg: 'bg-rose-500/10 text-rose-400 border border-rose-500/30',
      glow: 'hover:shadow-rose-950/20',
    },
    warning: {
      border: 'border-amber-500/20 hover:border-amber-500/40',
      iconBg: 'bg-amber-500/10 text-amber-400 border border-amber-500/30',
      glow: 'hover:shadow-amber-950/20',
    },
    emerald: {
      border: 'border-emerald-500/20 hover:border-emerald-500/40',
      iconBg: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
      glow: 'hover:shadow-emerald-950/20',
    },
    slate: {
      border: 'border-slate-800 hover:border-slate-700',
      iconBg: 'bg-slate-800 text-slate-300 border border-slate-700',
      glow: '',
    },
  }[variant];

  return (
    <div className={`bg-cyber-900/90 rounded-xl p-5 border ${variantStyles.border} shadow-lg transition-all duration-200 ${variantStyles.glow}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</p>
          <h3 className="text-2xl font-bold tracking-tight text-white mt-1.5">{value}</h3>
          {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-lg ${variantStyles.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      {badge && (
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <span className="text-slate-400">Status</span>
          <span className="font-medium text-slate-200">{badge}</span>
        </div>
      )}
    </div>
  );
};
