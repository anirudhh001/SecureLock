import React from 'react';
import { useDevices } from '../context/DeviceContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { 
  Smartphone, 
  Cpu, 
  ShieldCheck, 
  Battery, 
  BatteryCharging, 
  Wifi, 
  HardDrive, 
  Radio, 
  Lock, 
  MapPin, 
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

interface Props {
  onNavigate: (page: string) => void;
}

export const DeviceDetailsPage: React.FC<Props> = ({ onNavigate }) => {
  const { selectedDevice } = useDevices();

  if (!selectedDevice) {
    return (
      <div className="p-8 text-center text-slate-400">
        Please select a registered device to inspect hardware telemetry.
      </div>
    );
  }

  const { specs, battery, network, location } = selectedDevice;
  const storageUsedPercent = Math.round(((specs.storageTotalGb - specs.storageAvailableGb) / specs.storageTotalGb) * 100);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <StatusBadge status={selectedDevice.status} />
            <span className="text-xs font-mono text-slate-400">ID: {selectedDevice.deviceId}</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            {selectedDevice.deviceName}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Cryptographic hardware profile and low-level Android sensor telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('controls')}
            className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white flex items-center gap-1.5 shadow-lg shadow-cyan-950/40"
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Launch Controls</span>
          </button>

          <button
            onClick={() => onNavigate('lost-mode')}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-rose-500 text-xs font-bold text-slate-300 hover:text-rose-400 flex items-center gap-1.5"
          >
            <Lock className="w-3.5 h-3.5 text-rose-400" />
            <span>Lost Mode</span>
          </button>
        </div>
      </div>

      {/* 4 Telemetry Spec Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* OS & Firmware */}
        <div className="bg-cyber-900/90 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold uppercase tracking-wider">Platform</span>
            <Cpu className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-lg font-bold text-white">{specs.osVersion}</p>
          <div className="text-[11px] text-slate-400 space-y-0.5">
            <p>API Level: <span className="text-white font-mono">{specs.apiLevel}</span></p>
            <p>Patch Level: <span className="text-white font-mono">{specs.securityPatchLevel}</span></p>
          </div>
        </div>

        {/* Security & Integrity */}
        <div className="bg-cyber-900/90 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold uppercase tracking-wider">Integrity</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-sm">
            <CheckCircle2 className="w-4 h-4" />
            <span>Device Admin Enrolled</span>
          </div>
          <div className="text-[11px] text-slate-400 space-y-0.5">
            <p>Root Compromise: <span className="text-emerald-400 font-semibold">{specs.rootDetected ? 'DETECTED' : 'CLEAN'}</span></p>
            <p>Lock Policy: <span className="text-cyan-300 font-mono">ENFORCED</span></p>
          </div>
        </div>

        {/* Battery Telemetry */}
        <div className="bg-cyber-900/90 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold uppercase tracking-wider">Power Subsystem</span>
            {battery.isCharging ? (
              <BatteryCharging className="w-4 h-4 text-emerald-400 animate-pulse" />
            ) : (
              <Battery className="w-4 h-4 text-cyan-400" />
            )}
          </div>
          <p className="text-lg font-bold text-white">{battery.level}% Charge</p>
          <div className="text-[11px] text-slate-400 space-y-0.5">
            <p>Temperature: <span className="text-white font-mono">{battery.temperature}°C</span></p>
            <p>Health: <span className="text-emerald-400 font-semibold">{battery.health}</span></p>
          </div>
        </div>

        {/* Storage */}
        <div className="bg-cyber-900/90 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold uppercase tracking-wider">Storage Memory</span>
            <HardDrive className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-lg font-bold text-white">{specs.storageAvailableGb} GB Free</p>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
            <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${storageUsedPercent}%` }} />
          </div>
          <p className="text-[10px] text-slate-400 text-right">{storageUsedPercent}% used of {specs.storageTotalGb} GB</p>
        </div>

      </div>

      {/* Lower Details: Connectivity & Security Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Network & Radios */}
        <div className="bg-cyber-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Wifi className="w-4 h-4 text-cyan-400" />
              Network & Transceivers
            </h3>
            <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
              {network.type}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Wi-Fi Access Point (SSID)</span>
              <span className="font-semibold text-white">{network.ssid || 'Not connected to Wi-Fi'}</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Cellular Carrier</span>
              <span className="font-semibold text-white">{network.carrier || 'T-Mobile 5G Standalone'}</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Local IP Interface</span>
              <span className="font-mono text-cyan-300">{network.ipAddress || '192.168.1.188'}</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-slate-400">Encrypted VPN Tunnel</span>
              <span className={`font-semibold ${network.isVpnActive ? 'text-emerald-400' : 'text-slate-400'}`}>
                {network.isVpnActive ? 'ACTIVE (WireGuard/IPsec)' : 'INACTIVE'}
              </span>
            </div>
          </div>
        </div>

        {/* Location & GPS Fix Card */}
        <div className="bg-cyber-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cyan-400" />
              Location & Spatial Sensor
            </h3>
            <button
              onClick={() => onNavigate('location')}
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>View Map</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Physical Address</span>
              <span className="font-medium text-white truncate max-w-[240px]">{location.address || 'San Francisco, CA'}</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Latitude / Longitude</span>
              <span className="font-mono text-cyan-300">{location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">GPS Accuracy Radius</span>
              <span className="font-semibold text-emerald-400">±{location.accuracy} meters</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-slate-400">Last Telemetry Timestamp</span>
              <span className="text-slate-300">{new Date(location.timestamp).toLocaleString()}</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
