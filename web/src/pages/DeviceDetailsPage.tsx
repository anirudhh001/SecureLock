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
  CheckCircle2, 
  ArrowRight
} from 'lucide-react';

interface Props {
  onNavigate: (page: string) => void;
}

export const DeviceDetailsPage: React.FC<Props> = ({ onNavigate }) => {
  const { selectedDevice } = useDevices();

  if (!selectedDevice) {
    return (
      <div className="cyber-card p-12 text-center text-slate-400 space-y-3">
        <Smartphone className="w-12 h-12 text-slate-600 mx-auto" />
        <h3 className="text-base font-bold text-white">No device selected</h3>
        <p className="text-xs text-slate-400">Please select a registered device to inspect hardware telemetry.</p>
        <button
          onClick={() => onNavigate('devices')}
          className="cyber-btn-primary text-xs"
        >
          View Devices
        </button>
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
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {selectedDevice.deviceName}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Cryptographic hardware profile and low-level Android sensor telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('controls')}
            className="cyber-btn-primary text-xs"
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Remote Controls</span>
          </button>

          <button
            onClick={() => onNavigate('lost-mode')}
            className="cyber-btn-secondary text-xs"
          >
            <Lock className="w-3.5 h-3.5 text-rose-400" />
            <span>Lost Mode</span>
          </button>
        </div>
      </div>

      {/* 4 Telemetry Spec Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* OS & Firmware */}
        <div className="cyber-card p-4 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Platform</span>
            <Cpu className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-base font-bold text-white">{specs.osVersion}</p>
          <div className="text-[11px] text-slate-400 space-y-0.5 pt-1">
            <p>API Level: <span className="text-slate-200 font-mono">{specs.apiLevel}</span></p>
            <p>Patch Level: <span className="text-slate-200 font-mono">{specs.securityPatchLevel}</span></p>
          </div>
        </div>

        {/* Security & Integrity */}
        <div className="cyber-card p-4 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Integrity</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-sm">
            <CheckCircle2 className="w-4 h-4" />
            <span>Device Admin Enrolled</span>
          </div>
          <div className="text-[11px] text-slate-400 space-y-0.5 pt-1">
            <p>Root Check: <span className="text-emerald-400 font-medium">Not Rooted</span></p>
            <p>SELinux: <span className="text-emerald-400 font-medium">Enforcing</span></p>
          </div>
        </div>

        {/* Battery & Health */}
        <div className="cyber-card p-4 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Battery & Power</span>
            {battery.isCharging ? (
              <BatteryCharging className="w-4 h-4 text-emerald-400 animate-pulse" />
            ) : (
              <Battery className="w-4 h-4 text-blue-400" />
            )}
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-white">{battery.level}%</span>
            <span className="text-xs text-slate-400">{battery.isCharging ? 'Charging' : 'Discharging'}</span>
          </div>
          <div className="text-[11px] text-slate-400 space-y-0.5 pt-1">
            <p>Temp: <span className="text-slate-200 font-mono">{battery.temperature}°C</span></p>
            <p>Health: <span className="text-emerald-400 font-medium">{battery.health}</span></p>
          </div>
        </div>

        {/* Storage Telemetry */}
        <div className="cyber-card p-4 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Internal Storage</span>
            <HardDrive className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-white">{specs.storageAvailableGb} GB</span>
            <span className="text-xs text-slate-400">free of {specs.storageTotalGb} GB</span>
          </div>
          <div className="w-full bg-[#0B1120] rounded-full h-1.5 overflow-hidden border border-white/[0.06] mt-2">
            <div className="bg-blue-500 h-full rounded-full" style={{ width: `${storageUsedPercent}%` }} />
          </div>
        </div>

      </div>

      {/* Detailed Diagnostic Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Device Hardware & Identifiers */}
        <div className="cyber-card p-5 space-y-4">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-white/[0.08]">
            <Smartphone className="w-4 h-4 text-blue-400" />
            Hardware & Identity Specifications
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-white/[0.04]">
              <span className="text-slate-400">Manufacturer</span>
              <span className="font-semibold text-white">{specs.manufacturer}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-white/[0.04]">
              <span className="text-slate-400">Model Name</span>
              <span className="font-semibold text-white">{specs.model}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-white/[0.04]">
              <span className="text-slate-400">Device Hardware Model</span>
              <span className="font-mono text-slate-200">{specs.model}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-white/[0.04]">
              <span className="text-slate-400">Android Security Patch</span>
              <span className="font-mono text-slate-200">{specs.securityPatchLevel}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-white/[0.04]">
              <span className="text-slate-400">Unique Device UUID</span>
              <span className="font-mono text-blue-400">{selectedDevice.deviceId}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-400">Bound Owner UID</span>
              <span className="font-mono text-emerald-400">{selectedDevice.ownerId}</span>
            </div>
          </div>
        </div>

        {/* Network & Spatial Diagnostic */}
        <div className="cyber-card p-5 space-y-4">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-white/[0.08]">
            <Wifi className="w-4 h-4 text-blue-400" />
            Network & Connectivity Subsystems
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-white/[0.04]">
              <span className="text-slate-400">Bearer Protocol</span>
              <span className="font-semibold text-white">{network.type}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-white/[0.04]">
              <span className="text-slate-400">Carrier / SSID</span>
              <span className="font-mono text-slate-200">{network.ssid || network.carrier || 'Direct TLS Radio'}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-white/[0.04]">
              <span className="text-slate-400">Local Radio IP</span>
              <span className="font-mono text-blue-400">{network.ipAddress || '192.168.1.142'}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-white/[0.04]">
              <span className="text-slate-400">Current Fix Address</span>
              <span className="font-medium text-slate-200 truncate max-w-xs">{location.address || 'Resolving Street Address...'}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-white/[0.04]">
              <span className="text-slate-400">GPS Coordinates</span>
              <span className="font-mono text-slate-200">{location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-400">Horizontal Fix Accuracy</span>
              <span className="font-semibold text-emerald-400">±{location.accuracy} meters</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
