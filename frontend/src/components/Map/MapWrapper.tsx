"use client";
import dynamic from 'next/dynamic';
import { EnrichedTrafficData } from '@/lib/types';

// Dynamically import the LiveMap component, disabling Server-Side Rendering
const DynamicMap = dynamic(() => import('./LiveMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[#0a0a0a] text-pulse-cyan animate-pulse">
      Initializing GIS Engine...
    </div>
  ),
});

interface MapWrapperProps {
  data: EnrichedTrafficData[] | null;
}

export default function MapWrapper({ data }: MapWrapperProps) {
  return <DynamicMap data={data} />;
}