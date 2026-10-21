import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import type { DeviceLocation } from '../../types/device';
import { useTheme } from '../../context/ThemeContext';

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
  const { theme } = useTheme();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const circleRef = useRef<L.Circle | null>(null);
  const polylineRef = useRef<L.Polyline | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [location.latitude, location.longitude],
        zoom: zoom,
        zoomControl: true,
      });

      const tileUrl = theme === 'dark' 
        ? 'https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

      const tileLayer = L.tileLayer(tileUrl, {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap',
        maxZoom: 19,
      }).addTo(map);

      tileLayerRef.current = tileLayer;
      mapInstanceRef.current = map;

      setTimeout(() => {
        map.invalidateSize();
      }, 200);
    }
  }, []);

  // Update Tile Layer when Theme changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    
    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }

    const tileUrl = theme === 'dark' 
      ? 'https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

    const newTileLayer = L.tileLayer(tileUrl, {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap',
      maxZoom: 19,
    }).addTo(mapInstanceRef.current);

    tileLayerRef.current = newTileLayer;
  }, [theme]);

  // Update coordinates & markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Pan smoothly
    map.panTo([location.latitude, location.longitude], { animate: true });

    // Custom Minimal Radar Marker
    const customIcon = L.divIcon({
      className: 'custom-radar-pin',
      html: `
        <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; width: 32px; height: 32px; border-radius: 50%; background: rgba(37, 99, 235, 0.2); border: 1.5px solid rgba(37, 99, 235, 0.6); animation: ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="position: relative; width: 14px; height: 14px; border-radius: 50%; background: #2563EB; border: 2px solid #FFFFFF; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);"></div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    if (markerRef.current) {
      markerRef.current.setLatLng([location.latitude, location.longitude]);
      markerRef.current.setIcon(customIcon);
    } else {
      markerRef.current = L.marker([location.latitude, location.longitude], { icon: customIcon }).addTo(map);
    }

    markerRef.current.bindPopup(`
      <div style="font-family: 'Inter', system-ui, sans-serif; font-size: 12px; line-height: 1.5; color: #111827; padding: 4px;">
        <div style="font-weight: 600; color: #2563EB; margin-bottom: 2px;">
          ${deviceName}
        </div>
        <div><b>Coordinates:</b> ${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}</div>
        <div><b>Accuracy:</b> ±${location.accuracy}m</div>
        <div><b>Timestamp:</b> ${new Date(location.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
        ${location.address ? `<div style="margin-top: 4px; padding-top: 4px; border-top: 1px solid #E5E7EB; font-size: 11px; color: #6B7280;">${location.address}</div>` : ''}
      </div>
    `);

    // Accuracy Circle
    if (circleRef.current) {
      circleRef.current.setLatLng([location.latitude, location.longitude]);
      circleRef.current.setRadius(location.accuracy);
    } else {
      circleRef.current = L.circle([location.latitude, location.longitude], {
        radius: location.accuracy,
        color: '#2563EB',
        fillColor: '#3B82F6',
        fillOpacity: 0.1,
        weight: 1.5,
      }).addTo(map);
    }

    // Historical Breadcrumbs line
    if (history.length > 1) {
      const latlngs: L.LatLngExpression[] = history.map((h) => [h.latitude, h.longitude]);
      if (polylineRef.current) {
        polylineRef.current.setLatLngs(latlngs);
      } else {
        polylineRef.current = L.polyline(latlngs, {
          color: '#2563EB',
          weight: 2.5,
          opacity: 0.6,
          dashArray: '4, 8',
        }).addTo(map);
      }
    }
  }, [location, deviceName, history]);

  return (
    <div className="relative w-full h-full min-h-[340px] rounded-xl overflow-hidden border border-slate-200 dark:border-white/[0.08]">
      <div ref={mapContainerRef} className="w-full h-full min-h-[340px] z-0" />
    </div>
  );
};
