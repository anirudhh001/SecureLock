import React from 'react';
import { useDevices } from '../context/DeviceContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { 
  Smartphone, 
  Cpu, 
  Battery, 
  BatteryCharging, 
  Wifi, 
  HardDrive, 
  Radio, 
  Lock, 
  MapPin, 
  ArrowRight
} from 'lucide-react';

interface Props {
  onNavigate: (page: string) => void;
}

export const DeviceDetailsPage: React.FC<Props> = ({ onNavigate }) => {
  const { selectedDevice } = useDevices();

  if (!selectedDevice) {
    return (
      <div className="cyber-card p-12 text-center text-slate-500 space-y-3">
        <Smartphone className="w-10 h-10 text-slate-400 mx-auto" />
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">No device selected</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">Please select a registered device to inspect hardware telemetry.</p>
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
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <StatusBadge status={selectedDevice.status} />
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">ID: {selectedDevice.deviceId}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {selectedDevice.deviceName}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Hardware telemetry, system sensors, and cryptographic connection profile.
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
        </div>
      </div>

      {/* Hardware Telemetry Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        
        {/* Specs */}
        <div className="cyber-card p-5 space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>System Architecture</span>
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Android OS:</span>
              <span className="font-medium text-slate-900 dark:text-white">v{specs.osVersion} (API {specs.apiLevel})</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Manufacturer:</span>
              <span className="font-medium text-slate-900 dark:text-white">{specs.manufacturer}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Security Patch:</span>
              <span className="font-medium text-slate-900 dark:text-white">{specs.securityPatchLevel}</span>
            </div>
          </div>
        </div>

        {/* Battery Health */}
        <div className="cyber-card p-5 space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-2">
            <Battery className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Power & Battery</span>
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Charge Level:</span>
              <span className="font-medium text-slate-900 dark:text-white flex items-center gap-1">
                {battery.isCharging ? <BatteryCharging className="w-3.5 h-3.5 text-emerald-500" /> : null}
                {battery.level}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Battery Health:</span>
              <span className="font-medium text-emerald-600 dark:text-emerald-400">{battery.health || 'GOOD'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Temperature:</span>
              <span className="font-medium text-slate-900 dark:text-white">{battery.temperature || 31}°C</span>
            </div>
          </div>
        </div>

        {/* Network & Connectivity */}
        <div className="cyber-card p-5 space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-2">
            <Wifi className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Network Interface</span>
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Connection:</span>
              <span className="font-medium text-slate-900 dark:text-white">{network.type}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Carrier:</span>
              <span className="font-medium text-slate-900 dark:text-white">{network.carrier || 'Cellular LTE'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">WiFi SSID:</span>
              <span className="font-mono text-slate-900 dark:text-white">{network.ssid || 'Cellular Only'}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Storage and Location Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="cyber-card p-5 space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Device Storage</span>
          </h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">{specs.storageAvailableGb} GB free of {specs.storageTotalGb} GB</span>
              <span className="font-semibold text-slate-900 dark:text-white">{storageUsedPercent}% used</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${storageUsedPercent}%` }} />
            </div>
          </div>
        </div>

        <div className="cyber-card p-5 space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Geospatial Position</span>
          </h3>
          <div className="flex items-center justify-between text-xs pt-1">
            <div className="space-y-0.5">
              <p className="font-mono font-medium text-slate-900 dark:text-white">
                {location.latitude.toFixed(6)}°, {location.longitude.toFixed(6)}°
              </p>
              <p className="text-[11px] text-slate-500">Accuracy: ±{location.accuracy}m</p>
            </div>
            <button
              onClick={() => onNavigate('location')}
              className="cyber-btn-secondary text-xs flex items-center gap-1"
            >
              <span>Map</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
