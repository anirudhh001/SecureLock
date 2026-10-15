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

      // Dark cyber-styled CartoDB or OpenStreetMap tiles
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;
    if (!map) return;

    // Pan map smoothly to new coordinates
    map.panTo([location.latitude, location.longitude], { animate: true });

    // Custom Glowing Radar Marker Icon
    const customIcon = L.divIcon({
      className: 'custom-radar-pin',
      html: `
        <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; width: 36px; height: 36px; border-radius: 50%; background: rgba(6, 182, 212, 0.25); border: 1px solid rgba(6, 182, 212, 0.8); animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="position: relative; width: 18px; height: 18px; border-radius: 50%; background: #06b6d4; border: 3px solid #ffffff; box-shadow: 0 0 15px rgba(6, 182, 212, 0.9);"></div>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    });

    // Update or create main marker
    if (markerRef.current) {
      markerRef.current.setLatLng([location.latitude, location.longitude]);
      markerRef.current.setIcon(customIcon);
    } else {
      markerRef.current = L.marker([location.latitude, location.longitude], { icon: customIcon }).addTo(map);
    }

    markerRef.current.bindPopup(`
      <div style="font-family: sans-serif; font-size: 12px; line-height: 1.4; color: #0f172a; padding: 4px;">
        <strong style="color: #0284c7;">📱 ${deviceName}</strong><br/>
        <b>Lat:</b> ${location.latitude.toFixed(6)}<br/>
        <b>Lng:</b> ${location.longitude.toFixed(6)}<br/>
        <b>Accuracy:</b> ±${location.accuracy}m<br/>
        <b>Last Update:</b> ${new Date(location.timestamp).toLocaleTimeString()}<br/>
        ${location.address ? `<span style="font-size: 11px; color: #64748b;">${location.address}</span>` : ''}
      </div>
    `);

    // Accuracy Circle
    if (circleRef.current) {
      circleRef.current.setLatLng([location.latitude, location.longitude]);
      circleRef.current.setRadius(location.accuracy);
    } else {
      circleRef.current = L.circle([location.latitude, location.longitude], {
        radius: location.accuracy,
        color: '#06b6d4',
        fillColor: '#06b6d4',
        fillOpacity: 0.15,
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
          color: '#38bdf8',
          weight: 3,
          opacity: 0.7,
          dashArray: '5, 8',
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
    <div className="relative w-full h-full min-h-[420px] rounded-xl overflow-hidden border border-slate-800 shadow-xl">
      <div ref={mapContainerRef} className="w-full h-full min-h-[420px] z-10" />
      
      {/* Map Overlay Controls */}
      <div className="absolute top-3 right-3 z-20 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/80 text-xs shadow-lg flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
        <span className="text-slate-300 font-mono">Accuracy: ±{location.accuracy}m</span>
      </div>
    </div>
  );
};
