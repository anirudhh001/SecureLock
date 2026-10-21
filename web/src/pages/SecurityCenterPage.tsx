import React, { useState } from 'react';
import { useDevices } from '../context/DeviceContext';
import { SeverityBadge } from '../components/common/SeverityBadge';
import { MetricCard } from '../components/common/MetricCard';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Smartphone, 
  Activity, 
  Search,
  CheckCircle2,
  AlertOctagon,
  Radio,
  Clock
} from 'lucide-react';
import type { EventSeverity } from '../types/event';

interface Props {
  onNavigate: (page: string) => void;
}

export const SecurityCenterPage: React.FC<Props> = ({ onNavigate }) => {
  const { 
    selectedDevice, 
    securityEvents, 
    addSecurityEvent 
  } = useDevices();

  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Count severities
  const counts = {
    CRITICAL: securityEvents.filter((e) => e.severity === 'CRITICAL').length,
    HIGH: securityEvents.filter((e) => e.severity === 'HIGH').length,
    MEDIUM: securityEvents.filter((e) => e.severity === 'MEDIUM').length,
    LOW: securityEvents.filter((e) => e.severity === 'LOW').length,
  };

  // Determine overall threat level
  const getThreatLevel = (): { level: 'LOW' | 'MEDIUM' | 'HIGH'; badge: string; color: string } => {
    if (counts.CRITICAL > 0) return { level: 'HIGH', badge: '🔴 HIGH', color: 'text-rose-600 dark:text-rose-400' };
    if (counts.HIGH > 0 || counts.MEDIUM > 2) return { level: 'MEDIUM', badge: '🟡 MEDIUM', color: 'text-amber-600 dark:text-amber-400' };
    return { level: 'LOW', badge: '🟢 LOW', color: 'text-emerald-600 dark:text-emerald-400' };
  };

  const threat = getThreatLevel();

  const filteredEvents = securityEvents.filter((evt) => {
    if (filterSeverity !== 'ALL' && evt.severity !== filterSeverity) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        evt.description.toLowerCase().includes(term) ||
        evt.eventType.toLowerCase().includes(term) ||
        (evt.deviceName && evt.deviceName.toLowerCase().includes(term))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Security Center
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Monitor real-time security events, threat evaluations, and device anomalies.
          </p>
        </div>

        <button
          onClick={() => onNavigate('history')}
          className="cyber-btn-secondary text-xs"
        >
          <span>View Audit History</span>
        </button>
      </div>

      {/* KPI Cards: Threat Level, Active Alerts, Security Events, Protected Devices */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="cyber-card p-5 space-y-1">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            Threat Level
          </span>
          <h3 className={`text-2xl font-bold tracking-tight ${threat.color}`}>
            {threat.level}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {threat.level === 'LOW' ? 'Normal threat status' : 'Active investigation'}
          </p>
        </div>

        <div className="cyber-card p-5 space-y-1">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            Active Alerts
          </span>
          <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {counts.CRITICAL + counts.HIGH}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {counts.CRITICAL} Critical • {counts.HIGH} High
          </p>
        </div>

        <div className="cyber-card p-5 space-y-1">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            Security Events
          </span>
          <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {securityEvents.length}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Recorded in session audit
          </p>
        </div>

        <div className="cyber-card p-5 space-y-1">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            Protected Devices
          </span>
          <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            1
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Enrolled Android Hardware
          </p>
        </div>
      </div>

      {/* Security Event Timeline & Filter Card */}
      <div className="cyber-card p-6 space-y-4">
        
        {/* Controls: Search & Severity Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-white/[0.06]">
          <div className="relative flex-1 max-w-sm">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search security events..."
              className="w-full pl-9 pr-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-white/[0.1] bg-slate-50 dark:bg-[#101827] text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((sev) => (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  filterSeverity === sev 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-100 dark:bg-white/[0.04] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>

        {/* Event List */}
        <div className="space-y-3 pt-1">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">
              No security events matching filter criteria.
            </div>
          ) : (
            filteredEvents.map((event) => (
              <div 
                key={event.eventId}
                className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/[0.04] flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-200 dark:hover:border-white/[0.08] transition-colors"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <SeverityBadge severity={event.severity} />
                    <span className="font-semibold text-xs text-slate-900 dark:text-white">
                      {event.eventType.replace(/_/g, ' ')}
                    </span>
                    {event.deviceName && (
                      <span className="text-[11px] text-slate-400 font-mono">
                        • {event.deviceName}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {event.description}
                  </p>
                </div>

                <div className="text-[11px] text-slate-400 font-mono shrink-0">
                  {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))
          )}
        </div>

      </div>

    </div>
  );
};
