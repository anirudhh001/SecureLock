import React, { useState } from 'react';
import { useDevices } from '../context/DeviceContext';
import { SeverityBadge } from '../components/common/SeverityBadge';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Wifi, 
  Cpu, 
  Battery, 
  Lock, 
  Plane, 
  Key, 
  Filter, 
  Search,
  CheckCircle2,
  AlertOctagon,
  ArrowRight,
  Sparkles
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

  // Simulated Alert Injections for Testing
  const simulateSimChangeAlert = () => {
    if (!selectedDevice) return;
    addSecurityEvent({
      deviceId: selectedDevice.deviceId,
      deviceName: selectedDevice.deviceName,
      ownerId: selectedDevice.ownerId,
      eventType: 'SIM_STATE_CHANGED',
      severity: 'HIGH',
      description: `Suspicious SIM card change detected on ${selectedDevice.deviceName}. Telephony state altered to ABSENT.`,
      status: 'INVESTIGATING',
      metadata: {
        slot: 1,
        detectionApi: 'TelephonyManager.ACTION_SIM_CARD_STATE_CHANGED',
      },
    });
  };

  const simulateRogueCommandAlert = () => {
    if (!selectedDevice) return;
    addSecurityEvent({
      deviceId: selectedDevice.deviceId,
      deviceName: selectedDevice.deviceName,
      ownerId: selectedDevice.ownerId,
      eventType: 'UNAUTHORIZED_COMMAND_ATTEMPT',
      severity: 'CRITICAL',
      description: `Unauthorized remote unlock command intercepted. Origin IP did not possess valid owner token. Command blocked.`,
      status: 'ACTION_REQUIRED',
      metadata: {
        blockedIp: '203.0.113.89',
        targetCommand: 'DEVICE_UNLOCK',
      },
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>SMART THREAT DETECTION & SECURITY CENTER</span>
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse"></span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time threat heuristics, anomaly detection, and permission-compliant Android security event logs.
          </p>
        </div>

        {/* Test Alert Injections */}
        <div className="flex items-center gap-2">
          <button
            onClick={simulateSimChangeAlert}
            className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-xs font-semibold text-amber-300 flex items-center gap-1.5"
            title="Inject simulated SIM swap event"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Simulate SIM Swap</span>
          </button>

          <button
            onClick={simulateRogueCommandAlert}
            className="px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 text-xs font-semibold text-rose-300 flex items-center gap-1.5"
            title="Inject simulated rogue attack attempt"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Simulate Rogue Attack</span>
          </button>
        </div>
      </div>

      {/* 4 Threat Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <button
          onClick={() => setFilterSeverity('CRITICAL')}
          className={`p-4 rounded-xl border text-left transition-all ${
            filterSeverity === 'CRITICAL' 
              ? 'bg-rose-950/60 border-rose-500 cyber-glow-danger' 
              : 'bg-cyber-900/90 border-slate-800 hover:border-rose-500/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-400">CRITICAL</span>
            <AlertOctagon className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-2xl font-black text-white mt-1">{counts.CRITICAL}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Immediate intervention</p>
        </button>

        <button
          onClick={() => setFilterSeverity('HIGH')}
          className={`p-4 rounded-xl border text-left transition-all ${
            filterSeverity === 'HIGH' 
              ? 'bg-amber-950/60 border-amber-500' 
              : 'bg-cyber-900/90 border-slate-800 hover:border-amber-500/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400">HIGH</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-white mt-1">{counts.HIGH}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Suspicious state changes</p>
        </button>

        <button
          onClick={() => setFilterSeverity('MEDIUM')}
          className={`p-4 rounded-xl border text-left transition-all ${
            filterSeverity === 'MEDIUM' 
              ? 'bg-cyan-950/60 border-cyan-500' 
              : 'bg-cyber-900/90 border-slate-800 hover:border-cyan-500/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cyan-400">MEDIUM</span>
            <AlertTriangle className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-black text-white mt-1">{counts.MEDIUM}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Operational anomalies</p>
        </button>

        <button
          onClick={() => setFilterSeverity('LOW')}
          className={`p-4 rounded-xl border text-left transition-all ${
            filterSeverity === 'LOW' 
              ? 'bg-slate-800 border-slate-600' 
              : 'bg-cyber-900/90 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">LOW</span>
            <CheckCircle2 className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-2xl font-black text-white mt-1">{counts.LOW}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Telemetry & connections</p>
        </button>
      </div>

      {/* Threat Filter & Search Bar */}
      <div className="bg-cyber-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search security alerts by keyword..."
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-400">Filter:</span>
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setFilterSeverity(lvl)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                filterSeverity === lvl 
                  ? 'bg-cyan-500/20 border border-cyan-500 text-cyan-300' 
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Security Alerts Stream */}
      <div className="space-y-3">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <div
              key={event.eventId}
              className="bg-cyber-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-lg transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <SeverityBadge severity={event.severity} />
                  <h3 className="text-sm font-bold text-white">
                    {event.eventType.replace(/_/g, ' ')}
                  </h3>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="font-mono">{new Date(event.timestamp).toLocaleString()}</span>
                  <span className="px-2 py-0.5 rounded bg-slate-950 text-emerald-400 font-semibold border border-slate-800">
                    {event.status}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {event.description}
              </p>

              {/* Metadata & Cryptographic Integrity Pill */}
              <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 font-mono">
                <span>Target: {event.deviceName || event.deviceId}</span>
                {event.integrityHash && (
                  <span className="text-cyan-400/80">
                    Hash: {event.integrityHash}
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 bg-slate-900/40 border border-slate-800 rounded-2xl text-center text-xs text-slate-400">
            No security events matching filter criteria.
          </div>
        )}
      </div>

    </div>
  );
};
