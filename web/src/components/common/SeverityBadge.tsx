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
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-950/70 border border-rose-500/60 text-rose-300 cyber-glow-danger">
          {showIcon && <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />}
          CRITICAL
        </span>
      );
    case 'HIGH':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-950/70 border border-amber-500/50 text-amber-300">
          {showIcon && <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
          HIGH
        </span>
      );
    case 'MEDIUM':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-950/60 border border-cyan-500/40 text-cyan-300">
          {showIcon && <AlertCircle className="w-3.5 h-3.5 text-cyan-400" />}
          MEDIUM
        </span>
      );
    case 'LOW':
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800/80 border border-slate-700 text-slate-300">
          {showIcon && <Info className="w-3.5 h-3.5 text-slate-400" />}
          LOW
        </span>
      );
  }
};
