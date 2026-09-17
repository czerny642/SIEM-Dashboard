import React, { useState, useEffect } from "react";

interface ThreatPoint {
  id: string;
  country: string;
  code: string;
  x: number; // Persentase posisi X pada peta SVG
  y: number; // Persentase posisi Y pada peta SVG
  attacks: number;
}

export default function ThreatMap(): React.JSX.Element {
  // Lokasi Target (Indonesia)
  const targetLocation = { name: "Indonesia", code: "ID", x: 78, y: 62 };

  // Lokasi Penyerang (Origins)
  const [threatNodes, setThreatNodes] = useState<ThreatPoint[]>([
    { id: "1", country: "Russia", code: "RU", x: 68, y: 28, attacks: 42 },
    { id: "2", country: "China", code: "CN", x: 72, y: 40, attacks: 89 },
    { id: "3", country: "Germany", code: "DE", x: 48, y: 32, attacks: 18 },
    { id: "4", country: "North Korea", code: "KP", x: 79, y: 38, attacks: 31 },
  ]);

  // Efek simulasi fluktuasi jumlah serangan secara realtime
  useEffect(() => {
    const interval = setInterval(() => {
      setThreatNodes((prev) =>
        prev.map((node) => ({
          ...node,
          attacks: node.attacks + Math.floor(Math.random() * 3),
        })),
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-56 bg-slate-950 border border-slate-800 rounded-lg overflow-hidden flex flex-col justify-center items-center">
      {/* Grid Overlay Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:16px_16px]" />

      {/* SVG Canvas Map & Attack Vectors */}
      <svg
        className="w-full h-full absolute inset-0 z-10"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          {/* Gradient untuk garis serangan */}
          <linearGradient
            id="attackGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Garis Vektor Serangan (Origin ke Target ID) */}
        {threatNodes.map((node) => (
          <g key={`line-${node.id}`}>
            <line
              x1={`${node.x}%`}
              y1={`${node.y}%`}
              x2={`${targetLocation.x}%`}
              y2={`${targetLocation.y}%`}
              stroke="url(#attackGradient)"
              strokeWidth="0.6"
              strokeDasharray="2 1"
              className="animate-pulse"
            />
          </g>
        ))}

        {/* Target Node (Indonesia) */}
        <g>
          <circle
            cx={`${targetLocation.x}%`}
            cy={`${targetLocation.y}%`}
            r="3"
            className="fill-emerald-500/30 animate-ping"
          />
          <circle
            cx={`${targetLocation.x}%`}
            cy={`${targetLocation.y}%`}
            r="1.5"
            className="fill-emerald-400 stroke-emerald-200 stroke-[0.5]"
          />
        </g>

        {/* Threat Origin Nodes */}
        {threatNodes.map((node) => (
          <g key={`node-${node.id}`}>
            <circle
              cx={`${node.x}%`}
              cy={`${node.y}%`}
              r="2.5"
              className="fill-red-500/40 animate-ping"
            />
            <circle
              cx={`${node.x}%`}
              cy={`${node.y}%`}
              r="1.2"
              className="fill-red-500 stroke-red-300 stroke-[0.5]"
            />
          </g>
        ))}
      </svg>

      {/* HTML Overlay Labels */}
      <div className="absolute inset-0 pointer-events-none z-20">
        {/* Label Target Indonesia */}
        <div
          className="absolute transform -translate-x-1/2 -translate-y-1/2 flex items-center gap-1"
          style={{
            left: `${targetLocation.x}%`,
            top: `${targetLocation.y + 6}%`,
          }}
        >
          <span className="bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold shadow-md backdrop-blur-sm">
            TARGET: ID
          </span>
        </div>

        {/* Labels Threat Origins */}
        {threatNodes.map((node) => (
          <div
            key={`label-${node.id}`}
            className="absolute transform -translate-x-1/2 -translate-y-full"
            style={{ left: `${node.x}%`, top: `${node.y - 3}%` }}
          >
            <div className="bg-red-950/80 text-red-400 border border-red-500/30 px-1.5 py-0.5 rounded text-[8px] font-mono flex items-center gap-1 shadow-md backdrop-blur-sm">
              <span className="font-bold">{node.code}</span>
              <span className="text-slate-400">({node.attacks})</span>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Live Radar Legend */}
      <div className="absolute bottom-2 left-2 right-2 z-20 flex justify-between items-center text-[10px] font-mono text-slate-400 bg-slate-900/80 border border-slate-800 px-2 py-1 rounded backdrop-blur">
        <div className="flex items-center space-x-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          <span>INGRESS VECTOR ACTIVE</span>
        </div>
        <span className="text-slate-500">NODES: 4 ORIGINS</span>
      </div>
    </div>
  );
}
