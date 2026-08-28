import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowLeft, Check, CheckCircle, Clock, FileText, HeartPulse,
  Loader2, Search, Send, Shield, Stethoscope, AlertTriangle, User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppLayout } from "@/components/layout";
import { useAuth } from "@/lib/auth";
import { getHistories, reviewSummary } from "@/lib/medikiosk-api";
import type { ClinicalHistoryRecord } from "@/lib/medikiosk-api";

export default function MedikioskClinicianReview() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [histories, setHistories] = useState<ClinicalHistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedHistory, setSelectedHistory] = useState<ClinicalHistoryRecord | null>(null);
  const [approving, setApproving] = useState(false);

  useEffect(() => {
    setLoading(true);
    getHistories()
      .then((data) => {
        setHistories(data);
        if (data.length > 0) setSelectedHistory(data[0]);
      })
      .catch(() => {
        // Demo data
        const demoHistories: ClinicalHistoryRecord[] = [
          {
            historyId: "CH-DEMO-1",
            sessionId: "INT-DEMO-1",
            patientId: "PT-001",
            patientName: "Alex Carter",
            chiefComplaint: "Chest Pain",
            hpi: { onset: "Hours ago", character: "Dull, pressing", severity: "6/10", timing: "During exertion" },
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
              { testName: "FBS", value: "142 mg/dL", referenceRange: "70-100", isAbnormal: true },
              { testName: "HbA1c", value: "7.8%", referenceRange: "<5.7%", isAbnormal: true },
            ],
            aiSummary: "Exertional chest pain in a 34yo male with HTN, T2DM. Dull, pressing, 6/10, relieved by rest. Multiple cardiovascular risk factors. Former smoker. Suboptimal glycemic control.",
            redFlags: ["chest pain", "exertion"],
            completenessScore: 82,
            physicianReviewed: false,
            createdAt: new Date(Date.now() - 1800000).toISOString(),
          },
          {
            historyId: "CH-DEMO-2",
            sessionId: "INT-DEMO-2",
            patientId: "PT-002",
            patientName: "Sofia Reyes",
            chiefComplaint: "Tremor & Joint Pain",
            hpi: { onset: "Weeks ago", character: "Shaking, aching", severity: "5/10", timing: "Worse in morning" },
            pastMedicalHistory: ["Parkinson's Disease (Early Stage)"],
            pastSurgicalHistory: [],
            drugHistory: [{ name: "Levodopa/Carbidopa", dosage: "25/100mg", frequency: "1-0-1" }],
            allergyHistory: [],
            familyHistory: ["Mother: Parkinson's"],
            personalHistory: { occupation: "Retired teacher" },
            reviewOfSystems: {},
            priorInvestigations: [],
            aiSummary: "Progressive tremor and joint pain in 62yo female with early Parkinson's. Morning exacerbation. On Levodopa. Family history positive.",
            redFlags: [],
            completenessScore: 71,
            physicianReviewed: false,
            createdAt: new Date(Date.now() - 3600000).toISOString(),
          },
        ];
        setHistories(demoHistories);
        setSelectedHistory(demoHistories[0]);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleApprove = async (historyId: string) => {
    setApproving(true);
    try {
      await reviewSummary(historyId, {}, true);
      setHistories((prev) =>
        prev.map((h) => (h.historyId === historyId ? { ...h, physicianReviewed: true } : h))
      );
      if (selectedHistory?.historyId === historyId) {
        setSelectedHistory((prev) => (prev ? { ...prev, physicianReviewed: true } : null));
      }
    } catch (err) {
      console.error("Failed to approve:", err);
    } finally {
      setApproving(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      const mins = Math.round((Date.now() - d.getTime()) / 60000);
      if (mins < 60) return `${mins} min ago`;
      return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  return (
    <AppLayout userType="clinician">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold font-[Manrope]">MediKiosk Intake Reviews</h2>
            <p className="text-sm text-muted-foreground">Patient clinical histories ready for physician review</p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="px-3 py-1.5 bg-primary/10 text-primary rounded-full font-bold">
              {histories.filter((h) => !h.physicianReviewed).length} Pending
            </span>
            <span className="px-3 py-1.5 bg-secondary/10 text-secondary rounded-full font-bold">
              {histories.filter((h) => h.physicianReviewed).length} Reviewed
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* History List */}
          <div className="lg:col-span-2 space-y-3">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-primary" size={24} />
              </div>
            ) : histories.length === 0 ? (
              <div className="text-center py-20 bg-card border rounded-2xl">
                <FileText className="mx-auto text-muted-foreground mb-3" size={32} />
                <p className="text-muted-foreground">No intake histories yet</p>
              </div>
            ) : (
              histories.map((history) => (
                <button
                  key={history.historyId}
                  onClick={() => setSelectedHistory(history)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all ${
                    selectedHistory?.historyId === history.historyId
                      ? "bg-primary/5 border-primary/30 shadow-md"
                      : "bg-card border hover:border-primary/20"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <User size={16} className="text-primary" />
                      </div>
                      <div>
                        <p className="font-bold text-sm">{history.patientName}</p>
                        <p className="text-[10px] text-muted-foreground">{history.patientId}</p>
                      </div>
                    </div>
                    {history.physicianReviewed ? (
                      <CheckCircle size={16} className="text-secondary shrink-0" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0 mt-2" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 bg-destructive/10 text-destructive text-[10px] font-bold rounded-full">
                      {history.chiefComplaint}
                    </span>
                    {history.redFlags.length > 0 && (
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-full">
                        ⚠ Red Flags
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock size={11} /> {formatDate(history.createdAt)}
                    </span>
                    <span className={`text-xs font-bold ${
                      history.completenessScore >= 80 ? "text-secondary" : history.completenessScore >= 60 ? "text-amber-500" : "text-destructive"
                    }`}>
                      {history.completenessScore}%
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>

          {/* History Detail */}
          <div className="lg:col-span-3">
            {selectedHistory ? (
              <motion.div
                key={selectedHistory.historyId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border rounded-[2rem] shadow-sm overflow-hidden"
              >
                {/* Detail Header */}
                <div className="bg-gradient-to-r from-slate-950 to-slate-800 text-white p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-extrabold font-[Manrope]">{selectedHistory.patientName}</h3>
                      <p className="text-slate-300 text-sm">{selectedHistory.patientId} · {selectedHistory.chiefComplaint}</p>
                    </div>
                    <div className={`px-4 py-2 rounded-xl text-sm font-bold ${
                      selectedHistory.physicianReviewed
                        ? "bg-secondary/20 text-secondary"
                        : "bg-amber-500/20 text-amber-300"
                    }`}>
                      {selectedHistory.physicianReviewed ? "✓ Reviewed" : "Pending Review"}
                    </div>
                  </div>
                </div>

                {/* Detail Body */}
                <div className="p-6 space-y-6 max-h-[600px] overflow-y-auto">

                  {/* Red Flags */}
                  {selectedHistory.redFlags.length > 0 && (
                    <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle size={16} className="text-destructive" />
                        <p className="font-bold text-destructive text-sm">Red Flags</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedHistory.redFlags.map((f) => (
                          <span key={f} className="text-xs font-bold bg-destructive/20 text-destructive px-3 py-1 rounded-full">{f}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* HPI */}
                  <section>
                    <h4 className="font-bold text-xs uppercase tracking-wider text-primary mb-2">History of Present Illness</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(selectedHistory.hpi).map(([key, value]) => (
                        <div key={key} className="p-2.5 bg-muted/30 rounded-lg">
                          <p className="text-[10px] text-muted-foreground font-bold uppercase">{key.replace(/_/g, " ")}</p>
                          <p className="text-sm font-semibold">{Array.isArray(value) ? value.join(", ") : String(value)}</p>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Past Medical */}
                  {selectedHistory.pastMedicalHistory.length > 0 && (
                    <section>
                      <h4 className="font-bold text-xs uppercase tracking-wider text-primary mb-2">Past Medical History</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedHistory.pastMedicalHistory.map((m) => (
                          <span key={m} className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">{m}</span>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Medications */}
                  {selectedHistory.drugHistory.length > 0 && (
                    <section>
                      <h4 className="font-bold text-xs uppercase tracking-wider text-primary mb-2">Current Medications</h4>
                      <div className="space-y-1">
                        {(selectedHistory.drugHistory as Array<Record<string, string>>).map((d, i) => (
                          <div key={i} className="flex justify-between p-2 bg-muted/30 rounded-lg text-sm">
                            <span className="font-bold">{d.name}</span>
                            <span className="text-muted-foreground">{d.dosage} — {d.frequency}</span>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Allergies */}
                  {selectedHistory.allergyHistory.length > 0 && (
                    <section>
                      <h4 className="font-bold text-xs uppercase tracking-wider text-amber-500 mb-2">Allergies</h4>
                      <div className="space-y-1">
                        {(selectedHistory.allergyHistory as Array<Record<string, string>>).map((a, i) => (
                          <div key={i} className="flex items-center gap-3 p-2 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 rounded-lg text-sm">
                            <span className="font-bold">{a.allergen}</span>
                            <span className="text-muted-foreground text-xs">{a.reaction}</span>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Investigations */}
                  {selectedHistory.priorInvestigations.length > 0 && (
                    <section>
                      <h4 className="font-bold text-xs uppercase tracking-wider text-primary mb-2">Prior Investigations</h4>
                      <div className="space-y-1">
                        {(selectedHistory.priorInvestigations as Array<Record<string, unknown>>).map((inv, i) => {
                          const abnormal = !!inv.isAbnormal;
                          return (
                          <div key={i} className={`flex justify-between p-2 rounded-lg text-sm ${
                            abnormal ? "bg-destructive/5 border border-destructive/15" : "bg-muted/30"
                          }`}>
                            <span className="font-semibold">{String(inv.testName)}</span>
                            <span className={`font-bold ${abnormal ? "text-destructive" : ""}`}>
                              {String(inv.value)} {abnormal && "⚠"}
                            </span>
                          </div>
                        );})}
                      </div>
                    </section>
                  )}

                  {/* AI Summary */}
                  <section>
                    <h4 className="font-bold text-xs uppercase tracking-wider text-secondary mb-2">AI Summary</h4>
                    <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border text-sm leading-relaxed">
                      {selectedHistory.aiSummary}
                    </div>
                  </section>
                </div>

                {/* Action Bar */}
                <div className="p-4 border-t flex justify-between items-center">
                  <p className="text-xs text-muted-foreground">
                    {selectedHistory.completenessScore}% complete · {formatDate(selectedHistory.createdAt)}
                  </p>
                  <div className="flex gap-3">
                    <Button variant="outline" className="rounded-xl" size="sm">
                      Edit Summary
                    </Button>
                    <Button
                      onClick={() => handleApprove(selectedHistory.historyId)}
                      disabled={approving || selectedHistory.physicianReviewed}
                      className="rounded-xl"
                      size="sm"
                    >
                      {approving ? (
                        <Loader2 className="animate-spin mr-2" size={14} />
                      ) : (
                        <CheckCircle className="mr-2" size={14} />
                      )}
                      {selectedHistory.physicianReviewed ? "Approved ✓" : "Approve & Confirm"}
                    </Button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="bg-card border rounded-2xl p-12 text-center">
                <Stethoscope className="mx-auto text-muted-foreground mb-3" size={40} />
                <p className="text-muted-foreground font-bold">Select a patient history to review</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
