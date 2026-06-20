import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  Activity, AlertCircle, BrainCircuit, CheckCircle2, Cloud, Mic,
  Radio, ShieldCheck, Volume2, Wind, Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  analyzeVoiceBiomarkers, buildMFCCFeatures, saveVoiceSession, type VoiceSession,
} from "@/lib/realtime";
import { fetchAIAnalysis, fetchPatientSessions, saveSessionToServer, transcribeAudio, uploadAudioToServer } from "@/lib/api";
import { useAuth } from "@/lib/auth";

const promptText =
  "Read this aloud or describe how you feel today: I am checking in with my care team. My breathing, energy, mood, and voice all help tell the story of my health.";

type SpeechRecognitionConstructor = new () => {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: { results: ArrayLike<{ 0: { transcript: string } }> }) => void) | null;
  onerror: (() => void) | null;
};

const DURATION = 15;

function CircularTimer({ timeLeft, isRecording }: { timeLeft: number; isRecording: boolean }) {
  const r = 70;
  const circ = 2 * Math.PI * r;
  const progress = isRecording ? (timeLeft / DURATION) * circ : 0;

  return (
    <div className="relative flex items-center justify-center w-full h-full">
      <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90 absolute inset-0">
        <circle cx="80" cy="80" r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
        {isRecording && (
          <circle
            cx="80" cy="80" r={r} fill="none"
            stroke="hsl(var(--primary))" strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={circ - progress}
            style={{ transition: "stroke-dashoffset 1s linear" }}
          />
        )}
      </svg>
      <div className="relative z-10 flex flex-col items-center">
        <span className="text-6xl font-extrabold font-[Manrope] text-primary leading-none">
          {String(timeLeft).padStart(2, "0")}
        </span>
        <span className="text-xl font-bold text-muted-foreground mt-1">seconds</span>
      </div>
    </div>
  );
}

function BreathingGuide({ active }: { active: boolean }) {
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  useEffect(() => {
    if (!active) return;
    const cycle = ["inhale", "hold", "exhale"] as const;
    const durations = [3000, 1000, 3000];
    let idx = 0;
    const tick = () => {
      idx = (idx + 1) % 3;
      setPhase(cycle[idx]);
      return setTimeout(tick, durations[idx]);
    };
    const id = setTimeout(tick, durations[0]);
    return () => clearTimeout(id);
  }, [active]);

  if (!active) return null;

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className={`rounded-full border-4 border-primary/40 transition-all duration-[3000ms] ease-in-out ${
          phase === "inhale" ? "w-24 h-24 bg-primary/10" : phase === "hold" ? "w-20 h-20 bg-primary/20" : "w-12 h-12 bg-primary/5"
        }`}
      />
      <p className="text-sm font-bold text-primary uppercase tracking-widest capitalize">{phase}</p>
    </div>
  );
}

function StatusPill({ icon, text, success }: { icon: React.ReactNode; text: string; success?: boolean }) {
  return (
    <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl text-sm font-semibold border ${
      success
        ? "bg-primary/10 border-primary/20 text-primary"
        : "bg-secondary/10 border-secondary/20 text-secondary"
    }`}>
      {icon} {text}
    </div>
  );
}

function LiveTile({ icon: Icon, label, value, width, color = "bg-primary" }: {
  icon: typeof Activity; label: string; value: string; width: number; color?: string;
}) {
  return (
    <div className="bg-card/80 backdrop-blur-md border rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="p-2.5 rounded-xl bg-primary/10 text-primary"><Icon size={20} /></div>
        <span className="text-2xl font-black font-[Manrope]">{value}</span>
      </div>
      <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">{label}</p>
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${color}`}
          style={{ width: `${Math.max(4, Math.min(100, width))}%` }}
        />
      </div>
    </div>
  );
}

export default function RecordSession() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [isRecording, setIsRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [isComplete, setIsComplete] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [aiStatus, setAiStatus] = useState<"idle" | "transcribing" | "analyzing" | "done" | "error">("idle");
  const [permissionState, setPermissionState] = useState<"ready" | "live" | "demo" | "blocked">("ready");
  const [bars, setBars] = useState<number[]>(Array.from({ length: 48 }, (_, i) => 20 + ((i * 17) % 55)));
  const [volume, setVolume] = useState(0);
  const [noiseFloor, setNoiseFloor] = useState(10);
  const [clarity, setClarity] = useState(92);
  const [transcript, setTranscript] = useState("");

  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);
  const recognitionRef = useRef<InstanceType<SpeechRecognitionConstructor> | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const freqFramesRef = useRef<number[][]>([]);
  const barsSnapshotRef = useRef<number[]>([]);
  const sampleRateRef = useRef<number>(44100);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    if (isRecording && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && isRecording) {
      completeRecording();
    }
    return () => { if (timer) clearInterval(timer); };
  }, [isRecording, timeLeft]);

  useEffect(() => { return () => stopAudio(); }, []);

  const startRecording = async () => {
    setIsComplete(false);
    setTimeLeft(DURATION);
    setTranscript("");
    setIsRecording(true);
    setUploadStatus("idle");
    setAiStatus("idle");
    audioChunksRef.current = [];
    freqFramesRef.current = [];

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        startDemoAnalyzer();
        setPermissionState("demo");
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      });
      streamRef.current = stream;
      setPermissionState("live");

      const AudioContextClass =
        window.AudioContext ||
        (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) { startDemoAnalyzer(); return; }

      const audioContext = new AudioContextClass();
      audioContextRef.current = audioContext;
      sampleRateRef.current = audioContext.sampleRate;

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.65;
      analyserRef.current = analyser;

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      const data = new Uint8Array(analyser.frequencyBinCount);
      let frame = 0;
      const tick = () => {
        analyser.getByteFrequencyData(data);
        if (frame % 6 === 0) freqFramesRef.current.push(Array.from(data));
        frame++;
        const chunks = Array.from({ length: 48 }, (_, i) => data[Math.floor((i * data.length) / 48)] || 0);
        const next = chunks.map((v) => Math.max(6, Math.round((v / 255) * 100)));
        const avg = next.reduce((s, v) => s + v, 0) / next.length;
        const noise = Math.round(Math.max(6, 28 - avg / 6));
        barsSnapshotRef.current = next;
        setBars(next);
        setVolume(Math.round(avg));
        setNoiseFloor(noise);
        setClarity(Math.min(99, Math.max(68, Math.round(100 - noise + avg / 12))));
        animationRef.current = requestAnimationFrame(tick);
      };
      tick();
      startSpeechRecognition();
      startMediaRecorder(stream);
    } catch {
      setPermissionState("blocked");
      startDemoAnalyzer();
    }
  };

  const startMediaRecorder = (stream: MediaStream) => {
    try {
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "audio/ogg";
      const recorder = new MediaRecorder(stream, { mimeType });
      recorder.ondataavailable = (e) => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
      recorder.start(500);
      mediaRecorderRef.current = recorder;
    } catch { /* not supported */ }
  };

  const startDemoAnalyzer = () => {
    setPermissionState((c) => (c === "blocked" ? "blocked" : "demo"));
    const tick = () => {
      const t = Date.now() / 180;
      const next = Array.from({ length: 48 }, (_, i) => Math.round(15 + Math.abs(Math.sin(t + i * 0.44)) * 78));
      const avg = next.reduce((s, v) => s + v, 0) / next.length;
      barsSnapshotRef.current = next;
      setBars(next);
      setVolume(Math.round(avg));
      setNoiseFloor(Math.round(11 + Math.abs(Math.sin(t / 4)) * 7));
      setClarity(Math.round(88 + Math.abs(Math.sin(t / 6)) * 8));
      animationRef.current = requestAnimationFrame(tick);
    };
    tick();
  };

  const startSpeechRecognition = () => {
    const Recognition = (
      window as unknown as {
        SpeechRecognition?: SpeechRecognitionConstructor;
        webkitSpeechRecognition?: SpeechRecognitionConstructor;
      }
    ).SpeechRecognition || (
      window as unknown as {
        SpeechRecognition?: SpeechRecognitionConstructor;
        webkitSpeechRecognition?: SpeechRecognitionConstructor;
      }
    ).webkitSpeechRecognition;
    if (!Recognition) return;
    const recognition = new Recognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.onresult = (e) => {
      const spoken = Array.from(e.results).map((r) => r[0]?.transcript || "").join(" ").trim();
      if (spoken) setTranscript(spoken);
    };
    recognition.onerror = () => undefined;
    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopAudio = () => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    if (mediaRecorderRef.current?.state !== "inactive") mediaRecorderRef.current?.stop();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    recognitionRef.current?.stop();
    audioContextRef.current?.close().catch(() => undefined);
    animationRef.current = null; streamRef.current = null;
    recognitionRef.current = null; audioContextRef.current = null;
    mediaRecorderRef.current = null;
  };

  const completeRecording = async () => {
    if (!isRecording) return;
    stopAudio();
    setIsRecording(false);
    setIsComplete(true);

    const duration = DURATION - timeLeft;
    const capturedBars = barsSnapshotRef.current.length > 0 ? barsSnapshotRef.current : bars;
    const mfccFeatures = freqFramesRef.current.length > 0
      ? buildMFCCFeatures(freqFramesRef.current, capturedBars, sampleRateRef.current) : undefined;

    const model = analyzeVoiceBiomarkers({
      waveform: capturedBars, clarity, volume, noiseFloor, transcript,
      duration, live: permissionState === "live", mfcc: mfccFeatures,
    });

    const session: VoiceSession = {
      id: `REC-${Date.now().toString().slice(-5)}`,
      capturedAt: new Date().toISOString(), duration,
      clarity: model.metrics.clarity, tremor: model.metrics.tremor,
      breathlessness: model.metrics.breathlessness, pitchConsistency: model.metrics.pitchConsistency,
      speechRate: model.metrics.speechRate, confidence: model.metrics.confidence,
      noiseFloor, risk: model.metrics.risk,
      transcript: transcript || "Demo transcript: breathing is steady today, voice is clear, and fatigue is mild after a short walk.",
      waveform: capturedBars, ml: model.ml, mfcc: mfccFeatures,
    };

    saveVoiceSession(session);
    try { await saveSessionToServer(session, user?.patientId); } catch { /* continue */ }

    const audioBlob = audioChunksRef.current.length > 0
      ? new Blob(audioChunksRef.current, { type: "audio/webm" }) : null;

    if (audioBlob) {
      setUploadStatus("uploading");
      try { await uploadAudioToServer(session.id, audioBlob); setUploadStatus("done"); } catch { setUploadStatus("error"); }
      try {
        setAiStatus("transcribing");
        const aiTranscript = await transcribeAudio(audioBlob);
        if (aiTranscript && aiTranscript.length > 10) { session.transcript = aiTranscript; saveVoiceSession(session); }
      } catch { /* keep browser transcript */ }
    }

    try {
      setAiStatus("analyzing");
      const previousSessions = await fetchPatientSessions(user?.patientId ?? "PT-001");
      const patientConditions = (user as { conditions?: string[] })?.conditions ?? [];
      const aiAnalysis = await fetchAIAnalysis({ session, patientConditions, previousSessions });
      session.aiAnalysis = aiAnalysis;
      saveVoiceSession(session);
      setAiStatus("done");
    } catch { setAiStatus("error"); }

    setTimeout(() => setLocation("/analysis"), 800);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-hidden relative">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-25">
        <div
          className={`w-[600px] h-[600px] bg-gradient-to-tr from-primary to-secondary rounded-full blur-[120px] transition-all duration-1000 ${isRecording ? "scale-125 opacity-100" : "scale-100 opacity-60"}`}
        />
      </div>

      <header className="relative z-20 p-6 flex justify-between items-center border-b border-border/50 bg-background/60 backdrop-blur-xl">
        <Link href="/" className="font-extrabold text-xl tracking-tight text-primary font-[Manrope]">
          Voxara Health AI
        </Link>
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border
            ${isRecording
              ? "bg-destructive/10 border-destructive/30 text-destructive"
              : permissionState === "blocked"
              ? "bg-muted border-border text-muted-foreground"
              : "bg-card border-border text-muted-foreground"}`}
          >
            <div className={`w-2 h-2 rounded-full ${isRecording ? "bg-destructive animate-pulse" : "bg-muted-foreground/40"}`} />
            {isRecording ? "Live Recording" : permissionState === "blocked" ? "Demo Mode" : "Ready"}
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 relative z-10 pt-8 pb-10">
        <div className="w-full max-w-5xl grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">

          {/* Main Recording UI */}
          <section className="xl:col-span-7 flex flex-col items-center text-center">
            {!isComplete ? (
              <>
                {/* Timer ring */}
                <div className="w-48 h-48 mb-8 relative">
                  <CircularTimer timeLeft={timeLeft} isRecording={isRecording} />
                </div>

                {/* Breathing guide */}
                {!isRecording && <BreathingGuide active={!isRecording} />}

                {/* Mic button */}
                <button
                  className={`relative group mb-8 cursor-pointer transition-all duration-300 ${isRecording ? "scale-105" : "hover:scale-105"}`}
                  onClick={isRecording ? completeRecording : startRecording}
                >
                  {isRecording && (
                    <>
                      <div className="absolute inset-0 rounded-full bg-primary/25 scale-[1.5] blur-xl animate-pulse" />
                      <div className="absolute inset-0 rounded-full bg-secondary/20 scale-[1.25] blur-lg animate-pulse" style={{ animationDelay: "0.3s" }} />
                    </>
                  )}
                  <div className={`relative w-44 h-44 rounded-full bg-gradient-to-br from-primary to-secondary shadow-2xl flex items-center justify-center z-10 border-4 border-white/20`}>
                    <Mic className="text-white w-16 h-16" />
                  </div>
                </button>

                {/* Waveform */}
                <div className="w-full h-24 flex items-end gap-1 mb-6 px-2 rounded-2xl bg-slate-950 dark:bg-black/60 p-3 overflow-hidden shadow-inner">
                  {bars.map((bar, i) => (
                    <div
                      key={i}
                      className="w-full rounded-full transition-all duration-100 waveform-bar"
                      style={{
                        height: `${Math.max(6, bar)}%`,
                        background: isRecording
                          ? `hsl(${199 + (i / bars.length) * 40} 100% 55%)`
                          : "hsl(var(--muted))",
                      }}
                    />
                  ))}
                </div>

                {/* Prompt card */}
                <div className="bg-card/80 backdrop-blur-md px-7 py-6 rounded-2xl w-full border shadow-xl">
                  <p className="text-xs font-black uppercase tracking-widest text-primary mb-2 flex items-center justify-center gap-2">
                    <Zap size={12} /> {isRecording ? "Recording — MFCC extraction active" : "Speak naturally for 15 seconds"}
                  </p>
                  <p className="text-muted-foreground leading-relaxed mb-5 text-sm">{promptText}</p>
                  {permissionState === "blocked" && (
                    <div className="mb-4 rounded-xl border border-destructive/20 bg-destructive/8 p-3 text-sm text-destructive font-semibold flex items-center gap-2 text-left">
                      <AlertCircle size={16} /> Microphone blocked — running labeled demo analyzer.
                    </div>
                  )}
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button size="lg" className="rounded-xl px-8 py-5 text-base" onClick={isRecording ? completeRecording : startRecording}>
                      {isRecording ? "Finish & Analyze" : "Start Live Scan"}
                    </Button>
                    <Link href="/">
                      <Button variant="outline" size="lg" className="rounded-xl px-8 py-5 text-base w-full sm:w-auto">
                        Cancel
                      </Button>
                    </Link>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500 text-center">
                <div className="w-28 h-28 bg-primary/10 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-primary/20">
                  <CheckCircle2 className="text-primary w-14 h-14" />
                </div>
                <h2 className="text-4xl font-extrabold font-[Manrope] mb-3">Sample Captured</h2>
                <p className="text-muted-foreground text-base mb-6 max-w-sm">
                  Running MFCC extraction, AI transcription, and clinical analysis…
                </p>
                <div className="flex flex-col gap-3 w-full max-w-sm">
                  {uploadStatus === "uploading" && <StatusPill icon={<Cloud size={16} className="animate-pulse" />} text="Uploading audio to cloud..." />}
                  {uploadStatus === "done" && <StatusPill icon={<CheckCircle2 size={16} />} text="Audio saved to Cloudinary" success />}
                  {aiStatus === "transcribing" && <StatusPill icon={<BrainCircuit size={16} className="animate-pulse" />} text="AI transcribing voice sample..." />}
                  {aiStatus === "analyzing" && <StatusPill icon={<BrainCircuit size={16} className="animate-pulse" />} text="GPT analyzing biomarkers..." />}
                  {aiStatus === "done" && <StatusPill icon={<CheckCircle2 size={16} />} text="Clinical AI analysis complete" success />}
                  {aiStatus === "error" && <StatusPill icon={<AlertCircle size={16} />} text="AI unavailable — using local model" />}
                </div>
              </div>
            )}
          </section>

          {/* Live Metrics Sidebar */}
          <aside className="xl:col-span-5 space-y-4">
            <LiveTile icon={Volume2} label="Input Volume" value={`${volume}%`} width={volume} />
            <LiveTile icon={ShieldCheck} label="Signal Clarity" value={`${clarity}%`} width={clarity} color="bg-secondary" />
            <LiveTile icon={Wind} label="Noise Floor" value={`${noiseFloor} dB`} width={100 - noiseFloor * 3} color="bg-destructive" />
            <LiveTile
              icon={BrainCircuit} label="ML Mode"
              value={permissionState === "live" ? "MFCC Live" : "Demo"}
              width={permissionState === "live" ? 96 : 84}
            />

            <div className="bg-card/80 backdrop-blur-md border rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3 text-primary font-black uppercase tracking-widest text-xs">
                <Activity size={14} /> Live Transcript
              </div>
              <p className="text-muted-foreground leading-relaxed text-sm min-h-20">
                {transcript || "Transcript appears here when browser speech recognition is available."}
              </p>
            </div>

            <div className="bg-gradient-to-br from-primary to-secondary text-white rounded-2xl p-5 shadow-xl">
              <div className="flex items-center gap-2 mb-2">
                <Radio size={17} className="animate-pulse" />
                <span className="font-black uppercase tracking-widest text-xs">ML Pipeline</span>
              </div>
              <p className="text-white/85 text-xs leading-relaxed">
                Real-time MFCC extraction (26-band Mel filterbank, 13 cepstral coefficients), spectral centroid, ZCR, and energy tracked live. After recording: AI transcription via Whisper, then GPT clinical analysis with disease-specific biomarker interpretation.
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
