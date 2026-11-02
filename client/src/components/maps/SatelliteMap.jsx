import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Circle, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { Crosshair, MapPin, Navigation } from 'lucide-react';

// Custom glowing emerald pin icon for Leaflet
const createEmeraldIcon = () =>
  new L.DivIcon({
    className: 'custom-emerald-pin',
    html: `
      <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; width: 28px; height: 28px; background: rgba(16, 185, 129, 0.35); border-radius: 50%; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
        <div style="position: absolute; width: 20px; height: 20px; background: #10b981; border: 2px solid #ffffff; border-radius: 50%; box-shadow: 0 0 12px #10b981;"></div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });

// Map event listener component to capture clicks
function MapClickHandler({ onSelectCoordinates }) {
  useMapEvents({
    click(e) {
      if (onSelectCoordinates) {
        onSelectCoordinates({
          lat: Number(e.latlng.lat.toFixed(6)),
          lng: Number(e.latlng.lng.toFixed(6)),
        });
      }
    },
  });
  return null;
}

// Controller to fly to new coordinates
function FlyToController({ coords }) {
  const map = useMapEvents({});
  useEffect(() => {
    if (coords && coords.lat && coords.lng) {
      map.flyTo([coords.lat, coords.lng], 13, { duration: 1.5 });
    }
  }, [coords, map]);
  return null;
}

export default function SatelliteMap({
  initialLat = 21.9497,
  initialLng = 89.1833,
  areaHectares = 5.0,
  onSelectCoordinates,
  interactive = true,
  height = '420px',
  title = 'Interactive Esri Satellite Remote Sensing Map',
}) {
  const [selectedCoords, setSelectedCoords] = useState({ lat: initialLat, lng: initialLng });
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    if (initialLat && initialLng) {
      setSelectedCoords({ lat: initialLat, lng: initialLng });
    }
  }, [initialLat, initialLng]);

  const handleCoordinatesSelected = (coords) => {
    setSelectedCoords(coords);
    if (onSelectCoordinates) {
      onSelectCoordinates(coords);
    }
  };

  const handleDetectGps = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const coords = {
          lat: Number(pos.coords.latitude.toFixed(6)),
          lng: Number(pos.coords.longitude.toFixed(6)),
        };
        handleCoordinatesSelected(coords);
      },
      (err) => {
        setIsLocating(false);
        alert('Could not retrieve browser GPS: ' + err.message);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const presets = [
    { label: 'Sundarbans Delta', lat: 21.9497, lng: 89.1833 },
    { label: 'Bhitarkanika Estuary', lat: 20.7289, lng: 86.8689 },
    { label: 'Pichavaram Mangroves', lat: 11.4289, lng: 79.7820 },
    { label: 'Godavari Estuary', lat: 16.7500, lng: 82.2500 },
  ];

  // Visual radius calculation in meters (1 ha = 10,000 m2; radius = sqrt(area * 10000 / pi))
  const radiusMeters = Math.max(80, Math.round(Math.sqrt((areaHectares * 10000) / Math.PI)));

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Map Header with Controls & Presets */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
          <MapPin className="w-4 h-4 text-emerald-400" />
          <span>{title}</span>
          <span className="text-slate-500">• Click anywhere to pinpoint mangrove plot</span>
        </div>

        <div className="flex items-center gap-2">
          {interactive && (
            <button
              type="button"
              onClick={handleDetectGps}
              disabled={isLocating}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25 transition-all"
            >
              <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
              <span>{isLocating ? 'Detecting...' : 'Detect Browser GPS'}</span>
            </button>
          )}

          {/* Quick Coastal Presets */}
          <div className="hidden sm:flex items-center gap-1">
            {presets.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => handleCoordinatesSelected({ lat: preset.lat, lng: preset.lng })}
                className="px-2 py-1 rounded-md text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Embedded Leaflet Map */}
      <div
        style={{ height }}
        className="w-full rounded-2xl overflow-hidden border border-emerald-500/30 shadow-xl relative z-0"
      >
        <MapContainer
          center={[selectedCoords.lat, selectedCoords.lng]}
          zoom={12}
          scrollWheelZoom={false}
          style={{ width: '100%', height: '100%' }}
        >
          {/* Esri World Imagery High-Resolution Satellite Tiles */}
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution='Tiles &copy; Esri &mdash; Earth Observation Imagery'
            maxZoom={18}
          />

          <FlyToController coords={selectedCoords} />

          {interactive && <MapClickHandler onSelectCoordinates={handleCoordinatesSelected} />}

          {/* Target Plot Marker */}
          <Marker
            position={[selectedCoords.lat, selectedCoords.lng]}
            icon={createEmeraldIcon()}
          >
            <Popup>
              <div className="p-1">
                <div className="font-bold text-emerald-400 text-sm">Selected Mangrove Coordinates</div>
                <div className="text-xs text-slate-300 font-mono mt-1">
                  Lat: {selectedCoords.lat.toFixed(6)}<br />
                  Lng: {selectedCoords.lng.toFixed(6)}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Estimated Area: {areaHectares} Hectares (~{radiusMeters}m canopy radius)
                </div>
              </div>
            </Popup>
          </Marker>

          {/* Canopy Radius Coverage Circle */}
          <Circle
            center={[selectedCoords.lat, selectedCoords.lng]}
            radius={radiusMeters}
            pathOptions={{
              color: '#10b981',
              fillColor: '#10b981',
              fillOpacity: 0.25,
              weight: 2,
              dashArray: '4, 6',
            }}
          />
        </MapContainer>

        {/* Live Coordinate Badge overlay */}
        <div className="absolute bottom-3 left-3 z-[1000] px-3 py-1.5 rounded-xl bg-obsidian-950/85 border border-emerald-500/40 text-[11px] font-mono text-emerald-300 backdrop-blur-md shadow-lg flex items-center gap-2">
          <Crosshair className="w-3.5 h-3.5 text-emerald-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span>
            {selectedCoords.lat.toFixed(6)}, {selectedCoords.lng.toFixed(6)}
          </span>
        </div>
      </div>
    </div>
  );
}
