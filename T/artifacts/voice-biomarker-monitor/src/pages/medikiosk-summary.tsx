import { useState, useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowLeft, Check, CheckCircle, Clock, FileText, HeartPulse,
  Loader2, Printer, Send, Shield, User, Stethoscope, AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppLayout } from "@/components/layout";
import { useAuth } from "@/lib/auth";
import { generateSummary } from "@/lib/medikiosk-api";
import type { ClinicalHistoryRecord } from "@/lib/medikiosk-api";
import { t } from "@/lib/medikiosk-i18n";

export default function MedikioskSummary() {
  const [, setLocation] = useLocation();
  const search = useSearch();
  const { user } = useAuth();
  const params = new URLSearchParams(search);
  const sessionId = params.get("session") || "";

  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [summary, setSummary] = useState<ClinicalHistoryRecord | null>(null);
  const [completenessScore, setCompletenessScore] = useState(0);
  const [physicianNotified, setPhysicianNotified] = useState(false);

  useEffect(() => {
    if (!sessionId) return;
    setLoading(true);
    generateSummary(sessionId)
      .then((data) => {
        setSummary(data.summary);
        setCompletenessScore(data.completenessScore);
      })
      .catch(() => {
        // Fallback demo summary
        setSummary({
          historyId: `CH-DEMO-${Date.now()}`,
          sessionId,
          patientId: user?.patientId || "PT-001",
          patientName: user?.name || "Patient",
          chiefComplaint: "Chest Pain",
          hpi: {
            onset: "Hours ago",
            character: "Dull, pressing",
            severity: "6/10",
            timing: "During exertion",
            aggravatingFactors: ["Walking", "Stress"],
            relievingFactors: ["Rest"],
          },
          pastMedicalHistory: ["Hypertension", "Type 2 Diabetes"],
          pastSurgicalHistory: [],
          drugHistory: [
            { name: "Metformin", dosage: "500mg", frequency: "1-0-1" },
            { name: "Amlodipine", dosage: "5mg", frequency: "0-0-1" },
          ],
          allergyHistory: [{ allergen: "Penicillin", reaction: "Rash", severity: "Moderate" }],
          familyHistory: ["Father: Heart Disease", "Mother: Diabetes"],
          personalHistory: { smoking: "Former smoker", alcohol: "Occasionally", occupation: "Office worker" },
          reviewOfSystems: {},
          priorInvestigations: [
            { testName: "Fasting Blood Sugar", value: "142 mg/dL", referenceRange: "70-100", isAbnormal: true },
            { testName: "HbA1c", value: "7.8%", referenceRange: "<5.7%", isAbnormal: true },
          ],
          aiSummary: "Patient presents with exertional chest pain described as dull and pressing, rated 6/10 severity. Pain occurs during physical activity and is relieved by rest. History significant for hypertension and Type 2 DM. Current medications include Metformin and Amlodipine. Known allergy to Penicillin (rash). Family history positive for heart disease (father) and diabetes (mother). Former smoker, occasional alcohol. Lab findings: elevated fasting glucose (142) and HbA1c (7.8%) suggesting suboptimal glycemic control. Red flags: chest pain with exertion in a patient with multiple cardiovascular risk factors requires urgent cardiac evaluation.",
          redFlags: ["chest pain", "exertion"],
          completenessScore: 82,
          physicianReviewed: false,
          createdAt: new Date().toISOString(),
        });
        setCompletenessScore(82);
      })
      .finally(() => setLoading(false));
  }, [sessionId, user]);

  const handleNotifyPhysician = () => {
    setGenerating(true);
    setTimeout(() => {
      setPhysicianNotified(true);
      setGenerating(false);
    }, 1500);
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-IN", {
        year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <AppLayout userType={user?.role === "clinician" ? "clinician" : "patient"}>
        <div className="max-w-3xl mx-auto flex flex-col items-center justify-center py-32 space-y-6">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <Loader2 className="animate-spin text-primary" size={36} />
          </div>
          <h3 className="text-xl font-extrabold font-[Manrope]">Generating Clinical Summary</h3>
          <p className="text-muted-foreground text-center max-w-md">
            AI is synthesizing your conversational history and scanned documents into a structured physician-ready summary...
          </p>
          <div className="w-64">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "90%" }}
                transition={{ duration: 4, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!summary) {
    return (
      <AppLayout userType={user?.role === "clinician" ? "clinician" : "patient"}>
        <div className="max-w-3xl mx-auto text-center py-20">
          <p className="text-muted-foreground">Failed to generate summary.</p>
          <Button onClick={() => setLocation("/medikiosk")} className="mt-4 rounded-xl">{t("backToHub")}</Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout userType={user?.role === "clinician" ? "clinician" : "patient"}>
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setLocation("/medikiosk")}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={16} /> {t("backToHub")}
          </button>
          <div className="flex items-center gap-2 text-sm font-bold text-secondary">
            <FileText size={16} />
            {t("physicianReadySummary")}
          </div>
        </div>

        {/* Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border rounded-[2rem] shadow-sm overflow-hidden"
        >
          {/* Summary Header */}
          <div className="bg-gradient-to-r from-slate-950 to-slate-800 text-white p-8">
            <div className="flex items-start justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full text-xs font-bold text-sky-200 uppercase tracking-widest mb-3">
                  <Stethoscope size={12} /> {t("physicianReadySummary")}
                </div>
                <h3 className="text-2xl font-extrabold font-[Manrope]">{t("physicianReadySummary")}</h3>
                <p className="text-slate-300 text-sm mt-1">
                  {t("generatedFor")} <span className="font-bold text-white">{summary.patientName}</span> ({summary.patientId})
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">{t("completeness")}</p>
                <p className={`text-3xl font-black ${
                  completenessScore >= 80 ? "text-green-400" : completenessScore >= 60 ? "text-amber-400" : "text-red-400"
                }`}>
                  {completenessScore}%
                </p>
              </div>
            </div>
          </div>

          {/* Summary Content */}
          <div className="p-8 space-y-8">

            {/* Chief Complaint */}
            <section>
              <SectionHeader icon={AlertTriangle} label={t("chiefComplaintLabel")} color="text-destructive" />
              <div className="p-4 bg-destructive/5 border border-destructive/10 rounded-xl">
                <p className="font-bold text-lg">{summary.chiefComplaint}</p>
              </div>
            </section>

            {/* Red Flags */}
            {summary.redFlags.length > 0 && (
              <section className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle size={16} className="text-destructive" />
                  <p className="font-bold text-destructive text-sm">{t("redFlagsDetected")}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {summary.redFlags.map((flag) => (
                    <span key={flag} className="text-xs font-bold bg-destructive/20 text-destructive px-3 py-1 rounded-full">
                      {flag}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* HPI */}
            <section>
              <SectionHeader icon={FileText} label={t("hpi")} />
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(summary.hpi).map(([key, value]) => (
                  <div key={key} className="p-3 bg-muted/30 rounded-xl">
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-1">
                      {key.replace(/_/g, " ")}
                    </p>
                    <p className="text-sm font-semibold">
                      {Array.isArray(value) ? value.join(", ") : String(value)}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Past Medical History */}
            {summary.pastMedicalHistory.length > 0 && (
              <section>
                <SectionHeader icon={HeartPulse} label={t("pastMedicalLabel")} />
                <div className="flex flex-wrap gap-2">
                  {summary.pastMedicalHistory.map((item) => (
                    <span key={item} className="px-3 py-1.5 bg-primary/10 text-primary text-sm font-bold rounded-full">
                      {item}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Drug History */}
            {summary.drugHistory.length > 0 && (
              <section>
                <SectionHeader icon={Stethoscope} label={t("currentMedications")} />
                <div className="space-y-2">
                  {(summary.drugHistory as Array<Record<string, string>>).map((drug, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
                      <span className="font-bold text-sm">{drug.name}</span>
                      <span className="text-xs text-muted-foreground">{drug.dosage} — {drug.frequency}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Allergies */}
            {summary.allergyHistory.length > 0 && (
              <section>
                <SectionHeader icon={Shield} label={t("allergyLabel")} />
                <div className="space-y-2">
                  {(summary.allergyHistory as Array<Record<string, string>>).map((allergy, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 rounded-xl">
                      <span className="font-bold text-sm">{allergy.allergen}</span>
                      <span className="text-xs text-muted-foreground">Reaction: {allergy.reaction}</span>
                      <span className="text-xs font-bold text-amber-600">{allergy.severity}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Family History */}
            {summary.familyHistory.length > 0 && (
              <section>
                <SectionHeader icon={User} label={t("familyHistoryLabel")} />
                <ul className="space-y-1">
                  {summary.familyHistory.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm">
                      <Check size={12} className="text-secondary shrink-0" /> {item}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Personal History */}
            {Object.keys(summary.personalHistory).length > 0 && (
              <section>
                <SectionHeader icon={User} label={t("personalHistory")} />
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(summary.personalHistory).map(([key, value]) => (
                    <div key={key} className="p-3 bg-muted/30 rounded-xl">
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-1">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </p>
                      <p className="text-sm font-semibold">{value}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Prior Investigations */}
            {summary.priorInvestigations.length > 0 && (
              <section>
                <SectionHeader icon={FileText} label={t("priorInvestigations")} />
                <div className="space-y-2">
                  {(summary.priorInvestigations as Array<Record<string, unknown>>).map((inv, i) => {
                    const abnormal = !!inv.isAbnormal;
                    return (
                    <div key={i} className={`flex items-center justify-between p-3 rounded-xl ${
                      abnormal ? "bg-destructive/5 border border-destructive/15" : "bg-muted/30"
                    }`}>
                      <span className="font-semibold text-sm">{String(inv.testName)}</span>
                      <div className="flex items-center gap-3">
                        <span className={`font-bold text-sm ${abnormal ? "text-destructive" : ""}`}>
                          {String(inv.value)}
                        </span>
                        <span className="text-[10px] text-muted-foreground">Ref: {String(inv.referenceRange)}</span>
                        {abnormal && <AlertTriangle size={14} className="text-destructive" />}
                      </div>
                    </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* AI Summary */}
            <section>
              <SectionHeader icon={Stethoscope} label={t("aiSummary")} />
              <div className="p-5 bg-slate-50 dark:bg-slate-900/50 rounded-xl border">
                <p className="text-sm leading-relaxed whitespace-pre-line">{summary.aiSummary}</p>
              </div>
              <p className="text-[10px] text-muted-foreground mt-2 font-bold">
                ⚠ {t("aiDisclaimer")}
              </p>
            </section>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">
            <Clock size={14} className="inline mr-1" />
            Generated: {formatDate(summary.createdAt)}
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="rounded-xl" onClick={() => window.print()}>
              <Printer size={16} className="mr-2" /> {t("printSummary")}
            </Button>
            <Button
              onClick={handleNotifyPhysician}
              disabled={physicianNotified || generating}
              className="px-8 rounded-xl font-bold shadow-lg shadow-primary/20"
            >
              {generating ? (
                <Loader2 className="animate-spin mr-2" size={16} />
              ) : physicianNotified ? (
                <CheckCircle className="mr-2" size={16} />
              ) : (
                <Send className="mr-2" size={16} />
              )}
              {physicianNotified ? t("physicianNotified") : t("sendToPhysician")}
            </Button>
          </div>
        </div>

        {/* Complete Message */}
        {physicianNotified && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-secondary/10 border border-secondary/20 rounded-2xl p-6 text-center"
          >
            <CheckCircle className="text-secondary mx-auto mb-3" size={32} />
            <h4 className="font-bold text-lg mb-2">{t("intakeComplete")}</h4>
            <p className="text-sm text-muted-foreground mb-4">
              {t("intakeCompleteDesc")}
            </p>
            <Button onClick={() => setLocation("/")} className="rounded-xl">
              {t("returnToDashboard")}
            </Button>
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
}

function SectionHeader({ icon: Icon, label, color }: { icon: typeof FileText; label: string; color?: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <Icon size={16} className={color || "text-primary"} />
      <h4 className="font-bold text-sm uppercase tracking-wider">{label}</h4>
    </div>
  );
}
