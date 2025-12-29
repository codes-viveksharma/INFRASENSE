import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MapView = ({ infrastructure }) => {
  useEffect(() => {
    // Initialize map
    const map = L.map('map').setView([40.7128, -74.0060], 13);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Define custom icons
    const icons = {
      green: new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      }),
      yellow: new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      }),
      red: new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      })
    };

    // Add markers for each infrastructure item
    infrastructure.forEach(item => {
      const marker = L.marker([item.location.lat, item.location.lng], {
        icon: icons[item.status]
      }).addTo(map);
      
      marker.bindPopup(`
        <div class="p-2">
          <strong class="text-lg">${item.name}</strong><br/>
          <span class="status-badge status-${item.status}">${item.status.toUpperCase()}</span><br/>
          Type: ${item.type.replace('_', ' ')}<br/>
          Value: ${item.value}<br/>
          ${item.anomaly ? `<div class="mt-2 text-red-600"><strong>Alert:</strong> ${item.anomaly}</div>` : ''}
        </div>
      `);
    });

    return () => {
      map.remove();
    };
  }, [infrastructure]);

  return <div id="map" className="w-full h-[600px] rounded-lg" />;
};

export default MapView;