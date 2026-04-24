import { createFileRoute, Link } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { Activity, Car, Gauge, Pause, Play, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/traffic/StatCard";
import { NodeList } from "@/components/traffic/NodeList";
import { ForecastChart, HistoryChart, NodeBarChart } from "@/components/traffic/Charts";
import { useTraffic } from "@/hooks/use-traffic";
import { useAuth } from "@/hooks/use-auth";
import { CORRIDORS, congestionLabel, forecast, type CorridorId } from "@/lib/traffic-sim";
import { SiteHeader } from "@/components/SiteHeader";
import { cn } from "@/lib/utils";

const TrafficMap = lazy(() => import("@/components/traffic/TrafficMap"));

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard · Pulse Traffic" },
      {
        name: "description",
        content:
          "Live traffic monitoring dashboard for Nairobi corridors with predictive congestion analytics.",
      },
    ],
  }),
  component: Dashboard,
});

type CorridorFilter = "all" | CorridorId;

function Dashboard() {
  const { user, ready } = useAuth();
  const { nodes: allNodes, history, running, setRunning } = useTraffic(4000);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [corridor, setCorridor] = useState<CorridorFilter>("all");
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const nodes = useMemo(
    () => (corridor === "all" ? allNodes : allNodes.filter((n) => n.corridor === corridor)),
    [allNodes, corridor],
  );

  const selected = useMemo(
    () => nodes.find((n) => n.id === selectedId) ?? nodes[0],
    [nodes, selectedId],
  );
  const fc = useMemo(() => (selected ? forecast(selected) : []), [selected]);

  const totals = useMemo(() => {
    if (!nodes.length) {
      return { vehicles: 0, avgSpeed: 0, avgDensity: 0, low: 0, med: 0, high: 0 };
    }
    const t = nodes.reduce(
      (acc, n) => {
        acc.vehicles += n.vehicleCount;
        acc.speed += n.speed;
        acc.density += n.density;
        if (n.congestion === "high") acc.high++;
        else if (n.congestion === "med") acc.med++;
        else acc.low++;
        return acc;
      },
      { vehicles: 0, speed: 0, density: 0, low: 0, med: 0, high: 0 },
    );
    return {
      vehicles: t.vehicles,
      low: t.low,
      med: t.med,
      high: t.high,
      avgSpeed: Math.round(t.speed / nodes.length),
      avgDensity: Math.round(t.density / nodes.length),
    };
  }, [nodes]);

  // Auth gate (mock)
  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        Loading…
      </div>
    );
  }
  if (!user) {
    return (
      <div className="min-h-screen">
        <SiteHeader />
        <div className="hero-bg flex min-h-[80vh] items-center justify-center px-4">
          <Card className="max-w-md border-border/60 bg-card/70 p-8 text-center backdrop-blur-xl">
            <h2 className="text-2xl font-bold">Sign in required</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              The live dashboard is for Pulse Traffic members. Create a free account to continue.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link to="/signup">
                <Button>Create account</Button>
              </Link>
              <Link to="/signin">
                <Button variant="outline">Sign in</Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const filterTitle =
    corridor === "all"
      ? "Nairobi Network · Live"
      : `${CORRIDORS.find((c) => c.id === corridor)?.name} · Live`;

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="mx-auto max-w-[1600px] space-y-6 px-6 py-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold">{filterTitle}</h2>
            <p className="text-sm text-muted-foreground">
              {nodes.length} monitored junctions across{" "}
              {corridor === "all" ? `${CORRIDORS.length} corridors` : "1 corridor"}.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1.5">
              <span
                className={`h-2 w-2 rounded-full ${running ? "bg-traffic-low animate-pulse" : "bg-muted-foreground"}`}
              />
              {running ? "Live" : "Paused"}
            </Badge>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setRunning((r) => !r)}
              className="gap-1.5"
            >
              {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {running ? "Pause" : "Resume"}
            </Button>
          </div>
        </div>

        {/* Corridor filter chips */}
        <div className="flex flex-wrap gap-2">
          <CorridorChip
            active={corridor === "all"}
            onClick={() => setCorridor("all")}
            label={`All corridors · ${allNodes.length}`}
          />
          {CORRIDORS.map((c) => {
            const count = allNodes.filter((n) => n.corridor === c.id).length;
            return (
              <CorridorChip
                key={c.id}
                active={corridor === c.id}
                onClick={() => setCorridor(c.id)}
                label={`${c.shortName} · ${count}`}
              />
            );
          })}
        </div>

        {/* KPIs */}
        <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard
            icon={Car}
            label="Total Vehicles"
            value={totals.vehicles.toLocaleString()}
            hint="across selection"
            accent="primary"
          />
          <StatCard
            icon={Gauge}
            label="Avg Speed"
            value={totals.avgSpeed}
            unit="km/h"
            hint={totals.avgSpeed > 35 ? "Free-flowing" : "Slow"}
            accent={totals.avgSpeed > 35 ? "low" : totals.avgSpeed > 20 ? "med" : "high"}
          />
          <StatCard
            icon={Activity}
            label="Avg Density"
            value={totals.avgDensity}
            unit="v/km"
            hint="lower is better"
            accent={totals.avgDensity < 35 ? "low" : totals.avgDensity < 70 ? "med" : "high"}
          />
          <StatCard
            icon={TrendingUp}
            label="Hotspots"
            value={totals.high}
            hint={`${totals.med} slow · ${totals.low} clear`}
            accent={totals.high > 2 ? "high" : totals.high > 0 ? "med" : "low"}
          />
        </section>

        {/* Map + node list */}
        <section className="grid gap-4 lg:grid-cols-[1fr_360px]">
          <Card className="overflow-hidden p-0">
            <CardHeader className="flex-row items-center justify-between space-y-0 border-b py-3">
              <CardTitle className="text-base">Live Traffic Map · Nairobi</CardTitle>
              <Legend />
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[560px] w-full">
                {mounted ? (
                  <Suspense fallback={<MapFallback />}>
                    <TrafficMap
                      nodes={nodes}
                      selectedId={selected?.id ?? null}
                      onSelect={setSelectedId}
                    />
                  </Suspense>
                ) : (
                  <MapFallback />
                )}
              </div>
            </CardContent>
          </Card>
          <NodeList
            nodes={nodes}
            selectedId={selected?.id ?? null}
            onSelect={setSelectedId}
          />
        </section>

        {/* Selected node details */}
        {selected && (
          <section className="grid gap-4 md:grid-cols-3">
            <StatCard
              icon={Car}
              label={`${selected.name} · Vehicles`}
              value={selected.vehicleCount}
              accent="primary"
            />
            <StatCard
              icon={Gauge}
              label="Speed"
              value={selected.speed}
              unit="km/h"
              accent={
                selected.congestion === "high"
                  ? "high"
                  : selected.congestion === "med"
                    ? "med"
                    : "low"
              }
            />
            <StatCard
              icon={Activity}
              label="Congestion"
              value={congestionLabel(selected.congestion)}
              hint={`${selected.density} v/km`}
              accent={selected.congestion}
            />
          </section>
        )}

        {/* Charts */}
        <section className="grid gap-4 lg:grid-cols-2">
          <HistoryChart history={history} />
          {selected && <ForecastChart node={selected} forecast={fc} />}
        </section>
        <section>
          <NodeBarChart nodes={nodes} />
        </section>

        <footer className="pb-2 pt-4 text-center text-xs text-muted-foreground">
          Simulated data · Tick 4s · {nodes.length} nodes · Updated{" "}
          {new Date().toLocaleTimeString()}
        </footer>
      </main>
    </div>
  );
}

function CorridorChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
        active
          ? "border-primary bg-primary/15 text-primary glow-low"
          : "border-border/60 bg-card/60 text-muted-foreground hover:border-primary/40 hover:text-foreground",
      )}
    >
      {label}
    </button>
  );
}

function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <LegendDot color="bg-traffic-low" glow="glow-low" text="text-traffic-low" border="border-traffic-low/40 bg-traffic-low/10" label="Free" />
      <LegendDot color="bg-traffic-med" glow="glow-med" text="text-traffic-med" border="border-traffic-med/40 bg-traffic-med/10" label="Slow" />
      <LegendDot color="bg-traffic-high" glow="glow-high" text="text-traffic-high" border="border-traffic-high/40 bg-traffic-high/10" label="Jammed" />
    </div>
  );
}
function LegendDot({
  color,
  glow,
  text,
  border,
  label,
}: {
  color: string;
  glow: string;
  text: string;
  border: string;
  label: string;
}) {
  return (
    <span className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold ${text} ${border}`}>
      <span className={`h-3 w-3 rounded-full ${color} ${glow}`} />
      {label}
    </span>
  );
}

function MapFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-muted text-sm text-muted-foreground">
      Loading map…
    </div>
  );
}
