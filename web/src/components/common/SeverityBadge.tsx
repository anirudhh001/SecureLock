import React from 'react';
import type { EventSeverity } from '../../types/event';
import { ShieldAlert, AlertTriangle, AlertCircle, Info } from 'lucide-react';

interface Props {
  severity: EventSeverity;
  showIcon?: boolean;
}

export const SeverityBadge: React.FC<Props> = ({ severity, showIcon = true }) => {
  switch (severity) {
    case 'CRITICAL':
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-300">
          {showIcon && <ShieldAlert className="w-3 h-3 text-rose-600 dark:text-rose-400" />}
          CRITICAL
        </span>
      );
    case 'HIGH':
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 text-amber-700 dark:text-amber-300">
          {showIcon && <AlertTriangle className="w-3 h-3 text-amber-600 dark:text-amber-400" />}
          HIGH
        </span>
      );
    case 'MEDIUM':
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/25 text-cyan-700 dark:text-cyan-300">
          {showIcon && <AlertCircle className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />}
          MEDIUM
        </span>
      );
    case 'LOW':
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
          {showIcon && <Info className="w-3 h-3 text-slate-500" />}
          LOW
        </span>
      );
  }
};
