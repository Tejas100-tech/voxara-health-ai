import { useState, useEffect, useCallback } from "react";
import { AppLayout } from "@/components/layout";
import {
  CalendarClock, CheckCircle2, Loader2, Plus, X, Save, Clock, AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth";
import { getDoctor, updateDoctorProfile, type Doctor } from "@/lib/api";

const CONSULTATION_TYPES = ["in-person", "video", "chat"];

export default function ClinicianSchedule() {
  const { user } = useAuth();
  const doctorId = user?.doctorId;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [available, setAvailable] = useState(true);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [newSlot, setNewSlot] = useState("");
  const [clinic, setClinic] = useState("");
  const [address, setAddress] = useState("");
  const [consultationFee, setConsultationFee] = useState(500);
  const [phone, setPhone] = useState("");
  const [experience, setExperience] = useState(1);
  const [languages, setLanguages] = useState<string[]>([]);
  const [consultationTypes, setConsultationTypes] = useState<string[]>(["in-person", "video", "chat"]);

  useEffect(() => {
    if (!doctorId) {
      setLoading(false);
      return;
    }
    getDoctor(doctorId)
      .then((d: Doctor) => {
        setAvailable(d.available !== false);
        setAvailableSlots(d.availableSlots || []);
        setClinic(d.clinic || "");
        setAddress(d.address || "");
        setConsultationFee(d.consultationFee ?? 500);
        setPhone(d.phone || "");
        setExperience(d.experience ?? 1);
        setLanguages(d.languages || []);
        setConsultationTypes(d.consultationTypes || ["in-person", "video", "chat"]);
      })
      .catch(() => setError("Could not load your doctor profile."))
      .finally(() => setLoading(false));
  }, [doctorId]);

  const addSlot = useCallback(() => {
    const slot = newSlot.trim();
    if (!slot) return;
    if (!/^\d{1,2}:\d{2}\s*-\s*\d{1,2}:\d{2}$/.test(slot)) {
      setError("Use format like 09:00-10:00");
      return;
    }
    setError("");
    setAvailableSlots((prev) => (prev.includes(slot) ? prev : [...prev, slot]));
    setNewSlot("");
  }, [newSlot]);

  const removeSlot = useCallback((slot: string) => {
    setAvailableSlots((prev) => prev.filter((s) => s !== slot));
  }, []);

  const toggleConsultationType = useCallback((ct: string) => {
    setConsultationTypes((prev) => (prev.includes(ct) ? prev.filter((x) => x !== ct) : [...prev, ct]));
  }, []);

  const handleSave = async () => {
    if (!doctorId) return;
    setSaving(true);
    setSaved(false);
    setError("");
    try {
      const updated = await updateDoctorProfile(doctorId, {
        available,
        availableSlots,
        clinic,
        address,
        consultationFee,
        phone,
        experience,
        languages,
        consultationTypes,
      });
      // Reflect whatever the server normalized back.
      setAvailable(updated.available !== false);
      setAvailableSlots(updated.availableSlots || []);
      setClinic(updated.clinic || "");
      setAddress(updated.address || "");
      setConsultationFee(updated.consultationFee ?? consultationFee);
      setPhone(updated.phone || "");
      setExperience(updated.experience ?? experience);
      setLanguages(updated.languages || []);
      setConsultationTypes(updated.consultationTypes || consultationTypes);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to save changes");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <AppLayout userType="clinician">
        <div className="flex items-center justify-center py-24">
          <Loader2 size={32} className="animate-spin text-[#54ACBF]" />
        </div>
      </AppLayout>
    );
  }

  if (!doctorId) {
    return (
      <AppLayout userType="clinician">
        <div className="max-w-lg mx-auto text-center py-16">
          <AlertCircle size={40} className="text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">No doctor profile linked</h2>
          <p className="text-muted-foreground text-sm">
            This account isn't linked to a doctor profile yet, so there's no schedule to manage.
          </p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout userType="clinician">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold font-[Manrope] mb-1">My Schedule & Availability</h2>
            <p className="text-muted-foreground text-sm">
              Control when patients can see you and book appointments. Changes go live instantly.
            </p>
          </div>
          {saved && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full text-xs font-bold text-emerald-700">
              <CheckCircle2 size={14} /> Saved
            </span>
          )}
        </div>

        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm font-semibold">
            <AlertCircle size={17} /> {error}
          </div>
        )}

        {/* Availability */}
        <section className="bg-card border rounded-[1.5rem] p-6 space-y-4">
          <div className="flex items-center gap-3">
            <CalendarClock size={20} className="text-[#54ACBF]" />
            <h3 className="font-bold">Availability</h3>
          </div>
          <button
            type="button"
            onClick={() => setAvailable((a) => !a)}
            className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
              available
                ? "border-emerald-300 bg-emerald-50 dark:bg-emerald-950/30"
                : "border-slate-200 bg-muted/40"
            }`}
          >
            <div className="text-left">
              <div className="font-bold text-sm">{available ? "Available for appointments" : "Not accepting appointments"}</div>
              <div className="text-xs text-muted-foreground">
                {available ? "Patients can see and book you in Find Doctors." : "You are hidden from patient search until you turn this back on."}
              </div>
            </div>
            <div className={`w-12 h-7 rounded-full relative transition-colors ${available ? "bg-emerald-500" : "bg-slate-300"}`}>
              <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-all ${available ? "left-6" : "left-1"}`} />
            </div>
          </button>
        </section>

        {/* Appointment Slots */}
        <section className="bg-card border rounded-[1.5rem] p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Clock size={20} className="text-[#54ACBF]" />
            <h3 className="font-bold">Appointment Schedule</h3>
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Add slot, e.g. 09:00-10:00"
              value={newSlot}
              onChange={(e) => setNewSlot(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSlot(); } }}
              className="h-11 rounded-xl"
            />
            <Button type="button" onClick={addSlot} className="h-11 rounded-xl shrink-0">
              <Plus size={16} className="mr-1" /> Add
            </Button>
          </div>
          {availableSlots.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No slots set. Patients will fall back to standard slot times when booking.
            </p>
          ) : (
            <div className="flex gap-2 flex-wrap">
              {availableSlots.map((slot) => (
                <span key={slot} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#A7EBF2]/40 border border-[#54ACBF]/25 text-sm font-bold text-[#26658C]">
                  {slot}
                  <button type="button" onClick={() => removeSlot(slot)} className="text-[#26658C]/60 hover:text-red-500">
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </section>

        {/* Profile & Fees */}
        <section className="bg-card border rounded-[1.5rem] p-6 space-y-4">
          <h3 className="font-bold">Practice Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">Hospital / Clinic</label>
              <Input value={clinic} onChange={(e) => setClinic(e.target.value)} className="h-11 rounded-xl" placeholder="Hospital or clinic name" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">Consultation Fee (₹)</label>
              <Input type="number" min={0} value={consultationFee} onChange={(e) => setConsultationFee(Number(e.target.value))} className="h-11 rounded-xl" />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">Clinic Address</label>
              <Input value={address} onChange={(e) => setAddress(e.target.value)} className="h-11 rounded-xl" placeholder="Full clinic / hospital address" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">Phone</label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="h-11 rounded-xl" placeholder="+91 ..." />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">Years of Experience</label>
              <Input type="number" min={0} value={experience} onChange={(e) => setExperience(Number(e.target.value))} className="h-11 rounded-xl" />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">Languages (comma separated)</label>
              <Input
                value={languages.join(", ")}
                onChange={(e) => setLanguages(e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
                className="h-11 rounded-xl"
                placeholder="English, Hindi, Marathi"
              />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">Consultation Types</label>
              <div className="flex gap-2 flex-wrap">
                {CONSULTATION_TYPES.map((ct) => (
                  <button
                    key={ct}
                    type="button"
                    onClick={() => toggleConsultationType(ct)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                      consultationTypes.includes(ct)
                        ? "bg-[#54ACBF] text-white border-transparent"
                        : "bg-[#F7FCFD] border-[#DCEFF2] text-[#5d7a8c]"
                    }`}
                  >
                    {ct === "in-person" ? "In-person" : ct === "video" ? "Video" : "Chat"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <Button onClick={handleSave} disabled={saving} className="w-full h-12 rounded-2xl font-extrabold luna-btn-teal">
          {saving ? <Loader2 size={18} className="animate-spin mr-2" /> : <Save size={18} className="mr-2" />}
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </AppLayout>
  );
}