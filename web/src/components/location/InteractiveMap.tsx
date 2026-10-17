import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import type { DeviceLocation } from '../../types/device';

interface Props {
  location: DeviceLocation;
  deviceName: string;
  history?: DeviceLocation[];
  zoom?: number;
}

export const InteractiveMap: React.FC<Props> = ({ 
  location, 
  deviceName, 
  history = [], 
  zoom = 15 
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const circleRef = useRef<L.Circle | null>(null);
  const polylineRef = useRef<L.Polyline | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Check if map is already initialized on this DOM element
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [location.latitude, location.longitude],
        zoom: zoom,
        zoomControl: true,
      });

      // CartoDB Voyager tiles: clean, highly detailed, formal enterprise map style
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;

      // Invalidate size shortly after mount to ensure tiles are completely rendered
      setTimeout(() => {
        map.invalidateSize();
      }, 200);
    }

    const map = mapInstanceRef.current;
    if (!map) return;

    // Pan map smoothly to new coordinates
    map.panTo([location.latitude, location.longitude], { animate: true });

    // Custom Formal Enterprise Radar Marker Icon
    const customIcon = L.divIcon({
      className: 'custom-radar-pin',
      html: `
        <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; width: 34px; height: 34px; border-radius: 50%; background: rgba(37, 99, 235, 0.2); border: 1.5px solid rgba(37, 99, 235, 0.7); animation: ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="position: relative; width: 16px; height: 16px; border-radius: 50%; background: #2563eb; border: 2.5px solid #ffffff; box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);"></div>
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 17],
    });

    // Update or create main marker
    if (markerRef.current) {
      markerRef.current.setLatLng([location.latitude, location.longitude]);
      markerRef.current.setIcon(customIcon);
    } else {
      markerRef.current = L.marker([location.latitude, location.longitude], { icon: customIcon }).addTo(map);
    }

    markerRef.current.bindPopup(`
      <div style="font-family: system-ui, -apple-system, sans-serif; font-size: 12px; line-height: 1.5; color: #0f172a; padding: 6px;">
        <div style="font-weight: 700; color: #1e40af; display: flex; align-items: center; gap: 4px; margin-bottom: 4px;">
          <span>📱</span> <span>${deviceName}</span>
        </div>
        <div><b>Coordinates:</b> ${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}</div>
        <div><b>Accuracy:</b> ±${location.accuracy}m</div>
        <div><b>Timestamp:</b> ${new Date(location.timestamp).toLocaleTimeString()}</div>
        ${location.address ? `<div style="margin-top: 4px; padding-top: 4px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #475569;">${location.address}</div>` : ''}
      </div>
    `);

    // Accuracy Circle
    if (circleRef.current) {
      circleRef.current.setLatLng([location.latitude, location.longitude]);
      circleRef.current.setRadius(location.accuracy);
    } else {
      circleRef.current = L.circle([location.latitude, location.longitude], {
        radius: location.accuracy,
        color: '#2563eb',
        fillColor: '#3b82f6',
        fillOpacity: 0.12,
        weight: 1.5,
      }).addTo(map);
    }

    // Historical breadcrumbs line
    if (history.length > 1) {
      const latlngs: [number, number][] = history.map(h => [h.latitude, h.longitude]);
      if (polylineRef.current) {
        polylineRef.current.setLatLngs(latlngs);
      } else {
        polylineRef.current = L.polyline(latlngs, {
          color: '#1d4ed8',
          weight: 3,
          opacity: 0.8,
          dashArray: '5, 7',
        }).addTo(map);
      }
    }

    return () => {
      // Keep map alive or clean on unmount
    };
  }, [location, deviceName, history, zoom]);

  // Clean up map when component unmounts
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-[420px] rounded-xl overflow-hidden border border-slate-800 shadow-md">
      <div ref={mapContainerRef} className="w-full h-full min-h-[420px] z-10" />
      
      {/* Map Overlay Controls */}
      <div className="absolute top-3 right-3 z-20 bg-slate-900/95 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/80 text-xs shadow-md flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
        <span className="text-slate-300 font-mono">Precision: ±{location.accuracy}m</span>
      </div>
    </div>
  );
};
