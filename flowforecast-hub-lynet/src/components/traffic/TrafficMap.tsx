import { useEffect, useMemo } from "react";
import { MapContainer, Polyline, TileLayer, CircleMarker, Popup, Tooltip, useMap } from "react-leaflet";
import type { CorridorId, TrafficNode } from "@/lib/traffic-sim";
import { congestionLabel, corridorName } from "@/lib/traffic-sim";

interface Props {
  nodes: TrafficNode[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
}

const COLORS: Record<string, string> = {
  low: "#22ee88",
  med: "#ffcc33",
  high: "#ff3b3b",
};

const CORRIDOR_COLORS: Record<CorridorId, string> = {
  thika: "#7dd3fc",
  ngong: "#c4b5fd",
  waiyaki: "#fda4af",
  mombasa: "#fcd34d",
  jogoo: "#86efac",
  lang_ata: "#f9a8d4",
};

function FlyTo({ nodes, selectedId }: { nodes: TrafficNode[]; selectedId?: string | null }) {
  const map = useMap();
  useEffect(() => {
    if (!selectedId) return;
    const n = nodes.find((x) => x.id === selectedId);
    if (n) map.flyTo([n.lat, n.lng], 14, { duration: 0.8 });
  }, [selectedId, nodes, map]);
  return null;
}

export function TrafficMap({ nodes, selectedId, onSelect }: Props) {
  // Group nodes per corridor to draw a polyline per route
  const corridorLines = useMemo(() => {
    const map = new Map<CorridorId, TrafficNode[]>();
    for (const n of nodes) {
      const arr = map.get(n.corridor) ?? [];
      arr.push(n);
      map.set(n.corridor, arr);
    }
    return Array.from(map.entries());
  }, [nodes]);

  return (
    <MapContainer
      center={[-1.2864, 36.8172]}
      zoom={11}
      scrollWheelZoom
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      <FlyTo nodes={nodes} selectedId={selectedId} />
      {corridorLines.map(([cid, ns]) => (
        <Polyline
          key={cid}
          positions={ns.map((n) => [n.lat, n.lng] as [number, number])}
          pathOptions={{
            color: CORRIDOR_COLORS[cid],
            weight: 3,
            opacity: 0.55,
            dashArray: "6 6",
          }}
        />
      ))}
      {nodes.map((n) => {
        const color = COLORS[n.congestion];
        const radius = 9 + Math.min(22, n.density / 5);
        return (
          <CircleMarker
            key={n.id}
            center={[n.lat, n.lng]}
            radius={radius}
            pathOptions={{
              color,
              fillColor: color,
              fillOpacity: 0.65,
              weight: selectedId === n.id ? 4 : 2,
            }}
            eventHandlers={{ click: () => onSelect?.(n.id) }}
          >
            <Tooltip
              direction="top"
              offset={[0, -6]}
              opacity={1}
              permanent
              className="pulse-map-label"
            >
              {n.name}
            </Tooltip>
            <Popup>
              <div className="space-y-1">
                <div className="font-semibold">{n.name}</div>
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  {corridorName(n.corridor)}
                </div>
                <div className="text-xs text-muted-foreground">
                  Congestion:{" "}
                  <span style={{ color }} className="font-medium">
                    {congestionLabel(n.congestion)}
                  </span>
                </div>
                <div className="text-xs">Vehicles: {n.vehicleCount}</div>
                <div className="text-xs">Speed: {n.speed} km/h</div>
                <div className="text-xs">Density: {n.density} veh/km</div>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}

export default TrafficMap;
