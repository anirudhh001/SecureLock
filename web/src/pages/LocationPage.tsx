import React, { useState } from 'react';
import { useDevices } from '../context/DeviceContext';
import { InteractiveMap } from '../components/location/InteractiveMap';
import { 
  MapPin, 
  Radio, 
  Navigation, 
  Compass, 
  Clock, 
  ShieldCheck, 
  History,
  Smartphone,
  Wifi,
  WifiOff
} from 'lucide-react';

interface Props {
  onNavigate: (page: string) => void;
}

export const LocationPage: React.FC<Props> = ({ onNavigate }) => {
  const { selectedDevice, requestLocation } = useDevices();
  const [polling, setPolling] = useState(false);

  if (!selectedDevice) {
    return (
      <div className="cyber-card p-12 text-center text-slate-400 space-y-3">
        <Smartphone className="w-12 h-12 text-slate-600 mx-auto" />
        <h3 className="text-base font-bold text-white">No device selected</h3>
        <p className="text-xs text-slate-400">Please select an Android device to monitor location telemetry.</p>
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
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/10 border border-blue-500/30 text-blue-300">
              GEOSPATIAL DEFENSE TELEMETRY
            </span>
            <span className="text-xs font-mono text-slate-400">Target: {selectedDevice.deviceName}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Device Location
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Last updated {new Date(location.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • FusedLocationProviderApi
          </p>
        </div>

        <button
          onClick={handlePollLocation}
          disabled={polling}
          className="cyber-btn-primary text-xs"
        >
          <Radio className={`w-4 h-4 ${polling ? 'animate-spin' : 'animate-pulse'}`} />
          <span>{polling ? 'Querying GPS Provider...' : 'Request Real-Time Location'}</span>
        </button>
      </div>

      {/* Main Map & Spatial Telemetry Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Map View Container */}
        <div className="lg:col-span-2 cyber-card p-4 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
              <Compass className="w-4 h-4 text-blue-400" />
              <span>Live Vector Satellite & Street Map</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] ${
                selectedDevice.status === 'online' 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                  : 'bg-slate-800 text-slate-400'
              }`}>
                {selectedDevice.status === 'online' ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                {selectedDevice.status.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Clean Map Container with rounded corners */}
          <div className="h-[460px] w-full rounded-xl overflow-hidden border border-white/[0.08]">
            <InteractiveMap
              location={location}
              deviceName={selectedDevice.deviceName}
              history={locationHistory}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 px-1 pt-1">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Fused Location Provider (GPS + Cellular + Wi-Fi Triangulation)
            </span>
            <span className="font-mono">
              Fix Timestamp: {new Date(location.timestamp).toLocaleTimeString()}
            </span>
          </div>
        </div>

        {/* Spatial Telemetry & Breadcrumbs Sidebar */}
        <div className="space-y-6">
          
          {/* Active Coordinate Card */}
          <div className="cyber-card p-5 space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Navigation className="w-4 h-4 text-blue-400" />
              Spatial Telemetry
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-[#1A2537] border border-white/[0.06] rounded-xl space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Street Address</span>
                <p className="text-white font-medium leading-relaxed">
                  {location.address || 'Resolving physical street address...'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-[#1A2537] border border-white/[0.06] rounded-xl space-y-0.5">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Latitude</span>
                  <p className="font-mono text-blue-300 font-bold">{location.latitude.toFixed(6)}</p>
                </div>
                <div className="p-3 bg-[#1A2537] border border-white/[0.06] rounded-xl space-y-0.5">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Longitude</span>
                  <p className="font-mono text-blue-300 font-bold">{location.longitude.toFixed(6)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-[#1A2537] border border-white/[0.06] rounded-xl space-y-0.5">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Accuracy</span>
                  <p className="font-semibold text-emerald-400">±{location.accuracy}m</p>
                </div>
                <div className="p-3 bg-[#1A2537] border border-white/[0.06] rounded-xl space-y-0.5">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Speed</span>
                  <p className="font-medium text-slate-200">{location.speed ? `${location.speed} km/h` : 'Stationary'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Breadcrumb Location Trail */}
          <div className="cyber-card p-5 space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <History className="w-4 h-4 text-blue-400" />
              Recent Location Breadcrumbs
            </h3>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {locationHistory.length > 0 ? (
                locationHistory.map((item, idx) => (
                  <div 
                    key={idx}
                    className="p-2.5 bg-[#1A2537] border border-white/[0.06] rounded-xl text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-blue-400" />
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                      <span className="text-emerald-400 font-mono">±{item.accuracy}m</span>
                    </div>
                    <p className="text-slate-200 text-[11px] truncate">
                      {item.address || `${item.latitude.toFixed(4)}, ${item.longitude.toFixed(4)}`}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-500 italic p-3 text-center">
                  Zero previous breadcrumbs. Click "Request Real-Time Location" to record points.
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
