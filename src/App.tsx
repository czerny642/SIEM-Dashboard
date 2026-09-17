import { useState } from "react";
import SOCDashboard from "./components/SOCDashboard";

export interface LogEntry {
  id: string;
  time: string;
  type: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO";
  event: string;
  srcIp: string;
  destIp: string;
  status: string;
}

const initialLogs: LogEntry[] = [
  {
    id: "1",
    time: "10:15:30",
    type: "CRITICAL",
    event: "SQL Injection Detected",
    srcIp: "192.168.1.50",
    destIp: "10.0.0.1",
    status: "Blocked",
  },
  {
    id: "2",
    time: "10:18:12",
    type: "HIGH",
    event: "SSH Brute Force Attempt",
    srcIp: "172.16.0.4",
    destIp: "10.0.0.1",
    status: "Logged",
  },
];

export default function App() {
  const [logs] = useState<LogEntry[]>(initialLogs);
  const [activeFilter, setActiveFilter] = useState<string>("ALL");

  return (
    <SOCDashboard
      logs={logs}
      activeFilter={activeFilter}
      setActiveFilter={setActiveFilter}
    />
  );
}
