import { AppLayout } from "@/components/layout";
import { Link } from "wouter";
import { ArrowRight, ClipboardList, Clock, FileText, ScanLine, ShieldCheck, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useLanguage } from "@/lib/language";

export default function PatientDashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();

  return (
    <AppLayout userType="patient">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Hero Banner */}
        <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#011C40] via-[#023859] to-[#011C40] text-white p-8 md:p-10 flex flex-col xl:flex-row items-stretch justify-between gap-8 shadow-2xl shadow-cyan-500/10">
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_85%_15%,rgba(16,185,129,.28),transparent_38%),radial-gradient(ellipse_at_10%_90%,rgba(20,184,166,.22),transparent_40%)]" />
          <div className="relative z-10 space-y-5 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold tracking-wider uppercase text-cyan-300 border border-white/10">
              <Activity size={13} className="animate-pulse" /> {t("app.name")} · {t("app.tagline")}
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold font-[Manrope] leading-tight">
              {t("landing.heroTitle")}{" "}
              <span className="text-cyan-400">{t("landing.heroHighlight")}</span>
            </h2>
            <p className="text-slate-300 text-base leading-relaxed">
              {user?.name}, your clinical history is captured through voice conversations and document scanning.
            </p>
            {user?.abhaId && (
              <div className="flex items-center gap-2 text-cyan-400 text-sm font-bold">
                <ShieldCheck size={16} /> ABHA ID: {user.abhaId}
              </div>
            )}
          </div>
          <div className="relative z-10 flex flex-col items-center justify-center gap-4 min-w-[240px]">
            <Link href="/intake">
              <button className="group relative flex flex-col items-center justify-center w-48 h-48 rounded-full bg-gradient-to-br from-cyan-500 to-sky-400 transition-all duration-500 shadow-2xl shadow-cyan-500/20 active:scale-95 hover:scale-105 glow-pulse">
                <span className="absolute inset-[-16px] rounded-full border border-cyan-300/15 animate-pulse" />
                <ClipboardList className="mb-2 group-hover:scale-110 transition-transform" size={52} />
                <span className="font-black tracking-tight text-center px-4 leading-tight text-base">
                  {t("nav.startNewIntake")}
                </span>
              </button>
            </Link>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">5 steps · ~5 minutes</p>
          </div>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: t("records.intakes"), value: "3", icon: ClipboardList, color: "text-cyan-600" },
            { label: t("documents.scanned"), value: "7", icon: ScanLine, color: "text-sky-600" },
            { label: t("records.summaries"), value: "2", icon: FileText, color: "text-blue-600" },
            { label: t("records.reviewed"), value: "1", icon: Clock, color: "text-cyan-600" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-card border rounded-2xl p-5 card-hover">
              <Icon size={20} className={`${color} mb-3`} />
              <p className="text-2xl font-black font-[Manrope]">{value}</p>
              <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mt-1">{label}</p>
            </div>
          ))}
        </section>

        {/* Quick Actions */}
        <section className="grid md:grid-cols-3 gap-4">
          <Link href="/intake">
            <div className="bg-gradient-to-br from-cyan-500 to-sky-400 rounded-[2rem] p-7 text-white shadow-xl card-hover cursor-pointer">
              <ClipboardList size={28} className="mb-4" />
              <h4 className="font-bold text-lg font-[Manrope] mb-1">{t("nav.newIntake")}</h4>
              <p className="text-white/80 text-sm">{t("step.converseDesc")}</p>
            </div>
          </Link>
          <Link href="/records">
            <div className="bg-card border rounded-[2rem] p-7 card-hover cursor-pointer">
              <ScanLine size={28} className="text-sky-600 dark:text-sky-400 mb-4" />
              <h4 className="font-bold text-lg font-[Manrope] mb-1">{t("step.scan")}</h4>
              <p className="text-muted-foreground text-sm">{t("step.scanDesc")}</p>
            </div>
          </Link>
          <Link href="/profile">
            <div className="bg-card border rounded-[2rem] p-7 card-hover cursor-pointer">
              <ShieldCheck size={28} className="text-cyan-600 dark:text-cyan-400 mb-4" />
              <h4 className="font-bold text-lg font-[Manrope] mb-1">{t("nav.profile")}</h4>
              <p className="text-muted-foreground text-sm">{t("step.identifyDesc")}</p>
            </div>
          </Link>
        </section>
      </div>
    </AppLayout>
  );
}
