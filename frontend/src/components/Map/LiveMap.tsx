import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { EnrichedTrafficData } from '@/lib/types';

interface LiveMapProps {
  data: EnrichedTrafficData[] | null;
}

// Custom function to create colored dot markers based on traffic status
const createCustomIcon = (status: 'Free' | 'Slow' | 'Jammed') => {
  const colors = {
    Free: '#22c55e', // pulse-green
    Slow: '#eab308', // pulse-yellow
    Jammed: '#ef4444' // pulse-red
  };
  const color = colors[status];

  return L.divIcon({
    className: 'custom-icon',
    html: `
      <div style="
        width: 14px; 
        height: 14px; 
        background-color: ${color}; 
        border-radius: 50%; 
        border: 2px solid #0B1121;
        box-shadow: 0 0 10px ${color}80;
      "></div>
    `,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
};

const LiveMap: React.FC<LiveMapProps> = ({ data }) => {
  // Center roughly on Nairobi
  const nairobiCenter: [number, number] = [-1.2921, 36.8219];

  return (
    <MapContainer 
      center={nairobiCenter} 
      zoom={12} 
      scrollWheelZoom={true} 
      className="w-full h-full rounded-xl z-0"
    >
      {/* Dark mode map tiles from CartoDB */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      
      {data?.map((node) => {
        // Skip rendering if we don't have valid coordinates in NODE_DIRECTORY
        if (!node.meta.lat || !node.meta.lng) return null;

        return (
          <Marker 
            key={node.id} 
            position={[node.meta.lat, node.meta.lng]} 
            icon={createCustomIcon(node.status)}
          >
            <Popup className="custom-popup">
              <div className="text-navy-950 font-sans p-1">
                <h3 className="font-bold border-b border-gray-200 pb-1 mb-2">{node.meta.name}</h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                  <span className="text-gray-500">Speed:</span>
                  <span className="font-semibold">{node.speed} km/h</span>
                  <span className="text-gray-500">Vehicles:</span>
                  <span className="font-semibold">{node.vehicle_count}</span>
                  <span className="text-gray-500">Status:</span>
                  <span className={`font-bold uppercase ${node.status === 'Free' ? 'text-green-600' : node.status === 'Slow' ? 'text-yellow-600' : 'text-red-600'}`}>
                    {node.status}
                  </span>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default LiveMap;