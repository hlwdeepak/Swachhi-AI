# SWACHHAI AI 🌱

**AI-Powered Smart Municipal Waste & Circular Economy Platform**

> Built for **Gujarat Hackathon 2026 — Challenge 18: Municipal Solid Waste & Circular Economy Agent**

---

## Tagline

**"Smarter Cities. Cleaner Gujarat."**

SWACHHAI AI uses Agentic AI to connect citizens, sanitation teams, and municipalities for faster and smarter waste management — powered by IBM Granite and IBM watsonx.ai.

---

## Problem Statement

Municipal solid waste management in Gujarat cities faces:
- Missed door-to-door collections with no feedback loop
- Inefficient collection routes causing wasted fuel and time
- Poor wet/dry waste segregation compliance
- No multilingual citizen grievance system
- No data-driven ward-level analytics for officers

---

## Solution

SWACHHAI AI is a full-stack Agentic AI platform that:

1. **Citizens** report waste issues by voice (Gujarati/Hindi/English), text, or photo
2. **IBM Granite AI** classifies the complaint, determines priority, and routes it to the right team
3. **Municipal Officers** see a real-time dashboard with ward analytics, maps, and AI copilot
4. **Field Workers** receive prioritized tasks with navigation links
5. The entire lifecycle is tracked — submitted → classified → assigned → in progress → resolved
6. Ward analytics update automatically and power AI-generated insights

---

## Architecture

```
┌─────────────┐     HTTP/REST      ┌────────────────────────────┐
│   Citizen   │ ←─────────────────→│                            │
│   Officer   │                    │   Next.js App (Monorepo)   │
│   Worker    │                    │                            │
└─────────────┘                    │  ┌─────────────────────┐   │
                                   │  │   API Routes (/api) │   │
                                   │  └──────────┬──────────┘   │
                                   │             │              │
                                   │  ┌──────────▼──────────┐   │
                                   │  │    AI Agents Layer  │   │
                                   │  │  ┌───────────────┐  │   │
                                   │  │  │ Grievance     │  │   │
                                   │  │  │ Routing       │  │   │
                                   │  │  │ Route Optim.  │  │   │
                                   │  │  │ Segregation   │  │   │
                                   │  │  │ Analytics     │  │   │
                                   │  │  └───────────────┘  │   │
                                   │  └──────────┬──────────┘   │
                                   │             │              │
                                   │  ┌──────────▼──────────┐   │
                                   │  │  IBM Granite/watsonx│   │
                                   │  │  (or Demo fallback) │   │
                                   │  └─────────────────────┘   │
                                   │             │              │
                                   │  ┌──────────▼──────────┐   │
                                   │  │   SQLite Database   │   │
                                   │  └─────────────────────┘   │
                                   └────────────────────────────┘
```

---

## AI Agents

| Agent | Purpose |
|-------|---------|
| **Grievance Intake Agent** | Classifies citizen complaints in Gujarati/Hindi/English using IBM Granite. Extracts category, subcategory, priority, ward, and recommended action. |
| **Municipal Routing Agent** | Determines correct department/team for each complaint with explainable logic. |
| **Route Optimization Agent** | Generates optimized waste collection routes using nearest-neighbor TSP with priority weighting. |
| **Segregation Compliance Agent** | Classifies waste types (wet/dry/recyclable/hazardous/mixed) with disposal guidance. |
| **Ward Analytics Agent** | Generates natural-language insights from ward data to help officers make decisions. |

**AI Fallback:** All agents have a deterministic demo mode that works without IBM credentials. Responses are clearly labeled as `Demo AI` or `IBM Granite`.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| Backend | Next.js API Routes (Node.js) |
| Database | SQLite via better-sqlite3 |
| AI | IBM Granite via watsonx.ai REST API + Demo fallback |
| Maps | Leaflet + OpenStreetMap (no API key required) |
| Charts | Recharts |
| Auth | JWT in httpOnly cookies + bcryptjs |

---

## Project Structure

```
swachhai-ai/
├── app/
│   ├── api/
│   │   ├── auth/login, register, logout, me
│   │   ├── complaints/[id]
│   │   ├── routes/
│   │   ├── analytics/
│   │   ├── workers/
│   │   ├── notifications/
│   │   └── ai/classify, copilot, segregation
│   ├── dashboard/
│   │   ├── citizen/     — Mobile-first citizen interface
│   │   ├── officer/     — Municipal command center
│   │   └── worker/      — Field worker task manager
│   ├── complaint/[id]/  — Complaint detail + timeline
│   ├── login/
│   ├── register/
│   └── page.tsx         — Landing page
├── ai/
│   ├── grievance-agent/ — Multilingual complaint classifier
│   ├── routing-agent/   — Municipal routing logic
│   ├── route-agent/     — Route optimization (TSP)
│   ├── segregation-agent/ — Waste classification
│   └── analytics-agent/ — AI insights generator
├── components/
│   ├── Navbar.tsx
│   ├── MapView.tsx      — Leaflet map component
│   └── ui.tsx           — Shared UI components
├── database/
│   └── seed.ts          — Demo data (wards, users, complaints, workers)
└── lib/
    ├── db.ts            — SQLite connection + schema
    ├── types.ts         — TypeScript types
    ├── auth.ts          — JWT helpers
    ├── context.tsx      — React auth context
    └── utils.ts         — Utility functions
```

---

## Setup & Running Locally

### Prerequisites
- Node.js 18+
- npm 9+

### Quick Start

```bash
# 1. Clone / enter directory
cd swachhai-ai

# 2. Install dependencies
npm install --legacy-peer-deps

# 3. Set up environment
cp .env.example .env.local
# Edit .env.local if you have IBM credentials (optional)

# 4. Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `JWT_SECRET` | Yes | Secret for JWT signing (default provided for dev) |
| `WATSONX_URL` | No | IBM watsonx.ai endpoint URL |
| `WATSONX_API_KEY` | No | IBM Cloud API key |
| `WATSONX_PROJECT_ID` | No | IBM watsonx project ID |
| `GRANITE_MODEL` | No | Model ID (default: `ibm/granite-13b-instruct-v2`) |

**Without IBM credentials:** the app runs in Demo AI mode with deterministic, realistic outputs clearly labeled as `Demo AI`.

---

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Citizen | `citizen@demo.com` | `Demo@123` |
| Municipal Officer | `officer@demo.com` | `Demo@123` |
| Field Worker | `worker@demo.com` | `Demo@123` |

---

## Demo Workflow (Full End-to-End)

1. **Login** as `citizen@demo.com`
2. Go to **Report** tab → click **Use Demo Gujarati Complaint**
3. Text pre-fills: *"અમારા વિસ્તારમાં ત્રણ દિવસથી કચરો ઉપાડવા કોઈ આવ્યું નથી."*
4. Click **Analyze & Continue** → AI shows: Language: Gujarati, Category: Waste Collection, Priority: Critical
5. Click **Submit Complaint** → ticket created, routed to Collection Team
6. **Logout** → Login as `officer@demo.com`
7. View **Overview** tab → new complaint visible in ward stats
8. Go to **Complaints** tab → find the new complaint, click **→ In Progress**
9. Go to **Routes** tab → click **Optimize Today's Route** → see AI-optimized route vs original
10. Go to **AI Copilot** → ask *"Which wards need immediate attention?"*
11. **Logout** → Login as `worker@demo.com`
12. See assigned task → expand it → click **Start Task** → **Mark Complete**
13. **Logout** → Login as citizen → My Complaints → complaint shows **Resolved** with timeline

---

## API Reference

```
POST   /api/auth/register         Register new user
POST   /api/auth/login            Login
POST   /api/auth/logout           Logout
GET    /api/auth/me               Get current user

GET    /api/complaints            List complaints (role-filtered)
POST   /api/complaints            Create + AI classify complaint
GET    /api/complaints/:id        Get complaint with timeline
PATCH  /api/complaints/:id        Update status / assign team

GET    /api/analytics             City + ward analytics overview
GET    /api/workers               List field workers
GET    /api/notifications         User notifications
PATCH  /api/notifications         Mark all as read
GET    /api/routes                List routes
POST   /api/routes                Generate optimized route

POST   /api/ai/classify           Classify complaint text
POST   /api/ai/copilot            AI municipal copilot query
POST   /api/ai/segregation        Waste segregation analysis
```

---

## IBM Integration

When `WATSONX_URL`, `WATSONX_API_KEY`, and `WATSONX_PROJECT_ID` are set:
- The Grievance Intake Agent calls IBM Granite via the watsonx.ai REST API
- Structured JSON extraction is prompted from the model
- Responses are labeled `IBM Granite` in the UI

In demo mode: a deterministic rule-based classifier handles multilingual inputs (Gujarati Unicode detection + keyword matching).

---

## Future Improvements

- Real computer vision for waste image classification (IBM Visual Recognition)
- WhatsApp/SMS integration for citizen notifications
- GPS tracking for sanitation vehicles
- Predictive analytics for complaint volume forecasting
- Integration with AMC's existing GIS/ward boundary system
- Mobile app (React Native) for field workers
- Offline-capable PWA for low-connectivity areas
- Multilingual TTS response for voice interface

---

## Hackathon Criteria Coverage

| Criterion | Implementation |
|-----------|----------------|
| Problem relevance | Directly solves Challenge 18 — door-to-door collection, segregation, multilingual grievance |
| Innovation | 5 AI agents with real agentic workflow (not just chatbot) |
| IBM Tech | Granite LLM + watsonx.ai + IBM Cloud (env-var configured) |
| Social impact | Citizen-facing + officer command center + field worker interface |
| Scalability | Ward → City → Multi-city architecture; SQLite → PostgreSQL swap is 1 file change |
| UX | Mobile-first citizen, desktop officer, simplified worker; responsive throughout |

---

*SWACHHAI AI © 2025 · Gujarat Hackathon 2026 · Powered by IBM Granite + IBM watsonx.ai*
