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
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-rose-500/10 border border-rose-500/30 text-rose-300">
          {showIcon && <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />}
          CRITICAL
        </span>
      );
    case 'HIGH':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-amber-500/10 border border-amber-500/30 text-amber-300">
          {showIcon && <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
          HIGH
        </span>
      );
    case 'MEDIUM':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-cyan-500/10 border border-cyan-500/25 text-cyan-300">
          {showIcon && <AlertCircle className="w-3.5 h-3.5 text-cyan-400" />}
          MEDIUM
        </span>
      );
    case 'LOW':
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-slate-800/60 border border-slate-700/60 text-slate-300">
          {showIcon && <Info className="w-3.5 h-3.5 text-slate-400" />}
          LOW
        </span>
      );
  }
};
