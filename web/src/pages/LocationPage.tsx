import React, { useState } from 'react';
import { useDevices } from '../context/DeviceContext';
import { InteractiveMap } from '../components/location/InteractiveMap';
import { 
  MapPin, 
  Radio, 
  Navigation, 
  Compass, 
  Clock, 
  Smartphone,
  Wifi,
  WifiOff,
  History,
  RefreshCw
} from 'lucide-react';

interface Props {
  onNavigate: (page: string) => void;
}

export const LocationPage: React.FC<Props> = ({ onNavigate }) => {
  const { selectedDevice, requestLocation } = useDevices();
  const [polling, setPolling] = useState(false);

  if (!selectedDevice) {
    return (
      <div className="cyber-card p-12 text-center text-slate-500 space-y-3">
        <Smartphone className="w-10 h-10 text-slate-400 mx-auto" />
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">No device selected</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">Please select an Android device to monitor location telemetry.</p>
        <button
          onClick={() => onNavigate('devices')}
          className="cyber-btn-primary text-xs"
        >
          View Devices
        </button>
      </div>
    );
  }

  const handlePollLocation = async () => {
    setPolling(true);
    await requestLocation(selectedDevice.deviceId);
    setTimeout(() => setPolling(false), 1200);
  };

  const { location, locationHistory = [] } = selectedDevice;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
              Device: {selectedDevice.deviceName}
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Device Location
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Last updated {new Date(location.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Real-Time GPS Tracking
          </p>
        </div>

        <button
          onClick={handlePollLocation}
          disabled={polling}
          className="cyber-btn-primary text-xs"
        >
          <Radio className={`w-3.5 h-3.5 ${polling ? 'animate-spin' : ''}`} />
          <span>{polling ? 'Querying GPS...' : 'Update Location'}</span>
        </button>
      </div>

      {/* Main Map & Location Telemetry Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Large Clean Map (2 cols) */}
        <div className="lg:col-span-2 cyber-card p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/[0.06]">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
              <Compass className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Interactive Map View</span>
            </div>
            
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] ${
                selectedDevice.status === 'online' 
                  ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
              }`}>
                {selectedDevice.status === 'online' ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3 text-slate-400" />}
                {selectedDevice.status.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Leaflet Container */}
          <div className="h-[420px] w-full rounded-xl overflow-hidden">
            <InteractiveMap 
              location={location} 
              deviceName={selectedDevice.deviceName}
              history={locationHistory}
              zoom={15}
            />
          </div>

          {/* Map Footer Metadata */}
          <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
            <div className="font-mono font-medium text-slate-800 dark:text-slate-200">
              {location.latitude.toFixed(6)}° N, {location.longitude.toFixed(6)}° E
            </div>
            <div className="flex items-center gap-4">
              <span>Accuracy ±{location.accuracy} m</span>
              <span>Altitude {location.altitude ? `${location.altitude.toFixed(0)}m` : 'Sea Level'}</span>
            </div>
          </div>
        </div>

        {/* Spatial Information & Coordinates Card (1 col) */}
        <div className="space-y-4">
          
          <div className="cyber-card p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Coordinates & Address</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/[0.06] space-y-1">
                <span className="text-[11px] text-slate-400 block">Resolved Street Address</span>
                <p className="font-medium text-slate-800 dark:text-slate-200 leading-snug">
                  {location.address || 'Street address lookup active...'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/[0.06]">
                  <span className="text-[10px] text-slate-400 block">Latitude</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200 font-medium">{location.latitude.toFixed(6)}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/[0.06]">
                  <span className="text-[10px] text-slate-400 block">Longitude</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200 font-medium">{location.longitude.toFixed(6)}</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/[0.06] flex items-center justify-between">
                <span className="text-slate-400">GPS Accuracy</span>
                <span className="font-medium text-emerald-600 dark:text-emerald-400">±{location.accuracy} meters</span>
              </div>
            </div>
          </div>

          {/* Location Breadcrumb History */}
          <div className="cyber-card p-5 space-y-3">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <History className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Recent Fixes</span>
            </h3>

            <div className="space-y-2 text-xs">
              {locationHistory.slice(0, 3).map((h, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/[0.04] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span className="font-mono text-slate-700 dark:text-slate-300">
                      {h.latitude.toFixed(3)}°, {h.longitude.toFixed(3)}°
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
