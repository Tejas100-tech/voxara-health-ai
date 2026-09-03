import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout";
import {
  FileText, Calendar, Clock, BrainCircuit, AlertTriangle,
  ChevronDown, ChevronUp, Stethoscope, Download,
} from "lucide-react";
import { getAllIntakeSessions, getAllClinicalSummaries, type IntakeSession, type ClinicalSummary } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useLanguage } from "@/lib/language";

export default function MyRecords() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [sessions, setSessions] = useState<IntakeSession[]>([]);
  const [summaries, setSummaries] = useState<ClinicalSummary[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    getAllIntakeSessions().then(setSessions).catch(() => {});
    getAllClinicalSummaries().then(setSummaries).catch(() => {});
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <AppLayout userType="patient">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h2 className="text-2xl font-extrabold font-[Manrope] mb-1">{t("records.title")}</h2>
          <p className="text-muted-foreground">{t("records.description")}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-card border rounded-2xl p-4 text-center">
            <div className="text-3xl font-black text-emerald-600">{sessions.length}</div>
            <div className="text-xs text-muted-foreground font-bold uppercase tracking-wider mt-1">{t("records.intakes")}</div>
          </div>
          <div className="bg-card border rounded-2xl p-4 text-center">
            <div className="text-3xl font-black text-teal-600">{summaries.length}</div>
            <div className="text-xs text-muted-foreground font-bold uppercase tracking-wider mt-1">{t("records.summaries")}</div>
          </div>
          <div className="bg-card border rounded-2xl p-4 text-center">
            <div className="text-3xl font-black text-blue-600">{summaries.filter((s) => s.status === "approved").length}</div>
            <div className="text-xs text-muted-foreground font-bold uppercase tracking-wider mt-1">{t("records.reviewed")}</div>
          </div>
        </div>

        {/* Summaries */}
        {summaries.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-bold text-lg">{t("records.summaries")}</h3>
            {summaries.map((summary) => (
              <div key={summary.sessionId} className="bg-card border rounded-2xl p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-400 flex items-center justify-center text-white">
                      <BrainCircuit size={18} />
                    </div>
                    <div>
                      <div className="font-bold">{summary.chiefComplaint}</div>
                      <div className="text-xs text-muted-foreground">{new Date(summary.generatedAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    summary.status === "approved" ? "bg-emerald-100 text-emerald-700" :
                    summary.status === "pending_review" ? "bg-amber-100 text-amber-700" :
                    "bg-slate-100 text-slate-700"
                  }`}>
                    {summary.status === "approved" ? "✓ Approved" :
                     summary.status === "pending_review" ? t("records.summaryReady") : summary.status}
                  </span>
                </div>
                {summary.aiAssessment && (
                  <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{summary.aiAssessment}</p>
                )}
                {summary.abnormalFlags && summary.abnormalFlags.length > 0 && (
                  <div className="mt-3 flex items-center gap-2 text-xs text-amber-600">
                    <AlertTriangle size={12} />
                    {summary.abnormalFlags.length} abnormal finding{summary.abnormalFlags.length > 1 ? "s" : ""}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Sessions */}
        <div className="space-y-3">
          <h3 className="font-bold text-lg">{t("records.intakes")}</h3>
          {sessions.length === 0 ? (
            <div className="bg-card border rounded-2xl p-12 text-center">
              <FileText size={40} className="mx-auto text-muted-foreground mb-4" />
              <h4 className="font-bold text-lg mb-2">{t("records.noRecords")}</h4>
              <p className="text-muted-foreground text-sm">{t("records.noRecordsDesc")}</p>
            </div>
          ) : (
            sessions.map((session) => (
              <div key={session.id} className="bg-card border rounded-2xl p-5">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleExpand(session.id)}
                >
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
                        {new Date(session.createdAt).toLocaleDateString()}
                        {session.mode === "ayush" && (
                          <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-[10px] font-bold">AYUSH</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-emerald-600">{session.answers?.length || 0} answers</span>
                    {expandedId === session.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </div>
                {expandedId === session.id && (
                  <div className="mt-4 pt-4 border-t space-y-3">
                    {session.chiefComplaint && (
                      <div className="text-sm">
                        <span className="font-bold">Chief Complaint:</span> {session.chiefComplaint}
                      </div>
                    )}
                    {session.answers?.map((a, i) => (
                      <div key={i} className="text-sm">
                        <div className="font-bold text-muted-foreground">{a.question}</div>
                        <div>{a.answer}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </AppLayout>
  );
}
