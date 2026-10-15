import React, { useState } from 'react';
import { useDevices } from '../context/DeviceContext';
import { InteractiveMap } from '../components/location/InteractiveMap';
import { 
  MapPin, 
  Radio, 
  Navigation, 
  RefreshCw, 
  Compass, 
  Clock, 
  ShieldCheck, 
  History,
  Layers
} from 'lucide-react';

interface Props {
  onNavigate: (page: string) => void;
}

export const LocationPage: React.FC<Props> = ({ onNavigate }) => {
  const { selectedDevice, requestLocation } = useDevices();
  const [polling, setPolling] = useState(false);

  if (!selectedDevice) {
    return (
      <div className="p-8 text-center text-slate-400">
        Please select a device to monitor location telemetry.
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
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>SPATIAL LOCATION TRACKING</span>
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Target: <strong className="text-white">{selectedDevice.deviceName}</strong> ({selectedDevice.deviceId})
          </p>
        </div>

        <button
          onClick={handlePollLocation}
          disabled={polling}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-950/50 flex items-center gap-2 transition-all disabled:opacity-50"
        >
          <Radio className={`w-4 h-4 ${polling ? 'animate-spin' : 'animate-pulse'}`} />
          <span>{polling ? 'Querying Fused GPS...' : 'Request Real-Time Location'}</span>
        </button>
      </div>

      {/* Main Map & Spatial Telemetry Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Map View Container */}
        <div className="lg:col-span-2 bg-cyber-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <Compass className="w-4 h-4 text-cyan-400" />
              <span>Live OpenStreetMap Satellite & Street Vector View</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
              <span>Zoom: City Level</span>
            </div>
          </div>

          <div className="h-[460px] w-full rounded-xl overflow-hidden border border-slate-800">
            <InteractiveMap
              location={location}
              deviceName={selectedDevice.deviceName}
              history={locationHistory}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 px-1 pt-1">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Android FusedLocationProviderApi (GPS + Wi-Fi Triangulation)
            </span>
            <span className="font-mono">
              Fix Timestamp: {new Date(location.timestamp).toLocaleTimeString()}
            </span>
          </div>
        </div>

        {/* Spatial Telemetry & Breadcrumbs Sidebar */}
        <div className="space-y-6">
          
          {/* Active Coordinate Card */}
          <div className="bg-cyber-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Navigation className="w-4 h-4 text-cyan-400" />
              Spatial Telemetry
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Street Address</span>
                <p className="text-white font-medium leading-relaxed">
                  {location.address || 'San Francisco, CA, United States'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-0.5">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Latitude</span>
                  <p className="font-mono text-cyan-300 font-bold">{location.latitude.toFixed(6)}</p>
                </div>
                <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-0.5">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Longitude</span>
                  <p className="font-mono text-cyan-300 font-bold">{location.longitude.toFixed(6)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-0.5">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Accuracy</span>
                  <p className="font-semibold text-emerald-400">±{location.accuracy}m</p>
                </div>
                <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-0.5">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Speed</span>
                  <p className="font-medium text-slate-200">{location.speed ? `${location.speed} km/h` : 'Stationary'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Breadcrumb Location Trail */}
          <div className="bg-cyber-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <History className="w-4 h-4 text-cyan-400" />
              Recent Location Breadcrumbs
            </h3>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {locationHistory.length > 0 ? (
                locationHistory.map((item, idx) => (
                  <div 
                    key={idx}
                    className="p-2.5 bg-slate-950/60 border border-slate-800/80 rounded-xl text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-cyan-400" />
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
