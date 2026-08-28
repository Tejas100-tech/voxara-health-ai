import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  Leaf, BookOpen, Stethoscope, MessageCircle, FileText,
  Clock, Shield, ArrowRight, Loader2, User, Activity,
  Upload, Sparkles, Heart, Pill,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppLayout } from "@/components/layout";
import { useAuth } from "@/lib/auth";
import { createAyushChatSession, seedAyushDemoData, getPatientAyushData } from "@/lib/ayush-api";

export default function AyushHub() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [selectedMode, setSelectedMode] = useState<"education" | "pre_consultation">("pre_consultation");
  const [loading, setLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [assessmentCount, setAssessmentCount] = useState(0);

  const patientId = user?.patientId || "PT-001";

  useEffect(() => {
    const checkData = async () => {
      try {
        const data = await getPatientAyushData(patientId);
        if (data.hasAssessment) setAssessmentCount(1);
      } catch { /* no data yet */ }
    };
    checkData();
  }, [patientId]);

  const handleStartChat = async () => {
    setLoading(true);
    try {
      const session = await createAyushChatSession({
        patientId,
        patientName: user?.name || "Patient",
        language: "en",
        mode: selectedMode,
      });
      setLocation(`/patient/ayush/chat?session=${session.sessionId}&mode=${selectedMode}`);
    } catch {
      setLocation(`/patient/ayush/chat?mode=${selectedMode}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSeedDemo = async () => {
    setSeeding(true);
    try {
      await seedAyushDemoData();
      setAssessmentCount(3);
    } catch { /* silent */ }
    setSeeding(false);
  };

  return (
    <AppLayout userType={user?.role === "clinician" ? "clinician" : "patient"}>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-green-950 via-green-900 to-amber-950 text-white p-8 md:p-10 shadow-2xl shadow-green-900/30">
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_85%_15%,rgba(34,197,94,.22),transparent_38%),radial-gradient(ellipse_at_10%_90%,rgba(245,158,11,.18),transparent_40%)]" />
          <div className="absolute top-4 right-6 opacity-10">
            <svg viewBox="0 0 120 120" className="w-40 h-40" fill="none">
              <circle cx="60" cy="60" r="55" stroke="rgba(245,158,11,0.5)" strokeWidth="1" />
              <circle cx="60" cy="60" r="40" stroke="rgba(34,197,94,0.4)" strokeWidth="1" />
              <circle cx="60" cy="60" r="25" stroke="rgba(245,158,11,0.3)" strokeWidth="1" />
              <path d="M60 5 L60 115 M5 60 L115 60" stroke="rgba(34,197,94,0.2)" strokeWidth="0.5" />
            </svg>
          </div>
          <div className="relative z-10 flex flex-col md:flex-row items-start justify-between gap-8">
            <div className="space-y-4 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold tracking-wider uppercase border border-amber-400/20 text-amber-200">
                <Leaf size={13} className="animate-pulse" /> AyurVoxara · Ayurvedic AI
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold font-[Manrope] leading-tight">
                Ayurvedic <span className="text-amber-300">Pre-Consultation</span> Assistant
              </h2>
              <p className="text-green-200/80 text-base leading-relaxed">
                AI-powered Ayurvedic intake that captures your lifestyle, dietary habits, digestive patterns, and constitutional characteristics — all before your consultation with a qualified Vaidya.
              </p>
              <div className="grid grid-cols-3 gap-3 pt-2">
                {[
                  ["🌿", "Dashavidha", "10-Point Assessment"],
                  ["🎙️", "Voice + Touch", "Multilingual Input"],
                  ["📋", "Practitioner Ready", "AI-Generated Brief"],
                ].map(([emoji, value, label]) => (
                  <div key={value} className="rounded-2xl border border-white/10 bg-white/8 p-3 backdrop-blur-md">
                    <p className="text-lg mb-1">{emoji}</p>
                    <p className="text-xs font-black font-[Manrope]">{value}</p>
                    <p className="text-[9px] uppercase tracking-widest text-amber-200/60 font-bold">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Mode Selection */}
        <section className="bg-card border rounded-[2rem] p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
              <Activity size={20} className="text-green-700" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Choose Your Path</h3>
              <p className="text-xs text-muted-foreground">Select how you'd like to begin</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => setSelectedMode("pre_consultation")}
              className={`p-6 rounded-2xl border text-left transition-all ${selectedMode === "pre_consultation" ? "bg-green-50 border-green-500/30 shadow-md ring-2 ring-green-500/10" : "bg-muted/20 border hover:border-green-500/20"}`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <Stethoscope size={22} className={selectedMode === "pre_consultation" ? "text-green-700" : "text-muted-foreground"} />
                </div>
                <div>
                  <h4 className="font-bold">Pre-Consultation Assessment</h4>
                  <p className="text-[10px] text-green-700/70 uppercase tracking-wider font-bold">Ayurvedic History</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Guided conversational intake covering Ahara, Vihara, Agni, Koshtha, Nidra, Dashavidha Pariksha, and more. Your information is prepared for the Vaidya.
              </p>
              {selectedMode === "pre_consultation" && (
                <div className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-green-700">
                  ✓ Selected
                </div>
              )}
            </button>
            <button
              onClick={() => setSelectedMode("education")}
              className={`p-6 rounded-2xl border text-left transition-all ${selectedMode === "education" ? "bg-emerald-50 border-emerald-500/30 shadow-md ring-2 ring-emerald-500/10" : "bg-muted/20 border hover:border-emerald-500/20"}`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <BookOpen size={22} className={selectedMode === "education" ? "text-emerald-700" : "text-muted-foreground"} />
                </div>
                <div>
                  <h4 className="font-bold">Learn About Ayurveda</h4>
                  <p className="text-[10px] text-emerald-700/70 uppercase tracking-wider font-bold">Education Mode</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Ask questions about Prakriti, Vikriti, Agni, Dinacharya, Panchakarma, and other Ayurvedic concepts. Get simple, culturally appropriate explanations.
              </p>
              {selectedMode === "education" && (
                <div className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
                  ✓ Selected
                </div>
              )}
            </button>
          </div>
          <div className="flex justify-end mt-6">
            <Button
              size="lg"
              onClick={handleStartChat}
              disabled={loading}
              className="px-10 py-6 rounded-2xl text-lg font-bold shadow-lg shadow-green-700/20 bg-gradient-to-r from-green-700 to-emerald-600 hover:from-green-800 hover:to-emerald-700"
            >
              {loading ? <Loader2 className="animate-spin mr-2" size={20} /> : <MessageCircle className="mr-2" size={20} />}
              {loading ? "Starting..." : "Open AyurBot"}
              {!loading && <ArrowRight className="ml-2" size={18} />}
            </Button>
          </div>
        </section>

        {/* Quick Access */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { icon: Upload, title: "Upload Documents", desc: "Upload previous Ayurvedic prescriptions, treatment notes, or therapy records for OCR extraction.", color: "text-blue-600", onClick: () => setLocation("/patient/documents") },
            { icon: Clock, title: "AYUSH Timeline", desc: "View your unified Ayurvedic and medical history in chronological order.", color: "text-purple-600", onClick: () => setLocation("/patient/ayush/timeline") },
            { icon: Shield, title: "Privacy & Consent", desc: "Your data is protected under DPDP Act 2023. Consent-based access only.", color: "text-amber-600", onClick: () => {} },
          ].map((item) => (
            <button
              key={item.title}
              onClick={item.onClick}
              className="bg-card border rounded-2xl p-6 text-left hover:shadow-md transition-all group"
            >
              <item.icon size={24} className={`${item.color} mb-4 group-hover:scale-110 transition-transform`} />
              <h4 className="font-bold mb-2">{item.title}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </button>
          ))}
        </section>

        {/* Demo Data */}
        <section className="bg-muted/30 border rounded-2xl p-6 flex items-center justify-between">
          <div>
            <p className="font-bold text-sm">Demo Data</p>
            <p className="text-xs text-muted-foreground">Load sample AYUSH patients for demonstration</p>
          </div>
          <Button variant="outline" onClick={handleSeedDemo} disabled={seeding} className="rounded-xl">
            {seeding ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
            {assessmentCount > 0 ? "Demo Loaded ✓" : "Load Demo Patients"}
          </Button>
        </section>
      </div>
    </AppLayout>
  );
}
