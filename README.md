# Power for What Matters

> **AI-Powered Dynamic Emergency Power Allocation System for Critical Disaster Relief Facilities**  
> *"When power is limited, every watt matters."*

---

## 🚨 Problem Statement

During major emergencies—natural disasters, municipal grid collapses, or mass-casualty incidents—an emergency facility (field hospital, trauma center, or regional relief headquarters) faces severe electrical power deficits. 

Multiple critical subsystems demand electricity simultaneously:
- **Medical Equipment & ICU** (ventilators, hemodialysis, cardiac telemetry, patient life-support)
- **Communication Systems** (satellite uplink, disaster dispatch radio, emergency telemetry)
- **Emergency Lighting** (operating theatre lights, corridor egress safety)
- **Cooling / HVAC** (OR climate control, server room chillers, vaccine cold-chain preservation)
- **Computing & Servers** (EHR health records, diagnostic radiology imaging)
- **Water Treatment & Pumps** (sterilization steam, dialysis water filtration, fire hydrants)
- **EV & Device Charging Stations** (first-responder vehicles, patient/staff communications)
- **Emergency Support Systems** (negative pressure isolation, fire suppression valves)

Conventional power systems rely on **rigid, hardcoded priority lists**. But during a crisis, priorities change dynamically from minute to minute:
- An emergency broadcast arrives requiring immediate radio transmission wattage.
- A trauma intake arrives requiring instant ventilator and suction pump surge.
- Rooftop solar generation drops due to storm clouds or nighttime shifts.
- Diesel backup generator fuel runs low or experiences mechanical derating.
- Battery energy storage drops below critical safety buffers.

Rigid systems either trip main circuit breakers, indiscriminately black out entire wards, or starve life-critical systems.

---

## ⚡ The Solution: Power for What Matters

**Power for What Matters** is an autonomous, explainable AI operations command platform that continuously analyzes available generation, real-time consumption, clinical urgency, battery risk, and predictive demand curves to dynamically reallocate power with mathematical safety guarantees.

### Core Guarantees:
1. **Zero Life-Support Blackouts**: Critical medical systems are mathematically locked to safe minimum operating thresholds.
2. **Deterministic Constraint Optimization**: Total allocated power **never** exceeds available generation bus limits.
3. **Transparent Explainability (XAI)**: Every reallocation decision explains **WHY**, **WHAT CHANGED**, **WHAT WAS REDUCED**, **WHAT WAS INCREASED**, and **WHAT RISK WAS AVOIDED**.
4. **Predictive Awareness**: Forecasts load demand and battery degradation 15 minutes to 4 hours in advance.
5. **Hard Operator Safety Interlocks**: Prevents manual operator errors from setting life-support power below critical minimums.

---

## 📐 System Architecture

```
Power Meters & Grid Sensors (Grid, Genset, Solar, Battery)
Telemetry Uplinks & Medical Urgency Signals
Operator Controls & Safety Boundaries
                   │
                   ▼
       [ DATA INGESTION & PROCESSING ]
  (Noise filtering, load delta rates, time-of-day solar curves)
                   │
                   ▼
      [ AI MULTI-FACTOR SCORING ENGINE ]
  Priority Score = Criticality + Urgency + Medical Necessity + 
                   Comms Traffic + Battery Risk - Curtailment Margin
                   │
                   ▼
  [ MULTI-TIER CONSTRAINT SATISFACTION LAYER ]
  - Tier 1: Satisfy 100% of Life-Safety Minimums
  - Tier 2: Defend 15% Emergency Reserve Target
  - Tier 3: Proportional Weighted Surplus Distribution
                   │
                   ▼
     [ ACTUATION & EXPLAINABILITY ENGINE ]
  Actuation: Microgrid bus distribution & load dispatch
  XAI: Causal attribution (Why, Changes, Risks Averted)
                   │
                   ▼
[ COMMAND CENTER DASHBOARD & REST API ]
  - Real-time animated Power Flow Diagram
  - Interactive Facility Floor Map
  - 10-Step Automated Hackathon Jury Tour
  - PowerAI Assistant (State-Grounded Chatbot)
```

---

## 🧠 Why This AI Is Intelligent

| Conventional Emergency Power | Power for What Matters (Our Platform) |
| :--- | :--- |
| **Fixed Priority Ranks**: Hardcoded order | **Dynamic Scoring**: Recalculates dynamically based on urgency |
| **Reactive Blackouts**: Switches only after breaker trips | **Predictive Trajectory**: Anticipates battery/solar drops hours ahead |
| **Black Box / Manual**: Operators guess why switches flipped | **Transparent XAI**: Causal explanation for every single watt moved |
| **Human Delay**: Manual switching takes minutes to hours | **Millisecond Adaptation**: Autonomous closed-loop arbitration |
| **Error-Prone**: Operator can accidentally cut life support | **Hard Safety Interlocks**: Mathematical locks prevent unsafe overrides |

---

## 🚀 Key Features

1. **Live Emergency Command Center**: Real-time KPI monitors for Available Power, Consumption, Emergency Reserve (kW & %), Systems Online, AI Efficiency, and Current Risk level.
2. **Animated Power Flow Diagram**: Interactive visual energy bus flowing from 4 generation sources through the central AI Optimizer node to 8 facility subsystems.
3. **Instant Emergency Crisis Triggers**: 1-click disaster injections (Medical Emergency, Emergency Broadcast, Generator Failure, Battery Critical, Power Surge, Cooling Thermal Spike, Water Pressure Loss).
4. **Explainable AI (XAI) Reasoning Panel**: Displays concise decision factors, why power was redirected, what was reduced/boosted, and what risk was avoided.
5. **Actionable AI Recommendations**: Proactive recommendation card allowing operators to click "Apply Recommendation" to enact simulated load balancing.
6. **Predictive Analytics & Power Forecast**: Recharts area & line graphs modeling demand vs generation curves across 15m, 30m, 1h, and 4h horizons.
7. **Multi-Domain Risk Monitor**: Probabilistic threat matrix assessing power shortage, battery failure, clinical risk, communication loss, cooling failure, and water pressure risk.
8. **Auditable Decision History**: Chronological timeline logging every autonomous action with diffs and before/after risk scores.
9. **Manual Control with Safety Interlocks**: Manual adjustment console featuring strict safety blocks (e.g. attempting to lower Medical Equipment below 10.0 kW triggers an instant safety block).
10. **Interactive Facility Floor Blueprint**: Stylized SVG emergency facility map with 8 clickable zones showing heat glow and wattage.
11. **Power Sources Telemetry**: Live metrics for Municipal Grid, Diesel Genset A (with fuel runtime hours), Rooftop Solar Array, and BESS Battery Storage (LiFePO4 SOC %).
12. **Alert Notification Center**: Filterable real-time alert log (Critical, High, Warning, Info) with read/dismiss controls.
13. **Before vs After Benchmark**: Visual side-by-side contrast between conventional static allocation and AI dynamic reallocation.
14. **PowerAI Conversational Assistant**: Context-aware assistant answering natural language questions based on active facility state.
15. **System Settings & Tuning**: Select optimization strategies (`BALANCED`, `CRITICAL-FIRST`, `MEDICAL-FIRST`, `ENERGY-SAVING`) and configure facility thresholds.
16. **10-Step Interactive Hackathon Jury Tour**: Dedicated guided walkthrough demonstrating the entire narrative in 2–3 minutes with auto-play and live state synchronization.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide React icons, Recharts
- **Audio Feedback**: Custom Web Audio API synthesizer for mission-control auditory feedback
- **Backend**: Node.js, Express 5, REST API
- **Optimization Engine**: Custom deterministic multi-tier constraint satisfaction solver with mathematical safety validation
- **Zero Paid Dependencies**: 100% local execution, zero API keys required

---

## 📦 Installation & Running

### Prerequisites
- Node.js (v20+ recommended)
- npm (v10+ recommended)

### 1. Clone & Install
```bash
# Clone the repository
git clone <repo-url>
cd project

# Install root dependencies
npm install

# Install frontend dependencies
npm --prefix client install
```

### 2. Build the Application
```bash
npm run build
```

### 3. Run the Platform
To run both backend API server and frontend together:
```bash
npm start
```
The unified application will be accessible at:
```
http://localhost:3001
```

Or for development with Vite hot-reload:
```bash
npm run dev
```
(Frontend at `http://localhost:5173`, Backend API at `http://localhost:3001`)

---

## 🧪 Automated Test Suite

To verify all system constraints, safety blocks, API endpoints, and decision algorithms:
```bash
node tests/verify-system.js
```

Validation includes:
- [x] Initial status & KPI bounds
- [x] Medical Emergency surge prioritization
- [x] Emergency Broadcast uplink boost
- [x] Diesel Generator failure & microgrid islanding
- [x] Strict Safety Block preventing Medical reduction below 10.0 kW
- [x] Safe manual overrides
- [x] Releasing override back to autonomous AI
- [x] Extreme power shortage triage
- [x] Grounded PowerAI assistant natural language replies
- [x] Strategy mode changes (`CRITICAL-FIRST`)
- [x] System reset to baseline

---

## 📋 REST API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/status` | Returns complete system state, KPIs, forecast, and risks |
| `GET` | `/api/systems` | Returns all 8 subsystem parameters |
| `GET` | `/api/power` | Returns generation source outputs and bus status |
| `GET` | `/api/allocations` | Returns current allocation matrix and latest decision |
| `GET` | `/api/alerts` | Returns notification alert stream |
| `GET` | `/api/history` | Returns chronological audit decision ledger |
| `GET` | `/api/forecast` | Returns 4-horizon predictive demand & battery data |
| `POST` | `/api/optimize` | Triggers immediate multi-tier optimization solver |
| `POST` | `/api/scenario` | Arms predefined disaster scenario (`NORMAL`, `MEDICAL_EMERGENCY`, etc.) |
| `POST` | `/api/emergency` | Injects crisis event (`MEDICAL_EMERGENCY`, `GENERATOR_FAILURE`, etc.) |
| `POST` | `/api/override` | Operator manual dispatch with safety constraint checks |
| `POST` | `/api/override/release` | Returns full control to AI Optimizer |
| `POST` | `/api/recommendation/apply` | Executes current proactive AI recommendation |
| `POST` | `/api/simulation/start` | Starts continuous 3-second dynamic simulation loop |
| `POST` | `/api/simulation/pause` | Pauses real-time simulation |
| `POST` | `/api/simulation/reset` | Resets facility to initial baseline parameters |
| `POST` | `/api/settings` | Updates facility parameters & optimization strategy |
| `POST` | `/api/chat` | Queries the context-aware PowerAI assistant |

---

## 🏆 Hackathon Demo Guide (2–3 Minutes)

1. Open `http://localhost:3001`
2. Click **"HACKATHON DEMO"** in the top navigation bar.
3. Click **"AUTO-PLAY TOUR"** (or step manually through 1 to 10):
   - **Step 1**: Observe normal baseline (48 kW bus, 15% reserve).
   - **Step 2 & 3**: Communication Emergency occurs; AI immediately boosts radio power from 8 kW to 11.5 kW by throttling non-essential EV charging.
   - **Step 4 & 5**: Medical trauma Code Blue surge occurs; ICU equipment escalates to 17.5 kW; AI protects ventilators while shedding secondary cooling.
   - **Step 6 & 7**: Diesel generator derates from 15 kW to 8 kW; AI safely maintains life support within the constrained bus.
   - **Step 8 & 9**: Battery SOC drops; non-essential charging is deeply shed to preserve emergency buffers.
   - **Step 10**: Observe final Power Resilience Score (92/100) and review the decision history audit log.
4. Test **"Manual Control"** in the left sidebar: try lowering Medical Equipment below 10 kW to demonstrate the **SAFETY BLOCK** interlock.
5. Open the **"PowerAI Assistant"** drawer and ask: *"Why did you reduce cooling?"* to verify grounded live reasoning.

---

## 📄 License
MIT License. Built for the Emergency Facility Energy Resilience Hackathon.
