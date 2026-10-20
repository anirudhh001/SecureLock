import React from 'react';
import type { DeviceStatus } from '../../types/device';
import { Wifi, WifiOff, AlertOctagon } from 'lucide-react';

interface Props {
  status: DeviceStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<Props> = ({ status, size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3 py-1.5 gap-2 font-semibold',
  };

  switch (status) {
    case 'online':
      return (
        <span className={`inline-flex items-center rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-medium ${sizeClasses[size]}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
          <Wifi className="w-3.5 h-3.5 text-emerald-400" />
          <span>Online</span>
        </span>
      );
    case 'lost':
      return (
        <span className={`inline-flex items-center rounded-full bg-rose-500/15 border border-rose-500/40 text-rose-300 font-semibold cyber-glow-danger ${sizeClasses[size]}`}>
          <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
          <span>Lost Mode Active</span>
        </span>
      );
    case 'offline':
    default:
      return (
        <span className={`inline-flex items-center rounded-full bg-slate-800/80 border border-slate-700/60 text-slate-400 ${sizeClasses[size]}`}>
          <WifiOff className="w-3.5 h-3.5 text-slate-400" />
          <span>Offline</span>
        </span>
      );
  }
};
