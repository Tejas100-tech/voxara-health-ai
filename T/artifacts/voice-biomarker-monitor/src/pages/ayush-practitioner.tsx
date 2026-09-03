import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  Leaf, Users, Clock, CheckCircle, AlertCircle, FileText,
  Loader2, ArrowRight, Search, Eye, Shield, MessageCircle,
  BarChart3, Filter, Stethoscope,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppLayout } from "@/components/layout";
import { useAuth } from "@/lib/auth";
import {
  getPractitionerPatients,
  getPractitionerPatientDetail,
  submitPractitionerReview,
  seedAyushDemoData,
} from "@/lib/ayush-api";
import { AyurBot } from "@/components/ayurbot";

interface PatientSummary {
  patientId: string;
  patientName: string;
  chiefComplaint?: string;
  assessmentStatus: string;
  documentCount: number;
  hasAiBrief: boolean;
  updatedAt: string;
}

interface PatientDetail {
  patientId: string;
  assessment: Record<string, unknown> | null;
  documents: unknown[];
  timeline: unknown[];
  aiBrief: string;
}

export default function AyushPractitioner() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [patients, setPatients] = useState<PatientSummary[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<PatientDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [filter, setFilter] = useState<"all" | "in_progress" | "completed" | "verified">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "brief" | "dashavidha" | "ahara" | "vihara" | "agni" | "koshtha" | "nidra" | "chat">("overview");

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    setLoading(true);
    try {
      const data = await getPractitionerPatients();
      setPatients(data);
    } catch { /* empty */ }
    setLoading(false);
  };

  const handleSeed = async () => {
    setSeeding(true);
    try {
      await seedAyushDemoData();
      await loadPatients();
    } catch { /* empty */ }
    setSeeding(false);
  };

  const handleSelectPatient = async (patientId: string) => {
    setDetailLoading(true);
    try {
      const detail = await getPractitionerPatientDetail(patientId);
      setSelectedPatient(detail);
      setActiveTab("overview");
    } catch { /* empty */ }
    setDetailLoading(false);
  };

  const handleVerify = async (action: "confirm" | "reject") => {
    if (!selectedPatient) return;
    try {
      await submitPractitionerReview({
        patientId: selectedPatient.patientId,
        practitionerId: user?.patientId || "DR-001",
        action,
      });
      await loadPatients();
      if (action === "confirm") {
        setSelectedPatient((prev) => prev ? { ...prev, assessment: { ...prev.assessment, assessmentStatus: "verified", practitionerVerified: true } } : null);
      }
    } catch { /* empty */ }
  };

  const filteredPatients = patients
    .filter((p) => filter === "all" || p.assessmentStatus === filter)
    .filter((p) => p.patientName.toLowerCase().includes(searchTerm.toLowerCase()));

  const statusColor = (status: string) => {
    if (status === "verified") return "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300";
    if (status === "completed") return "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300";
    return "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300";
  };

  const TABS = ["overview", "brief", "dashavidha", "ahara", "vihara", "agni", "koshtha", "nidra", "chat"] as const;

  return (
    <AppLayout userType="clinician">
      <div className="max-w-7xl mx-auto">
        {!selectedPatient ? (
          /* ─── Patient List View ─────────────────────────────────────── */
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-extrabold font-[Manrope] flex items-center gap-3">
                  <Leaf size={24} className="text-green-700" /> AYUSH Practitioner Dashboard
                </h2>
                <p className="text-sm text-muted-foreground mt-1">Review patient assessments, AI briefs, and verify findings</p>
              </div>
              <Button variant="outline" onClick={handleSeed} disabled={seeding} className="rounded-xl">
                {seeding ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
                {patients.length > 0 ? `${patients.length} patients` : "Load Demo Data"}
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Total Patients", value: patients.length, icon: Users, color: "text-blue-600" },
                { label: "In Progress", value: patients.filter((p) => p.assessmentStatus === "in_progress").length, icon: Clock, color: "text-amber-600" },
                { label: "Completed", value: patients.filter((p) => p.assessmentStatus === "completed").length, icon: CheckCircle, color: "text-green-600" },
                { label: "Verified", value: patients.filter((p) => p.assessmentStatus === "verified").length, icon: Shield, color: "text-purple-600" },
              ].map((stat) => (
                <div key={stat.label} className="bg-card border rounded-2xl p-4">
                  <stat.icon size={18} className={`${stat.color} mb-2`} />
                  <p className="text-2xl font-black">{stat.value}</p>
                  <p className="text-xs text-muted-foreground font-semibold">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Search & Filter */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search patients..."
                  className="w-full h-10 pl-10 pr-4 rounded-xl border bg-background text-sm"
                />
              </div>
              <div className="flex gap-1 bg-muted/50 rounded-xl p-1">
                {(["all", "in_progress", "completed", "verified"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      filter === f ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {f === "all" ? "All" : f === "in_progress" ? "Pending" : f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Patient Cards */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-green-700" size={32} />
              </div>
            ) : filteredPatients.length === 0 ? (
              <div className="text-center py-20 bg-card border rounded-2xl">
                <Users size={40} className="mx-auto text-muted-foreground mb-4" />
                <p className="font-bold text-lg">No patients found</p>
                <p className="text-sm text-muted-foreground mt-1">Load demo data or wait for patients to complete their assessment</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredPatients.map((patient) => (
                  <motion.button
                    key={patient.patientId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => handleSelectPatient(patient.patientId)}
                    className="bg-card border rounded-2xl p-5 text-left hover:shadow-md transition-all group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-cyan-600 flex items-center justify-center text-white font-black text-sm">
                          {patient.patientName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold">{patient.patientName}</p>
                          <p className="text-xs text-muted-foreground">{patient.patientId}</p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${statusColor(patient.assessmentStatus)}`}>
                        {patient.assessmentStatus}
                      </span>
                    </div>
                    {patient.chiefComplaint && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        <span className="font-semibold">Chief complaint:</span> {patient.chiefComplaint}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><FileText size={12} /> {patient.documentCount} docs</span>
                      {patient.hasAiBrief && <span className="flex items-center gap-1 text-green-600"><CheckCircle size={12} /> AI Brief</span>}
                      <span className="flex items-center gap-1"><Clock size={12} /> {new Date(patient.updatedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-green-700 opacity-0 group-hover:opacity-100 transition-opacity">
                      View Details <ArrowRight size={12} />
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* ─── Patient Detail View ───────────────────────────────────── */
          <div className="space-y-6">
            <button
              onClick={() => setSelectedPatient(null)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back to Patient List
            </button>

            {/* Patient Header */}
            <div className="bg-card border rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-cyan-600 flex items-center justify-center text-white font-black text-lg">
                    {selectedPatient.assessment?.patientName?.toString().charAt(0) || "?"}
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold">{String(selectedPatient.assessment?.patientName || "Patient")}</h2>
                    <p className="text-sm text-muted-foreground">{selectedPatient.patientId} · Chief: {String(selectedPatient.assessment?.chiefComplaint || "Not recorded")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-full uppercase ${statusColor(String(selectedPatient.assessment?.assessmentStatus || "in_progress"))}`}>
                    {String(selectedPatient.assessment?.assessmentStatus || "pending")}
                  </span>
                  {selectedPatient.assessment?.assessmentStatus !== "verified" && (
                    <>
                      <Button size="sm" onClick={() => handleVerify("confirm")} className="rounded-xl bg-green-700 hover:bg-green-800">
                        <CheckCircle size={14} className="mr-1" /> Confirm
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleVerify("reject")} className="rounded-xl text-destructive">
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 overflow-x-auto bg-muted/30 rounded-xl p-1">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    activeTab === tab ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab === "chat" ? "🤖 AyurBot" : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="bg-card border rounded-2xl p-6 shadow-sm min-h-[400px]">
              {detailLoading ? (
                <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin" size={32} /></div>
              ) : activeTab === "chat" ? (
                <AyurBot
                  patientId={selectedPatient.patientId}
                  patientName={String(selectedPatient.assessment?.patientName || "Patient")}
                  language="en"
                  initialMode="practitioner"
                  compact
                />
              ) : activeTab === "overview" ? (
                <div className="space-y-4">
                  <h3 className="font-bold text-lg">Patient Overview</h3>
                  {selectedPatient.assessment && Object.entries(selectedPatient.assessment).filter(([k]) => !["assessmentId", "sessionId", "createdAt", "updatedAt", "aiBrief", "practitionerVerified", "practitionerId", "practitionerVerifiedAt"].includes(k)).map(([key, value]) => (
                    <div key={key} className="p-3 bg-muted/30 rounded-xl">
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">{key.replace(/([A-Z])/g, " $1").replace(/_/g, " ")}</p>
                      {typeof value === "object" && value !== null ? (
                        <div className="grid grid-cols-2 gap-2">
                          {Object.entries(value as Record<string, unknown>).map(([k, v]) => (
                            <div key={k} className="text-sm">
                              <span className="font-semibold">{k.replace(/_/g, " ")}:</span>{" "}
                              <span className="text-muted-foreground">{String(v)}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm">{String(value)}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : activeTab === "brief" ? (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Stethoscope size={18} className="text-green-700" />
                    <h3 className="font-bold text-lg">AI-Generated AYUSH Brief</h3>
                  </div>
                  {selectedPatient.aiBrief ? (
                    <div className="p-5 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-xl">
                      {selectedPatient.aiBrief.split("\n").map((line, i) => (
                        <p key={i} className={`text-sm ${line.startsWith("**") ? "font-bold mt-3" : "mt-1"} ${line.startsWith("⚠") ? "text-amber-700 font-semibold" : ""}`}>
                          {line.replace(/\*\*/g, "")}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No AI brief available yet. Complete the assessment first.</p>
                  )}
                </div>
              ) : (
                /* Assessment sections */
                <div className="space-y-4">
                  <h3 className="font-bold text-lg capitalize">{activeTab} Assessment</h3>
                  {selectedPatient.assessment && (selectedPatient.assessment as Record<string, unknown>)[activeTab] ? (
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries((selectedPatient.assessment as Record<string, Record<string, unknown>>)[activeTab] || {}).map(([key, value]) => (
                        <div key={key} className="p-3 bg-muted/30 rounded-xl">
                          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">{key.replace(/_/g, " ")}</p>
                          <p className="text-sm font-semibold">{typeof value === "object" ? JSON.stringify(value) : String(value)}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No {activeTab} data recorded yet.</p>
                  )}
                </div>
              )}
            </div>

            {/* Documents & Timeline */}
            {(activeTab === "overview" || activeTab === "brief") && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-card border rounded-2xl p-5 shadow-sm">
                  <h4 className="font-bold text-sm mb-3 flex items-center gap-2"><FileText size={14} /> Documents ({selectedPatient.documents.length})</h4>
                  {selectedPatient.documents.length === 0 ? (
                    <p className="text-xs text-muted-foreground">No documents uploaded</p>
                  ) : (
                    <div className="space-y-2">
                      {selectedPatient.documents.map((doc: Record<string, unknown>) => (
                        <div key={String(doc.documentId)} className="p-2 bg-muted/30 rounded-lg text-xs">
                          <p className="font-semibold">{String(doc.fileName)}</p>
                          <p className="text-muted-foreground">{String(doc.documentType)} · {String(doc.processingStatus)}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="bg-card border rounded-2xl p-5 shadow-sm">
                  <h4 className="font-bold text-sm mb-3 flex items-center gap-2"><Clock size={14} /> Timeline ({selectedPatient.timeline.length})</h4>
                  {selectedPatient.timeline.length === 0 ? (
                    <p className="text-xs text-muted-foreground">No timeline entries</p>
                  ) : (
                    <div className="space-y-2">
                      {selectedPatient.timeline.map((entry: Record<string, unknown>) => (
                        <div key={String(entry.entryId)} className="flex items-start gap-2 p-2 bg-muted/30 rounded-lg text-xs">
                          <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${entry.type === "ayush" ? "bg-green-500" : "bg-blue-500"}`} />
                          <div>
                            <p className="font-semibold">{String(entry.title)}</p>
                            <p className="text-muted-foreground">{String(entry.description)}</p>
                            <p className="text-[10px] text-muted-foreground">{String(entry.date)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
