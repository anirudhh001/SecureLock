import React, { useState } from 'react';
import { useDevices } from '../context/DeviceContext';
import { useAuth } from '../context/AuthContext';
import { MetricCard } from '../components/common/MetricCard';
import { StatusBadge } from '../components/common/StatusBadge';
import { InteractiveMap } from '../components/location/InteractiveMap';
import { 
  Smartphone, 
  ShieldCheck, 
  Lock, 
  ShieldAlert, 
  MapPin, 
  Volume2, 
  VolumeX,
  Battery, 
  BatteryCharging, 
  ArrowRight,
  RefreshCw,
  Clock,
  Radio,
  CheckCircle2,
  AlertTriangle,
  Sliders
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
    requestLocation, 
    triggerAlarm, 
    stopAlarm, 
    triggerRemoteLock, 
    refreshDeviceStatus 
  } = useDevices();

  const [commandLoading, setCommandLoading] = useState<string | null>(null);

  const totalDevices = devices.length;
  const onlineDevices = devices.filter((d) => d.status === 'online').length;
  const lostDevices = devices.filter((d) => d.lostMode).length;
  const highAlerts = securityEvents.filter((e) => e.severity === 'CRITICAL' || e.severity === 'HIGH').length;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const userName = user?.displayName || user?.email?.split('@')[0] || 'Admin';

  const handleQuickCommand = async (actionKey: string, fn: () => Promise<any>) => {
    setCommandLoading(actionKey);
    try {
      await fn();
    } finally {
      setTimeout(() => setCommandLoading(null), 800);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {getGreeting()}, {userName}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Your devices are protected and monitored.
          </p>
        </div>

        {selectedDevice && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => refreshDeviceStatus(selectedDevice.deviceId)}
              className="cyber-btn-secondary text-xs"
              title="Refresh device telemetry"
            >
              <RefreshCw className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Refresh Status</span>
            </button>
            <button
              onClick={() => onNavigate('controls')}
              className="cyber-btn-primary text-xs"
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Remote Controls</span>
            </button>
          </div>
        )}
      </div>

      {/* 2. Four Compact Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Device Status */}
        <MetricCard
          title="Device"
          value={`${onlineDevices} Online`}
          subtitle={selectedDevice ? selectedDevice.deviceName : 'No enrolled device'}
          icon={Smartphone}
          variant="blue"
        />

        {/* Security Status */}
        <MetricCard
          title="Security"
          value="Protected"
          subtitle={highAlerts === 0 ? 'No active threats' : `${highAlerts} threat review required`}
          icon={ShieldCheck}
          variant="emerald"
        />

        {/* Lost Mode Status */}
        <MetricCard
          title="Lost Mode"
          value={selectedDevice?.lostMode ? 'Active' : 'Inactive'}
          subtitle={selectedDevice?.lostMode ? 'Device screen broadcast active' : 'Device is secure'}
          icon={Lock}
          variant={selectedDevice?.lostMode ? 'danger' : 'slate'}
        />

        {/* Recent Alerts */}
        <MetricCard
          title="Alerts"
          value={securityEvents.length}
          subtitle={highAlerts > 0 ? `${highAlerts} high priority` : 'Zero critical threats'}
          icon={ShieldAlert}
          variant={highAlerts > 0 ? 'warning' : 'slate'}
        />
      </div>

      {/* 3. Two Main Sections: My Device and Device Location */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: My Device Card */}
        <div className="cyber-card p-6 flex flex-col justify-between">
          <div className="space-y-5">
            
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Primary Device
                </span>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mt-0.5">
                  {selectedDevice ? selectedDevice.deviceName : 'Android Smartphone'}
                </h3>
              </div>
              {selectedDevice && <StatusBadge status={selectedDevice.status} size="sm" />}
            </div>

            {/* Realistic Minimal Smartphone Visual */}
            <div className="my-2 p-4 rounded-xl bg-slate-50 dark:bg-[#182235]/60 border border-slate-100 dark:border-white/[0.04] flex items-center gap-4">
              <div className="w-12 h-20 rounded-xl bg-slate-900 border-2 border-slate-700 dark:border-slate-600 flex flex-col justify-between p-1.5 shrink-0 shadow-xs relative">
                {/* Speaker notch */}
                <div className="w-4 h-1 bg-slate-700 rounded-full mx-auto" />
                {/* Screen content */}
                <div className="w-full h-11 rounded-sm bg-blue-600/10 flex items-center justify-center">
                  {selectedDevice?.lostMode ? (
                    <Lock className="w-3.5 h-3.5 text-rose-500" />
                  ) : (
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                  )}
                </div>
                {/* Home bar */}
                <div className="w-5 h-0.5 bg-slate-600 rounded-full mx-auto" />
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Last seen:</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">Just now</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Battery:</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200 flex items-center gap-1">
                    {selectedDevice?.battery.isCharging ? (
                      <BatteryCharging className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Battery className="w-3.5 h-3.5 text-slate-500" />
                    )}
                    {selectedDevice ? `${selectedDevice.battery.level}%` : '78%'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Lost Mode:</span>
                  <span className={`font-medium ${selectedDevice?.lostMode ? 'text-rose-600 dark:text-rose-400 font-semibold' : 'text-slate-700 dark:text-slate-300'}`}>
                    {selectedDevice?.lostMode ? 'Active' : 'Off'}
                  </span>
                </div>
              </div>
            </div>

            {/* Hardware Info Details */}
            {selectedDevice && (
              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/[0.04]">
                  <span className="text-[11px] text-slate-400 block">Model</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200 truncate block">{selectedDevice.specs.model}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/[0.04]">
                  <span className="text-[11px] text-slate-400 block">Android OS</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200 block">v{selectedDevice.specs.osVersion}</span>
                </div>
              </div>
            )}

          </div>

          {/* Action button */}
          <div className="pt-4 border-t border-slate-100 dark:border-white/[0.06] mt-4">
            <button
              onClick={() => onNavigate('device-details')}
              className="w-full cyber-btn-secondary text-xs flex items-center justify-center gap-2"
            >
              <span>View Device</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right: Device Location (Main Visual Element) */}
        <div className="lg:col-span-2 cyber-card p-6 flex flex-col justify-between">
          <div className="space-y-4">
            
            {/* Location Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                  Device Location
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {selectedDevice?.location.address || 'Real-time GPS coordinates via Google Play Services'}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                  <Clock className="w-3.5 h-3.5" /> Updated 2 min ago
                </span>
                <button
                  onClick={() => selectedDevice && requestLocation(selectedDevice.deviceId)}
                  className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-white/[0.06] text-blue-600 dark:text-blue-400 transition-colors"
                  title="Query GPS now"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Interactive Leaflet Map */}
            {selectedDevice && (
              <div className="h-[280px] w-full rounded-xl overflow-hidden">
                <InteractiveMap 
                  location={selectedDevice.location} 
                  deviceName={selectedDevice.deviceName}
                  history={selectedDevice.locationHistory}
                />
              </div>
            )}

            {/* Below Map Coordinates Metadata */}
            {selectedDevice && (
              <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
                <div className="font-mono font-medium text-slate-700 dark:text-slate-300">
                  {selectedDevice.location.latitude.toFixed(4)}° N, {selectedDevice.location.longitude.toFixed(4)}° E
                </div>
                <div className="flex items-center gap-4">
                  <span>Accuracy ±{selectedDevice.location.accuracy} m</span>
                  <button 
                    onClick={() => onNavigate('location')}
                    className="text-blue-600 dark:text-blue-400 hover:underline font-medium inline-flex items-center gap-1"
                  >
                    <span>Full Map View</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>

      {/* 4. Remote Controls (Simple & Restrained) */}
      <div className="cyber-card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              Remote Controls
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage your registered device with instant cryptographic command dispatch.
            </p>
          </div>
          <button
            onClick={() => onNavigate('controls')}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium inline-flex items-center gap-1"
          >
            <span>Advanced Controls</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Locate */}
          <button
            disabled={!selectedDevice || commandLoading === 'locate'}
            onClick={() => selectedDevice && handleQuickCommand('locate', () => requestLocation(selectedDevice.deviceId))}
            className="p-3.5 rounded-xl border border-slate-200 dark:border-white/[0.08] hover:border-blue-500/40 bg-white dark:bg-[#182235]/40 hover:bg-slate-50 dark:hover:bg-[#182235] text-left transition-all duration-150 group"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2">
              <MapPin className="w-4 h-4" />
            </div>
            <p className="text-xs font-semibold text-slate-900 dark:text-white">Locate</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Query GPS</p>
          </button>

          {/* Alarm */}
          <button
            disabled={!selectedDevice || commandLoading === 'alarm'}
            onClick={() => {
              if (!selectedDevice) return;
              if (selectedDevice.alarmActive) {
                handleQuickCommand('alarm', () => stopAlarm(selectedDevice.deviceId));
              } else {
                handleQuickCommand('alarm', () => triggerAlarm(selectedDevice.deviceId));
              }
            }}
            className={`p-3.5 rounded-xl border text-left transition-all duration-150 ${
              selectedDevice?.alarmActive 
                ? 'bg-amber-50 dark:bg-amber-500/15 border-amber-300 dark:border-amber-500/40 text-amber-800 dark:text-amber-200' 
                : 'border-slate-200 dark:border-white/[0.08] hover:border-amber-500/40 bg-white dark:bg-[#182235]/40 hover:bg-slate-50 dark:hover:bg-[#182235]'
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${
              selectedDevice?.alarmActive 
                ? 'bg-amber-500 text-white' 
                : 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400'
            }`}>
              {selectedDevice?.alarmActive ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </div>
            <p className="text-xs font-semibold text-slate-900 dark:text-white">
              {selectedDevice?.alarmActive ? 'Mute Alarm' : 'Alarm'}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {selectedDevice?.alarmActive ? 'Siren Ringing' : 'High Decibel'}
            </p>
          </button>

          {/* Lost Mode */}
          <button
            onClick={() => onNavigate('lost-mode')}
            className={`p-3.5 rounded-xl border text-left transition-all duration-150 ${
              selectedDevice?.lostMode 
                ? 'bg-rose-50 dark:bg-rose-500/15 border-rose-300 dark:border-rose-500/40 text-rose-800 dark:text-rose-200' 
                : 'border-slate-200 dark:border-white/[0.08] hover:border-rose-500/40 bg-white dark:bg-[#182235]/40 hover:bg-slate-50 dark:hover:bg-[#182235]'
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${
              selectedDevice?.lostMode 
                ? 'bg-rose-500 text-white' 
                : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400'
            }`}>
              <Lock className="w-4 h-4" />
            </div>
            <p className="text-xs font-semibold text-slate-900 dark:text-white">Lost Mode</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {selectedDevice?.lostMode ? 'Active on phone' : 'Screen Broadcast'}
            </p>
          </button>

          {/* Lock */}
          <button
            disabled={!selectedDevice || commandLoading === 'lock'}
            onClick={() => selectedDevice && handleQuickCommand('lock', () => triggerRemoteLock(selectedDevice.deviceId))}
            className="p-3.5 rounded-xl border border-slate-200 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/[0.15] bg-white dark:bg-[#182235]/40 hover:bg-slate-50 dark:hover:bg-[#182235] text-left transition-all duration-150"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center mb-2">
              <Lock className="w-4 h-4" />
            </div>
            <p className="text-xs font-semibold text-slate-900 dark:text-white">Lock Device</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Instant Pin Lock</p>
          </button>
        </div>
      </div>

    </div>
  );
};
