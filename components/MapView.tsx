'use client';
import { useEffect, useRef } from 'react';

interface MapViewProps {
  complaints: any[];
  routes?: any[];
}

export default function MapView({ complaints, routes = [] }: MapViewProps) {
  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Dynamically import Leaflet only on client
    import('leaflet').then((L) => {
      // Fix default marker icons
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const map = L.map(mapContainerRef.current!, {
        center: [23.0225, 72.5714],
        zoom: 12,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      mapRef.current = map;

      // Add complaint markers
      const priorityColors: Record<string, string> = {
        critical: '#ef4444',
        high: '#f97316',
        medium: '#eab308',
        low: '#22c55e',
      };

      complaints.forEach((c) => {
        if (!c.latitude || !c.longitude) return;
        const color = priorityColors[c.priority] || '#6b7280';
        const icon = L.divIcon({
          html: `<div style="background:${color};width:12px;height:12px;border-radius:50%;border:2px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.3)"></div>`,
          className: '',
          iconSize: [12, 12],
          iconAnchor: [6, 6],
        });
        L.marker([c.latitude, c.longitude], { icon })
          .addTo(map)
          .bindPopup(`
            <div style="font-family:system-ui;font-size:12px;min-width:160px">
              <p style="font-weight:600;margin:0 0 4px">${c.ticket_id}</p>
              <p style="color:#666;margin:0 0 2px">${c.category} — ${c.subcategory || ''}</p>
              <p style="margin:0 0 2px">Priority: <strong style="color:${color}">${c.priority}</strong></p>
              ${c.ward ? `<p style="color:#666;margin:0">📍 ${c.ward}</p>` : ''}
            </div>
          `);
      });

      // Add depot marker
      const depotIcon = L.divIcon({
        html: `<div style="background:#1f2937;color:white;font-size:10px;font-weight:bold;width:24px;height:24px;border-radius:4px;display:flex;align-items:center;justify-content:center;border:2px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.3)">D</div>`,
        className: '',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });
      L.marker([23.0225, 72.5714], { icon: depotIcon }).addTo(map).bindPopup('AMC Municipal Depot');

      // Legend
      const legend = (L as any).control({ position: 'bottomright' });
      legend.onAdd = () => {
        const div = L.DomUtil.create('div', 'leaflet-legend');
        div.style.cssText = 'background:white;padding:8px 10px;border-radius:8px;font-size:11px;border:1px solid #e5e7eb;line-height:1.8';
        div.innerHTML = `
          <strong style="font-size:11px">Complaint Priority</strong><br>
          <span style="color:#ef4444">●</span> Critical &nbsp;
          <span style="color:#f97316">●</span> High<br>
          <span style="color:#eab308">●</span> Medium &nbsp;
          <span style="color:#22c55e">●</span> Low
        `;
        return div;
      };
      legend.addTo(map);
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update markers when complaints change
  useEffect(() => {
    if (!mapRef.current || !complaints.length) return;
    // For simplicity, markers are added on init. Real app would use refs.
  }, [complaints]);

  return (
    <>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <div ref={mapContainerRef} className="h-72 w-full rounded-xl" />
    </>
  );
}
