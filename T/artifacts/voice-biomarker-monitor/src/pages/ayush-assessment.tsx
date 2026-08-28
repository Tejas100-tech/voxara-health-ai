import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Check, CheckCircle, Loader2, Leaf,
  Save, ChevronDown, ChevronRight, AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppLayout } from "@/components/layout";
import { useAuth } from "@/lib/auth";
import { saveAyushAssessment, getPatientAyushData } from "@/lib/ayush-api";

// ─── Assessment Sections ─────────────────────────────────────────────────

interface SectionField {
  id: string;
  label: string;
  type: "single_choice" | "multiple_choice" | "free_text";
  options?: string[];
}

const ASSESSMENT_SECTIONS = [
  {
    id: "ahara",
    title: "Ahara — Dietary History",
    icon: "🍽️",
    description: "Meal patterns, food preferences, taste inclinations, and dietary habits",
    fields: [
      { id: "meal_pattern", label: "How regular are your meal times?", type: "single_choice" as const, options: ["Very regular", "Mostly regular", "Somewhat irregular", "Very irregular", "Skip meals often"] },
      { id: "food_preference", label: "What are your primary food preferences?", type: "single_choice" as const, options: ["Vegetarian", "Non-vegetarian", "Vegan", "Mixed diet"] },
      { id: "preferred_tastes", label: "Which tastes do you prefer most often?", type: "multiple_choice" as const, options: ["Sweet", "Sour", "Salty", "Pungent/spicy", "Bitter", "Astringent"] },
      { id: "water_intake", label: "How much water do you drink daily?", type: "single_choice" as const, options: ["Less than 4 glasses", "4-6 glasses", "6-8 glasses", "More than 8 glasses", "Mostly tea/coffee instead"] },
      { id: "foods_worsen", label: "Are there foods that worsen your symptoms?", type: "free_text" as const },
    ],
  },
  {
    id: "vihara",
    title: "Vihara — Lifestyle",
    icon: "🏃",
    description: "Sleep schedule, physical activity, work habits, daily routine",
    fields: [
      { id: "sleep_schedule", label: "What time do you usually sleep and wake up?", type: "single_choice" as const, options: ["Before 10 PM / Before 6 AM", "10 PM - 12 AM / 6-8 AM", "After 12 AM / After 8 AM", "Irregular schedule"] },
      { id: "physical_activity", label: "How would you describe your physical activity?", type: "single_choice" as const, options: ["Active (daily exercise/sports)", "Moderate (walk regularly)", "Light (occasional walks)", "Sedentary (mostly sitting)", "Varies day to day"] },
      { id: "sitting_hours", label: "How many hours per day do you sit?", type: "single_choice" as const, options: ["Less than 4 hours", "4-6 hours", "6-8 hours", "More than 8 hours"] },
      { id: "screen_time", label: "Screen time per day?", type: "single_choice" as const, options: ["Less than 2 hours", "2-4 hours", "4-6 hours", "6-8 hours", "More than 8 hours"] },
      { id: "daily_routine", label: "Describe your daily routine consistency", type: "single_choice" as const, options: ["Very consistent", "Mostly consistent", "Somewhat irregular", "Very irregular"] },
    ],
  },
  {
    id: "agni",
    title: "Agni — Digestive Fire",
    icon: "🔥",
    description: "Appetite, digestion patterns, post-meal comfort, digestive symptoms",
    fields: [
      { id: "appetite", label: "How would you describe your appetite?", type: "single_choice" as const, options: ["Strong and regular", "Moderate", "Weak/reduced", "Variable/irregular", "Excessively strong"] },
      { id: "hunger_timing", label: "When do you feel most hungry?", type: "single_choice" as const, options: ["Regular mealtimes", "Variable", "Late/not much hunger", "Constantly hungry"] },
      { id: "digestion", label: "How is your digestion generally?", type: "single_choice" as const, options: ["Good/efficient", "Moderate", "Slow/sluggish", "Variable"] },
      { id: "post_meal", label: "Any discomfort after meals?", type: "multiple_choice" as const, options: ["Bloating", "Gas", "Acidity/burning", "Heaviness", "Nausea", "None"] },
    ],
  },
  {
    id: "koshtha",
    title: "Koshtha — Bowel Habits",
    icon: "💚",
    description: "Bowel frequency, regularity, consistency, and changes",
    fields: [
      { id: "frequency", label: "How often do you have a bowel movement?", type: "single_choice" as const, options: ["2-3 times daily", "Once daily", "Once every 2 days", "Once every 3+ days", "Irregular"] },
      { id: "regularity", label: "How regular are your bowels?", type: "single_choice" as const, options: ["Very regular", "Mostly regular", "Somewhat irregular", "Very irregular"] },
      { id: "consistency", label: "Typical stool consistency?", type: "single_choice" as const, options: ["Loose/watery", "Soft", "Medium/formed", "Hard/dry", "Variable"] },
      { id: "bowel_changes", label: "Any recent changes in bowel habits?", type: "free_text" as const },
    ],
  },
  {
    id: "nidra",
    title: "Nidra — Sleep",
    icon: "😴",
    description: "Sleep patterns, quality, difficulties, and daytime energy",
    fields: [
      { id: "sleep_quality", label: "How would you rate your sleep quality?", type: "single_choice" as const, options: ["Deep and refreshing", "Good but light", "Fair/ interrupted", "Poor", "Very poor"] },
      { id: "sleep_difficulties", label: "Any sleep difficulties?", type: "multiple_choice" as const, options: ["Difficulty falling asleep", "Frequent awakenings", "Wakes too early", "Daytime sleepiness", "Restless sleep", "None"] },
      { id: "dreams", label: "Do you recall dreams frequently?", type: "single_choice" as const, options: ["Rarely", "Sometimes", "Often", "Very frequently"] },
    ],
  },
  {
    id: "sattva",
    title: "Sattva — Mental Well-being",
    icon: "🧠",
    description: "Stress, emotional balance, clarity of mind, relaxation",
    fields: [
      { id: "stress_level", label: "How would you describe your stress level?", type: "single_choice" as const, options: ["Low — mostly calm", "Moderate — some daily stress", "High — frequently stressed", "Very high — constant tension"] },
      { id: "relaxation", label: "Do you have difficulty relaxing?", type: "single_choice" as const, options: ["No, I relax easily", "Sometimes", "Often", "Very often"] },
      { id: "emotional_state", label: "How would you describe your general emotional state?", type: "single_choice" as const, options: ["Calm and content", "Mostly positive", "Variable/moody", "Often anxious/restless", "Frequently agitated"] },
    ],
  },
  {
    id: "dashavidha",
    title: "Dashavidha Pariksha",
    icon: "🔮",
    description: "10-point Ayurvedic constitutional assessment for practitioner review",
    fields: [
      { id: "prakriti_indicators", label: "Body characteristics: How would you describe your natural body type?", type: "single_choice" as const, options: ["Thin/light frame", "Medium build", "Large/heavy build", "Mixed characteristics"] },
      { id: "vikriti_changes", label: "Recent changes from your normal state?", type: "free_text" as const },
      { id: "sara_indicators", label: "How would you rate your overall vitality?", type: "single_choice" as const, options: ["Excellent — full of energy", "Good — generally energetic", "Fair — sometimes tired", "Low — often fatigued"] },
      { id: "samhanana", label: "How would you describe your body firmness/compactness?", type: "single_choice" as const, options: ["Firm and compact", "Moderate", "Loose/soft", "Varies"] },
      { id: "pramana", label: "Your body size classification?", type: "single_choice" as const, options: ["Small (Laghu)", "Medium (Madhyama)", "Large (Adhimatra)"] },
      { id: "satmya_adaptation", label: "How well do you adapt to changes in diet/routine?", type: "single_choice" as const, options: ["Adapt very well", "Adapt reasonably well", "Slow to adapt", "Very sensitive to changes"] },
      { id: "vyayama_shakti", label: "Your exercise capacity?", type: "single_choice" as const, options: ["High — can exercise vigorously", "Moderate — regular exercise tolerance", "Low — tire easily", "Very low — minimal activity"] },
      { id: "ahara_shakti", label: "Your eating/digestive capacity?", type: "single_choice" as const, options: ["Large appetite, strong digestion", "Moderate appetite and digestion", "Small appetite, weak digestion", "Variable"] },
    ],
  },
  {
    id: "previous_treatment",
    title: "Previous Ayurvedic Treatment",
    icon: "📋",
    description: "Previous consultations, medications, and therapies",
    fields: [
      { id: "previous_consultation", label: "Have you consulted an Ayurvedic practitioner before?", type: "single_choice" as const, options: ["Yes, currently taking", "Yes, previously but not now", "No, first-time", "Not sure"] },
      { id: "previous_medicines", label: "Any Ayurvedic medicines you've taken?", type: "free_text" as const },
      { id: "therapies", label: "Any Ayurvedic therapies (Panchakarma, etc.)?", type: "free_text" as const },
    ],
  },
];

export default function AyushAssessment() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const patientId = user?.patientId || "PT-001";

  const [currentSectionIdx, setCurrentSectionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [chiefComplaint, setChiefComplaint] = useState("");
  const [duration, setDuration] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set([ASSESSMENT_SECTIONS[0].id]));

  const currentSection = ASSESSMENT_SECTIONS[currentSectionIdx];

  useEffect(() => {
    const loadExisting = async () => {
      try {
        const data = await getPatientAyushData(patientId);
        if (data.assessment) {
          const a = data.assessment;
          if (a.chiefComplaint) setChiefComplaint(String(a.chiefComplaint));
          if (a.duration) setDuration(String(a.duration));
          // Load existing answers from assessment sections
          for (const section of ASSESSMENT_SECTIONS) {
            const sectionData = a[section.id as keyof typeof a];
            if (sectionData && typeof sectionData === "object") {
              for (const [key, value] of Object.entries(sectionData as Record<string, unknown>)) {
                setAnswers((prev) => ({ ...prev, [`${section.id}.${key}`]: value }));
              }
            }
          }
        }
      } catch { /* no existing data */ }
    };
    loadExisting();
  }, [patientId]);

  const handleFieldChange = (fieldId: string, value: unknown) => {
    setAnswers((prev) => ({ ...prev, [`${currentSection.id}.${fieldId}`]: value }));
  };

  const toggleMultiOption = (fieldId: string, option: string) => {
    setAnswers((prev) => {
      const key = `${currentSection.id}.${fieldId}`;
      const current = Array.isArray(prev[key]) ? prev[key] as string[] : [];
      const updated = current.includes(option)
        ? current.filter((o) => o !== option)
        : [...current, option];
      return { ...prev, [key]: updated };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Group answers by section
      const sectionData: Record<string, Record<string, unknown>> = {};
      for (const [key, value] of Object.entries(answers)) {
        const [sectionId, fieldId] = key.split(".");
        if (!sectionData[sectionId]) sectionData[sectionId] = {};
        sectionData[sectionId][fieldId] = value;
      }

      await saveAyushAssessment({
        patientId,
        patientName: user?.name || "Patient",
        chiefComplaint,
        duration,
        ...sectionData,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setSaving(false);
    }
  };

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const getSectionProgress = (sectionId: string) => {
    const section = ASSESSMENT_SECTIONS.find((s) => s.id === sectionId);
    if (!section) return 0;
    const total = section.fields.length;
    const filled = section.fields.filter((f) => {
      const val = answers[`${sectionId}.${f.id}`];
      return val !== undefined && val !== "" && (!Array.isArray(val) || val.length > 0);
    }).length;
    return total > 0 ? Math.round((filled / total) * 100) : 0;
  };

  const totalProgress = Math.round(
    ASSESSMENT_SECTIONS.reduce((sum, s) => sum + getSectionProgress(s.id), 0) / ASSESSMENT_SECTIONS.length,
  );

  return (
    <AppLayout userType={user?.role === "clinician" ? "clinician" : "patient"}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back */}
        <button
          onClick={() => setLocation("/patient/ayush")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={16} /> Back to AYUSH Hub
        </button>

        {/* Progress */}
        <div className="bg-card border rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold flex items-center gap-2"><Leaf size={16} className="text-green-700" /> AYUSH Assessment</h3>
            <span className="text-sm font-black text-green-700">{totalProgress}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-green-700 to-amber-500 rounded-full"
              animate={{ width: `${totalProgress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Chief Complaint */}
        <div className="bg-card border rounded-2xl p-6 shadow-sm">
          <h4 className="font-bold mb-3">Chief Complaint</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              value={chiefComplaint}
              onChange={(e) => setChiefComplaint(e.target.value)}
              placeholder="What brings you here today?"
              className="h-11 px-4 rounded-xl border bg-background text-sm"
            />
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="h-11 px-4 rounded-xl border bg-background text-sm"
            >
              <option value="">Duration...</option>
              <option>Less than a week</option>
              <option>1-2 weeks</option>
              <option>2-4 weeks</option>
              <option>1-3 months</option>
              <option>3-6 months</option>
              <option>More than 6 months</option>
            </select>
          </div>
        </div>

        {/* Section Navigation */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {ASSESSMENT_SECTIONS.map((section, i) => {
            const progress = getSectionProgress(section.id);
            return (
              <button
                key={section.id}
                onClick={() => { setCurrentSectionIdx(i); toggleSection(section.id); }}
                className={`p-3 rounded-xl border text-left transition-all ${
                  currentSectionIdx === i
                    ? "bg-green-50 border-green-500/30 shadow-sm"
                    : "bg-card hover:bg-muted/50"
                }`}
              >
                <span className="text-lg">{section.icon}</span>
                <p className="text-xs font-bold mt-1 leading-tight">{section.title.split("—")[0].trim()}</p>
                <div className="h-1 bg-muted rounded-full overflow-hidden mt-2">
                  <div className="h-full bg-green-600 rounded-full" style={{ width: `${progress}%` }} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Current Section */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSection.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-card border rounded-2xl p-6 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">{currentSection.icon}</span>
              <div>
                <h3 className="font-bold text-lg">{currentSection.title}</h3>
                <p className="text-xs text-muted-foreground">{currentSection.description}</p>
              </div>
            </div>

            <div className="space-y-6">
              {currentSection.fields.map((field) => {
                const fieldKey = `${currentSection.id}.${field.id}`;
                const currentValue = answers[fieldKey];

                return (
                  <div key={field.id}>
                    <label className="block text-sm font-semibold mb-2">{field.label}</label>
                    {field.type === "single_choice" && field.options && (
                      <div className="grid grid-cols-2 gap-2">
                        {field.options.map((opt) => (
                          <button
                            key={opt}
                            onClick={() => handleFieldChange(field.id, opt)}
                            className={`p-3 rounded-xl border text-left text-sm transition-all ${
                              currentValue === opt
                                ? "bg-green-50 border-green-500/30 font-semibold"
                                : "bg-muted/30 hover:border-green-500/20"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                currentValue === opt ? "border-green-600 bg-green-600" : "border-muted-foreground/30"
                              }`}>
                                {currentValue === opt && <Check size={10} className="text-white" />}
                              </div>
                              {opt}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                    {field.type === "multiple_choice" && field.options && (
                      <div className="grid grid-cols-2 gap-2">
                        {field.options.map((opt) => {
                          const selected = Array.isArray(currentValue) && currentValue.includes(opt);
                          return (
                            <button
                              key={opt}
                              onClick={() => toggleMultiOption(field.id, opt)}
                              className={`p-3 rounded-xl border text-left text-sm transition-all ${
                                selected
                                  ? "bg-green-50 border-green-500/30 font-semibold"
                                  : "bg-muted/30 hover:border-green-500/20"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ${
                                  selected ? "border-green-600 bg-green-600" : "border-muted-foreground/30"
                                }`}>
                                  {selected && <Check size={10} className="text-white" />}
                                </div>
                                {opt}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                    {field.type === "free_text" && (
                      <textarea
                        value={String(currentValue || "")}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        placeholder="Type your response..."
                        className="w-full h-24 px-4 py-3 rounded-xl border bg-background text-sm resize-none"
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t">
              <button
                onClick={() => setCurrentSectionIdx(Math.max(0, currentSectionIdx - 1))}
                disabled={currentSectionIdx === 0}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30"
              >
                <ArrowLeft size={16} /> Previous
              </button>
              {currentSectionIdx < ASSESSMENT_SECTIONS.length - 1 ? (
                <Button onClick={() => setCurrentSectionIdx(currentSectionIdx + 1)} className="rounded-xl">
                  Next Section <ArrowRight className="ml-2" size={16} />
                </Button>
              ) : (
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="rounded-xl bg-gradient-to-r from-green-700 to-emerald-600"
                >
                  {saving ? <Loader2 className="animate-spin mr-2" size={16} /> : <Save className="mr-2" size={16} />}
                  {saved ? "Saved ✓" : "Save Assessment"}
                </Button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* AI Safety Notice */}
        <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl">
          <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-amber-800 dark:text-amber-200">Practitioner Verification Required</p>
            <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
              This information is collected for your Ayurvedic practitioner's review. A qualified Vaidya will verify and interpret all findings. This system does not diagnose or prescribe.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
