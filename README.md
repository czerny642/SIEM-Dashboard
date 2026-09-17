# 🛡️ Mini SIEM Dashboard

A lightweight Security Information and Event Management (SIEM) dashboard for real-time security event monitoring, alert visualization, and basic incident response.

This project simulates common security incidents such as **SQL Injection (SQLi)** and **Brute Force** attacks, processes security event logs through a rule-based detection engine, and displays actionable security insights on a centralized dashboard.

---

## 📸 Dashboard Preview

![Mini SIEM Dashboard](./screenshots/dashboard.png)

---

## 🚀 Features

- 📊 **Real-time Security Dashboard:** Live overview of security events, metrics, and active threats.
- 🚨 **Alert Classification:** Automated categorisation of threats (Critical, High, Medium, Low).
- 🔴 **Threat Detection Simulation:** Real-time simulation of SQL Injection and Brute Force attack vectors.
- 🌐 **Blocked IP Monitoring:** Instant visibility into automatically or manually blacklisted IP addresses.
- 🔎 **Log Search & Filtering:** Granular search capability across security event logs by IP, event type, or severity.
- 📡 **Real-time Event Stream:** Live event ingestion and detection streaming.
- 🧪 **Attack Simulator:** Integrated testing interface to trigger attack vectors on demand.
- 📥 **Export Security Logs:** Export logs and incident reports for offline analysis (CSV/JSON).
- 📈 **Security Event Statistics:** Visual analytics showing event trends and attack distribution.

---

## 🏗️ System Architecture

```text
┌──────────────────────┐
│   Attack Simulator   │
│ SQLi / Brute Force   │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│   Event Generator    │
│   Security Logs      │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│   Detection Engine   │
│ Rule-based Analysis  │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Alert Classification │
│ Critical / High / ...│
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│    SIEM Dashboard    │
│ Monitoring & Alerts  │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  Incident Response   │
│  Block IP / Export   │
└──────────────────────┘

🛠️ Tech Stack
Frontend
Framework: Next.js (React)

Language: TypeScript

Styling: Tailwind CSS

Icons: Lucide React / React Icons

Backend
Runtime: Node.js

Framework / Architecture: Express.js (REST API / WebSockets)

Language: TypeScript / JavaScript

📁 Project Structure
Plaintext
mini-siem-dashboard/
├── client/                  # Frontend (Next.js, React, Tailwind CSS)
│   ├── public/              # Static assets & screenshots
│   │   └── screenshots/
│   ├── src/
│   │   ├── app/             # Next.js App Router (pages & layouts)
│   │   ├── components/      # UI components (Dashboard, Alerts, Simulator, Logs)
│   │   ├── lib/             # Utility functions & API client handlers
│   │   └── types/           # TypeScript interfaces (Event, Alert, Log)
│   └── package.json
│
├── server/                  # Backend (Node.js)
│   ├── src/
│   │   ├── controllers/     # Incident response & log controllers
│   │   ├── engine/          # Detection engine (SQLi & Brute Force rules)
│   │   ├── simulator/       # Attack vector simulation scripts
│   │   └── routes/          # API endpoints for logs, alerts & response
│   └── package.json
│
├── screenshots/             # Repository documentation previews
├── package.json             # Root scripts (Concurrently / Workspace)
└── README.md

the MIT License.
```
