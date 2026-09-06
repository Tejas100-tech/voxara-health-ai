import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { AppLayout } from "@/components/layout";
import {
  BrainCircuit, AlertTriangle, CheckCircle2, ArrowLeft,
  FileText, Loader2, Clock, Stethoscope, Save, ChevronDown, ChevronUp,
  Download, X, Eye, Pill, ExternalLink, Image as ImageIcon, Beaker, FileSpreadsheet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getAllClinicalSummaries,
  getClinicalSummary,
  reviewClinicalSummary,
  downloadSummaryAsPDF,
  type ClinicalSummary,
} from "@/lib/api";
import { useLanguage } from "@/lib/language";

export default function ClinicianReviews() {
  const { t } = useLanguage();
  const [summaries, setSummaries] = useState<ClinicalSummary[]>([]);
  const [selectedSummary, setSelectedSummary] = useState<ClinicalSummary | null>(null);
  const [physicianNotes, setPhysicianNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showRawHistory, setShowRawHistory] = useState(false);
  const [viewingDoc, setViewingDoc] = useState<any>(null);

  useEffect(() => {
    getAllClinicalSummaries().then(setSummaries).catch(() => {});
  }, []);

  const handleReview = async (sessionId: string, status: string) => {
    setSaving(true);
    try {
      const updated = await reviewClinicalSummary(sessionId, {
        status,
        physicianNotes,
      });
      setSelectedSummary(updated);
      setSummaries((prev) => prev.map((s) => (s.sessionId === sessionId ? updated : s)));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error(err);
    }
    setSaving(false);
  };

  // ── Summary Detail View (Compact Physician Format) ─────────────────────
  if (selectedSummary) {
    const s = selectedSummary;
    const hasFlags = s.abnormalFlags && s.abnormalFlags.length > 0;
    const hasRedFlags = s.redFlags && s.redFlags.length > 0;

    return (
      <AppLayout userType="clinician">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSelectedSummary(null)}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground font-semibold"
            >
              <ArrowLeft size={16} /> {t("common.back")}
            </button>
            <Button variant="outline" size="sm" onClick={() => downloadSummaryAsPDF(s)} className="rounded-lg">
              <Download size={14} className="mr-1" /> {t("summary.download")}
            </Button>
          </div>

          {/* ── COMPACT HEADER ────────────────────────────────────────── */}
          <div className="bg-card border rounded-2xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-extrabold font-[Manrope]">{s.patientName}</h2>
                <p className="text-xs text-muted-foreground">
                  {s.patientId} · {s.sessionId} {s.abhaId ? `· ABHA: ${s.abhaId}` : ""}
                </p>
                {s.abhaVerification?.verified && (
                  <div className="mt-2 inline-flex flex-wrap items-center gap-x-3 gap-y-1 rounded-full bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800 px-3 py-1.5 text-[11px] font-semibold text-cyan-700 dark:text-cyan-400">
                    <span className="inline-flex items-center gap-1">
                      <CheckCircle2 size={12} />
                      ABHA verified{s.abhaVerification.beneficiary?.name ? ` · ${s.abhaVerification.beneficiary.name}` : ""}
                    </span>
                    {s.abhaVerification.gatewayTxnId && (
                      <span className="font-mono text-[10px] text-muted-foreground">Txn {s.abhaVerification.gatewayTxnId}</span>
                    )}
                    {s.abhaVerification.verifiedAt && (
                      <span className="text-[10px] text-muted-foreground">{new Date(s.abhaVerification.verifiedAt).toLocaleString()}</span>
                    )}
                    <span className="text-[10px] text-muted-foreground">
                      {s.abhaVerification.mode === "simulated" ? "ABDM sandbox (simulated demo)" : "ABDM sandbox"}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                {s.mode === "ayush" && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">AYUSH</span>}
                <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                  s.status === "confirmed" ? "bg-cyan-100 text-cyan-700" :
                  s.status === "reviewed" ? "bg-blue-100 text-blue-700" :
                  "bg-amber-100 text-amber-700"
                }`}>{s.status}</span>
              </div>
            </div>

            {/* ── BULLET-POINT SUMMARY (3-4 scannable items) ────────── */}
            <div className="space-y-3">
              {/* 1. Primary Complaint & Duration */}
              <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-xl">
                <span className="text-lg">🩺</span>
                <div className="flex-1">
                  <div className="text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-1">Primary Complaint</div>
                  <p className="text-sm font-bold">{s.chiefComplaint}</p>
                  {s.historyOfPresentIllness && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{s.historyOfPresentIllness}</p>
                  )}
                </div>
              </div>

              {/* 2. Red Flags / Out-of-Range Labs */}
              {(hasFlags || hasRedFlags) && (
                <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-200 dark:border-red-800">
                  <AlertTriangle size={18} className="text-red-500 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-[10px] font-black uppercase tracking-wider text-red-600 mb-1">⚠ Red Flags / Abnormal Labs</div>
                    <ul className="space-y-0.5">
                      {[...(s.redFlags || []), ...(s.abnormalFlags || [])].map((flag, i) => (
                        <li key={i} className="text-xs font-semibold text-red-600 dark:text-red-400">• {flag}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* 3. Active Medications & Allergies */}
              <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-800">
                <span className="text-lg">💊</span>
                <div className="flex-1">
                  <div className="text-[10px] font-black uppercase tracking-wider text-blue-600 mb-1">Active Medications & Allergies</div>
                  <p className="text-xs font-semibold text-foreground">{s.drugAllergyHistory || "No medications or allergies documented"}</p>
                </div>
              </div>

              {/* 4. Key History (collapsed by default) */}
              <button
                onClick={() => setShowRawHistory(!showRawHistory)}
                className="w-full flex items-center justify-between p-3 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <FileText size={14} className="text-muted-foreground" />
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Full History & Documents</span>
                </div>
                {showRawHistory ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>

              {showRawHistory && (
                <div className="space-y-3 pl-2">
                  {s.pastMedicalHistory && (
                    <CompactBlock title="Past Medical History" content={s.pastMedicalHistory} />
                  )}
                  {s.familyHistory && (
                    <CompactBlock title="Family History" content={s.familyHistory} />
                  )}
                  {s.personalHistory && (
                    <CompactBlock title="Personal History" content={s.personalHistory} />
                  )}

                  {/* AYUSH Sections */}
                  {s.mode === "ayush" && s.dashavidhaPariksha && (
                    <div className="bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-xl p-4">
                      <h4 className="font-bold text-xs text-orange-700 dark:text-orange-400 mb-3 flex items-center gap-2">
                        <Stethoscope size={14} /> Dashavidha Pariksha
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(s.dashavidhaPariksha).map(([key, val]) => (
                          <div key={key} className="text-xs">
                            <span className="font-bold text-orange-600">{val.title}:</span>{" "}
                            <span className="text-muted-foreground">{val.finding}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {s.mode === "ayush" && s.aharaVihara && (
                    <div className="bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-xl p-4">
                      <h4 className="font-bold text-xs text-orange-700 dark:text-orange-400 mb-3">Ahara-Vihara</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(s.aharaVihara).map(([key, val]) => (
                          <div key={key} className="text-xs">
                            <span className="font-bold text-orange-600">{val.title}:</span>{" "}
                            <span className="text-muted-foreground">{val.finding}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Prior Investigations */}
                  {s.priorInvestigations && s.priorInvestigations.length > 0 && (
                    <div className="bg-muted/30 border rounded-xl p-4">
                      <h4 className="font-bold text-xs mb-2">Prior Investigations</h4>
                      {s.priorInvestigations.map((inv: any, i: number) => (
                        <div key={i} className="mb-2 last:mb-0 text-xs">
                          <span className="text-muted-foreground">{inv.facility} · {inv.date}</span>
                          {inv.values?.map((v: any, j: number) => (
                            <p key={j}>
                              {v.name}: <span className={`font-bold ${v.status === "High" ? "text-red-600" : v.status === "Low" ? "text-blue-600" : ""}`}>
                                {v.value} {v.unit}
                              </span>
                              <span className="text-muted-foreground ml-1">({v.referenceRange})</span>
                            </p>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* ═══ ATTACHED DOCUMENTS — Doctor can VIEW actual images ═══ */}
                  {s.documents && s.documents.length > 0 && (
                    <div className="bg-slate-50 dark:bg-[#011C40]/40 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
                      <h4 className="font-bold text-xs text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                        📎 {s.documents.length} Patient Document{s.documents.length > 1 ? "s" : ""}
                      </h4>
                      <div className="space-y-3">
                        {s.documents.map((doc, i) => (
                          <div key={i} className="bg-white dark:bg-slate-900 rounded-lg border overflow-hidden">
                            {/* Document Header */}
                            <div className="flex items-center justify-between p-3 border-b bg-muted/20">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">
                                  {doc.type === "Lab Report" ? "🔬" : doc.type === "Prescription" ? "💊" : "📄"}
                                </span>
                                <div>
                                  <span className="font-medium text-xs">{doc.filename}</span>
                                  <span className="text-[10px] text-muted-foreground ml-2">· {doc.type}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {doc.ocrConfidence !== undefined && doc.ocrConfidence < 85 && (
                                  <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded text-[9px] font-bold">
                                    ⚠ Unconfirmed ({doc.ocrConfidence}%)
                                  </span>
                                )}
                                {doc.url && (
                                  <button
                                    onClick={() => setViewingDoc(doc)}
                                    className="flex items-center gap-1 px-2 py-1 bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400 rounded text-[10px] font-bold hover:bg-sky-100 transition-colors"
                                  >
                                    <Eye size={12} /> View
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Extracted Medicines */}
                            {doc.extractedEntities?.medications?.length > 0 && (
                              <div className="p-3 border-b">
                                <div className="text-[10px] font-black uppercase tracking-wider text-blue-600 mb-2 flex items-center gap-1">
                                  <Pill size={11} /> Extracted Medications
                                </div>
                                <div className="space-y-1.5">
                                  {doc.extractedEntities.medications.map((med: any, j: number) => (
                                    <div key={j} className="flex items-center gap-2 text-xs p-2 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                                      <span className="font-bold text-blue-800 dark:text-blue-300">{med.name}</span>
                                      {med.dosage && <span className="text-muted-foreground">· {med.dosage}</span>}
                                      {med.frequency && <span className="text-muted-foreground">· {med.frequency}</span>}
                                      {med.matchedGeneric && med.matchedGeneric !== med.name && (
                                        <span className="text-[9px] px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded font-bold">
                                          Generic: {med.matchedGeneric}
                                        </span>
                                      )}
                                      {med.matchedCategory && (
                                        <span className="text-[9px] px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded">
                                          {med.matchedCategory}
                                        </span>
                                      )}
                                      {med.unconfirmed && (
                                        <span className="text-[9px] px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded font-bold">
                                          ⚠ Verify
                                        </span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Extracted Diagnoses */}
                            {doc.extractedEntities?.diagnoses?.length > 0 && (
                              <div className="p-3 border-b">
                                <div className="text-[10px] font-black uppercase tracking-wider text-cyan-600 mb-2">Diagnoses</div>
                                <div className="flex flex-wrap gap-1">
                                  {doc.extractedEntities.diagnoses.map((d: string, j: number) => (
                                    <span key={j} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-400">{d}</span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Lab Values */}
                            {doc.extractedEntities?.labValues?.length > 0 && (
                              <div className="p-3 border-b">
                                <div className="text-[10px] font-black uppercase tracking-wider text-violet-600 mb-2 flex items-center gap-1">
                                  <Beaker size={11} /> Lab Values
                                </div>
                                <div className="grid grid-cols-2 gap-1">
                                  {doc.extractedEntities.labValues.map((lv: any, j: number) => (
                                    <div key={j} className="text-[10px] p-1.5 bg-violet-50 dark:bg-violet-950/20 rounded">
                                      <span className="font-semibold">{lv.name}:</span>{" "}
                                      <span className={`font-bold ${
                                        lv.status === "High" || lv.status === "abnormal" ? "text-red-600" :
                                        lv.status === "Low" ? "text-blue-600" : ""
                                      }`}>{lv.value} {lv.unit}</span>
                                      {lv.referenceRange && <span className="text-muted-foreground"> ({lv.referenceRange})</span>}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Abnormal Flags */}
                            {doc.abnormalFlags && doc.abnormalFlags.length > 0 && (
                              <div className="p-3 bg-red-50 dark:bg-red-950/20">
                                <div className="text-[10px] font-black uppercase tracking-wider text-red-600 mb-1 flex items-center gap-1">
                                  <AlertTriangle size={11} /> Abnormal Findings
                                </div>
                                {doc.abnormalFlags.map((flag: string, j: number) => (
                                  <p key={j} className="text-[10px] text-red-600 dark:text-red-400">• {flag}</p>
                                ))}
                              </div>
                            )}

                            {/* Unconfirmed Items */}
                            {doc.unconfirmedItems && doc.unconfirmedItems.length > 0 && (
                              <div className="p-3 bg-amber-50 dark:bg-amber-950/20">
                                <div className="text-[10px] font-black uppercase tracking-wider text-amber-600 mb-1">⚠ Needs Verification</div>
                                {doc.unconfirmedItems.map((item: string, j: number) => (
                                  <p key={j} className="text-[10px] text-amber-600 dark:text-amber-400">• {item}</p>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* AI Assessment */}
              <div className="bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800 rounded-xl p-4">
                <h4 className="font-bold text-xs text-cyan-700 dark:text-cyan-400 mb-1 flex items-center gap-2">
                  <BrainCircuit size={14} /> AI Assessment
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{s.aiAssessment}</p>
              </div>
            </div>
          </div>

          {/* ── Physician Notes & Actions ─────────────────────────────── */}
          <div className="bg-card border rounded-2xl p-6 space-y-4">
            <div>
              <label className="text-sm font-bold uppercase tracking-wider mb-2 block">
                {t("reviews.physicianNotes")}
              </label>
              <textarea
                value={physicianNotes}
                onChange={(e) => setPhysicianNotes(e.target.value)}
                placeholder={t("reviews.notesPlaceholder")}
                className="w-full h-24 rounded-xl border bg-muted/30 p-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => handleReview(s.sessionId, "reviewed")}
                disabled={saving}
                className="rounded-xl font-bold"
              >
                {saving ? <Loader2 size={16} className="animate-spin mr-2" /> : <Save size={16} className="mr-2" />}
                {t("reviews.saveNotes")}
              </Button>
              <Button
                onClick={() => handleReview(s.sessionId, "confirmed")}
                disabled={saving}
                className="flex-1 h-12 rounded-xl font-bold bg-cyan-600 hover:bg-cyan-700"
              >
                <CheckCircle2 size={18} className="mr-2" />
                {t("reviews.confirmApprove")}
              </Button>
            </div>
            {saved && (
              <div className="flex items-center gap-2 text-cyan-600 text-sm font-bold">
                <CheckCircle2 size={16} /> {t("reviews.saved")}
              </div>
            )}
          </div>
        </div>

        {/* ═══ DOCUMENT VIEWER MODAL ═══ */}
        {viewingDoc && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setViewingDoc(null)}>
            <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-2">
                  <span className="text-lg">
                    {viewingDoc.type === "Lab Report" ? "🔬" : viewingDoc.type === "Prescription" ? "💊" : "📄"}
                  </span>
                  <div>
                    <h3 className="font-bold text-sm">{viewingDoc.filename}</h3>
                    <p className="text-[10px] text-muted-foreground">{viewingDoc.type} · {viewingDoc.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {viewingDoc.url && (
                    <a
                      href={viewingDoc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-3 py-1.5 bg-sky-50 text-sky-700 rounded-lg text-xs font-bold hover:bg-sky-100 transition-colors"
                    >
                      <ExternalLink size={12} /> Open Full
                    </a>
                  )}
                  <button
                    onClick={() => setViewingDoc(null)}
                    className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
              <div className="overflow-y-auto max-h-[80vh] p-4">
                {viewingDoc.url ? (
                  viewingDoc.mimetype === "application/pdf" ? (
                    <iframe
                      src={viewingDoc.url}
                      className="w-full h-[60vh] rounded-xl border"
                      title={viewingDoc.filename}
                    />
                  ) : (
                    <img
                      src={viewingDoc.url}
                      alt={viewingDoc.filename}
                      className="w-full rounded-xl border shadow-sm"
                    />
                  )
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <ImageIcon size={48} className="mb-4 opacity-30" />
                    <p className="font-bold">Document preview not available</p>
                    <p className="text-xs mt-1">The original file was not stored</p>
                  </div>
                )}

                {/* Extracted Data Summary Below Image */}
                {viewingDoc.extractedEntities && (
                  <div className="mt-4 space-y-3">
                    {viewingDoc.extractedEntities.medications?.length > 0 && (
                      <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-xl">
                        <h4 className="text-xs font-bold text-blue-700 dark:text-blue-400 mb-2 flex items-center gap-1">
                          <Pill size={12} /> Extracted Medications
                        </h4>
                        <div className="space-y-1">
                          {viewingDoc.extractedEntities.medications.map((med: any, j: number) => (
                            <div key={j} className="text-xs flex items-center gap-2">
                              <span className="font-bold">{med.name}</span>
                              {med.dosage && <span className="text-muted-foreground">{med.dosage}</span>}
                              {med.frequency && <span className="text-muted-foreground">{med.frequency}</span>}
                              {med.matchedGeneric && med.matchedGeneric !== med.name && (
                                <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded text-[9px] font-bold">→ {med.matchedGeneric}</span>
                              )}
                              {med.unconfirmed && <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded text-[9px] font-bold">⚠</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {viewingDoc.extractedEntities.diagnoses?.length > 0 && (
                      <div className="p-3 bg-cyan-50 dark:bg-cyan-950/20 rounded-xl">
                        <h4 className="text-xs font-bold text-cyan-700 dark:text-cyan-400 mb-2">Diagnoses</h4>
                        <div className="flex flex-wrap gap-1">
                          {viewingDoc.extractedEntities.diagnoses.map((d: string, j: number) => (
                            <span key={j} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-700">{d}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {viewingDoc.extractedEntities.labValues?.length > 0 && (
                      <div className="p-3 bg-violet-50 dark:bg-violet-950/20 rounded-xl">
                        <h4 className="text-xs font-bold text-violet-700 dark:text-violet-400 mb-2 flex items-center gap-1">
                          <Beaker size={12} /> Lab Values
                        </h4>
                        <div className="space-y-1">
                          {viewingDoc.extractedEntities.labValues.map((lv: any, j: number) => (
                            <div key={j} className="text-xs">
                              <span className="font-semibold">{lv.name}:</span>{" "}
                              <span className={`font-bold ${
                                lv.status === "High" || lv.status === "abnormal" ? "text-red-600" :
                                lv.status === "Low" ? "text-blue-600" : ""
                              }`}>{lv.value} {lv.unit}</span>
                              {lv.referenceRange && <span className="text-muted-foreground ml-1">({lv.referenceRange})</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </AppLayout>
    );
  }

  // ── Summary List View ──────────────────────────────────────────────────
  return (
    <AppLayout userType="clinician">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h2 className="text-2xl font-extrabold font-[Manrope] mb-1">{t("reviews.title")}</h2>
          <p className="text-muted-foreground">{t("reviews.description")}</p>
        </div>

        {summaries.length === 0 ? (
          <div className="bg-card border rounded-[2rem] p-12 text-center">
            <BrainCircuit size={48} className="text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="font-bold text-lg mb-1">{t("clinician.noPending")}</h3>
            <p className="text-muted-foreground text-sm">Clinical summaries will appear here after patients complete intake sessions.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {summaries.map((s) => (
              <button
                key={s.sessionId}
                onClick={() => setSelectedSummary(s)}
                className="w-full text-left bg-card border rounded-2xl p-5 hover:shadow-lg transition-all hover:border-sky-200 dark:hover:border-sky-800"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-400 flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-md">
                    {s.patientName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <p className="font-bold text-base truncate">{s.patientName}</p>
                      <span className="text-xs text-muted-foreground">{s.patientId}</span>
                      {s.mode === "ayush" && <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-[10px] font-bold">AYUSH</span>}
                      {s.documents && s.documents.length > 0 && (
                        <span className="px-2 py-0.5 bg-sky-100 text-sky-700 rounded-full text-[10px] font-bold flex items-center gap-1">
                          📎 {s.documents.length} doc{s.documents.length > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{s.chiefComplaint}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span>{new Date(s.generatedAt).toLocaleDateString()}</span>
                      {s.abnormalFlags && s.abnormalFlags.length > 0 && (
                        <span className="text-red-600 flex items-center gap-1 font-bold">
                          <AlertTriangle size={11} /> {s.abnormalFlags.length} flags
                        </span>
                      )}
                    </div>
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shrink-0 ${
                    s.status === "confirmed" ? "bg-cyan-100 text-cyan-700" :
                    s.status === "reviewed" ? "bg-blue-100 text-blue-700" :
                    "bg-amber-100 text-amber-700"
                  }`}>{s.status}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

function CompactBlock({ title, content }: { title: string; content: string }) {
  return (
    <div className="text-xs p-3 bg-muted/30 rounded-lg border">
      <div className="font-bold text-muted-foreground mb-1">{title}</div>
      <p className="text-foreground">{content}</p>
    </div>
  );
}
