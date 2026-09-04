import { useState, useEffect, useRef } from "react";
import { useLocation, useSearch } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Camera, Check, CheckCircle, File, FileText,
  FlaskConical, Loader2, Pill, ScanLine, Trash2, Upload, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppLayout } from "@/components/layout";
import { useAuth } from "@/lib/auth";
import { uploadDocument, getDocuments, finalizeIntake } from "@/lib/medikiosk-api";
import type { MedicalDocument } from "@/lib/medikiosk-api";
import { t } from "@/lib/medikiosk-i18n";

const DOCUMENT_TYPES = [
  { id: "prescription", label: "Prescription", icon: Pill, color: "text-blue-500", bg: "bg-blue-500/10" },
  { id: "lab_report", label: "Lab Report", icon: FlaskConical, color: "text-cyan-500", bg: "bg-cyan-500/10" },
  { id: "discharge_summary", label: "Discharge Summary", icon: FileText, color: "text-purple-500", bg: "bg-purple-500/10" },
  { id: "imaging", label: "Imaging / X-Ray", icon: ScanLine, color: "text-orange-500", bg: "bg-orange-500/10" },
  { id: "other", label: "Other", icon: File, color: "text-gray-500", bg: "bg-gray-500/10" },
];

// Simulated OCR extraction for demo
function simulateOCRExtraction(fileName: string, docType: string): {
  ocrText: string;
  extractedData: Record<string, unknown>;
} {
  const ocrTexts: Record<string, string> = {
    prescription: "Rx: Tab. Metformin 500mg - 1-0-1 after meals\nTab. Amlodipine 5mg - 0-0-1\nLisinopril 10mg - 0-1-0\nDisp: 30 days\nDr. R. Sharma, MD\nDate: 15/01/2025",
    lab_report: "Complete Blood Count (CBC)\nHemoglobin: 11.2 g/dL (Ref: 12-16)\nWBC: 8,500 /mm³ (Ref: 4,000-11,000)\nPlatelets: 2,10,000 (Ref: 1,50,000-4,00,000)\nFasting Blood Sugar: 142 mg/dL (Ref: 70-100) [HIGH]\nHbA1c: 7.8% (Ref: <5.7%) [HIGH]\nDate: 10/01/2025",
    discharge_summary: "DISCHARGE SUMMARY\nPatient: Alex Carter, Age 34\nAdmission: 05/01/2025 - Discharge: 08/01/2025\nDiagnosis: Acute Asthma Exacerbation\nTreatment: Nebulized Salbutamol, IV Corticosteroids\nFollow-up: 2 weeks post-discharge\nDr. Priya Mehta, Pulmonology",
    imaging: "Chest X-Ray PA View\nFindings: Bilateral air trapping, no consolidation.\nHeart size normal. No pleural effusion.\nImpression: Features suggestive of bronchial asthma.\nRadiologist: Dr. K. Patel",
    other: `Document: ${fileName}\nDate: 15/12/2024\nGeneral medical document uploaded for review.`,
  };

  const extractedData: Record<string, unknown> = {};

  if (docType === "prescription") {
    extractedData.diagnoses = ["Hypertension", "Type 2 Diabetes Mellitus"];
    extractedData.medications = [
      { name: "Metformin", dosage: "500mg", frequency: "1-0-1" },
      { name: "Amlodipine", dosage: "5mg", frequency: "0-0-1" },
      { name: "Lisinopril", dosage: "10mg", frequency: "0-1-0" },
    ];
    extractedData.physicianName = "Dr. R. Sharma, MD";
    extractedData.documentDate = "15/01/2025";
  } else if (docType === "lab_report") {
    extractedData.labResults = [
      { testName: "Hemoglobin", value: "11.2 g/dL", referenceRange: "12-16", isAbnormal: true },
      { testName: "WBC", value: "8,500 /mm³", referenceRange: "4,000-11,000", isAbnormal: false },
      { testName: "Platelets", value: "2,10,000", referenceRange: "1,50,000-4,00,000", isAbnormal: false },
      { testName: "Fasting Blood Sugar", value: "142 mg/dL", referenceRange: "70-100", isAbnormal: true },
      { testName: "HbA1c", value: "7.8%", referenceRange: "<5.7%", isAbnormal: true },
    ];
    extractedData.diagnoses = ["Prediabetes / Type 2 DM", "Mild Anemia"];
    extractedData.documentDate = "10/01/2025";
  } else if (docType === "discharge_summary") {
    extractedData.diagnoses = ["Acute Asthma Exacerbation"];
    extractedData.procedures = ["Nebulized Salbutamol", "IV Corticosteroids"];
    extractedData.physicianName = "Dr. Priya Mehta";
    extractedData.documentDate = "08/01/2025";
  }

  return { ocrText: ocrTexts[docType] || ocrTexts.other, extractedData };
}

export default function MedikioskScan() {
  const [, setLocation] = useLocation();
  const search = useSearch();
  const { user } = useAuth();
  const params = new URLSearchParams(search);
  const sessionId = params.get("session") || "";
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [documents, setDocuments] = useState<MedicalDocument[]>([]);
  const [selectedDocType, setSelectedDocType] = useState("prescription");
  const [uploading, setUploading] = useState(false);
  const [processingFile, setProcessingFile] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // Load existing documents
  useEffect(() => {
    if (!sessionId) return;
    getDocuments(sessionId)
      .then((data) => setDocuments(data.documents || []))
      .catch(() => {});
  }, [sessionId]);

  // Handle file upload
  const handleFileUpload = async (files: FileList | null) => {
    if (!files || !sessionId) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setProcessingFile(file.name);
      setUploading(true);

      // Simulate OCR processing delay
      await new Promise((r) => setTimeout(r, 1500));

      const { ocrText, extractedData } = simulateOCRExtraction(file.name, selectedDocType);

      try {
        const result = await uploadDocument({
          sessionId,
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          documentType: selectedDocType,
          ocrText,
          extractedData,
        });

        const newDoc: MedicalDocument = {
          documentId: result.documentId,
          sessionId,
          fileName: file.name,
          fileType: file.type,
          documentType: selectedDocType,
          ocrText,
          extractedData: extractedData as Record<string, unknown>,
          processingStatus: "completed",
          chronologicalOrder: documents.length,
          uploadedAt: new Date().toISOString(),
        };

        setDocuments((prev) => [...prev, newDoc]);
      } catch (err) {
        console.error("Upload failed:", err);
      } finally {
        setUploading(false);
        setProcessingFile(null);
      }
    }
  };

  // Handle drag and drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFileUpload(e.dataTransfer.files);
  };

  // Proceed to summary
  const handleProceed = async () => {
    try {
      await finalizeIntake(sessionId);
      setLocation(`/medikiosk/summary?session=${sessionId}`);
    } catch (err) {
      console.error("Failed to proceed:", err);
    }
  };

  return (
    <AppLayout userType={user?.role === "clinician" ? "clinician" : "patient"}>
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setLocation(`/medikiosk/intake?session=${sessionId}`)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={16} /> Back to History Interview
          </button>
          <div className="flex items-center gap-2 text-sm font-bold text-primary">
            <ScanLine size={16} />
            Step 3: Document Scan
          </div>
        </div>

        {/* Upload Area */}
        <div className="bg-card border rounded-[2rem] p-8 shadow-sm">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-extrabold font-[Manrope] mb-2">{t("scanTitle")}</h3>
            <p className="text-muted-foreground">{t("scanSubtitle")}</p>
          </div>

          {/* Document Type Selector */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {DOCUMENT_TYPES.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedDocType(type.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${
                  selectedDocType === type.id
                    ? `${type.bg} ${type.color} border border-current/20`
                    : "bg-muted/50 text-muted-foreground hover:bg-muted border border-transparent"
                }`}
              >
                <type.icon size={14} />
                {type.label}
              </button>
            ))}
          </div>

          {/* Drop Zone */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
              dragActive
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/20 hover:border-primary/30"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,.pdf"
              onChange={(e) => handleFileUpload(e.target.files)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />

            {uploading ? (
              <div className="space-y-3">
                <Loader2 className="animate-spin text-primary mx-auto" size={40} />
                <p className="font-bold">{t("processing")}: {processingFile}</p>
                <p className="text-sm text-muted-foreground">Running OCR extraction and clinical entity parsing...</p>
                <div className="max-w-xs mx-auto">
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-primary rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: "80%" }}
                      transition={{ duration: 2, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <>
                <Camera className="mx-auto text-muted-foreground mb-4" size={40} />
                <p className="font-bold text-lg mb-2">{t("dropzone")}</p>
                <p className="text-sm text-muted-foreground mb-4">
                  {t("dropzoneHint")}
                </p>
                <Button variant="outline" className="rounded-xl">
                  <Upload size={16} className="mr-2" /> {t("chooseFiles")}
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Uploaded Documents List */}
        {documents.length > 0 && (
          <div className="bg-card border rounded-[2rem] p-8 shadow-sm">
            <h3 className="font-bold text-lg mb-6">{t("uploadedDocuments")} ({documents.length})</h3>
            <div className="space-y-4">
              <AnimatePresence>
                {documents.map((doc) => {
                  const typeInfo = DOCUMENT_TYPES.find((t) => t.id === doc.documentType) || DOCUMENT_TYPES[4];
                  const TypeIcon = typeInfo.icon;
                  return (
                    <motion.div
                      key={doc.documentId}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-5 bg-muted/30 border rounded-xl"
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl ${typeInfo.bg} flex items-center justify-center shrink-0`}>
                          <TypeIcon size={22} className={typeInfo.color} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-bold text-sm truncate">{doc.fileName}</p>
                            <span className={`shrink-0 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              doc.processingStatus === "completed"
                                ? "bg-secondary/10 text-secondary"
                                : "bg-amber-100 text-amber-700"
                            }`}>
                              {doc.processingStatus === "completed" ? t("processed") : t("processing")}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">{typeInfo.label}</p>

                          {/* Extracted Data Preview */}
                          {doc.processingStatus === "completed" && doc.ocrText && (
                            <div className="mt-3 p-3 bg-background rounded-lg border">
                              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">{t("ocrExtract")}</p>
                              <p className="text-xs text-foreground whitespace-pre-line font-mono leading-relaxed">
                                {doc.ocrText.slice(0, 300)}{doc.ocrText.length > 300 ? "..." : ""}
                              </p>
                            </div>
                          )}

                          {/* Lab Results Highlighting */}
                          {Array.isArray(doc.extractedData?.labResults) && doc.extractedData.labResults.length > 0 && (
                            <div className="mt-3 space-y-1">
                              {(doc.extractedData.labResults as Array<Record<string, unknown>>).map((lab, i) => {
                                  const abnormal = !!lab.isAbnormal;
                                  return (
                                <div key={i} className={`flex items-center justify-between p-2 rounded-lg text-xs ${
                                  abnormal ? "bg-destructive/10 border border-destructive/20" : "bg-muted/50"
                                }`}>
                                  <span className="font-semibold">{String(lab.testName)}</span>
                                  <span className={`font-bold ${abnormal ? "text-destructive" : ""}`}>
                                    {String(lab.value)} {abnormal && "⚠"}
                                  </span>
                                </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Proceed Button */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => setLocation(`/medikiosk/intake?session=${sessionId}`)}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft size={16} className="inline mr-1" /> {t("previous")}
          </button>
          <Button
            size="lg"
            onClick={handleProceed}
            disabled={uploading}
            className="px-10 py-6 rounded-2xl text-lg font-bold shadow-lg shadow-primary/20"
          >
            {documents.length === 0 ? t("skipToSummary") : t("generateClinicalSummary")}
            <ArrowRight className="ml-2" size={18} />
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
