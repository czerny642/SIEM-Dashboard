import React, { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  ShieldAlert,
  Volume2,
  Download,
  Play,
  Search,
  Filter,
  Globe,
  Radio,
  Lock,
} from "lucide-react";

export interface LogEntry {
  id: string;
  time: string;
  type: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "SYSTEM";
  event: string;
  srcIp: string;
  country?: string;
  destIp: string;
  status: "Blocked" | "Logged" | "Blacklisted" | "Pending";
  payload?: string;
}

const defaultLogs: LogEntry[] = [
  {
    id: "1",
    time: "5:57:00 AM",
    type: "HIGH",
    event: "Brute Force Threshold Exceeded",
    payload: "POST /api/v1/auth 401 FAILED_LOGIN (Target: admin)",
    srcIp: "103.45.12.88",
    country: "KP",
    destIp: "10.0.0.1",
    status: "Logged",
  },
  {
    id: "2",
    time: "5:56:49 AM",
    type: "SYSTEM",
    event: "FIREWALL ACTION: IP 192.168.1.50 has been blacklisted on Edge Router.",
    srcIp: "192.168.1.50",
    country: "CN",
    destIp: "FIREWALL",
    status: "Blacklisted",
  },
  {
    id: "3",
    time: "10:00:00 AM",
    type: "SYSTEM",
    event: "SOC Tactical Node & IDS Monitoring initialized...",
    srcIp: "LOCAL",
    country: "ID",
    destIp: "LOCAL [ID]",
    status: "Logged",
  },
  {
    id: "4",
    time: "5:01:14 AM",
    type: "CRITICAL",
    event: "SQL Injection Attack Detected",
    payload: "GET /login?user='admin' OR 1=1 -- 200",
    srcIp: "103.168.1.99",
    country: "RU",
    destIp: "10.0.0.1",
    status: "Blocked",
  },
  {
    id: "5",
    time: "5:02:58 AM",
    type: "HIGH",
    event: "Brute Force Threshold Exceeded",
    payload: "POST /login 401 FAILED_LOGIN (Attempt 5)",
    srcIp: "103.168.1.50",
    country: "CN",
    destIp: "10.0.0.1",
    status: "Blocked",
  },
];

const chartData = [
  { time: "10:00", SQLi: 0.2, BruteForce: 1.0 },
  { time: "10:01", SQLi: 1.0, BruteForce: 0.1 },
  { time: "5:57", SQLi: 0.1, BruteForce: 0.9 },
];

export default function SOCDashboard() {
  const [logs, setLogs] = useState<LogEntry[]>(defaultLogs);
  const [activeFilter, setActiveFilter] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [blockedIps, setBlockedIps] = useState<string[]>(["192.168.1.50", "103.168.1.99"]);

  const handleSimulateAttack = () => {
    const newLog: LogEntry = {
      id: Date.now().toString(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      type: Math.random() > 0.5 ? "CRITICAL" : "HIGH",
      event: Math.random() > 0.5 ? "SQL Injection Payload Detected" : "SSH Unauthorized Login Attempt",
      payload: "GET /api/data?id=1' UNION SELECT NULL--",
      srcIp: `185.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      country: ["RU", "CN", "KP", "DE"][Math.floor(Math.random() * 4)],
      destIp: "10.0.0.1",
      status: "Logged",
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  const handleBlockIp = (ip: string) => {
    if (!blockedIps.includes(ip)) {
      setBlockedIps((prev) => [...prev, ip]);
    }
  };

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesFilter =
        activeFilter === "ALL" || log.type === activeFilter;
      const matchesSearch =
        log.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.srcIp.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.payload && log.payload.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesFilter && matchesSearch;
    });
  }, [logs, activeFilter, searchTerm]);

  return (
    <div className="min-h-screen bg-[#03030c] text-slate-100 p-4 font-mono select-none">
      <div className="max-w-[1400px] mx-auto space-y-4 border border-slate-800/80 p-3 rounded-2xl bg-[#050512] shadow-2xl">
        
        {/* TOP DEFCON BAR */}
        <div className="bg-[#120307] border border-red-900/40 rounded-lg px-4 py-1.5 flex items-center justify-between text-xs text-red-500 font-semibold tracking-wider">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span>[=] DEFCON 3 - LIVE DEFENSE FEED:</span>
          </div>
          <div className="text-red-400 font-normal">
            Monitoring incoming traffic pipelines... System Operational.
          </div>
          <button className="text-red-400 hover:text-red-200">
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        {/* MAIN HEADER */}
        <div className="bg-[#0a0a1a] border border-slate-800/80 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-950/60 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-inner">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-wider text-white">
                  MINI SIEM SOC COMMAND
                </h1>
                <span className="bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 text-[10px] px-2 py-0.5 rounded font-bold">
                  ACTIVE IDS
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-Time Threat Intelligence & Automated Response Grid
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-[#12132a] border border-slate-700 hover:bg-[#1a1c3d] text-slate-300 text-xs px-3 py-2 rounded-lg transition-colors">
              <Download className="w-3.5 h-3.5" />
              <span>Export Logs</span>
            </button>
            <button
              onClick={handleSimulateAttack}
              className="flex items-center gap-2 bg-red-700 hover:bg-red-600 text-white text-xs px-4 py-2 rounded-lg font-bold transition-all shadow-lg shadow-red-900/30 active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Simulasi Attack</span>
            </button>
          </div>
        </div>

        {/* METRICS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Critical Alerts */}
          <div className="bg-[#0a0a1a] border-l-4 border-l-red-500 border border-slate-800/80 rounded-xl p-4">
            <div className="text-xs text-slate-400 font-sans">
              Critical Alerts (SQLi)
            </div>
            <div className="text-2xl font-bold text-red-500 mt-2 font-mono">
              12
            </div>
          </div>

          {/* High Alerts */}
          <div className="bg-[#0a0a1a] border-l-4 border-l-amber-500 border border-slate-800/80 rounded-xl p-4">
            <div className="text-xs text-slate-400 font-sans">
              High Alerts (Brute Force)
            </div>
            <div className="text-2xl font-bold text-amber-500 mt-2 font-mono">
              46
            </div>
          </div>

          {/* Total Log Processed */}
          <div className="bg-[#0a0a1a] border-l-4 border-l-emerald-500 border border-slate-800/80 rounded-xl p-4">
            <div className="text-xs text-slate-400 font-sans">
              Total Log Processed
            </div>
            <div className="text-2xl font-bold text-emerald-400 mt-2 font-mono">
              1,285
            </div>
          </div>

          {/* Blocked IPs */}
          <div className="bg-[#0a0a1a] border-l-4 border-l-purple-500 border border-slate-800/80 rounded-xl p-4">
            <div className="text-xs text-slate-400 font-sans">
              Blocked IPs (Firewall)
            </div>
            <div className="text-2xl font-bold text-purple-400 mt-2 font-mono">
              {blockedIps.length}
            </div>
          </div>
        </div>

        {/* MIDDLE SECTION: TIMELINE & MAP */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          
          {/* Attack Vector Timeline Trend */}
          <div className="lg:col-span-2 bg-[#0a0a1a] border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                <Radio className="w-4 h-4 text-indigo-400" />
                <span>Attack Vector Timeline Trend</span>
              </div>
              <div className="flex items-center gap-4 text-[11px]">
                <span className="flex items-center gap-1 text-red-500">
                  <span className="w-2 h-2 rounded-full bg-red-500" /> SQLi
                </span>
                <span className="flex items-center gap-1 text-amber-500">
                  <span className="w-2 h-2 rounded-full bg-amber-500" /> Brute Force
                </span>
              </div>
            </div>

            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="sqliGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.6} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="bruteGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.6} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="2 2" stroke="#1e293b" />
                  <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#030712",
                      borderColor: "#1e293b",
                      borderRadius: "6px",
                      fontSize: "12px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="SQLi"
                    stroke="#ef4444"
                    fillOpacity={1}
                    fill="url(#sqliGrad)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="BruteForce"
                    stroke="#f59e0b"
                    fillOpacity={1}
                    fill="url(#bruteGrad)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Global Threat Ingress Map */}
          <div className="bg-[#0a0a1a] border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-2">
              <Globe className="w-4 h-4 text-emerald-400" />
              <span>Global Threat Ingress Map</span>
            </div>

            {/* Custom SVG Vector Visualizer */}
            <div className="relative w-full h-44 bg-[#03030d] border border-slate-800/60 rounded-lg p-2 flex items-center justify-center overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 300 150">
                {/* Attack Rays */}
                <line x1="80" y1="40" x2="150" y2="110" stroke="#ef4444" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="150" y1="30" x2="150" y2="110" stroke="#ef4444" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="220" y1="50" x2="150" y2="110" stroke="#ef4444" strokeWidth="1" strokeDasharray="3 3" />

                {/* Threat Nodes */}
                <g transform="translate(80, 40)">
                  <rect x="-20" y="-10" width="40" height="18" rx="4" fill="#3f0f15" stroke="#ef4444" strokeWidth="1" />
                  <text x="0" y="2" fill="#ef4444" fontSize="8" textAnchor="middle" fontWeight="bold">RU (128)</text>
                </g>

                <g transform="translate(150, 30)">
                  <rect x="-20" y="-10" width="40" height="18" rx="4" fill="#3f0f15" stroke="#ef4444" strokeWidth="1" />
                  <text x="0" y="2" fill="#ef4444" fontSize="8" textAnchor="middle" fontWeight="bold">CN (370)</text>
                </g>

                <g transform="translate(220, 50)">
                  <rect x="-20" y="-10" width="40" height="18" rx="4" fill="#3f0f15" stroke="#ef4444" strokeWidth="1" />
                  <text x="0" y="2" fill="#ef4444" fontSize="8" textAnchor="middle" fontWeight="bold">KP (147)</text>
                </g>

                {/* Target Node */}
                <g transform="translate(150, 115)">
                  <rect x="-30" y="-10" width="60" height="20" rx="10" fill="#064e3b" stroke="#10b981" strokeWidth="1" />
                  <text x="0" y="3" fill="#34d399" fontSize="9" textAnchor="middle" fontWeight="bold">TARGET: ID</text>
                </g>
              </svg>

              <div className="absolute bottom-2 left-3 flex items-center gap-1.5 text-[9px] text-red-400">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                <span>INGRESS VECTOR ACTIVE</span>
              </div>
              <div className="absolute bottom-2 right-3 text-[9px] text-slate-500">
                NODES: 4 ORIGINS
              </div>
            </div>

            <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-between">
              <span>Active Attack Vector:</span>
              <span className="text-red-400 font-bold">RU, CN, KP, DE → ID</span>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: LOG STREAM & TOP THREATS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          
          {/* Real-Time SIEM Stream */}
          <div className="lg:col-span-2 bg-[#0a0a1a] border border-slate-800/80 rounded-xl p-4 space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                <span className="text-indigo-400">&gt;_</span>
                <span>Real-Time SIEM Stream</span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-48">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search IP / Payload..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[#03030d] border border-slate-800 rounded-lg pl-8 pr-3 py-1 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex items-center bg-[#03030d] border border-slate-800 rounded-lg p-0.5 text-[10px]">
                  <button
                    onClick={() => setActiveFilter("ALL")}
                    className={`px-2 py-1 rounded ${
                      activeFilter === "ALL" ? "bg-indigo-600 text-white font-bold" : "text-slate-400"
                    }`}
                  >
                    ALL
                  </button>
                  <button
                    onClick={() => setActiveFilter("CRITICAL")}
                    className={`px-2 py-1 rounded ${
                      activeFilter === "CRITICAL" ? "bg-red-600 text-white font-bold" : "text-slate-400"
                    }`}
                  >
                    CRITICAL
                  </button>
                  <button
                    onClick={() => setActiveFilter("HIGH")}
                    className={`px-2 py-1 rounded ${
                      activeFilter === "HIGH" ? "bg-amber-600 text-white font-bold" : "text-slate-400"
                    }`}
                  >
                    HIGH
                  </button>
                </div>
              </div>
            </div>

            {/* Stream Logs List */}
            <div className="h-60 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              {filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className="bg-[#03030e] border border-slate-800/80 rounded-lg p-3 text-xs flex flex-col justify-between gap-2 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-bold ${
                          log.type === "CRITICAL"
                            ? "text-red-500"
                            : log.type === "HIGH"
                            ? "text-amber-500"
                            : "text-blue-400"
                        }`}
                      >
                        [{log.type}] {log.event}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-2">
                      <span className="font-mono text-slate-300">
                        {log.srcIp} [{log.country || "ID"}]
                      </span>
                      <span className="text-slate-500">{log.time}</span>
                    </div>
                  </div>

                  {log.payload && (
                    <div className="text-[11px] text-slate-400 font-mono bg-[#070718] p-1.5 rounded border border-slate-900 overflow-x-auto">
                      {log.payload}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Top Threat Origin IPs */}
          <div className="bg-[#0a0a1a] border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-4">
                <Lock className="w-4 h-4 text-red-400" />
                <span>Top Threat Origin IPs</span>
              </div>

              <div className="space-y-3">
                <div className="text-[11px] grid grid-cols-2 text-slate-500 border-b border-slate-800 pb-1">
                  <span>IP / Location</span>
                  <span className="text-right">Mitigation</span>
                </div>

                {/* Threat IP Item 1 */}
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-red-500 font-mono">
                      103.45.12.88 [KP]
                    </div>
                    <div className="text-[10px] text-slate-500">
                      1 events (Brute Force)
                    </div>
                  </div>
                  {blockedIps.includes("103.45.12.88") ? (
                    <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] px-2 py-0.5 rounded font-bold">
                      Blacklisted
                    </span>
                  ) : (
                    <button
                      onClick={() => handleBlockIp("103.45.12.88")}
                      className="bg-red-950/80 hover:bg-red-900 border border-red-700 text-red-300 text-[10px] px-2.5 py-1 rounded transition-colors"
                    >
                      Block IP
                    </button>
                  )}
                </div>

                {/* Threat IP Item 2 */}
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-300 font-mono">
                      103.168.1.99 [RU]
                    </div>
                    <div className="text-[10px] text-slate-500">
                      1 events (SQLi)
                    </div>
                  </div>
                  <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] px-2 py-0.5 rounded font-bold">
                    Blacklisted
                  </span>
                </div>

                {/* Threat IP Item 3 */}
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-300 font-mono">
                      103.168.1.50 [CN]
                    </div>
                    <div className="text-[10px] text-slate-500">
                      1 events (Brute Force)
                    </div>
                  </div>
                  <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] px-2 py-0.5 rounded font-bold">
                    Blacklisted
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}