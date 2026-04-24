export type Congestion = "low" | "med" | "high";
//traffic sim
export type CorridorId = "thika" | "ngong" | "waiyaki" | "mombasa" | "jogoo" | "lang_ata";

export interface Corridor {
  id: CorridorId;
  name: string;
  shortName: string;
}

export const CORRIDORS: Corridor[] = [
  { id: "thika", name: "Thika Superhighway (A2)", shortName: "Thika Hwy" },
  { id: "ngong", name: "Ngong Road", shortName: "Ngong Rd" },
  { id: "waiyaki", name: "Waiyaki Way (A104)", shortName: "Waiyaki Way" },
  { id: "mombasa", name: "Mombasa Road (A8)", shortName: "Mombasa Rd" },
  { id: "jogoo", name: "Jogoo Road", shortName: "Jogoo Rd" },
  { id: "lang_ata", name: "Lang'ata Road", shortName: "Lang'ata Rd" },
];

export interface TrafficNode {
  id: string;
  name: string;
  corridor: CorridorId;
  lat: number;
  lng: number;
  vehicleCount: number;
  speed: number; // km/h
  density: number; // vehicles per km
  congestion: Congestion;
}

export interface HistoryPoint {
  t: number;
  vehicleCount: number;
  speed: number;
  density: number;
}

export interface ForecastPoint {
  t: number;
  predictedDensity: number;
  predictedCongestion: Congestion;
}

type SeedNode = Omit<TrafficNode, "vehicleCount" | "speed" | "density" | "congestion">;

/**
 * Nodes along Nairobi's most jam-prone corridors.
 * Coordinates are approximate but realistic for each landmark / interchange.
 */
const SEED: SeedNode[] = [
  // Thika Superhighway (A2): Nairobi CBD → Thika
  { id: "th1", corridor: "thika", name: "Globe Roundabout (CBD)", lat: -1.2811, lng: 36.8299 },
  { id: "th2", corridor: "thika", name: "Museum Hill Interchange", lat: -1.2731, lng: 36.8167 },
  { id: "th3", corridor: "thika", name: "Pangani", lat: -1.2632, lng: 36.8362 },
  { id: "th4", corridor: "thika", name: "Muthaiga Roundabout", lat: -1.2545, lng: 36.8421 },
  { id: "th5", corridor: "thika", name: "Allsopps / Roasters", lat: -1.2353, lng: 36.8665 },
  { id: "th6", corridor: "thika", name: "Kasarani Interchange", lat: -1.2208, lng: 36.8944 },
  { id: "th7", corridor: "thika", name: "Githurai 45", lat: -1.1948, lng: 36.9293 },
  { id: "th8", corridor: "thika", name: "Ruiru Interchange", lat: -1.1486, lng: 36.9624 },
  { id: "th9", corridor: "thika", name: "Juja / JKUAT", lat: -1.0978, lng: 37.0144 },
  { id: "th10", corridor: "thika", name: "Thika Blue Post", lat: -1.0386, lng: 37.0834 },

  // Ngong Road: CBD → Karen
  { id: "ng1", corridor: "ngong", name: "Kenyatta Ave / Uhuru Hwy", lat: -1.2876, lng: 36.8172 },
  { id: "ng2", corridor: "ngong", name: "Nyayo Stadium Roundabout", lat: -1.3017, lng: 36.8242 },
  { id: "ng3", corridor: "ngong", name: "Kenyatta Hospital Junction", lat: -1.3015, lng: 36.8062 },
  { id: "ng4", corridor: "ngong", name: "Adams Arcade", lat: -1.2989, lng: 36.7798 },
  { id: "ng5", corridor: "ngong", name: "Prestige Plaza", lat: -1.2965, lng: 36.7732 },
  { id: "ng6", corridor: "ngong", name: "Junction Mall", lat: -1.2978, lng: 36.7626 },
  { id: "ng7", corridor: "ngong", name: "Karen Shopping Centre", lat: -1.3193, lng: 36.7077 },

  // Waiyaki Way (A104): Westlands → Limuru
  { id: "wa1", corridor: "waiyaki", name: "Westlands Roundabout", lat: -1.2654, lng: 36.8049 },
  { id: "wa2", corridor: "waiyaki", name: "ABC Place", lat: -1.2604, lng: 36.7889 },
  { id: "wa3", corridor: "waiyaki", name: "Kangemi", lat: -1.2606, lng: 36.7484 },
  { id: "wa4", corridor: "waiyaki", name: "James Gichuru Junction", lat: -1.2641, lng: 36.7724 },
  { id: "wa5", corridor: "waiyaki", name: "Uthiru", lat: -1.2617, lng: 36.7193 },
  { id: "wa6", corridor: "waiyaki", name: "Kikuyu / Southern Bypass", lat: -1.2477, lng: 36.6657 },

  // Mombasa Road (A8): CBD → JKIA
  { id: "mb1", corridor: "mombasa", name: "Bunyala Roundabout", lat: -1.3001, lng: 36.8331 },
  { id: "mb2", corridor: "mombasa", name: "Nyayo Stadium", lat: -1.3046, lng: 36.8275 },
  { id: "mb3", corridor: "mombasa", name: "South C / Capital Centre", lat: -1.3171, lng: 36.8331 },
  { id: "mb4", corridor: "mombasa", name: "GM / SGR Bridge", lat: -1.3253, lng: 36.8497 },
  { id: "mb5", corridor: "mombasa", name: "Cabanas / Imara Daima", lat: -1.3433, lng: 36.8867 },
  { id: "mb6", corridor: "mombasa", name: "JKIA Turnoff", lat: -1.3498, lng: 36.9173 },

  // Jogoo Road: CBD → Donholm
  { id: "jg1", corridor: "jogoo", name: "Landhies / Bus Station", lat: -1.2842, lng: 36.8348 },
  { id: "jg2", corridor: "jogoo", name: "Burma Market", lat: -1.2861, lng: 36.8459 },
  { id: "jg3", corridor: "jogoo", name: "City Stadium", lat: -1.2884, lng: 36.8426 },
  { id: "jg4", corridor: "jogoo", name: "Buruburu", lat: -1.2868, lng: 36.8714 },
  { id: "jg5", corridor: "jogoo", name: "Donholm Roundabout", lat: -1.2929, lng: 36.8918 },

  // Lang'ata Road: Nyayo → Bomas
  { id: "la1", corridor: "lang_ata", name: "Nyayo Stadium R/About", lat: -1.3041, lng: 36.823 },
  { id: "la2", corridor: "lang_ata", name: "Wilson Airport", lat: -1.3216, lng: 36.8141 },
  { id: "la3", corridor: "lang_ata", name: "T-Mall / Lang'ata Rd", lat: -1.3137, lng: 36.8189 },
  { id: "la4", corridor: "lang_ata", name: "Carnivore", lat: -1.3236, lng: 36.8083 },
  { id: "la5", corridor: "lang_ata", name: "Bomas of Kenya", lat: -1.3479, lng: 36.7837 },
];

function classify(density: number): Congestion {
  if (density < 35) return "low";
  if (density < 70) return "med";
  return "high";
}

// Time-of-day factor — peaks around 7–9am and 5–7pm (EAT-style commute)
function rushFactor(date = new Date()): number {
  const h = date.getHours() + date.getMinutes() / 60;
  const morning = Math.exp(-((h - 8) ** 2) / 2);
  const evening = Math.exp(-((h - 18) ** 2) / 3);
  return 0.4 + 1.0 * Math.max(morning, evening);
}

// Some segments are inherently busier (CBD entrances, bottleneck junctions).
const BIAS: Record<string, number> = {
  // Thika
  th1: 1.25, th2: 1.2, th5: 1.25, th7: 1.3, th8: 1.1,
  // Ngong
  ng1: 1.25, ng2: 1.2, ng3: 1.15, ng6: 1.2,
  // Waiyaki
  wa1: 1.3, wa3: 1.25, wa4: 1.2,
  // Mombasa
  mb1: 1.2, mb2: 1.2, mb4: 1.15, mb6: 1.2,
  // Jogoo
  jg1: 1.3, jg2: 1.2, jg5: 1.15,
  // Lang'ata
  la1: 1.2, la3: 1.15,
};

export function initialNodes(): TrafficNode[] {
  return SEED.map((s, i) => {
    const base = 22 + ((i * 9) % 50);
    const density = base * rushFactor() * (BIAS[s.id] ?? 1);
    return {
      ...s,
      density: Math.round(density),
      vehicleCount: Math.round(density * (3 + Math.random() * 2)),
      speed: Math.round(Math.max(8, 70 - density * 0.55)),
      congestion: classify(density),
    };
  });
}

export function tickNode(n: TrafficNode): TrafficNode {
  const drift = (Math.random() - 0.5) * 14;
  const density = Math.max(5, Math.min(120, n.density + drift));
  const speed = Math.max(5, Math.min(95, 75 - density * 0.55 + (Math.random() - 0.5) * 8));
  const vehicleCount = Math.max(0, Math.round(density * (2.5 + Math.random() * 2)));
  return {
    ...n,
    density: Math.round(density),
    speed: Math.round(speed),
    vehicleCount,
    congestion: classify(density),
  };
}

export function forecast(node: TrafficNode, minutesAhead = 120, stepMin = 10): ForecastPoint[] {
  const points: ForecastPoint[] = [];
  let d = node.density;
  const now = Date.now();
  for (let m = stepMin; m <= minutesAhead; m += stepMin) {
    const future = new Date(now + m * 60_000);
    const target = 30 + 55 * (rushFactor(future) - 0.4) * (BIAS[node.id] ?? 1);
    d = d + (target - d) * 0.35 + (Math.random() - 0.5) * 6;
    d = Math.max(5, Math.min(120, d));
    points.push({
      t: now + m * 60_000,
      predictedDensity: Math.round(d),
      predictedCongestion: classify(d),
    });
  }
  return points;
}

export function congestionColor(c: Congestion): string {
  return c === "low"
    ? "var(--traffic-low)"
    : c === "med"
      ? "var(--traffic-med)"
      : "var(--traffic-high)";
}

export function congestionLabel(c: Congestion): string {
  return c === "low" ? "Free" : c === "med" ? "Slow" : "Jammed";
}

export function corridorName(id: CorridorId): string {
  return CORRIDORS.find((c) => c.id === id)?.name ?? id;
}
