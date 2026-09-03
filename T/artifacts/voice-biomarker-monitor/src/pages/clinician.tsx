import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout";
import { Link } from "wouter";
import {
  LayoutDashboard, Users, FileText, Clock, ArrowRight,
  BrainCircuit, AlertTriangle, Stethoscope, CheckCircle2,
} from "lucide-react";
import { getAllIntakeSessions, getAllClinicalSummaries, type IntakeSession, type ClinicalSummary } from "@/lib/api";
import { useLanguage } from "@/lib/language";

export default function ClinicianDashboard() {
  const { t } = useLanguage();
  const [sessions, setSessions] = useState<IntakeSession[]>([]);
  const [summaries, setSummaries] = useState<ClinicalSummary[]>([]);

  useEffect(() => {
    getAllIntakeSessions().then(setSessions).catch(() => {});
    getAllClinicalSummaries().then(setSummaries).catch(() => {});
  }, []);

  const pendingReview = summaries.filter((s) => s.status === "pending_review");
  const recentSessions = sessions.slice(0, 5);

  return (
    <AppLayout userType="clinician">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-950 via-teal-950 to-slate-950 text-white p-8 md:p-10 flex flex-col md:flex-row items-stretch justify-between gap-8 shadow-2xl shadow-teal-500/10">
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_85%_15%,rgba(20,184,166,.28),transparent_38%)]" />
          <div className="relative z-10 space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full text-xs font-bold tracking-wider uppercase text-teal-300 border border-white/10">
              <Stethoscope size={13} /> {t("nav.clinician")}
            </div>
            <h1 className="text-3xl md:text-4xl font-black font-[Manrope] leading-tight">
              {t("clinician.title")}
            </h1>
            <p className="text-white/70 text-sm md:text-base max-w-md">{t("clinician.description")}</p>
          </div>
          <div className="relative z-10 flex items-center gap-6">
            <div className="text-center">
              <div className="text-4xl font-black text-teal-400">{sessions.length}</div>
              <div className="text-xs text-white/50 uppercase tracking-wider mt-1">{t("common.patients")}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-amber-400">{pendingReview.length}</div>
              <div className="text-xs text-white/50 uppercase tracking-wider mt-1">{t("clinician.pendingReview")}</div>
            </div>
          </div>
        </section>

        {/* Pending Reviews */}
        {pendingReview.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-lg flex items-center gap-2">
                <AlertTriangle size={18} className="text-amber-500" />
                {t("clinician.clinicalSummaries")}
              </h2>
              <Link href="/clinician/reviews" className="text-sm text-teal-600 font-bold hover:underline flex items-center gap-1">
                {t("nav.reviews")} <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid gap-3">
              {pendingReview.slice(0, 3).map((summary) => (
                <Link key={summary.sessionId} href="/clinician/reviews" className="block">
                  <div className="bg-card border border-amber-200 dark:border-amber-800 rounded-2xl p-5 hover:shadow-lg transition-all cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-400 flex items-center justify-center text-white">
                          <BrainCircuit size={18} />
                        </div>
                        <div>
                          <div className="font-bold">{summary.patientName}</div>
                          <div className="text-xs text-muted-foreground">{summary.chiefComplaint}</div>
                        </div>
                      </div>
                      <ArrowRight size={16} className="text-muted-foreground" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Recent Sessions */}
        <div className="space-y-4">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <Clock size={18} className="text-muted-foreground" />
            {t("clinician.recentSessions")}
          </h2>
          {recentSessions.length === 0 ? (
            <div className="bg-card border rounded-2xl p-12 text-center">
              <FileText size={40} className="mx-auto text-muted-foreground mb-4" />
              <h4 className="font-bold text-lg mb-2">{t("clinician.noPending")}</h4>
              <p className="text-muted-foreground text-sm">{t("clinician.noPendingDesc")}</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {recentSessions.map((session) => (
                <div key={session.id} className="bg-card border rounded-2xl p-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${
                      session.mode === "ayush"
                        ? "bg-gradient-to-br from-orange-500 to-amber-400"
                        : "bg-gradient-to-br from-emerald-500 to-teal-400"
                    }`}>
                      {session.mode === "ayush" ? <Stethoscope size={18} /> : <FileText size={18} />}
                    </div>
                    <div>
                      <div className="font-bold">{session.patientName}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2">
                        <Clock size={11} />
                        {new Date(session.createdAt).toLocaleString()}
                        {session.mode === "ayush" && (
                          <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-[10px] font-bold">AYUSH</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-emerald-600">{session.answers?.length || 0} answers</div>
                    <div className="text-xs text-muted-foreground">{session.status}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Link href="/clinician/queue" className="block">
            <div className="bg-card border rounded-2xl p-6 hover:shadow-lg transition-all text-center">
              <Users size={28} className="mx-auto text-teal-600 mb-3" />
              <div className="font-bold">{t("nav.queue")}</div>
              <div className="text-xs text-muted-foreground mt-1">{sessions.length} {t("common.patients")}</div>
            </div>
          </Link>
          <Link href="/clinician/reviews" className="block">
            <div className="bg-card border rounded-2xl p-6 hover:shadow-lg transition-all text-center">
              <CheckCircle2 size={28} className="mx-auto text-emerald-600 mb-3" />
              <div className="font-bold">{t("nav.reviews")}</div>
              <div className="text-xs text-muted-foreground mt-1">{pendingReview.length} {t("clinician.pendingReview")}</div>
            </div>
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}
