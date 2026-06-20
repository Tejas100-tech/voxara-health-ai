# 🎙️ Voxara Health AI

> **AI-Powered Voice Diary & Biomarker Disease Tracking**

Voxara is a non-invasive health monitoring application. Patients record a **15-second daily voice sample**, and the system uses AI/ML to track vocal biomarkers — like tremors, breathlessness, and pitch — to monitor chronic conditions (Asthma, Parkinson's, Depression, etc.) between clinical visits.

---

## 📁 Project Structure (Quick Overview)

```
voxara-health-ai-main/
└── T/                                  ← Root workspace (run all commands here)
    ├── artifacts/
    │   ├── api-server/                 ← Express.js backend (Node.js)
    │   └── voice-biomarker-monitor/    ← React frontend (Vite + TailwindCSS)
    ├── lib/
    │   ├── api-client-react/           ← Shared API hooks for the frontend
    │   ├── api-spec/                   ← OpenAPI specification
    │   ├── api-zod/                    ← Shared Zod validation schemas
    │   └── db/                         ← Database config (Drizzle ORM)
    ├── package.json                    ← Root workspace package
    └── pnpm-workspace.yaml             ← Monorepo workspace config
```

---

## ✅ Prerequisites

Before you start, make sure you have the following installed on your machine:

| Tool | Version | Install Link |
|------|---------|-------------|
| **Node.js** | v20 or higher | https://nodejs.org |
| **PNPM** | v9 or higher | `npm install -g pnpm` |

To verify your installations:
```bash
node --version    # Should print v20.x.x or higher
pnpm --version    # Should print 9.x.x or higher
```

---

## 🔑 Environment Variables

The project needs API keys for MongoDB, Cloudinary, and Groq (AI). These are already pre-filled for testing purposes.

**Location of `.env` files:**
- `T/artifacts/api-server/.env`
- `T/artifacts/voice-biomarker-monitor/.env`

**What each variable does:**

```env
# MongoDB — stores patient sessions, notifications, and user data
MONGODB_URI="mongodb+srv://..."

# Cloudinary — stores uploaded voice audio files in the cloud
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Groq — powers AI transcription (Whisper) and clinical analysis (Llama)
GROQ_API_KEY="your-groq-api-key"
```

> **Note:** The demo credentials already in the `.env` files work out of the box. You only need to change them if you want to use your own services.

---

## 🚀 Step-by-Step Setup

### Step 1 — Open the Correct Directory

All commands must be run from the **`T`** directory inside the project:

```bash
cd path/to/voxara-health-ai-main/T
```

---

### Step 2 — Install All Dependencies

This installs packages for the entire monorepo (backend + frontend + all shared libraries) in one command:

```bash
pnpm install
```

What this does:
- Reads `pnpm-workspace.yaml` to find all sub-packages
- Installs `node_modules` for `api-server`, `voice-biomarker-monitor`, and all `lib/*` packages
- Takes approximately 1–3 minutes on first run

---

### Step 3 — Start the Backend API Server

Open a **first terminal** and run:

**Windows PowerShell:**
```powershell
$env:PORT = "8080"; pnpm --filter @workspace/api-server run dev
```

**Mac / Linux / Git Bash:**
```bash
PORT=8080 pnpm --filter @workspace/api-server run dev
```

What this does:
- Compiles the TypeScript backend using `esbuild`
- Starts an **Express.js** server on port `8080`
- Connects to **MongoDB** for data storage
- Exposes REST API endpoints under `/api/...`

✅ You should see: `Server listening  port: 8080`

---

### Step 4 — Start the Frontend App

Open a **second terminal** (keep the first one running) and run:

**Windows PowerShell:**
```powershell
$env:PORT = "23945"; $env:BASE_PATH = "/"; pnpm --filter @workspace/voice-biomarker-monitor run dev
```

**Mac / Linux / Git Bash:**
```bash
PORT=23945 BASE_PATH=/ pnpm --filter @workspace/voice-biomarker-monitor run dev
```

What this does:
- Starts the **Vite** development server for the React frontend
- All `/api/...` requests are automatically proxied to the backend at port `8080`
- Enables hot module reload for fast development

✅ Open your browser at: **`http://localhost:23945`**

---

### Step 5 — Log In and Test the App

The app ships with pre-seeded demo accounts. Use these to explore both portals:

#### 🧑‍⚕️ Patient Accounts

| Name | Email | Password | Conditions |
|------|-------|----------|------------|
| Alex Carter | `alex@voxara.ai` | `patient123` | Asthma, Mild Depression |
| Sofia Reyes | `sofia@voxara.ai` | `patient123` | Parkinson's (Early Stage) |

#### 👨‍⚕️ Clinician Accounts

| Name | Email | Password |
|------|-------|----------|
| Dr. Priya Mehta | `doctor@voxara.ai` | `doctor123` |
| Dr. James Osei | `james@voxara.ai` | `doctor123` |

---

## 🧭 Step-by-Step User Walkthroughs

### 👤 Walkthrough A: Patient Recording a Voice Session

1. Go to `http://localhost:23945/login`
2. Log in as **Alex Carter** (`alex@voxara.ai` / `patient123`)
3. Click **"Record Session"** in the sidebar
4. When prompted, allow microphone access in your browser
5. Click the microphone button and **speak for 15 seconds** (describe your day, read aloud, etc.)
6. Click **"Stop & Analyze"** when done
7. The system will:
   - Transcribe your speech using **Whisper AI**
   - Extract vocal biomarkers (clarity, tremor, breathlessness, pitch)
   - Run the in-browser **neural network** to classify your vocal health
   - Save the session to MongoDB via the API server
8. You are redirected to the **Analysis** page showing your biomarker scores

---

### 📊 Walkthrough B: Viewing ML Insights

1. While logged in as a patient, click **"ML Insights"** in the navigation
2. You will see four tabs:

   | Tab | What it shows |
   |-----|--------------|
   | **Neural Network** | 4-class vocal health classification (Stable → Acute) with confidence scores |
   | **Vocal Fingerprint** | 8-axis radar chart of your unique voice profile |
   | **7-Day Forecast** | Holt-Winters prediction of your wellness trend |
   | **Anomaly Detection** | Modified Z-score scan across 13 MFCC coefficients |

3. All inference runs **entirely in your browser** — no data is sent to an ML server

---

### 🏥 Walkthrough C: Clinician Reviewing a Patient

1. Log out, then log in as **Dr. Priya Mehta** (`doctor@voxara.ai` / `doctor123`)
2. You land on the **Clinician Overview** — a triage list of all assigned patients ranked by risk level
3. Click on **Alex Carter** to open their detail page
4. You can review:
   - Voice session timeline and waveform history
   - Audio playback of any recorded session
   - AI-generated clinical summaries
   - Biomarker trend charts over time
5. Click **"Medication Workflow"** to adjust prescriptions based on vocal data
6. Click **"Schedule Appointment"** to book a follow-up session

---

### 💊 Walkthrough D: Adjusting Medication

1. As a clinician, navigate to **Medication** in the sidebar
2. Select a patient
3. Review the current prescription alongside biomarker data (e.g., elevated tremor index)
4. Adjust dosage or frequency and add clinical notes
5. Save — the patient will see updated medication details on their dashboard

---

### 📹 Walkthrough E: Video Call (Telehealth Simulation)

1. As a clinician, open a patient's detail page
2. Click **"Start Video Call"**
3. This simulates a telehealth session where the clinician can discuss biomarker results with the patient in real time

---

## 🛠️ Available Pages & Routes

| Route | Who Can Access | Description |
|-------|---------------|-------------|
| `/login` | Everyone | Patient login page |
| `/doctor-login` | Clinicians | Doctor-specific login |
| `/signup` | New users | Patient registration |
| `/` (Dashboard) | Patients | Daily summary & quick stats |
| `/record` | Patients | Voice recording interface |
| `/analysis` | Patients | Biomarker breakdown after a session |
| `/trends` | Patients | Long-term health trend charts |
| `/history` | Patients | Past recording sessions |
| `/appointments` | Patients | Upcoming appointments |
| `/medication` | Patients | Medication schedule |
| `/ml` | Patients | ML Insights dashboard |
| `/alerts` | All | Notification & alert history |
| `/clinician` | Clinicians only | Patient triage overview |
| `/clinician/patient/:id` | Clinicians only | Individual patient detail |
| `/call/:id` | All | Video call session |

---

## 🔧 Useful Commands Reference

| Command | What it does |
|---------|-------------|
| `pnpm install` | Install all workspace dependencies |
| `pnpm run build` | Type-check and build all packages |
| `pnpm run typecheck` | Run TypeScript checks across the monorepo |
| `$env:PORT = "8080"; pnpm --filter @workspace/api-server run dev` | **(Windows PS)** Start backend server |
| `$env:PORT = "23945"; $env:BASE_PATH = "/"; pnpm --filter @workspace/voice-biomarker-monitor run dev` | **(Windows PS)** Start frontend app |
| `PORT=8080 pnpm --filter @workspace/api-server run dev` | **(Mac/Linux)** Start backend server |
| `PORT=23945 BASE_PATH=/ pnpm --filter @workspace/voice-biomarker-monitor run dev` | **(Mac/Linux)** Start frontend app |

---

## 🐛 Common Issues & Fixes

**Problem:** `pnpm: command not found`
```bash
npm install -g pnpm
```

**Problem:** Frontend shows "Cannot connect to API"
- Make sure the backend is running on port `8080` first
- Check that you started it with `PORT=8080 ...`

**Problem:** `PORT environment variable is required`
- You must set `PORT` and `BASE_PATH` when starting the frontend manually
- Use: `PORT=23945 BASE_PATH=/ pnpm --filter @workspace/voice-biomarker-monitor run dev`

**Problem:** MongoDB connection error
- The app has a built-in **demo mode** — if MongoDB is unavailable, it automatically falls back to in-memory demo data
- All features still work in demo mode; data just won't persist between restarts

**Problem:** AI transcription not working
- Check that `GROQ_API_KEY` is set in `artifacts/api-server/.env`
- The system will automatically use a local fallback analysis engine if the Groq API is unavailable

---

## 🏛️ Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite 7, Tailwind CSS v4, TanStack Query, Wouter, Recharts, Framer Motion |
| **Backend** | Node.js, Express 5, TypeScript, esbuild |
| **Database** | MongoDB (via Mongoose), with in-memory demo fallback |
| **AI / ML** | Groq API (Whisper v3 + Llama 3.1), on-device browser neural network |
| **Storage** | Cloudinary (audio files) |
| **Monorepo** | PNPM Workspaces |
| **Auth** | JWT + bcrypt |
| **Validation** | Zod |
