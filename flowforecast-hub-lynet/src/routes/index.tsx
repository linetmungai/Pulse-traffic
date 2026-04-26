import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, ArrowRight, Gauge, MapPin, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SiteHeader } from "@/components/SiteHeader";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pulse Traffic — Live Nairobi Corridor Intelligence" },
      {
        name: "description",
        content:
          "Live, color-coded traffic monitoring and 2-hour congestion forecasts across Nairobi's busiest corridors — Thika Superhighway, Ngong Road, Waiyaki Way, Mombasa Road and more.",
      },
      { property: "og:title", content: "Pulse Traffic — Live Nairobi Corridor Intelligence" },
      {
        property: "og:description",
        content:
          "Real-time GIS dashboard with predictive congestion analytics for Nairobi's jam-prone routes.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      {/* Hero */}
      <section className="hero-bg relative overflow-hidden">
        <div className="mx-auto grid max-w-[1400px] gap-10 px-6 py-20 md:py-28 lg:grid-cols-2 lg:items-center">
          <div className="animate-fade-in">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Sparkles className="h-3.5 w-3.5" /> Live · 6 Nairobi corridors
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight md:text-6xl">
              Feel the city's <span className="text-primary text-glow-primary">pulse</span>
              <br /> before you move.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              Pulse Traffic turns Nairobi's busiest roads — Thika Superhighway, Ngong Road,
              Waiyaki Way, Mombasa Road, Jogoo Road and Lang'ata Road — into a live, color-coded
              map with 2-hour predictive analytics. Leave at the right time, every time.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/signup">
                <Button size="lg" className="gap-2 glow-low">
                  Create free account <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/signin">
                <Button size="lg" variant="outline">
                  I already have an account
                </Button>
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-2 rounded-full border border-traffic-low/40 bg-traffic-low/10 px-4 py-2 text-sm font-semibold text-traffic-low">
                <span className="h-3.5 w-3.5 rounded-full bg-traffic-low glow-low" /> Free
              </span>
              <span className="flex items-center gap-2 rounded-full border border-traffic-med/40 bg-traffic-med/10 px-4 py-2 text-sm font-semibold text-traffic-med">
                <span className="h-3.5 w-3.5 rounded-full bg-traffic-med glow-med" /> Slow
              </span>
              <span className="flex items-center gap-2 rounded-full border border-traffic-high/40 bg-traffic-high/10 px-4 py-2 text-sm font-semibold text-traffic-high">
                <span className="h-3.5 w-3.5 rounded-full bg-traffic-high glow-high" /> Jammed
              </span>
            </div>
          </div>

          {/* Decorative HUD card */}
          <div className="relative animate-float">
            <Card className="overflow-hidden border-primary/20 bg-card/60 p-6 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">
                    Live · Nairobi network
                  </p>
                  <p className="mt-1 text-2xl font-semibold">City pulse</p>
                </div>
                <span className="rounded-full bg-traffic-low/15 px-3 py-1 text-xs font-medium text-traffic-low glow-low">
                  Improving
                </span>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-4">
                {[
                  { label: "Speed", value: "41", unit: "km/h", color: "text-traffic-low" },
                  { label: "Density", value: "44", unit: "v/km", color: "text-traffic-med" },
                  { label: "Hotspots", value: "5", unit: "", color: "text-traffic-high" },
                ].map((s) => (
                  <div key={s.label} className="rounded-lg bg-muted/40 p-3">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      {s.label}
                    </p>
                    <p className={`mt-1 text-2xl font-bold tabular-nums ${s.color}`}>
                      {s.value}
                      {s.unit && <span className="ml-1 text-xs text-muted-foreground">{s.unit}</span>}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-6 space-y-2">
                {[
                  { name: "Globe Roundabout · Thika Hwy", c: "high", v: 92 },
                  { name: "Westlands · Waiyaki Way", c: "high", v: 86 },
                  { name: "Nyayo Stadium · Mombasa Rd", c: "med", v: 64 },
                  { name: "Junction Mall · Ngong Rd", c: "med", v: 58 },
                  { name: "Bomas · Lang'ata Rd", c: "low", v: 24 },
                ].map((r) => (
                  <div key={r.name} className="flex items-center justify-between gap-3">
                    <span className="flex min-w-0 items-center gap-2 text-sm">
                      <span
                        className={`h-2.5 w-2.5 shrink-0 rounded-full bg-traffic-${r.c} glow-${r.c}`}
                      />
                      <span className="truncate">{r.name}</span>
                    </span>
                    <div className="h-1.5 w-32 overflow-hidden rounded-full bg-muted">
                      <div
                        className={`h-full bg-traffic-${r.c}`}
                        style={{ width: `${r.v}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            <div className="pointer-events-none absolute -inset-6 -z-10 rounded-3xl bg-primary/10 blur-3xl" />
          </div>
        </div>
      </section>

      {/* Corridors */}
      <section className="mx-auto max-w-[1400px] px-6 pb-4 pt-10">
        <div className="mb-8 max-w-2xl">
          <h2 className="text-3xl font-bold md:text-4xl">Six corridors. One pulse.</h2>
          <p className="mt-3 text-muted-foreground">
            We track Nairobi's most jam-prone routes — minute by minute, junction by junction.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { name: "Thika Superhighway (A2)", desc: "CBD → Roasters → Ruiru → Thika" },
            { name: "Ngong Road", desc: "CBD → Adams → Junction → Karen" },
            { name: "Waiyaki Way (A104)", desc: "Westlands → Kangemi → Kikuyu" },
            { name: "Mombasa Road (A8)", desc: "Bunyala → South C → JKIA" },
            { name: "Jogoo Road", desc: "Landhies → Buruburu → Donholm" },
            { name: "Lang'ata Road", desc: "Nyayo → T-Mall → Bomas" },
          ].map((c) => (
            <Card
              key={c.name}
              className="group flex items-center justify-between gap-3 border-border/60 bg-card/60 p-4 transition-all hover:-translate-y-0.5 hover:border-primary/40"
            >
              <div>
                <p className="font-medium">{c.name}</p>
                <p className="text-xs text-muted-foreground">{c.desc}</p>
              </div>
              <span className="h-2 w-2 rounded-full bg-traffic-low glow-low transition-transform group-hover:scale-125" />
            </Card>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-[1400px] px-6 py-16">
        <div className="mb-12 max-w-2xl">
          <h2 className="text-3xl font-bold md:text-4xl">Built for the Nairobi commute.</h2>
          <p className="mt-3 text-muted-foreground">
            From CBD bottlenecks to the suburbs — every interchange, every minute.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: MapPin,
              title: "Live GIS map",
              text: "Leaflet-powered dark map with color-coded nodes across six corridors.",
              color: "text-primary",
            },
            {
              icon: Gauge,
              title: "Real-time metrics",
              text: "Vehicle counts, speeds and density updated every few seconds.",
              color: "text-traffic-low",
            },
            {
              icon: TrendingUp,
              title: "2-hour forecasts",
              text: "Predictive congestion modelling so you know when to leave.",
              color: "text-traffic-med",
            },
            {
              icon: ShieldCheck,
              title: "Operator-grade",
              text: "Hotspot ranking and historical trends for planners and dispatch.",
              color: "text-traffic-high",
            },
          ].map((f) => (
            <Card
              key={f.title}
              className="group relative overflow-hidden border-border/60 bg-card/60 p-5 transition-all hover:-translate-y-1 hover:border-primary/40"
            >
              <div className={`mb-4 inline-flex rounded-lg bg-muted/60 p-2 ${f.color}`}>
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.text}</p>
              <div className="pointer-events-none absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-primary/10 opacity-0 blur-2xl transition-opacity group-hover:opacity-100" />
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-[1200px] px-6 pb-24">
        <Card className="relative overflow-hidden border-primary/30 bg-gradient-to-br from-card to-muted p-10 text-center">
          <Activity className="mx-auto h-10 w-10 text-primary text-glow-primary" />
          <h3 className="mt-4 text-3xl font-bold">Ready to skip the jam?</h3>
          <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
            Sign up in seconds. No credit card. Get instant access to the live dashboard.
          </p>
          <div className="mt-6 flex justify-center">
            <Link to="/signup">
              <Button size="lg" className="gap-2 glow-low">
                Create free account <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-10 h-72 w-72 rounded-full bg-traffic-high/10 blur-3xl" />
        </Card>
      </section>

      <footer className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Pulse Traffic · Simulated data for demo purposes.
      </footer>
    </div>
  );
}
