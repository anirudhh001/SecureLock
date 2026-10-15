import React from 'react';
import { useDevices } from '../context/DeviceContext';
import { MetricCard } from '../components/common/MetricCard';
import { StatusBadge } from '../components/common/StatusBadge';
import { SeverityBadge } from '../components/common/SeverityBadge';
import { TerminalLog } from '../components/common/TerminalLog';
import { 
  Smartphone, 
  ShieldAlert, 
  MapPin, 
  Volume2, 
  Lock, 
  RefreshCw, 
  AlertTriangle, 
  Wifi, 
  Battery, 
  BatteryCharging, 
  ExternalLink,
  ArrowRight,
  ShieldCheck,
  Radio
} from 'lucide-react';

interface Props {
  onNavigate: (page: string) => void;
}

export const DashboardPage: React.FC<Props> = ({ onNavigate }) => {
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

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>DEFENSE OVERVIEW</span>
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time remote telemetry, sensor surveillance, and emergency protection controls.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {selectedDevice && (
            <button
              onClick={() => refreshDeviceStatus(selectedDevice.deviceId)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-cyan-500/50 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
              <span>Poll Status</span>
            </button>
          )}

          <button
            onClick={() => onNavigate('lost-mode')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all ${
              selectedDevice?.lostMode 
                ? 'bg-rose-500/20 border-rose-500/50 text-rose-300 cyber-glow-danger animate-pulse' 
                : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-rose-500/40 hover:text-rose-300'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-rose-400" />
            <span>{selectedDevice?.lostMode ? 'LOST MODE ENGAGED' : 'Lost Mode Console'}</span>
          </button>
        </div>
      </div>

      {/* 4 Core Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Registered Hardware"
          value={totalDevices}
          subtitle="Linked Android phones"
          icon={Smartphone}
          variant="cyan"
          badge="100% Owner Verified"
        />
        <MetricCard
          title="Active Telemetry"
          value={`${onlineDevices}/${totalDevices}`}
          subtitle="Online & streaming GPS"
          icon={Wifi}
          variant="emerald"
          badge="Secure Handshake"
        />
        <MetricCard
          title="Lost Mode Status"
          value={lostDevices > 0 ? `${lostDevices} LOST` : 'SECURE'}
          subtitle={lostDevices > 0 ? 'Recovery lock active' : 'Zero devices reported lost'}
          icon={Lock}
          variant={lostDevices > 0 ? 'danger' : 'slate'}
          badge={lostDevices > 0 ? 'ATTENTION' : 'All Safe'}
        />
        <MetricCard
          title="Threat Detection"
          value={criticalThreats}
          subtitle="High/Critical security alerts"
          icon={ShieldAlert}
          variant={criticalThreats > 0 ? 'warning' : 'slate'}
          badge="Threat Matrix"
        />
      </div>

      {/* Main Grid: Device Spotlight & Quick Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Active Controlled Device Card & Map Preview */}
        <div className="lg:col-span-2 space-y-6">
          {selectedDevice ? (
            <div className="bg-cyber-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-800/80">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={selectedDevice.status} />
                    <span className="text-[11px] font-mono text-slate-500">
                      ID: {selectedDevice.deviceId}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mt-1">
                    {selectedDevice.deviceName}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {selectedDevice.specs.manufacturer} {selectedDevice.specs.model} • {selectedDevice.specs.osVersion}
                  </p>
                </div>

                {/* Battery & Health Telemetry */}
                <div className="flex items-center gap-4 bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    {selectedDevice.battery.isCharging ? (
                      <BatteryCharging className="w-5 h-5 text-emerald-400 animate-pulse" />
                    ) : (
                      <Battery className={`w-5 h-5 ${selectedDevice.battery.level < 20 ? 'text-rose-400' : 'text-cyan-400'}`} />
                    )}
                    <div>
                      <span className="text-xs font-bold text-white">{selectedDevice.battery.level}%</span>
                      <p className="text-[10px] text-slate-400">{selectedDevice.battery.isCharging ? 'Charging' : 'Discharging'}</p>
                    </div>
                  </div>

                  <div className="h-6 w-px bg-slate-800" />

                  <div>
                    <span className="text-xs font-semibold text-slate-300">
                      {selectedDevice.network.type === 'WIFI' ? 'Wi-Fi 5GHz' : selectedDevice.network.type === 'CELLULAR' ? '5G Cellular' : 'Offline'}
                    </span>
                    <p className="text-[10px] text-slate-400">Network Link</p>
                  </div>
                </div>
              </div>

              {/* Location Summary and Map Shortcut */}
              <div className="mt-4 p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Last Known GPS Fix
                    </span>
                    <p className="text-xs font-medium text-slate-200 mt-0.5">
                      {selectedDevice.location.address || 'Market Street, San Francisco, CA'}
                    </p>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                      Coordinates: {selectedDevice.location.latitude.toFixed(5)}, {selectedDevice.location.longitude.toFixed(5)} • Error: ±{selectedDevice.location.accuracy}m
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('location')}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-cyan-300 flex items-center justify-center gap-1.5 shrink-0"
                >
                  <span>Open Full Map</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Remote Security Actions Panel */}
              <div className="mt-5 space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Direct Remote Commands
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  
                  {/* Request Location */}
                  <button
                    onClick={() => requestLocation(selectedDevice.deviceId)}
                    className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800 text-left transition-all group"
                  >
                    <div className="p-2 w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group-hover:scale-110 transition-transform mb-2">
                      <Radio className="w-4 h-4" />
                    </div>
                    <p className="text-xs font-bold text-white leading-tight">Request GPS</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">High accuracy fix</p>
                  </button>

                  {/* Trigger Alarm */}
                  <button
                    onClick={() => {
                      if (selectedDevice.alarmActive) {
                        stopAlarm(selectedDevice.deviceId);
                      } else {
                        triggerAlarm(selectedDevice.deviceId);
                      }
                    }}
                    className={`p-3 rounded-xl border text-left transition-all group ${
                      selectedDevice.alarmActive 
                        ? 'bg-rose-950/70 border-rose-500 text-rose-300 cyber-glow-danger' 
                        : 'bg-slate-900/90 border-slate-800 hover:border-rose-500/50 hover:bg-slate-800'
                    }`}
                  >
                    <div className="p-2 w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 group-hover:scale-110 transition-transform mb-2">
                      <Volume2 className="w-4 h-4" />
                    </div>
                    <p className="text-xs font-bold text-white leading-tight">
                      {selectedDevice.alarmActive ? 'Mute Siren' : 'Sound Alarm'}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Max volume siren</p>
                  </button>

                  {/* Remote Lock */}
                  <button
                    onClick={() => triggerRemoteLock(selectedDevice.deviceId)}
                    className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-800 text-left transition-all group"
                  >
                    <div className="p-2 w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:scale-110 transition-transform mb-2">
                      <Lock className="w-4 h-4" />
                    </div>
                    <p className="text-xs font-bold text-white leading-tight">Remote Lock</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Device Admin API</p>
                  </button>

                  {/* Lost Mode */}
                  <button
                    onClick={() => onNavigate('lost-mode')}
                    className={`p-3 rounded-xl border text-left transition-all group ${
                      selectedDevice.lostMode 
                        ? 'bg-rose-900/30 border-rose-500/80 text-rose-200 cyber-glow-danger' 
                        : 'bg-slate-900/90 border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800'
                    }`}
                  >
                    <div className="p-2 w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 group-hover:scale-110 transition-transform mb-2">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <p className="text-xs font-bold text-white leading-tight">Lost Mode</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {selectedDevice.lostMode ? 'Active / Edit' : 'Engage lock'}
                    </p>
                  </button>

                </div>
              </div>

            </div>
          ) : (
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 text-center space-y-3">
              <Smartphone className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white">No Android Devices Enrolled</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Register your Android smartphone to enable remote location monitoring and emergency security controls.
              </p>
              <button
                onClick={() => onNavigate('devices')}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white"
              >
                Enroll New Device
              </button>
            </div>
          )}

          {/* Real-time Command Audit Terminal */}
          <TerminalLog logs={terminalLogs} />

        </div>

        {/* Right Col: Recent Security Alerts & Threat Matrix Feed */}
        <div className="space-y-6">
          <div className="bg-cyber-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Threat Activity Feed
                </h3>
              </div>
              <button
                onClick={() => onNavigate('history')}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
              >
                <span>Full Audit</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-3">
              {securityEvents.slice(0, 5).map((evt) => (
                <div 
                  key={evt.eventId}
                  className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl space-y-1.5 hover:border-slate-700 transition-colors"
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
                  <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between pt-1 border-t border-slate-900">
                    <span>Dev: {evt.deviceName ? evt.deviceName.split(' ')[0] : evt.deviceId}</span>
                    <span className="text-emerald-400 font-medium">{evt.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Android Restrictions & Compliance Card */}
          <div className="bg-slate-900/80 border border-cyan-950/60 rounded-2xl p-5 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-cyan-400 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Zero-Bypass Architecture</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              SecureLock operates strictly via legitimate Android APIs:
            </p>
            <ul className="list-disc list-inside text-[11px] text-slate-300 space-y-1 pt-1">
              <li>DeviceAdminReceiver for remote locking</li>
              <li>FusedLocationProvider for owner GPS polling</li>
              <li>Foreground Service with explicit notification</li>
              <li>Custom Fullscreen Recovery Activity for Lost Mode</li>
            </ul>
          </div>
        </div>

      </div>

    </div>
  );
};
