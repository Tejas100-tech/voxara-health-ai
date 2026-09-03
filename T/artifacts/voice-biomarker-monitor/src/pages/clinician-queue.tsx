import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout";
import { Link } from "wouter";
import {
  ClipboardList, Clock, ArrowRight, FileText, Users,
  Search, Filter, CheckCircle2, Loader2, ExternalLink,
} from "lucide-react";
import { getAllIntakeSessions, updateSessionStatus, type IntakeSession } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language";

export default function ClinicianQueue() {
  const { t } = useLanguage();
  const [sessions, setSessions] = useState<IntakeSession[]>([]);
  const [search, setSearch] = useState("");
  const [completingId, setCompletingId] = useState<string | null>(null);

  useEffect(() => {
    getAllIntakeSessions().then(setSessions).catch(() => {});
  }, []);

  const handleMarkComplete = async (sessionId: string) => {
    setCompletingId(sessionId);
    try {
      await updateSessionStatus(sessionId, "completed");
      setSessions((prev) =>
        prev.map((s) => (s.id === sessionId ? { ...s, status: "completed" as const } : s))
      );
    } catch (err) {
      console.error(err);
    }
    setCompletingId(null);
  };

  const filtered = sessions.filter(
    (s) =>
      s.patientName.toLowerCase().includes(search.toLowerCase()) ||
      s.patientId.toLowerCase().includes(search.toLowerCase()) ||
      (s.chiefComplaint || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout userType="clinician">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold font-[Manrope] mb-1">{t("clinician.title")}</h2>
            <p className="text-muted-foreground text-sm">{t("clinician.allPatients")}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-black text-sky-600">{filtered.length}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider">{t("common.patients")}</div>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder={t("search.placeholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-2xl border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        {/* Sessions List */}
        {filtered.length === 0 ? (
          <div className="bg-card border rounded-2xl p-12 text-center">
            <ClipboardList size={40} className="mx-auto text-muted-foreground mb-4" />
            <h4 className="font-bold text-lg mb-2">{t("search.noResults")}</h4>
            <p className="text-muted-foreground text-sm">{t("search.tryDifferent")}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((session) => (
              <div key={session.id} className="bg-card border rounded-2xl p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-lg ${
                      session.mode === "ayush"
                        ? "bg-gradient-to-br from-orange-500 to-amber-400"
                        : "bg-gradient-to-br from-cyan-500 to-sky-400"
                    }`}>
                      {session.patientName.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold">{session.patientName}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2">
                        <Clock size={11} />
                        {new Date(session.createdAt).toLocaleString()}
                        <span className="text-muted-foreground">·</span>
                        {session.patientId}
                        {session.mode === "ayush" && (
                          <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-[10px] font-bold">AYUSH</span>
                        )}
                      </div>
                      {session.chiefComplaint && (
                        <div className="text-sm text-muted-foreground mt-1">{session.chiefComplaint}</div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-sm font-bold text-cyan-600">{session.answers?.length || 0}</div>
                      <div className="text-[10px] text-muted-foreground uppercase">{t("history.progress")}</div>
                    </div>
                    <div className={`w-3 h-3 rounded-full shrink-0 ${
                      session.status === "completed" ? "bg-cyan-500" :
                      session.status === "complete" ? "bg-cyan-500" :
                      session.status === "summary" ? "bg-blue-500" :
                      "bg-amber-500"
                    }`} />
                    {/* Mark Complete Button */}
                    {session.status !== "completed" && session.status !== "complete" && (
                      <button
                        onClick={() => handleMarkComplete(session.id)}
                        disabled={completingId === session.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-50 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 rounded-lg text-xs font-bold hover:bg-cyan-100 dark:hover:bg-cyan-900/50 transition-colors border border-cyan-200 dark:border-cyan-800"
                      >
                        {completingId === session.id ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : (
                          <CheckCircle2 size={12} />
                        )}
                        Done
                      </button>
                    )}
                    {session.status === "completed" && (
                      <span className="flex items-center gap-1 px-3 py-1.5 bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-400 rounded-lg text-xs font-bold">
                        <CheckCircle2 size={12} /> Checked
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
