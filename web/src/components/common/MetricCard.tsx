import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface Props {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'blue' | 'cyan' | 'danger' | 'warning' | 'emerald' | 'slate';
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
      icon: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border-blue-100 dark:border-blue-500/20',
    },
    cyan: {
      icon: 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-500/10 border-cyan-100 dark:border-cyan-500/20',
    },
    danger: {
      icon: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border-rose-100 dark:border-rose-500/20',
    },
    warning: {
      icon: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-100 dark:border-amber-500/20',
    },
    emerald: {
      icon: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20',
    },
    slate: {
      icon: 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-white/[0.08]',
    },
  }[variant];

  return (
    <div className="bg-white dark:bg-[#141D2E] rounded-xl p-5 border border-slate-200 dark:border-white/[0.08] shadow-xs hover:shadow-sm hover:border-slate-300 dark:hover:border-white/[0.15] transition-all duration-150">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 min-w-0">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide truncate">
            {title}
          </p>
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {value}
          </h3>
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {subtitle}
            </p>
          )}
        </div>
        <div className={`p-2.5 rounded-lg border ${variantStyles.icon} shrink-0`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      {badge && (
        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between text-xs">
          <span className="text-[11px] text-slate-400">Status</span>
          <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300">{badge}</span>
        </div>
      )}
    </div>
  );
};
