import { Card } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

interface Props {
  icon: LucideIcon;
  label: string;
  value: string | number;
  unit?: string;
  hint?: string;
  accent?: "low" | "med" | "high" | "primary";
}

const accentMap = {
  low: "text-traffic-low",
  med: "text-traffic-med",
  high: "text-traffic-high",
  primary: "text-primary",
} as const;

export function StatCard({ icon: Icon, label, value, unit, hint, accent = "primary" }: Props) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-bold tabular-nums">
            {value}
            {unit && <span className="ml-1 text-base font-normal text-muted-foreground">{unit}</span>}
          </p>
          {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
        </div>
        <div className={`rounded-lg bg-muted p-2 ${accentMap[accent]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}
