import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useLocationContext } from '../context/LocationContext';

// ... (keep icon code same)

// Click handler component defined outside to avoid re-mounting issues
const MapEvents = ({ onMapClick }) => {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
};

const MapView = ({ infrastructure, complaints = [], fullScreen = false }) => {
  const { userLocation } = useLocationContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [mapCenter, setMapCenter] = useState(userLocation || [40.7128, -74.0060]);
  const [zoom, setZoom] = useState(13);
  const [isLocating, setIsLocating] = useState(false);
  const [targetLocation, setTargetLocation] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery) return;

    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        setMapCenter([parseFloat(lat), parseFloat(lon)]);
        setZoom(15);
      } else {
        alert('Location not found');
      }
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const handleLiveLocation = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMapCenter([latitude, longitude]);
          setZoom(16);
          setIsLocating(false);
          setSearchQuery('');
        },
        () => {
          alert("Unable to retrieve your location");
          setIsLocating(false);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser");
      setIsLocating(false);
    }
  };

  const handleRegisterComplaint = () => {
    if (targetLocation) {
      window.location.href = `/complaints?lat=${targetLocation.lat}&lng=${targetLocation.lng}`;
    }
  };

  return (
    <div className={`relative w-full rounded-[32px] overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-800 ${fullScreen ? 'h-[calc(100vh-64px)] rounded-none border-0' : 'h-[600px]'}`}>
      <div className="absolute top-4 left-4 z-[1000] w-full max-w-sm flex gap-2">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Find a location..."
            className="flex-1 px-5 py-3 rounded-2xl border-0 bg-white/90 backdrop-blur-md shadow-2xl outline-none text-sm font-medium"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold text-sm shadow-lg hover:bg-blue-700 transition-all"
          >
            Search
          </button>
        </form>
        <button
          onClick={handleLiveLocation}
          className="px-4 py-3 bg-white/90 backdrop-blur-md text-blue-600 rounded-2xl font-bold text-sm shadow-xl hover:bg-blue-50 transition-all flex items-center justify-center min-w-[50px]"
          title="Use my location"
        >
          {isLocating ? '...' : '📍'}
        </button>
      </div>

      <MapContainer
        center={mapCenter}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <ChangeView center={mapCenter} zoom={zoom} />
        <MapEvents onMapClick={setTargetLocation} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Click Popup */}
        {targetLocation && (
          <Popup position={targetLocation}>
            <div className="p-2 text-center">
              <h3 className="text-sm font-bold mb-2 text-gray-900">Selected Location</h3>
              <p className="text-xs text-gray-500 mb-3">
                {targetLocation.lat.toFixed(4)}, {targetLocation.lng.toFixed(4)}
              </p>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => window.open(`https://www.google.com/maps?q=${targetLocation.lat},${targetLocation.lng}`, '_blank')}
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-bold hover:bg-gray-200 transition-colors"
                >
                  See Details
                </button>
                <button
                  onClick={handleRegisterComplaint}
                  className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 transition-colors"
                >
                  Register Complaint
                </button>
              </div>
            </div>
          </Popup>
        )}

        {/* User Location */}
        {userLocation && (
          <Marker position={userLocation} icon={icons.gold}>
            <Popup>
              <div className="p-2">
                <strong className="text-blue-600">You are here</strong>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Infrastructure Markers */}
        {infrastructure.map(item => (
          (item.location && item.location.lat && item.location.lng) ? (
            <Marker
              key={item.id}
              position={[item.location.lat, item.location.lng]}
              icon={icons[item.status] || icons.blue}
            >
              <Popup>
                <div className="p-2 min-w-[200px]">
                  <h3 className="text-base font-black mb-1">{item.name}</h3>
                  <div className="flex gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${item.status === 'green' ? 'bg-emerald-100 text-emerald-700' :
                      item.status === 'yellow' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                      }`}>
                      {item.status}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.type}</span>
                  </div>
                  <div className="text-sm font-medium text-gray-600">Reading: {item.value?.toFixed(2) || 'N/A'}</div>
                  {item.anomaly && (
                    <div className="mt-2 text-rose-600 font-bold text-xs border-t pt-2 animate-pulse">
                      ⚠️ {item.anomaly}
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          ) : null
        ))}

        {/* Complaint Markers */}
        {complaints.map(complaint => (
          (complaint.userCoords && complaint.userCoords.lat && complaint.userCoords.lng) ? (
            <Marker
              key={complaint.id}
              position={[complaint.userCoords.lat, complaint.userCoords.lng]}
              icon={icons.violet}
            >
              <Popup>
                <div className="p-2 min-w-[200px]">
                  <h3 className="text-base font-black mb-1">Citizen: {complaint.type}</h3>
                  <div className="text-[10px] font-black text-violet-600 uppercase mb-2 tracking-widest">
                    Status: {complaint.status}
                  </div>
                  <p className="text-xs italic text-gray-600 border-l-2 border-violet-200 pl-2">
                    "{complaint.description}"
                  </p>
                </div>
              </Popup>
            </Marker>
          ) : null
        ))}
      </MapContainer>

      <div className="absolute bottom-6 right-6 z-[1000] bg-white/90 backdrop-blur-md p-4 rounded-3xl shadow-2xl border border-white/20">
        <div className="space-y-2">
          <LegendItem color="bg-emerald-500" label="Healthy" />
          <LegendItem color="bg-amber-500" label="Warning" />
          <LegendItem color="bg-rose-500" label="Critical" />
          <LegendItem color="bg-violet-500" label="Reports" />
          <LegendItem color="bg-orange-500" label="You" />
        </div>
      </div>
    </div>
  );
};

const LegendItem = ({ color, label }) => (
  <div className="flex items-center gap-3">
    <div className={`w-3 h-3 rounded-full ${color}`}></div>
    <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">{label}</span>
  </div>
);

export default MapView;