import { useEffect, useRef, useState } from "react";
import { initialNodes, tickNode, type HistoryPoint, type TrafficNode } from "@/lib/traffic-sim";

const MAX_HISTORY = 60; // last ~5 min at 5s tick

export function useTraffic(intervalMs = 5000) {
  const [nodes, setNodes] = useState<TrafficNode[]>(() => initialNodes());
  const [history, setHistory] = useState<HistoryPoint[]>([]);
  const [running, setRunning] = useState(true);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    timerRef.current = window.setInterval(() => {
      setNodes((prev) => {
        const next = prev.map(tickNode);
        const agg = next.reduce(
          (acc, n) => {
            acc.vehicleCount += n.vehicleCount;
            acc.speed += n.speed;
            acc.density += n.density;
            return acc;
          },
          { vehicleCount: 0, speed: 0, density: 0 },
        );
        const point: HistoryPoint = {
          t: Date.now(),
          vehicleCount: agg.vehicleCount,
          speed: Math.round(agg.speed / next.length),
          density: Math.round(agg.density / next.length),
        };
        setHistory((h) => [...h.slice(-(MAX_HISTORY - 1)), point]);
        return next;
      });
    }, intervalMs);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [intervalMs, running]);

  return { nodes, history, running, setRunning };
}
