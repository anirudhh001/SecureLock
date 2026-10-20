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
  Clock,
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

  // Determine overall threat level
  const getThreatLevel = (): { level: 'LOW' | 'MEDIUM' | 'HIGH'; badge: string; color: string } => {
    if (counts.CRITICAL > 0) return { level: 'HIGH', badge: '🔴 HIGH', color: 'text-rose-400' };
    if (counts.HIGH > 0 || counts.MEDIUM > 2) return { level: 'MEDIUM', badge: '🟡 MEDIUM', color: 'text-amber-400' };
    return { level: 'LOW', badge: '🟢 LOW', color: 'text-emerald-400' };
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
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/10 border border-blue-500/30 text-blue-300">
              SECURITY OPERATIONS CENTER
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Security Overview
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time telemetry surveillance, threat matrix monitoring, and anomaly detection.
          </p>
        </div>

        {/* Test alert injection buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={simulateSimChangeAlert}
            className="cyber-btn-secondary text-xs"
            title="Simulate SIM extraction detection event"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Simulate SIM Eject</span>
          </button>

          <button
            onClick={simulateRogueCommandAlert}
            className="cyber-btn-danger text-xs"
            title="Simulate rogue command block"
          >
            <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
            <span>Simulate Intrusion</span>
          </button>
        </div>
      </div>

      {/* 4 Security Overview Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Threat Level */}
        <MetricCard
          title="Threat Level"
          value={threat.level}
          subtitle={threat.level === 'LOW' ? 'Normal baseline security posture' : 'Active anomalies under monitoring'}
          icon={ShieldAlert}
          variant={threat.level === 'HIGH' ? 'danger' : threat.level === 'MEDIUM' ? 'warning' : 'emerald'}
          badge={threat.badge}
        />

        {/* Active Alerts */}
        <MetricCard
          title="Active Alerts"
          value={counts.CRITICAL + counts.HIGH}
          subtitle="Critical and High priority alerts"
          icon={AlertTriangle}
          variant={counts.CRITICAL > 0 ? 'danger' : counts.HIGH > 0 ? 'warning' : 'slate'}
          badge={`${counts.CRITICAL} Critical`}
        />

        {/* Security Events */}
        <MetricCard
          title="Security Events"
          value={securityEvents.length}
          subtitle="Total recorded security audits"
          icon={Activity}
          variant="blue"
          badge="Live Streaming"
        />

        {/* Device Status */}
        <MetricCard
          title="Device Status"
          value={selectedDevice?.status === 'online' ? 'Online' : selectedDevice?.status === 'lost' ? 'Lost' : 'Offline'}
          subtitle={selectedDevice ? selectedDevice.deviceName : 'No target selected'}
          icon={Smartphone}
          variant={selectedDevice?.status === 'online' ? 'emerald' : selectedDevice?.status === 'lost' ? 'danger' : 'slate'}
          badge={selectedDevice?.status === 'online' ? '🟢 Online' : 'Target Link'}
        />
      </div>

      {/* Main SOC Layout: Alerts Stream & Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Security Alerts List & Filter */}
        <div className="lg:col-span-2 space-y-4">
          <div className="cyber-card p-5 space-y-4">
            
            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
              {/* Severity Pills */}
              <div className="flex flex-wrap gap-1.5">
                {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((sev) => {
                  const isActive = filterSeverity === sev;
                  return (
                    <button
                      key={sev}
                      onClick={() => setFilterSeverity(sev)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-[#1A2537] text-slate-400 hover:text-white hover:bg-[#223046]'
                      }`}
                    >
                      {sev} {sev !== 'ALL' && `(${counts[sev as keyof typeof counts]})`}
                    </button>
                  );
                })}
              </div>

              {/* Search Field */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Filter events..."
                  className="bg-[#0B1120] border border-white/[0.1] rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 w-full sm:w-48"
                />
              </div>
            </div>

            {/* Alerts List */}
            <div className="space-y-3">
              {filteredEvents.length === 0 ? (
                <div className="text-center py-10 text-slate-500 text-xs">
                  No security alerts match the current filter.
                </div>
              ) : (
                filteredEvents.map((evt) => (
                  <div
                    key={evt.eventId}
                    className="p-4 bg-[#1A2537] border border-white/[0.06] rounded-xl space-y-2 hover:border-white/[0.12] transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <SeverityBadge severity={evt.severity} />
                        <span className="font-semibold text-white text-xs">
                          {evt.eventType.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(evt.timestamp).toLocaleString()}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {evt.description}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/[0.04] text-[11px] text-slate-400">
                      <span>Device: <strong className="text-slate-300">{evt.deviceName || evt.deviceId}</strong></span>
                      <span className="font-mono text-emerald-400 font-medium">Status: {evt.status}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        </div>

        {/* Right Col: Activity Timeline */}
        <div className="space-y-6">
          
          <div className="cyber-card p-5 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-white/[0.08]">
              <Activity className="w-4 h-4 text-blue-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Activity Timeline
              </h3>
            </div>

            <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-white/[0.06]">
              {securityEvents.slice(0, 6).map((evt, idx) => (
                <div key={idx} className="flex items-start gap-3 relative">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 ${
                    evt.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' :
                    evt.severity === 'HIGH' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                    'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                  }`}>
                    <ShieldAlert className="w-3.5 h-3.5" />
                  </div>
                  <div className="bg-[#1A2537] border border-white/[0.06] rounded-xl p-3 flex-1 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-white truncate max-w-[130px]">
                        {evt.eventType.replace(/_/g, ' ')}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">
                      {evt.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Defense Posture Standards */}
          <div className="cyber-card p-5 space-y-3 text-xs">
            <div className="flex items-center gap-2 text-blue-400 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>SOC Threat Mitigation Protocols</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              SecureLock employs continuous cryptographic validation and tamper triggers:
            </p>
            <ul className="text-[11px] text-slate-300 space-y-1.5 pt-1">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                <span>Immediate SIM hot-swap and telephony event trapping</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                <span>Encrypted token validation on all remote command receipts</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                <span>Automatic trigger log archival in Firestore audit stream</span>
              </li>
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
};
