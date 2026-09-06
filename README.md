# 🩺 Voxara Health AI — MediKiosk

> **AI-powered clinical intake & multilingual health assistant**

Voxara Health AI (MediKiosk) is a full-stack healthcare platform where patients describe symptoms in their own language (text **or voice**, in **15+ languages including Hinglish and 10 Indian languages**), upload prescriptions/reports, and get an AI-generated clinical summary — while clinicians get a triage queue, review tools, and telehealth video calls.

The UI is styled with the **LUNA palette** (ice cyan → medium teal → steel blue → deep navy) and ships with a light **and** dark theme (light by default).

---

## ✨ Features

| Area | What it does |
|------|-------------|
| 🏠 **Landing & Auth** | LUNA-themed landing page, patient sign-in/sign-up, clinician sign-in |
| 🗣️ **AI Health Chat** | Conversational chatbot like ChatGPT — casual chat + medical Q&A (medicine info, diseases, symptoms, diet, lab values, first aid) in 15+ languages |
| 🌿 **AYUSH Chat** | Ayurvedic assistant — Prakriti/dosha guidance, herbs, dinacharya, dosha-based diet |
| 📋 **Clinical Intake** | Guided patient intake (voice/conversation + documents) that generates a structured clinical summary with Gemini AI |
| 📄 **Document OCR** | Prescriptions & reports are scanned (Mistral OCR) and attached to the intake |
| 🎙️ **Voice Input** | Indian-language speech-to-text (Sarvam AI first, Groq/Whisper fallback) |
| 📊 **Patient Dashboard** | Daily summary, intake stats, quick actions |
| 🧑‍⚕️ **Clinician Portal** | Triage queue, patient reviews, clinical summaries, appointment booking |
| 📹 **Telehealth** | Simulated video-call room between clinician and patient |
| 🚨 **SOS** | Floating emergency button wired to alert endpoints |
| 🧠 **Knowledge base** | Medicines + lab tests + Indic doctor–patient conversation patterns trained from public datasets (Kaggle Medicines, MedOCR, Indic Speech) and served before rule-based fallbacks |

> ⚠️ **Disclaimer:** AI output is informational, not a medical diagnosis. For emergencies call **108 (India)** / **112** immediately.

---

## 📁 Project Structure

```
voxara-health-ai/
└── T/                                  ← Workspace root (run all commands here)
    ├── artifacts/
    │   ├── api-server/                 ← Express.js backend (Node.js + TypeScript)
    │   └── voice-biomarker-monitor/    ← React frontend (Vite + TailwindCSS v4)
    ├── lib/
    │   ├── api-client-react/           ← Shared API hooks for the frontend
    │   ├── api-spec/                   ← OpenAPI specification
    │   ├── api-zod/                    ← Shared Zod validation schemas
    │   └── db/                         ← Database config
    ├── package.json                    ← Root workspace package
    └── pnpm-workspace.yaml             ← Monorepo workspace config
```

---

## ✅ Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| **Node.js** | v20+ | https://nodejs.org |
| **PNPM** | v9+ | `npm install -g pnpm` |

```bash
node --version   # v20.x+
pnpm --version   # v9.x+
```

---

## 🔑 Environment Variables

Create **`T/artifacts/api-server/.env`**:

```env
# Database (local Mongo or Atlas; app falls back to in-memory demo mode if absent)
MONGODB_URI=mongodb://localhost:27017/medikiosk

# Gemini AI — powers health/AYUSH chatbots + clinical summaries
GEMINI_API_KEY=your_gemini_key

# Sarvam AI — Indian-language voice transcription (primary)
SARVAM_API_KEY=your_sarvam_key

# Groq — Whisper voice transcription (fallback)
GROQ_API_KEY=your_groq_key

# Mistral AI — OCR on uploaded prescriptions/reports
MISTRAL_API_KEY=your_mistral_key

# Cloudinary — stores uploaded document images
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# ABDM / ABHA — real gateway sandbox verification (see note below).
# Leave empty for a clearly-labelled simulated sandbox response.
ABDM_SANDBOX_CLIENT_ID=
ABDM_SANDBOX_CLIENT_SECRET=
# ABDM_SANDBOX_BASE_URL=https://abdm-sbx.ndhm.gov.in
```

| Service | Purpose | Free key at |
|---------|---------|-------------|
| **Gemini** | Chatbots + clinical summary (required for AI chat) | https://aistudio.google.com/apikey |
| **Sarvam** | Indian-language speech-to-text | https://dashboard.sarvam.ai/ |
| **Groq** | Whisper transcription fallback | https://console.groq.com/ |
| **Mistral** | Document OCR | https://console.mistral.ai/ |
| **Cloudinary** | Document image storage | https://cloudinary.com/ |
| **MongoDB** | Patient data | https://cloud.mongodb.com/ (free M0) |
| **ABDM Sandbox** | Live ABHA gateway verification (`ABDM_SANDBOX_CLIENT_ID` + `ABDM_SANDBOX_CLIENT_SECRET`) | https://sandbox.abdm.gov.in/ |

> 💡 Minimum for a working demo: **`GEMINI_API_KEY`** only. Without MongoDB the app auto-runs in demo mode. AI chat auto-falls back Gemini → Groq → OpenAI until a working key is found.

### 🔐 ABHA verification — simulated vs live ABDM sandbox

Patients can link an ABHA number in the intake identity step (and the MediKiosk hub) via **`POST /api/abha/verify`** (`{ abhaNumber, name?, gender?, dateOfBirth?, mobile? }`) and demo-register via **`POST /api/abha/register`**.

* **Without sandbox credentials** the endpoint returns the **same ABDM-shaped envelope** the gateway would produce — beneficiary (`healthIdNumber`, KYC status, PHR address, masked mobile), a **FHIR `Patient`** resource, `requestId`, `gatewayTxnId`, and `mode: "simulated"` — clearly labelled so judges never mistake the demo for a live NHA call.
* **With `ABDM_SANDBOX_CLIENT_ID` / `ABDM_SANDBOX_CLIENT_SECRET`** (optionally `ABDM_SANDBOX_BASE_URL`, default `https://abdm-sbx.ndhm.gov.in`) the same code path performs the **real gateway flow**: `POST /gateway/v0.5/sessions` (`X-CM-ID: abdm`) → beneficiary lookup, returning `mode: "abdm-sandbox"`.

On a successful verification the result (verified status, **beneficiary name**, **gateway transaction id**, timestamp, mode) is **persisted on the intake session and the clinical summary** (`abhaVerification` field) and displayed as a verification chip on the patient's **Records** page and the **clinician review** header.

---

## 🚀 Running Locally

### Step 1 — Install dependencies

All commands run from **`T/`**:

```bash
cd path/to/voxara-health-ai/T
pnpm install
```

### Step 2 — Start the backend (Terminal 1)

**Mac / Linux / Git Bash:**
```bash
PORT=8080 pnpm --filter @workspace/api-server run dev
```

**Windows PowerShell:**
```powershell
$env:PORT = "8080"; pnpm --filter @workspace/api-server run dev
```

✅ You should see: `Server listening on port: 8080`

### Step 3 — Start the frontend (Terminal 2)

**Mac / Linux / Git Bash:**
```bash
PORT=23945 BASE_PATH=/ pnpm --filter @workspace/voice-biomarker-monitor run dev
```

**Windows PowerShell:**
```powershell
$env:PORT = "23945"; $env:BASE_PATH = "/"; pnpm --filter @workspace/voice-biomarker-monitor run dev
```

✅ Open **http://localhost:23945**

### Step 4 — Log in with demo accounts

| Role | Name | Email | Password |
|------|------|-------|----------|
| 🧑‍⚕️ Patient | Alex Carter | `alex@voxara.ai` | `patient123` |
| 🧑‍⚕️ Patient | Sofia Reyes | `sofia@voxara.ai` | `patient123` |
| 👨‍⚕️ Clinician | Dr. Priya Mehta | `doctor@voxara.ai` | `doctor123` |
| 👨‍⚕️ Clinician | Dr. James Osei | `james@voxara.ai` | `doctor123` |

> Clinicians sign in on the same `/login` page — they are routed to the clinician portal automatically.

---

## 🧭 Quick Walkthroughs

### 👤 Patient: New AI intake
1. Log in as `alex@voxara.ai` and click **Start New Intake** (hero circle or sidebar button).
2. Answer the guided intake — type or use voice in your preferred language.
3. Optionally upload a prescription/report (OCR extracts the text).
4. Review the **AI clinical summary** generated by Gemini.

### 🤖 Patient: Ask the AI chatbot
1. Open **Health Chat** (`/chat/general`) or **AYUSH Chat** (`/chat/ayush`) from the sidebar.
2. Ask naturally — e.g. *"Tell me about Metformin"*, *"मुझे बुखार है, क्या करूं?"*, or casual *"hi"*.
3. Chat works in English, Hindi/Hinglish, Tamil, Telugu, Bengali, Marathi, Gujarati, Kannada, Malayalam, Punjabi and more.

### 🧑‍⚕️ Clinician: Triage & review
1. Log in as `doctor@voxara.ai` — you land on the **Clinician Overview** queue.
2. Open a patient to review intakes, AI summaries, and scanned documents.
3. Use **Queue / Reviews / Appointments** for the rest of the workflow and **Start Video Call** for telehealth.

---

## 🛠️ Routes

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Everyone | Landing page (signed out) / Patient dashboard (signed in) |
| `/login` · `/signup` | Everyone | Sign in (patient + clinician) / new patient sign-up |
| `/intake` | Patients | Guided clinical intake → AI clinical summary |
| `/records` | Patients | Past intakes, documents & summaries |
| `/profile` | Patients | Profile + ABHA details |
| `/appointments` | Patients | Patient appointments |
| `/chat/general` | All | General AI health chat (multilingual) |
| `/chat/ayush` | All | AYUSH/Ayurvedic AI chat |
| `/clinician` | Clinicians | Patient triage overview |
| `/clinician/queue` | Clinicians | Clinician queue |
| `/clinician/reviews` · `/clinician/summary/:sessionId` | Clinicians | Reviews & full AI summary |
| `/clinician/appointments` | Clinicians | Clinician appointment schedule |
| `/call/:roomId` | All | Telehealth video-call room |

---

## 🔧 Useful Commands

| Command | What it does |
|---------|-------------|
| `pnpm install` | Install all workspace dependencies |
| `PORT=8080 pnpm --filter @workspace/api-server run dev` | Start backend (Mac/Linux) |
| `PORT=23945 BASE_PATH=/ pnpm --filter @workspace/voice-biomarker-monitor run dev` | Start frontend (Mac/Linux) |
| `cd artifacts/api-server && npx tsc --noEmit` | Type-check the backend |

---

## 🐛 Troubleshooting

| Problem | Fix |
|---------|-----|
| `pnpm: command not found` | `npm install -g pnpm` |
| `ECONNREFUSED 127.0.0.1:8080` | Backend isn't running — start it first |
| `PORT environment variable is required` | Always pass `PORT=...` (and `BASE_PATH=/` for the frontend) |
| MongoDB connection error | Fine — app falls back to in-memory demo mode automatically |
| Chatbot not replying / generic answers | Check `GEMINI_API_KEY`; Gemini has auto-fallback across models on transient 503s |
| Voice transcription fails | Check `SARVAM_API_KEY` and `GROQ_API_KEY` |
| OCR doesn't read a document | Check `MISTRAL_API_KEY` |

---

## 🏛️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite, Tailwind CSS v4, TanStack Query, Wouter, Recharts, Framer Motion |
| **Backend** | Node.js, Express, TypeScript, esbuild |
| **Database** | MongoDB (Mongoose) with in-memory demo fallback |
| **AI / Chat** | Google Gemini (health + AYUSH chats, clinical summaries) with automatic model fallback |
| **Voice** | Sarvam AI (Indian languages) → Groq/Whisper fallback |
| **OCR** | Mistral AI |
| **Storage** | Cloudinary |
| **Auth** | JWT + bcrypt |
| **Validation** | Zod |
| **Monorepo** | PNPM workspaces |

---

## 🎨 Theme (LUNA)

| Token | Hex | Role |
|-------|-----|------|
| Ice Cyan | `#A7EBF2` | Lightest accents, badges, glows |
| Medium Teal | `#54ACBF` | Primary buttons & gradients |
| Steel Blue | `#26658C` | Secondary elements & gradients |
| Dark Navy | `#023859` | Dark surfaces & depth |
| Midnight | `#011C40` | Sidebar (dark mode) & navy panels |

Theme tokens live in `voice-biomarker-monitor/src/index.css`; default theme is **light**, toggle is in the app header (remembered in `localStorage`).
