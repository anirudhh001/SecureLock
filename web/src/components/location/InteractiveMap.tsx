import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { DeviceLocation } from '../../types/device';
import { useTheme } from '../../context/ThemeContext';
import { Navigation, ShieldAlert, CheckCircle2, MapPin, Eye, EyeOff } from 'lucide-react';
import { JAMMU_AREAS, type JammuArea } from '../../data/jammuAreas';

interface Props {
  location: DeviceLocation;
  deviceName: string;
  history?: DeviceLocation[];
  zoom?: number;
  isDemo?: boolean;
  className?: string;
  showJammuAreas?: boolean;
  onSelectArea?: (area: JammuArea) => void;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export const InteractiveMap: React.FC<Props> = ({ 
  location, 
  deviceName, 
  history = [], 
  zoom = 14,
  isDemo = true,
  className = '',
  showJammuAreas = true,
  onSelectArea,
}) => {
  const { theme } = useTheme();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const circleRef = useRef<L.Circle | null>(null);
  const polylineRef = useRef<L.Polyline | null>(null);
  const jammuLayerRef = useRef<L.LayerGroup | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [areasVisible, setAreasVisible] = useState(showJammuAreas);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Guard against React 18 strict-mode container re-attachment
    if ((mapContainerRef.current as any)._leaflet_id) {
      (mapContainerRef.current as any)._leaflet_id = null;
    }

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [location.latitude, location.longitude],
        zoom: zoom,
        zoomControl: true,
        scrollWheelZoom: true,
        attributionControl: true,
      });

      // Default to official OpenStreetMap tiles (100% Free & Open-Source, zero API key required)
      const tileUrlTemplate = import.meta.env.VITE_MAP_TILE_URL || 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

      const tileLayer = L.tileLayer(tileUrlTemplate, {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors • Jammu, J&K',
        maxZoom: 19,
        crossOrigin: true,
      }).addTo(map);

      tileLayerRef.current = tileLayer;
      jammuLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
      setMapReady(true);

      // Invalidate size once DOM settles
      const timer = setTimeout(() => {
        map.invalidateSize();
      }, 150);

      // Auto-recalculate layout on window or sidebar resize
      const handleResize = () => {
        map.invalidateSize();
      };
      window.addEventListener('resize', handleResize);

      // Attach ResizeObserver to container for responsive updates
      let resizeObserver: ResizeObserver | null = null;
      if (typeof ResizeObserver !== 'undefined' && mapContainerRef.current) {
        resizeObserver = new ResizeObserver(() => {
          map.invalidateSize();
        });
        resizeObserver.observe(mapContainerRef.current);
      }

      return () => {
        clearTimeout(timer);
        window.removeEventListener('resize', handleResize);
        if (resizeObserver) {
          resizeObserver.disconnect();
        }
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
          tileLayerRef.current = null;
          markerRef.current = null;
          circleRef.current = null;
          polylineRef.current = null;
          jammuLayerRef.current = null;
        }
      };
    }
  }, []);

  // Listen for area selection events dispatched from Leaflet popup buttons
  useEffect(() => {
    const handleAreaEvent = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      const areaId = customEvent.detail;
      const targetArea = JAMMU_AREAS.find((a) => a.id === areaId);
      if (targetArea && onSelectArea) {
        onSelectArea(targetArea);
      }
    };

    window.addEventListener('securelock_select_jammu_area', handleAreaEvent);
    return () => {
      window.removeEventListener('securelock_select_jammu_area', handleAreaEvent);
    };
  }, [onSelectArea]);

  // Render Jammu Area Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layer = jammuLayerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();

    if (areasVisible) {
      JAMMU_AREAS.forEach((area) => {
        const isCurrentLocation = 
          Math.abs(area.latitude - location.latitude) < 0.0015 &&
          Math.abs(area.longitude - location.longitude) < 0.0015;

        // Custom styled pill badge for each area of Jammu with extra pulsing dots for Gandhi Nagar
        const isGandhiNagar = Boolean(area.isGandhiNagarDot);

        const areaBadgeIcon = L.divIcon({
          className: 'jammu-area-pill',
          html: `
            <div style="cursor: pointer; display: inline-flex; align-items: center; gap: 5px; background: ${
              isCurrentLocation 
                ? 'rgba(37, 99, 235, 0.95)' 
                : isGandhiNagar 
                  ? 'rgba(15, 23, 42, 0.94)' 
                  : 'rgba(15, 23, 42, 0.88)'
            }; border: ${isGandhiNagar ? '1.5px solid #10B981' : isCurrentLocation ? '1.5px solid #60A5FA' : '1px solid rgba(56, 189, 248, 0.55)'}; backdrop-filter: blur(4px); padding: 3px 8px; border-radius: 9999px; box-shadow: ${isGandhiNagar ? '0 0 10px rgba(16, 185, 129, 0.45)' : '0 3px 8px rgba(0,0,0,0.4)'}; transform: translate(-50%, -50%); transition: all 0.2s ease;">
              <span style="position: relative; width: 8px; height: 8px; display: inline-flex; align-items: center; justify-content: center;">
                ${isGandhiNagar ? `<span style="position: absolute; width: 16px; height: 16px; border-radius: 50%; background: #10B981; opacity: 0.65; animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>` : ''}
                <span style="width: 7px; height: 7px; border-radius: 50%; background: ${
                  isCurrentLocation ? '#FFFFFF' : isGandhiNagar ? '#10B981' : '#38BDF8'
                }; box-shadow: 0 0 6px ${isCurrentLocation ? '#FFFFFF' : isGandhiNagar ? '#10B981' : '#38BDF8'};"></span>
              </span>
              <span style="font-family: 'Inter', system-ui, sans-serif; font-size: 10px; font-weight: 600; color: #FFFFFF; white-space: nowrap; letter-spacing: -0.01em;">
                ${isGandhiNagar ? `🟢 ` : ''}${area.name}
              </span>
            </div>
          `,
          iconSize: [0, 0],
          iconAnchor: [0, 0],
        });

        const areaMarker = L.marker([area.latitude, area.longitude], {
          icon: areaBadgeIcon,
          title: `${area.name} — Jammu Sector`,
        });

        const areaPopupHtml = `
          <div style="font-family: 'Inter', system-ui, -apple-system, sans-serif; font-size: 12px; line-height: 1.45; min-width: 220px; color: #0F172A; padding: 2px;">
            <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #E2E8F0; padding-bottom: 4px; margin-bottom: 6px;">
              <span style="font-weight: 700; color: #0284C7; font-size: 13px;">📍 ${escapeHtml(area.name)}</span>
              <span style="font-size: 9px; font-weight: 600; padding: 1px 5px; border-radius: 4px; background: #E0F2FE; color: #0369A1; text-transform: uppercase;">${area.category}</span>
            </div>
            
            <div style="font-size: 11px; color: #475569; margin-bottom: 4px;">
              <b>Landmark:</b> ${escapeHtml(area.landmark)}
            </div>

            <div style="font-size: 10.5px; color: #64748B; margin-bottom: 6px; line-height: 1.35;">
              ${escapeHtml(area.description)}
            </div>

            <div style="display: grid; grid-template-columns: auto 1fr; gap: 2px 6px; font-size: 10.5px; margin-bottom: 8px;">
              <span style="color: #64748B;">Postal PIN:</span>
              <span style="font-weight: 600;">${area.pincode}</span>
              <span style="color: #64748B;">Coordinates:</span>
              <span style="font-family: monospace;">${area.latitude.toFixed(4)}° N, ${area.longitude.toFixed(4)}° E</span>
            </div>

            <button 
              onclick="window.dispatchEvent(new CustomEvent('securelock_select_jammu_area', { detail: '${area.id}' }))"
              style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 4px; background: #2563EB; color: #FFFFFF; font-weight: 600; font-size: 11px; padding: 6px 10px; border-radius: 6px; border: none; cursor: pointer; transition: background 0.15s;"
            >
              🎯 Move Device to ${escapeHtml(area.name)}
            </button>
          </div>
        `;

        areaMarker.bindPopup(areaPopupHtml);
        layer.addLayer(areaMarker);
      });
    }
  }, [areasVisible, location.latitude, location.longitude]);

  // Recenter map action handler
  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([location.latitude, location.longitude], zoom, { animate: true });
      if (markerRef.current) {
        markerRef.current.openPopup();
      }
    }
  };

  // Zoom to show all of Jammu
  const handleFitJammu = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([32.7266, 74.8700], 12.5, { animate: true });
    }
  };

  // Zoom into Gandhi Nagar with extra dots
  const handleFocusGandhiNagar = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([32.7065, 74.8652], 15.5, { animate: true });
    }
  };

  // Update coordinates & markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Pan smoothly to updated location
    map.panTo([location.latitude, location.longitude], { animate: true, duration: 0.6 });

    // Custom High-Precision Radar Marker
    const customIcon = L.divIcon({
      className: 'custom-radar-pin',
      html: `
        <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
          <div style="position: absolute; width: 34px; height: 34px; border-radius: 50%; background: ${isDemo ? 'rgba(245, 158, 11, 0.25)' : 'rgba(37, 99, 235, 0.25)'}; border: 1.5px solid ${isDemo ? 'rgba(245, 158, 11, 0.7)' : 'rgba(37, 99, 235, 0.7)'}; animation: ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="position: relative; width: 15px; height: 15px; border-radius: 50%; background: ${isDemo ? '#F59E0B' : '#2563EB'}; border: 2.5px solid #FFFFFF; box-shadow: 0 2px 6px rgba(0, 0, 0, 0.35);"></div>
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 17],
      popupAnchor: [0, -18],
    });

    if (markerRef.current) {
      markerRef.current.setLatLng([location.latitude, location.longitude]);
      markerRef.current.setIcon(customIcon);
    } else {
      markerRef.current = L.marker([location.latitude, location.longitude], { 
        icon: customIcon,
        title: deviceName,
      }).addTo(map);
    }

    // Popup content with clear demonstration vs live labeling
    const popupHtml = `
      <div style="font-family: 'Inter', system-ui, -apple-system, sans-serif; font-size: 12px; line-height: 1.5; min-width: 210px; color: #0F172A; padding: 2px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; padding-bottom: 4px; border-bottom: 1px solid #E2E8F0;">
          <span style="font-weight: 700; color: #1D4ED8; font-size: 13px;">${escapeHtml(deviceName)}</span>
          <span style="font-size: 10px; font-weight: 600; color: #0369A1; background: #E0F2FE; padding: 1px 5px; border-radius: 4px;">Jammu Sector</span>
        </div>

        <div style="margin-bottom: 6px;">
          <span style="display: inline-block; font-size: 10px; font-weight: 600; padding: 2px 6px; border-radius: 4px; ${
            isDemo 
              ? 'background: #FEF3C7; color: #92400E; border: 1px solid #FCD34D;' 
              : 'background: #DCFCE7; color: #166534; border: 1px solid #86EFAC;'
          }">
            ${isDemo ? '⚠️ Demonstration Location (Simulated GPS)' : '🟢 Verified Hardware GPS Fix'}
          </span>
        </div>

        <div style="display: grid; grid-template-columns: auto 1fr; gap: 3px 8px; font-size: 11px;">
          <span style="color: #64748B;">Latitude:</span>
          <span style="font-family: monospace; font-weight: 600;">${location.latitude.toFixed(6)}° N</span>
          <span style="color: #64748B;">Longitude:</span>
          <span style="font-family: monospace; font-weight: 600;">${location.longitude.toFixed(6)}° E</span>
          <span style="color: #64748B;">Accuracy:</span>
          <span>±${location.accuracy} meters</span>
          <span style="color: #64748B;">Timestamp:</span>
          <span>${new Date(location.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
        </div>

        ${location.address ? `
          <div style="margin-top: 6px; padding-top: 5px; border-top: 1px solid #E2E8F0; font-size: 11px; color: #475569;">
            <b>Address:</b> ${escapeHtml(location.address)}
          </div>
        ` : ''}

        ${isDemo ? `
          <div style="margin-top: 8px; padding: 6px; background: #FFFBEB; border: 1px solid #FDE68A; border-radius: 4px; font-size: 10px; color: #78350F; line-height: 1.35;">
            <b>Notice:</b> Demonstration coordinates shown for Jammu defense evaluation. Does not represent live hardware GPS until paired with companion.
          </div>
        ` : ''}
      </div>
    `;

    markerRef.current.bindPopup(popupHtml);

    // Accuracy Circle
    if (circleRef.current) {
      circleRef.current.setLatLng([location.latitude, location.longitude]);
      circleRef.current.setRadius(location.accuracy);
      circleRef.current.setStyle({
        color: isDemo ? '#F59E0B' : '#2563EB',
        fillColor: isDemo ? '#F59E0B' : '#3B82F6',
      });
    } else {
      circleRef.current = L.circle([location.latitude, location.longitude], {
        radius: location.accuracy,
        color: isDemo ? '#F59E0B' : '#2563EB',
        fillColor: isDemo ? '#F59E0B' : '#3B82F6',
        fillOpacity: 0.12,
        weight: 1.5,
      }).addTo(map);
    }

    // Historical Breadcrumb Trail
    if (history.length > 1) {
      const latlngs: L.LatLngExpression[] = history.map((h) => [h.latitude, h.longitude]);
      if (polylineRef.current) {
        polylineRef.current.setLatLngs(latlngs);
      } else {
        polylineRef.current = L.polyline(latlngs, {
          color: isDemo ? '#F59E0B' : '#2563EB',
          weight: 2.5,
          opacity: 0.65,
          dashArray: '4, 8',
        }).addTo(map);
      }
    }
  }, [location, deviceName, history, isDemo, zoom]);

  return (
    <div className={`relative w-full h-full min-h-[300px] rounded-xl overflow-hidden border border-slate-200 dark:border-white/[0.08] shadow-xs group ${className}`}>
      
      {/* Leaflet Map Canvas with CSS Filter for Seamless Dark Mode */}
      <div 
        ref={mapContainerRef} 
        className={`w-full h-full min-h-[300px] z-0 transition-opacity duration-300 ${mapReady ? 'opacity-100' : 'opacity-0'} ${
          theme === 'dark' 
            ? '[&_.leaflet-tile]:brightness-[0.78] [&_.leaflet-tile]:invert-[1] [&_.leaflet-tile]:hue-rotate-[180deg] [&_.leaflet-tile]:contrast-[1.12]' 
            : ''
        }`} 
      />

      {/* Floating Top-Left Badges: Telemetry Mode & Jammu Indicator */}
      <div className="absolute top-3 left-3 z-[400] flex flex-col sm:flex-row gap-2 pointer-events-auto">
        <div className={`px-2.5 py-1 rounded-md text-[11px] font-medium backdrop-blur-md shadow-xs flex items-center gap-1.5 border ${
          isDemo 
            ? 'bg-amber-50/90 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-700/50' 
            : 'bg-emerald-50/90 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700/50'
        }`}>
          {isDemo ? (
            <>
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>Jammu Sector • Demonstration Telemetry</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Jammu Sector • Live Hardware GPS</span>
            </>
          )}
        </div>

        <div className="hidden sm:inline-flex px-2 py-1 rounded-md text-[10px] font-mono backdrop-blur-md shadow-xs items-center gap-1 bg-slate-900/80 text-cyan-300 border border-cyan-500/30">
          <MapPin className="w-3 h-3 text-cyan-400" />
          <span>Jammu, J&K (32.72° N, 74.86° E)</span>
        </div>
      </div>

      {/* Floating Bottom-Right Quick Controls: Center Device, Jammu Overview, Toggle Areas */}
      <div className="absolute bottom-3 right-3 z-[400] flex items-center gap-1.5 pointer-events-auto">
        
        {/* Toggle Jammu Area Pins */}
        <button
          onClick={() => setAreasVisible(!areasVisible)}
          className={`px-2.5 py-1.5 rounded-lg backdrop-blur-md border text-xs font-medium shadow-md transition-all flex items-center gap-1.5 ${
            areasVisible
              ? 'bg-blue-600 text-white border-blue-500 shadow-blue-500/20'
              : 'bg-white/95 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-white/[0.1] hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
          title={areasVisible ? 'Hide Jammu area pins' : 'Show all Jammu area pins'}
        >
          {areasVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{areasVisible ? 'Jammu Areas On' : 'Jammu Areas Off'}</span>
        </button>

        {/* Zoom into Gandhi Nagar Dots */}
        <button
          onClick={handleFocusGandhiNagar}
          className="px-2.5 py-1.5 rounded-lg bg-emerald-600/90 hover:bg-emerald-600 text-white backdrop-blur-md border border-emerald-500/80 text-xs font-medium shadow-md flex items-center gap-1.5 transition-all"
          title="Zoom directly into Gandhi Nagar and inspect all sub-dots"
        >
          <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
          <span>Gandhi Nagar Dots</span>
        </button>

        {/* Zoom Out to Entire Jammu */}
        <button
          onClick={handleFitJammu}
          className="px-2.5 py-1.5 rounded-lg bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-white/[0.1] text-xs font-medium text-slate-700 dark:text-slate-200 shadow-md hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-all"
          title="Zoom out to view all sectors across Jammu"
        >
          <MapPin className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
          <span>Jammu City</span>
        </button>

        {/* Center Device */}
        <button
          onClick={handleRecenter}
          className="px-2.5 py-1.5 rounded-lg bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-white/[0.1] text-xs font-medium text-slate-700 dark:text-slate-200 shadow-md hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-all"
          title="Center map on device and open info popup"
        >
          <Navigation className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>Center Device</span>
        </button>
      </div>

    </div>
  );
};
