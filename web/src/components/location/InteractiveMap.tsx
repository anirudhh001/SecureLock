import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { DeviceLocation } from '../../types/device';
import { useTheme } from '../../context/ThemeContext';
import { Navigation, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface Props {
  location: DeviceLocation;
  deviceName: string;
  history?: DeviceLocation[];
  zoom?: number;
  isDemo?: boolean;
  className?: string;
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
  zoom = 15,
  isDemo = true,
  className = '',
}) => {
  const { theme } = useTheme();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const circleRef = useRef<L.Circle | null>(null);
  const polylineRef = useRef<L.Polyline | null>(null);
  const [mapReady, setMapReady] = useState(false);

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
      // Supports optional custom tile provider via environment variable if desired
      const tileUrlTemplate = import.meta.env.VITE_MAP_TILE_URL || 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

      const tileLayer = L.tileLayer(tileUrlTemplate, {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
        maxZoom: 19,
        crossOrigin: true,
      }).addTo(map);

      tileLayerRef.current = tileLayer;
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
        }
      };
    }
  }, []);

  // Recenter map action handler
  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([location.latitude, location.longitude], zoom, { animate: true });
      if (markerRef.current) {
        markerRef.current.openPopup();
      }
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
      <div style="font-family: 'Inter', system-ui, -apple-system, sans-serif; font-size: 12px; line-height: 1.5; min-width: 200px; color: #0F172A; padding: 2px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; padding-bottom: 4px; border-bottom: 1px solid #E2E8F0;">
          <span style="font-weight: 700; color: #1D4ED8; font-size: 13px;">${escapeHtml(deviceName)}</span>
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
          <span style="font-family: monospace; font-weight: 600;">${location.latitude.toFixed(6)}°</span>
          <span style="color: #64748B;">Longitude:</span>
          <span style="font-family: monospace; font-weight: 600;">${location.longitude.toFixed(6)}°</span>
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
            <b>Notice:</b> Demonstration coordinates shown for project defense. Does not represent actual live hardware GPS telemetry.
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

      {/* Floating Telemetry Mode Badge */}
      <div className="absolute top-3 left-3 z-[400] pointer-events-auto">
        <div className={`px-2.5 py-1 rounded-md text-[11px] font-medium backdrop-blur-md shadow-xs flex items-center gap-1.5 border ${
          isDemo 
            ? 'bg-amber-50/90 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-700/50' 
            : 'bg-emerald-50/90 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700/50'
        }`}>
          {isDemo ? (
            <>
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>Demonstration Telemetry • Simulated GPS</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Live Telemetry • Active Hardware GPS</span>
            </>
          )}
        </div>
      </div>

      {/* Floating Re-center / Locate Control Button */}
      <div className="absolute bottom-3 right-3 z-[400] pointer-events-auto">
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
