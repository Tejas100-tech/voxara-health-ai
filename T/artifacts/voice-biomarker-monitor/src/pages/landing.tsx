import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  Activity, ArrowRight, BrainCircuit, Calendar, CheckCircle, ChevronRight,
  FileText, Globe, HeartPulse, Mic, Radio, Shield, Stethoscope, Users,
  Video, Zap, ShieldCheck, Clock, AlertTriangle, ScanLine, Pill,
  ArrowUpRight, Star, BadgeCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
const stagger = { visible: { transition: { staggerChildren: 0.08 } } };

function MetricBar({ value, max, color }: { value: number; max: number; color: string }) {
  return (
    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
      <motion.div className="h-full rounded-full" style={{ background: color }} initial={{ width: 0 }} animate={{ width: `${(value / max) * 100}%` }} transition={{ duration: 1.2, ease: "easeOut" }} />
    </div>
  );
}

export default function LandingPage() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  const features = [
    { icon: Mic, title: "Voice + Touch Intake", desc: "Patients speak naturally or tap options. Adaptive AI asks the right clinical questions.", color: "text-primary" },
    { icon: ScanLine, title: "Document Intelligence", desc: "Scan prescriptions, lab reports, discharge summaries — AI extracts and structures data.", color: "text-secondary" },
    { icon: BrainCircuit, title: "AI Clinical Summary", desc: "Structured physician-ready brief generated from voice intake + scanned documents.", color: "text-cyan-600" },
    { icon: Globe, title: "Indian Languages First", desc: "Hindi, Marathi, Tamil, Telugu, Gujarati, Bengali and more — designed for India.", color: "text-amber-600" },
    { icon: ShieldCheck, title: "Doctor Verification", desc: "Every AI output is labelled for clinical review. The physician is the final decision-maker.", color: "text-green-600" },
    { icon: AlertTriangle, title: "Red-Flag Detection", desc: "Urgent symptoms automatically flagged and routed to triage for priority attention.", color: "text-destructive" },
  ];

  const workflowSteps = [
    { num: 1, title: "Patient Arrives", desc: "Selects language, gives consent, identifies department", icon: Users },
    { num: 2, title: "AI History Taking", desc: "Conversational voice + touch clinical interview", icon: Mic },
    { num: 3, title: "Document Scan", desc: "Uploads prescriptions, reports — OCR extracts data", icon: ScanLine },
    { num: 4, title: "AI Summary", desc: "Structured clinical brief generated for physician", icon: BrainCircuit },
    { num: 5, title: "Doctor Review", desc: "Physician verifies, edits, confirms — consultation begins", icon: Stethoscope },
  ];

  const stats = [
    { value: "~2 min", label: "Average Intake Time" },
    { value: "7+", label: "Indian Languages" },
    { value: "100%", label: "Doctor Verified" },
    { value: "0", label: "AI Diagnoses" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/90 backdrop-blur-xl border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/30">
              <HeartPulse size={22} className="text-white" />
            </div>
            <div>
              <h1 className="font-extrabold text-primary text-lg font-[Manrope] tracking-tight">MediKiosk</h1>
              <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">Clinical Intelligence</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <Button onClick={() => setLocation(user.role === "clinician" ? "/clinician" : "/")} className="rounded-xl">
                Dashboard <ArrowRight size={16} className="ml-2" />
              </Button>
            ) : (
              <>
                <Button variant="ghost" onClick={() => setLocation("/login")} className="rounded-xl">Sign In</Button>
                <Button onClick={() => setLocation("/medikiosk")} className="rounded-xl">
                  Try Patient Kiosk <ArrowRight size={16} className="ml-2" />
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/8 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/6 rounded-full blur-[100px] -translate-x-1/4 translate-y-1/4" />
        
        <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-24">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="text-center max-w-4xl mx-auto">
            <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm font-bold text-primary mb-8">
              <Radio size={14} className="animate-pulse" /> AI-Powered Pre-Consultation Platform
            </motion.div>
            
            <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl font-extrabold font-[Manrope] tracking-tight leading-[1.05] mb-6">
              From Patient Voice to{" "}
              <span className="bg-gradient-to-r from-primary via-secondary to-cyan-500 bg-clip-text text-transparent">
                Physician Insight
              </span>
            </motion.h1>
            
            <motion.p variants={fadeIn} className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              MediKiosk transforms pre-consultation patient information into structured, reviewable clinical intelligence — giving doctors more time to be doctors.
            </motion.p>

            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Button size="lg" onClick={() => setLocation("/medikiosk")} className="px-10 py-7 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20">
                <Mic className="mr-2" size={20} /> Try Patient Kiosk
              </Button>
              <Button size="lg" variant="outline" onClick={() => setLocation("/clinician")} className="px-10 py-7 rounded-2xl text-lg font-bold">
                <Stethoscope className="mr-2" size={20} /> Open Doctor Dashboard
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div variants={fadeIn} className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-3xl md:text-4xl font-black font-[Manrope] text-primary">{stat.value}</p>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-1">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-16">
            <motion.h2 variants={fadeIn} className="text-4xl md:text-5xl font-extrabold font-[Manrope] mb-4">
              How It Works
            </motion.h2>
            <motion.p variants={fadeIn} className="text-muted-foreground text-lg max-w-2xl mx-auto">
              A complete pre-consultation workflow — from patient arrival to physician-ready briefing
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {workflowSteps.map((step, i) => (
              <motion.div key={step.num} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} transition={{ delay: i * 0.1 }} className="relative">
                <div className="bg-card border rounded-2xl p-6 h-full card-hover text-center">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <step.icon size={26} className="text-primary" />
                  </div>
                  <div className="text-xs font-black text-primary uppercase tracking-widest mb-2">Step {step.num}</div>
                  <h3 className="font-bold text-base mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
                {i < workflowSteps.length - 1 && (
                  <div className="hidden md:flex absolute top-1/2 -right-3 z-10">
                    <ChevronRight size={18} className="text-primary/40" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-16">
            <motion.h2 variants={fadeIn} className="text-4xl md:text-5xl font-extrabold font-[Manrope] mb-4">
              Built for Indian Hospitals
            </motion.h2>
            <motion.p variants={fadeIn} className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Designed for high-volume OPD environments with multilingual patients and paper records
            </motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <motion.div key={f.title} variants={fadeIn} className="bg-card border rounded-2xl p-8 card-hover group">
                <div className={`w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <f.icon size={24} className={f.color} />
                </div>
                <h3 className="font-bold text-lg mb-3">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Differentiators */}
      <section className="py-24 bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(0,180,255,.12),transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-16">
            <motion.h2 variants={fadeIn} className="text-4xl md:text-5xl font-extrabold font-[Manrope] mb-4">
              Why MediKiosk
            </motion.h2>
            <motion.p variants={fadeIn} className="text-slate-400 text-lg max-w-2xl mx-auto">
              Nine key differentiators that make MediKiosk a complete clinical intake platform
            </motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Pre-Consultation Intelligence", desc: "Information prepared before the doctor sees the patient.", icon: Zap },
              { title: "Multimodal Interaction", desc: "Voice + touch + documents — patients choose how to interact.", icon: Mic },
              { title: "Indian Languages First", desc: "Hindi, Marathi, Tamil, Telugu, Gujarati, Bengali and more.", icon: Globe },
              { title: "AYUSH Support", desc: "Dedicated extended history workflow for Ayurvedic practitioners.", icon: Activity },
              { title: "Document Intelligence", desc: "Not just scanning — extraction, structuring, and timeline.", icon: ScanLine },
              { title: "Human-in-the-Loop", desc: "Doctor verifies AI output. Physician is the final decision-maker.", icon: ShieldCheck },
              { title: "Video Consultation", desc: "Connect patient to doctor when in-person isn't possible.", icon: Video },
              { title: "Risk-Aware Triage", desc: "Potential red flags surfaced for human review.", icon: AlertTriangle },
              { title: "ABDM-Ready", desc: "Designed around India's digital health interoperability standards.", icon: Shield },
            ].map((d, i) => (
              <motion.div key={d.title} variants={fadeIn} className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <d.icon size={24} className="text-cyan-400 mb-4" />
                <h3 className="font-bold text-white mb-2">{d.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{d.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.h2 variants={fadeIn} className="text-4xl md:text-5xl font-extrabold font-[Manrope] mb-6">
              Ready to Experience MediKiosk?
            </motion.h2>
            <motion.p variants={fadeIn} className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
              Try the complete patient kiosk flow or explore the doctor dashboard
            </motion.p>
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" onClick={() => setLocation("/medikiosk")} className="px-10 py-7 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20">
                Start Patient Kiosk <ArrowRight size={20} className="ml-2" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => setLocation("/clinician")} className="px-10 py-7 rounded-2xl text-lg font-bold">
                Open Doctor Dashboard
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <HeartPulse size={18} className="text-primary" />
            <span className="font-bold text-sm">MediKiosk</span>
            <span className="text-xs text-muted-foreground">— MediKiosk does not replace the doctor. MediKiosk gives the doctor more time to be a doctor.</span>
          </div>
          <p className="text-xs text-muted-foreground">Prototype — For demonstration purposes. Not for clinical use.</p>
        </div>
      </footer>
    </div>
  );
}
