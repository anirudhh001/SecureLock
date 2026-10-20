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
      iconBg: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
      gradient: 'from-blue-500/[0.04] to-transparent',
    },
    cyan: {
      border: 'border-cyan-500/20 hover:border-cyan-500/40',
      iconBg: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20',
      gradient: 'from-cyan-500/[0.04] to-transparent',
    },
    danger: {
      border: 'border-rose-500/25 hover:border-rose-500/40',
      iconBg: 'bg-rose-500/10 text-rose-400 border border-rose-500/25',
      gradient: 'from-rose-500/[0.05] to-transparent',
    },
    warning: {
      border: 'border-amber-500/20 hover:border-amber-500/40',
      iconBg: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
      gradient: 'from-amber-500/[0.04] to-transparent',
    },
    emerald: {
      border: 'border-emerald-500/20 hover:border-emerald-500/40',
      iconBg: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
      gradient: 'from-emerald-500/[0.04] to-transparent',
    },
    slate: {
      border: 'border-white/[0.08] hover:border-white/[0.15]',
      iconBg: 'bg-slate-800/80 text-slate-300 border border-slate-700/60',
      gradient: 'from-white/[0.02] to-transparent',
    },
  }[variant];

  return (
    <div className={`bg-[#151E2E] bg-gradient-to-br ${variantStyles.gradient} rounded-2xl p-5 border ${variantStyles.border} shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 group`}>
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">{title}</p>
          <h3 className="text-2xl font-bold tracking-tight text-white">{value}</h3>
          {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
        </div>
        <div className={`p-2.5 rounded-xl ${variantStyles.iconBg} transition-transform duration-200 group-hover:scale-105`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      {badge && (
        <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
          <span className="text-[11px] text-slate-400">Status</span>
          <span className="text-[11px] font-medium text-slate-300">{badge}</span>
        </div>
      )}
    </div>
  );
};
