import React from 'react';
import { useDevices } from '../context/DeviceContext';
import { useAuth } from '../context/AuthContext';
import { MetricCard } from '../components/common/MetricCard';
import { StatusBadge } from '../components/common/StatusBadge';
import { SeverityBadge } from '../components/common/SeverityBadge';
import { TerminalLog } from '../components/common/TerminalLog';
import { InteractiveMap } from '../components/location/InteractiveMap';
import { 
  Smartphone, 
  ShieldAlert, 
  MapPin, 
  Volume2, 
  VolumeX,
  Lock, 
  RefreshCw, 
  Battery, 
  BatteryCharging, 
  ArrowRight,
  ShieldCheck,
  Radio,
  Eye,
  Activity,
  Compass,
  AlertTriangle,
  Clock
} from 'lucide-react';

interface Props {
  onNavigate: (page: string) => void;
}

export const DashboardPage: React.FC<Props> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { 
    devices, 
    selectedDevice, 
    securityEvents, 
    terminalLogs,
    requestLocation, 
    triggerAlarm, 
    stopAlarm, 
    triggerRemoteLock, 
    refreshDeviceStatus 
  } = useDevices();

  const totalDevices = devices.length;
  const onlineDevices = devices.filter((d) => d.status === 'online').length;
  const lostDevices = devices.filter((d) => d.lostMode).length;
  const criticalThreats = securityEvents.filter((e) => e.severity === 'CRITICAL' || e.severity === 'HIGH').length;

  // Dynamic Greeting based on local time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const userName = user?.displayName || user?.email?.split('@')[0] || 'Security Officer';

  // Format partially masked device ID
  const maskDeviceId = (id: string) => {
    if (!id || id.length <= 6) return id;
    return `${id.slice(0, 3)}••••${id.slice(-4)}`;
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {getGreeting()}, {userName}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Your devices are protected and monitored.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {selectedDevice && (
            <button
              onClick={() => refreshDeviceStatus(selectedDevice.deviceId)}
              className="cyber-btn-secondary text-xs"
              title="Poll latest device status"
            >
              <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
              <span>Poll Status</span>
            </button>
          )}

          <button
            onClick={() => onNavigate('lost-mode')}
            className={`text-xs font-semibold px-3.5 py-2 rounded-xl border transition-all inline-flex items-center gap-2 ${
              selectedDevice?.lostMode 
                ? 'bg-rose-500/15 border-rose-500/40 text-rose-300 animate-pulse' 
                : 'bg-[#151E2E] border-white/[0.08] text-slate-300 hover:text-white hover:border-white/[0.15]'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-rose-400" />
            <span>{selectedDevice?.lostMode ? 'Lost Mode Active' : 'Lost Mode'}</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Device Status */}
        <MetricCard
          title="Device Status"
          value={selectedDevice?.status === 'online' ? 'Online' : selectedDevice?.status === 'lost' ? 'Lost' : 'Offline'}
          subtitle={selectedDevice ? selectedDevice.deviceName : 'No devices enrolled'}
          icon={Smartphone}
          variant={selectedDevice?.status === 'online' ? 'emerald' : selectedDevice?.status === 'lost' ? 'danger' : 'slate'}
          badge={selectedDevice?.status === 'online' ? '🟢 Online' : 'Telemetry Link'}
        />

        {/* 2. Security Status */}
        <MetricCard
          title="Security Status"
          value={criticalThreats === 0 ? 'Protected' : 'Attention'}
          subtitle={criticalThreats === 0 ? 'All defensive checks passing' : `${criticalThreats} threat alerts pending`}
          icon={ShieldCheck}
          variant={criticalThreats === 0 ? 'blue' : 'warning'}
          badge="🛡 Protected"
        />

        {/* 3. Lost Mode */}
        <MetricCard
          title="Lost Mode"
          value={lostDevices > 0 ? `${lostDevices} Active` : 'Inactive'}
          subtitle={lostDevices > 0 ? 'Emergency recovery lock active' : 'Zero devices reported lost'}
          icon={Lock}
          variant={lostDevices > 0 ? 'danger' : 'slate'}
          badge={lostDevices > 0 ? '🔴 Active' : '🔒 Inactive'}
        />

        {/* 4. Recent Alerts */}
        <MetricCard
          title="Recent Alerts"
          value={securityEvents.length}
          subtitle="Total logged security events"
          icon={ShieldAlert}
          variant={criticalThreats > 0 ? 'warning' : 'slate'}
          badge={`${criticalThreats} Critical/High`}
        />
      </div>

      {/* Main Grid: Device Card & Remote Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Device Card & Location Section */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Dedicated Premium Device Card */}
          {selectedDevice ? (
            <div className="cyber-card p-6 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-white/[0.08]">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={selectedDevice.status} />
                    <span className="text-[11px] font-mono text-slate-400">
                      ID: {maskDeviceId(selectedDevice.deviceId)}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mt-1">
                    {selectedDevice.deviceName}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {selectedDevice.specs.manufacturer} {selectedDevice.specs.model} • Android {selectedDevice.specs.apiLevel >= 34 ? '14 (API 34)' : '13 (API 33)'}
                  </p>
                </div>

                {/* Battery & Network Telemetry Pill */}
                <div className="flex items-center gap-4 bg-[#1A2537] border border-white/[0.08] rounded-xl px-4 py-2.5">
                  <div className="flex items-center gap-2.5">
                    {selectedDevice.battery.isCharging ? (
                      <BatteryCharging className="w-5 h-5 text-emerald-400 animate-pulse" />
                    ) : (
                      <Battery className={`w-5 h-5 ${selectedDevice.battery.level < 20 ? 'text-rose-400' : 'text-blue-400'}`} />
                    )}
                    <div>
                      <span className="text-xs font-bold text-white">{selectedDevice.battery.level}%</span>
                      <p className="text-[10px] text-slate-400">{selectedDevice.battery.isCharging ? 'Charging' : 'Discharging'}</p>
                    </div>
                  </div>

                  <div className="h-6 w-px bg-white/[0.08]" />

                  <div>
                    <span className="text-xs font-semibold text-slate-200">
                      {selectedDevice.lostMode ? 'Active' : 'Off'}
                    </span>
                    <p className="text-[10px] text-slate-400">Lost Mode</p>
                  </div>

                  <div className="h-6 w-px bg-white/[0.08]" />

                  <div>
                    <button
                      onClick={() => onNavigate('device-details')}
                      className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 transition-colors"
                    >
                      <span>View Device</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Remote Security Controls Section */}
              <div className="mt-5 space-y-3">
                <div>
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Remote Security Controls
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Manage your registered device securely.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  
                  {/* Primary Action: Locate Device */}
                  <button
                    onClick={() => requestLocation(selectedDevice.deviceId)}
                    className="p-3.5 rounded-xl bg-blue-600/10 border border-blue-500/30 hover:bg-blue-600/20 hover:border-blue-500/50 text-left transition-all group"
                  >
                    <div className="p-2 w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 group-hover:scale-105 transition-transform mb-2 flex items-center justify-center">
                      <Radio className="w-4 h-4" />
                    </div>
                    <p className="text-xs font-bold text-white leading-tight">Locate Device</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Primary action</p>
                  </button>

                  {/* Warning/Danger Action: Trigger Alarm */}
                  <button
                    onClick={() => {
                      if (selectedDevice.alarmActive) {
                        stopAlarm(selectedDevice.deviceId);
                      } else {
                        triggerAlarm(selectedDevice.deviceId);
                      }
                    }}
                    className={`p-3.5 rounded-xl border text-left transition-all group ${
                      selectedDevice.alarmActive 
                        ? 'bg-rose-500/20 border-rose-500/60 text-rose-300 animate-pulse' 
                        : 'bg-[#1A2537] border-white/[0.08] hover:border-rose-500/40 hover:bg-rose-500/[0.06]'
                    }`}
                  >
                    <div className="p-2 w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/25 group-hover:scale-105 transition-transform mb-2 flex items-center justify-center">
                      {selectedDevice.alarmActive ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </div>
                    <p className="text-xs font-bold text-white leading-tight">
                      {selectedDevice.alarmActive ? 'Mute Alarm' : 'Trigger Alarm'}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Emergency siren</p>
                  </button>

                  {/* Lost Mode */}
                  <button
                    onClick={() => onNavigate('lost-mode')}
                    className={`p-3.5 rounded-xl border text-left transition-all group ${
                      selectedDevice.lostMode 
                        ? 'bg-rose-500/20 border-rose-500/60 text-rose-300' 
                        : 'bg-[#1A2537] border-white/[0.08] hover:border-blue-500/40 hover:bg-blue-500/[0.06]'
                    }`}
                  >
                    <div className="p-2 w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 group-hover:scale-105 transition-transform mb-2 flex items-center justify-center">
                      <Lock className="w-4 h-4" />
                    </div>
                    <p className="text-xs font-bold text-white leading-tight">Lost Mode</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {selectedDevice.lostMode ? 'Engaged (Edit)' : 'Broadcast Lock'}
                    </p>
                  </button>

                  {/* Lock Device */}
                  <button
                    onClick={() => triggerRemoteLock(selectedDevice.deviceId)}
                    className="p-3.5 rounded-xl bg-[#1A2537] border border-white/[0.08] hover:border-amber-500/40 hover:bg-amber-500/[0.06] text-left transition-all group"
                  >
                    <div className="p-2 w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:scale-105 transition-transform mb-2 flex items-center justify-center">
                      <ShieldAlert className="w-4 h-4" />
                    </div>
                    <p className="text-xs font-bold text-white leading-tight">Lock Device</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">DeviceAdmin lock</p>
                  </button>

                </div>
              </div>

            </div>
          ) : (
            <div className="cyber-card p-8 text-center space-y-3">
              <Smartphone className="w-12 h-12 text-slate-500 mx-auto" />
              <h3 className="text-base font-bold text-white">No registered devices</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Register your Android device to start protecting it with SecureLock.
              </p>
              <button
                onClick={() => onNavigate('devices')}
                className="cyber-btn-primary text-xs"
              >
                Register Device
              </button>
            </div>
          )}

          {/* Location Section: Clean Map Panel */}
          {selectedDevice && (
            <div className="cyber-card p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/[0.08]">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-400" />
                    <span>Device Location</span>
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Last updated {new Date(selectedDevice.location.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-slate-400 bg-[#1A2537] px-2.5 py-1 rounded-lg border border-white/[0.06]">
                    ±{selectedDevice.location.accuracy}m Accuracy
                  </span>
                  <button
                    onClick={() => onNavigate('location')}
                    className="cyber-btn-secondary text-xs py-1 px-3"
                  >
                    <span>Full Map</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Map View */}
              <div className="h-64 sm:h-80 w-full rounded-xl overflow-hidden border border-white/[0.08]">
                <InteractiveMap
                  location={selectedDevice.location}
                  deviceName={selectedDevice.deviceName}
                  history={selectedDevice.locationHistory || []}
                />
              </div>

              <div className="text-[11px] text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-1 pt-1">
                <span className="truncate max-w-md">
                  📍 {selectedDevice.location.address || 'GPS Coordinate Fix Acquired'}
                </span>
                <span className="font-mono text-slate-400 shrink-0">
                  {selectedDevice.location.latitude.toFixed(5)}, {selectedDevice.location.longitude.toFixed(5)}
                </span>
              </div>
            </div>
          )}

          {/* Command Audit Terminal */}
          <TerminalLog logs={terminalLogs} />

        </div>

        {/* Right Col: Recent Alerts & Architecture */}
        <div className="space-y-6">
          
          {/* Recent Security Alerts Feed */}
          <div className="cyber-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Security Alerts
                </h3>
              </div>
              <button
                onClick={() => onNavigate('security')}
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 transition-colors"
              >
                <span>View Details</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2.5">
              {securityEvents.length === 0 ? (
                <div className="text-center py-6 text-slate-500 text-xs">
                  Zero security alerts recorded.
                </div>
              ) : (
                securityEvents.slice(0, 5).map((evt) => (
                  <div 
                    key={evt.eventId}
                    className="p-3 bg-[#1A2537] border border-white/[0.06] rounded-xl space-y-1.5 hover:border-white/[0.12] transition-colors"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <SeverityBadge severity={evt.severity} />
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-200 leading-snug">
                      {evt.eventType.replace(/_/g, ' ')}
                    </p>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {evt.description}
                    </p>
                    <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between pt-1 border-t border-white/[0.04]">
                      <span>{evt.deviceName || evt.deviceId}</span>
                      <span className="text-emerald-400 font-medium">{evt.status}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Android Enterprise Security Architecture Card */}
          <div className="cyber-card p-5 space-y-3 text-xs">
            <div className="flex items-center gap-2 text-blue-400 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>SOC Compliance Standards</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              SecureLock adheres strictly to authorized enterprise Android Device Administration policies:
            </p>
            <ul className="text-[11px] text-slate-300 space-y-1.5 pt-1">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                <span>DevicePolicyManager for instant remote locking</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                <span>FusedLocationProviderApi high-accuracy stream</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                <span>Fullscreen Activity overlay for Lost Mode broadcast</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                <span>Zero system bypasses or root requirements</span>
              </li>
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
};
