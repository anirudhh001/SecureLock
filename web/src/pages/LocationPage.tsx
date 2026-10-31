import React, { useState } from 'react';
import { useDevices } from '../context/DeviceContext';
import { useAuth } from '../context/AuthContext';
import { isFirebaseConfigured } from '../firebase/config';
import { InteractiveMap } from '../components/location/InteractiveMap';
import { JAMMU_AREAS, type JammuArea } from '../data/jammuAreas';
import { 
  MapPin, 
  Radio, 
  Navigation, 
  Compass, 
  Smartphone,
  Wifi,
  WifiOff,
  History,
  Building2,
  Landmark,
  Plane,
  GraduationCap,
  Train,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  LocateFixed
} from 'lucide-react';

interface Props {
  onNavigate: (page: string) => void;
}

export const LocationPage: React.FC<Props> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { selectedDevice, requestLocation, setDeviceLocation } = useDevices();
  const [polling, setPolling] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const isDemoMode = !isFirebaseConfigured || Boolean(user?.isDemoUser);

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

  const handleSelectJammuArea = (area: JammuArea) => {
    setDeviceLocation(selectedDevice.deviceId, {
      latitude: area.latitude,
      longitude: area.longitude,
      address: `${area.address}, India`,
      accuracy: 4.8,
    });
  };

  const { location, locationHistory = [] } = selectedDevice;

  // Identify if currently tracked location matches one of the known Jammu areas
  const currentJammuArea = JAMMU_AREAS.find(
    (a) => Math.abs(a.latitude - location.latitude) < 0.003 && Math.abs(a.longitude - location.longitude) < 0.003
  );

  const categories = ['All', 'Commercial', 'Heritage', 'Residential', 'Transit', 'Academic', 'Administrative'];

  const filteredAreas = activeCategory === 'All' 
    ? JAMMU_AREAS 
    : JAMMU_AREAS.filter((a) => a.category === activeCategory);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Commercial': return <Building2 className="w-3.5 h-3.5 text-blue-500" />;
      case 'Heritage': return <Landmark className="w-3.5 h-3.5 text-amber-500" />;
      case 'Transit': return <Plane className="w-3.5 h-3.5 text-cyan-500" />;
      case 'Academic': return <GraduationCap className="w-3.5 h-3.5 text-emerald-500" />;
      default: return <MapPin className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
              Device: {selectedDevice.deviceName}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              Jammu Division, J&K
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Device Location — Jammu Defense Sector
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Last updated {new Date(location.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {isDemoMode ? 'Demonstration Mode (Simulated Telemetry across Jammu)' : 'Real-Time Hardware GPS Tracking'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePollLocation}
            disabled={polling}
            className="cyber-btn-primary text-xs"
          >
            <Radio className={`w-3.5 h-3.5 ${polling ? 'animate-spin' : ''}`} />
            <span>{polling ? 'Querying GPS...' : 'Poll Location'}</span>
          </button>
        </div>
      </div>

      {/* Demonstration Mode Cybersecurity Notice */}
      {isDemoMode && (
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-3">
          <span className="p-1 rounded-md bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold shrink-0 text-[10px]">
            DEMO
          </span>
          <div className="space-y-0.5">
            <span className="font-semibold block">Jammu Telemetry Simulation Mode Active</span>
            <p className="text-[11px] text-amber-700/90 dark:text-amber-300/80 leading-relaxed">
              Interactive map is centered on <strong>Jammu, Jammu & Kashmir</strong>. You can click on any Jammu sector badge on the map or use the quick selector below to simulate device tracking across different areas of Jammu (Gandhi Nagar, Bahu Fort, Trikuta Nagar, Old City, Satwari Airport, etc.).
            </p>
          </div>
        </div>
      )}

      {/* Main Map & Location Telemetry Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Large Clean Map (2 cols) */}
        <div className="lg:col-span-2 cyber-card p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/[0.06]">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
              <Compass className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Jammu Interactive Map View (OpenStreetMap)</span>
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

          {/* Leaflet Container with Jammu Area Markers */}
          <div className="h-[430px] w-full rounded-xl overflow-hidden">
            <InteractiveMap 
              location={location} 
              deviceName={selectedDevice.deviceName}
              history={locationHistory}
              zoom={14}
              isDemo={isDemoMode}
              showJammuAreas={true}
              onSelectArea={handleSelectJammuArea}
            />
          </div>

          {/* Map Footer Metadata */}
          <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1 gap-2">
            <div className="flex items-center gap-2 font-mono font-medium text-slate-800 dark:text-slate-200">
              <span>{location.latitude.toFixed(6)}° N, {location.longitude.toFixed(6)}° E</span>
              {currentJammuArea && (
                <span className="px-2 py-0.5 rounded text-[10px] font-sans font-semibold bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20">
                  📍 {currentJammuArea.name}
                </span>
              )}
              {isDemoMode && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-sans bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                  Simulated Fix
                </span>
              )}
            </div>
            <div className="flex items-center gap-4">
              <span>Accuracy ±{location.accuracy} m</span>
              <span>Altitude {location.altitude ? `${location.altitude.toFixed(0)}m` : '327m MSL'}</span>
            </div>
          </div>
        </div>

        {/* Spatial Information & Coordinates Card (1 col) */}
        <div className="space-y-4">
          
          {/* Active Sector Summary */}
          <div className="cyber-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Sector Telemetry</span>
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                Jammu, India
              </span>
            </div>

            <div className="space-y-3 text-xs">
              {/* Highlight active Jammu area */}
              {currentJammuArea ? (
                <div className="p-3 rounded-lg bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-800/40 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-blue-600 dark:text-blue-400">
                      Active Jammu Sector
                    </span>
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-blue-200/50 dark:bg-blue-800/50 text-blue-800 dark:text-blue-200">
                      PIN {currentJammuArea.pincode}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {currentJammuArea.name}
                  </p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">
                    {currentJammuArea.landmark}
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                    {currentJammuArea.description}
                  </p>
                </div>
              ) : null}

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/[0.06] space-y-1">
                <span className="text-[11px] text-slate-400 block">Resolved Street Address</span>
                <p className="font-medium text-slate-800 dark:text-slate-200 leading-snug">
                  {location.address || 'Gandhi Nagar, Jammu, Jammu & Kashmir 180004, India'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/[0.06]">
                  <span className="text-[10px] text-slate-400 block">Latitude</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200 font-medium">{location.latitude.toFixed(6)}°</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/[0.06]">
                  <span className="text-[10px] text-slate-400 block">Longitude</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200 font-medium">{location.longitude.toFixed(6)}°</span>
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
              <span>Recent Jammu Fixes</span>
            </h3>

            <div className="space-y-2 text-xs">
              {locationHistory.slice(0, 3).map((h, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/[0.04] flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                    <span className="font-mono text-slate-700 dark:text-slate-300 truncate">
                      {h.address ? h.address.split(',')[0] : `${h.latitude.toFixed(3)}°, ${h.longitude.toFixed(3)}°`}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono shrink-0 ml-2">
                    {new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Different Areas of Jammu Selector Section */}
      <div className="cyber-card p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <LocateFixed className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Different Areas of Jammu — Teleport & Simulation Directory</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select any major area across Jammu to reposition the monitored handset and test geospatial perimeter defenses.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                  activeCategory === cat
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-white/[0.04] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/[0.08]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Areas Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 pt-2">
          {filteredAreas.map((area) => {
            const isSelected = 
              Math.abs(area.latitude - location.latitude) < 0.002 &&
              Math.abs(area.longitude - location.longitude) < 0.002;

            return (
              <button
                key={area.id}
                onClick={() => handleSelectJammuArea(area)}
                className={`p-3 rounded-xl border text-left transition-all group flex flex-col justify-between ${
                  isSelected
                    ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-500 shadow-xs ring-1 ring-blue-500'
                    : 'bg-white dark:bg-[#121926] border-slate-200 dark:border-white/[0.06] hover:border-blue-400 dark:hover:border-blue-500/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <div className="flex items-center gap-1.5">
                      {getCategoryIcon(area.category)}
                      <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                        {area.category}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">
                      PIN {area.pincode}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {area.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                    {area.landmark}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[10px] pt-3 mt-2 border-t border-slate-100 dark:border-white/[0.04]">
                  <span className="font-mono text-slate-400">
                    {area.latitude.toFixed(3)}°N, {area.longitude.toFixed(3)}°E
                  </span>
                  <span className={`inline-flex items-center gap-1 font-semibold ${
                    isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 group-hover:text-blue-600'
                  }`}>
                    {isSelected ? 'Active Fix' : 'Move Here'}
                    <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};
