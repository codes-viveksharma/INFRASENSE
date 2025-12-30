import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useLocationContext } from '../context/LocationContext';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const createCustomIcon = (color) => {
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

const icons = {
  green: createCustomIcon('green'),
  yellow: createCustomIcon('gold'),
  red: createCustomIcon('red'),
  blue: createCustomIcon('blue'),
  violet: createCustomIcon('violet'),
  gold: createCustomIcon('orange')
};

// Component to handle map center updates
const ChangeView = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
};

const MapView = ({ infrastructure, complaints = [], fullScreen = false }) => {
  const { userLocation } = useLocationContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [mapCenter, setMapCenter] = useState(userLocation || [40.7128, -74.0060]);
  const [zoom, setZoom] = useState(13);
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    if (searchQuery.length > 2) {
      const delayDebounceFn = setTimeout(async () => {
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
          const data = await response.json();
          // Increased limit to 10 as requested
          setSuggestions(data.slice(0, 10));
        } catch (error) {
          console.error('Search error:', error);
        }
      }, 500);
      return () => clearTimeout(delayDebounceFn);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  const handleManualSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery) return;

    // Try to find the best match for the typed query
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      if (data && data.length > 0) {
        handleSelectLocation(data[0].lat, data[0].lon);
      } else {
        alert("Location not found");
      }
    } catch (error) {
      console.error("Manual search error:", error);
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
          setSearchQuery(''); // Clear search on live location
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

  const handleSelectLocation = (lat, lon) => {
    setMapCenter([parseFloat(lat), parseFloat(lon)]);
    setZoom(16);
    setSuggestions([]);
    // Keep the query or clear it? Usually keeping it is better UX for "modification" but clearing shows "done".
    // Let's keep the name in the box so user knows where they are.
    // setSearchQuery(''); 
  };

  return (
    <div className={`relative w-full rounded-[32px] overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-800 ${fullScreen ? 'h-full rounded-none border-0' : 'h-[600px]'}`}>
      <div className="absolute top-4 left-4 z-[1000] w-full max-w-sm flex gap-2">
        <div className="relative flex-1">
          <form onSubmit={handleManualSearch} className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search city, street..."
              className="w-full px-5 py-3 rounded-2xl border-0 bg-white/90 backdrop-blur-md shadow-xl outline-none text-sm font-medium focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-sm shadow-xl transition-all"
            >
              Search
            </button>
          </form>
          {suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl overflow-hidden max-h-60 overflow-y-auto custom-scrollbar">
          {suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl overflow-hidden">
              {suggestions.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectLocation(item.lat, item.lon)}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 border-b border-gray-100 last:border-0 truncate"
                >
                  {item.display_name}
                </button>
              ))}
            </div>
          )}
        </div>
        <button
          onClick={handleLiveLocation}
          className="px-4 py-3 bg-white/90 backdrop-blur-md text-blue-600 rounded-2xl font-bold text-sm shadow-xl hover:bg-blue-50 transition-all flex items-center justify-center"
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
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />

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
                  <div className="text-sm font-medium text-gray-600">Reading: {item.value.toFixed(2)}</div>
                  {item.anomaly && (
                    <div className="mt-2 text-rose-600 font-bold text-xs border-t pt-2 animate-pulse">
                      ⚠️ {item.anomaly}
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Complaint Markers */}
          {complaints.map(complaint => (
            complaint.userCoords && (
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
            )
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

      const LegendItem = ({color, label}) => (
      <div className="flex items-center gap-3">
        <div className={`w-3 h-3 rounded-full ${color}`}></div>
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">{label}</span>
      </div>
      );

      export default MapView;
