import { useState, useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { ArrowLeft, Leaf, FileText, CheckCircle, Clock } from "lucide-react";
import { AppLayout } from "@/components/layout";
import { useAuth } from "@/lib/auth";
import { AyurBot } from "@/components/ayurbot";

export default function AyushChat() {
  const [, setLocation] = useLocation();
  const search = useSearch();
  const { user } = useAuth();
  const params = new URLSearchParams(search);
  const sessionId = params.get("session") || "";
  const mode = (params.get("mode") as "education" | "pre_consultation" | "practitioner") || "pre_consultation";

  const [extractedData, setExtractedData] = useState<Record<string, unknown>>({});

  const patientId = user?.patientId || "PT-001";

  const handleExtractedData = (data: Record<string, unknown>) => {
    setExtractedData((prev) => ({ ...prev, ...data }));
  };

  const recordedFields = Object.entries(extractedData).filter(
    ([k]) => !["assessmentStarted", "assessmentComplete", "currentQuestion", "questionIndex"].includes(k),
  );

  return (
    <AppLayout userType={user?.role === "clinician" ? "clinician" : "patient"}>
      <div className="max-w-7xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => setLocation("/patient/ayush")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft size={16} /> Back to AYUSH Hub
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" style={{ height: "calc(100vh - 180px)" }}>
          {/* Chat — main area */}
          <div className="lg:col-span-2">
            <AyurBot
              patientId={patientId}
              patientName={user?.name || "Patient"}
              language="en"
              initialMode={mode}
              onExtractedData={handleExtractedData}
              embedded
            />
          </div>

          {/* Side panel — extracted data */}
          <div className="hidden lg:flex flex-col gap-4">
            {/* Assessment Progress */}
            <div className="bg-card border rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Leaf size={16} className="text-cyan-700" />
                <h4 className="font-bold text-sm">My AYUSH Information</h4>
              </div>
              {recordedFields.length === 0 ? (
                <p className="text-xs text-muted-foreground">Information will appear here as you chat with AyurBot.</p>
              ) : (
                <div className="space-y-2">
                  {recordedFields.map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2 p-2 bg-cyan-50 dark:bg-cyan-950/20 rounded-lg">
                      <CheckCircle size={14} className="text-cyan-600 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold capitalize">{key.replace(/_/g, " ")}</p>
                        <p className="text-[11px] text-muted-foreground truncate">{String(value)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Assessment Status */}
            <div className="bg-card border rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Clock size={16} className="text-amber-600" />
                <h4 className="font-bold text-sm">Assessment Sections</h4>
              </div>
              <div className="space-y-1.5">
                {["Chief Complaint", "Ahara (Diet)", "Vihara (Lifestyle)", "Agni (Digestion)", "Koshtha (Bowel)", "Nidra (Sleep)", "Sattva (Well-being)", "Dashavidha Pariksha"].map((section) => {
                  const hasData = recordedFields.some(([k]) =>
                    section.toLowerCase().includes(k.replace(/_/g, " ").split(" ")[0]),
                  );
                  return (
                    <div key={section} className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs">
                      {hasData ? (
                        <CheckCircle size={12} className="text-cyan-600" />
                      ) : (
                        <div className="w-3 h-3 rounded-full border-2 border-muted-foreground/30" />
                      )}
                      <span className={hasData ? "font-semibold text-foreground" : "text-muted-foreground"}>{section}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="bg-card border rounded-2xl p-5 shadow-sm space-y-2">
              <button
                onClick={() => setLocation("/patient/ayush/assessment")}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left text-sm font-semibold hover:bg-muted transition-colors"
              >
                <FileText size={16} className="text-cyan-700" />
                View Full Assessment
              </button>
              <button
                onClick={() => setLocation("/patient/documents")}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left text-sm font-semibold hover:bg-muted transition-colors"
              >
                <FileText size={16} className="text-blue-600" />
                Upload Documents
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
