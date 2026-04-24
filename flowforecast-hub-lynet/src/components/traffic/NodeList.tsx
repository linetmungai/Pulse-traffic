import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { congestionLabel, corridorName, type TrafficNode } from "@/lib/traffic-sim";
//git debugging
interface Props {
  nodes: TrafficNode[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const dot = {
  low: "bg-traffic-low",
  med: "bg-traffic-med",
  high: "bg-traffic-high",
} as const;

export function NodeList({ nodes, selectedId, onSelect }: Props) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="border-b px-4 py-3">
        <h3 className="font-semibold">Traffic Nodes</h3>
        <p className="text-xs text-muted-foreground">{nodes.length} monitored intersections</p>
      </div>
      <div className="max-h-[520px] overflow-y-auto divide-y">
        {nodes.map((n) => (
          <button
            key={n.id}
            onClick={() => onSelect(n.id)}
            className={cn(
              "w-full px-4 py-3 text-left transition-colors hover:bg-muted/60",
              selectedId === n.id && "bg-muted",
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className={cn("h-2.5 w-2.5 shrink-0 rounded-full", dot[n.congestion])}
                />
                <span className="truncate font-medium text-sm">{n.name}</span>
              </div>
              <Badge variant="secondary" className="text-[10px] uppercase">
                {congestionLabel(n.congestion)}
              </Badge>
            </div>
            <div className="mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
              {corridorName(n.corridor)}
            </div>
            <div className="mt-1 grid grid-cols-3 gap-1 text-[11px] text-muted-foreground tabular-nums">
              <span>{n.vehicleCount} veh</span>
              <span>{n.speed} km/h</span>
              <span>{n.density} v/km</span>
            </div>
          </button>
        ))}
      </div>
    </Card>
  );
}
