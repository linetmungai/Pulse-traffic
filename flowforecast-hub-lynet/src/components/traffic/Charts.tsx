import { useMemo } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ForecastPoint, HistoryPoint, TrafficNode } from "@/lib/traffic-sim";

const fmtTime = (t: number) =>
  new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export function HistoryChart({ history }: { history: HistoryPoint[] }) {
  const data = useMemo(() => history.map((p) => ({ ...p, time: fmtTime(p.t) })), [history]);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Live Network Trends</CardTitle>
      </CardHeader>
      <CardContent className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 12, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="gDensity" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.6} />
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gSpeed" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--traffic-low)" stopOpacity={0.6} />
                <stop offset="95%" stopColor="var(--traffic-low)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="time" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
            <YAxis tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
            <Tooltip
              contentStyle={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 12,
              }}
            />
            <Area
              type="monotone"
              dataKey="density"
              stroke="var(--primary)"
              fill="url(#gDensity)"
              name="Avg density"
            />
            <Area
              type="monotone"
              dataKey="speed"
              stroke="var(--traffic-low)"
              fill="url(#gSpeed)"
              name="Avg speed"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function ForecastChart({ node, forecast }: { node: TrafficNode; forecast: ForecastPoint[] }) {
  const data = useMemo(
    () => forecast.map((p) => ({ ...p, time: fmtTime(p.t) })),
    [forecast],
  );
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          Predicted congestion · next 2h ·{" "}
          <span className="text-muted-foreground font-normal">{node.name}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 12, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="time" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
            <YAxis tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
            <Tooltip
              contentStyle={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 12,
              }}
            />
            <Line
              type="monotone"
              dataKey="predictedDensity"
              stroke="var(--primary)"
              strokeWidth={2.5}
              dot={{ r: 3 }}
              name="Predicted density"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function NodeBarChart({ nodes }: { nodes: TrafficNode[] }) {
  const data = useMemo(
    () =>
      [...nodes]
        .sort((a, b) => b.density - a.density)
        .slice(0, 8)
        .map((n) => ({
          name: n.name.split(" ")[0],
          density: n.density,
          fill:
            n.congestion === "low"
              ? "var(--traffic-low)"
              : n.congestion === "med"
                ? "var(--traffic-med)"
                : "var(--traffic-high)",
        })),
    [nodes],
  );
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Top hotspots by density</CardTitle>
      </CardHeader>
      <CardContent className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 12, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
            <YAxis tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
            <Tooltip
              contentStyle={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 12,
              }}
            />
            <Bar dataKey="density" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
