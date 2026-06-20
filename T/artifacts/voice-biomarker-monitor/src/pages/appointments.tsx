import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { AppLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle, Calendar, CheckCircle2, Clock, PhoneCall,
  ShieldCheck, Stethoscope, Video, X, Zap, User,
  CheckCheck, XCircle, Hourglass, Activity, ListChecks,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useLiveVitals } from "@/lib/realtime";
import {
  fetchAppointments, bookAppointment, cancelAppointment,
  fetchDoctors, updateAppointmentStatus,
} from "@/lib/api";

type Urgency = "emergency" | "urgent" | "routine";
type Status = "scheduled" | "active" | "completed" | "cancelled";

interface Doctor {
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  available: boolean;
}

interface Appointment {
  _id: string;
  patientName?: string;
  patientId?: string;
  doctorName: string;
  doctorSpecialty: string;
  urgency: Urgency;
  status: Status;
  scheduledAt: string;
  reason: string;
  callRoomId: string;
  riskScore?: number;
}

const URGENCY_CONFIG: Record<Urgency, { label: string; color: string; badge: string; description: string; time: string; icon: typeof AlertTriangle }> = {
  emergency: {
    label: "Emergency — Now",
    color: "border-red-500 bg-red-50 dark:bg-red-950/30",
    badge: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
    description: "Critical biomarker alert. Connect with a doctor in under 5 minutes.",
    time: "< 5 min",
    icon: AlertTriangle,
  },
  urgent: {
    label: "Urgent — Within 2h",
    color: "border-amber-500 bg-amber-50 dark:bg-amber-950/30",
    badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
    description: "Your symptoms need same-day clinical review.",
    time: "< 2 hours",
    icon: Clock,
  },
  routine: {
    label: "Routine — Schedule",
    color: "border-primary/30 bg-primary/5",
    badge: "bg-primary/10 text-primary",
    description: "Preventive check-in or follow-up consultation.",
    time: "1–3 days",
    icon: Calendar,
  },
};

const STATUS_COLORS: Record<Status, string> = {
  scheduled: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  completed: "bg-muted text-muted-foreground",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const STATUS_LABELS: Record<Status, string> = {
  scheduled: "Pending",
  active: "Accepted",
  completed: "Completed",
  cancelled: "Cancelled",
};

const DEFAULT_REASONS = [
  "Increased tremor severity",
  "Breathing difficulty after walk",
  "Medication side effects",
  "Voice changes noticed",
  "Fatigue and dizziness",
  "Routine check-in",
];

export default function AppointmentsPage() {
  const { user } = useAuth();
  const isDoctor = user?.role === "clinician";
  return isDoctor ? <DoctorAppointmentsView /> : <PatientAppointmentsView />;
}

/* ─────────────────────────────────────────────
   DOCTOR VIEW — accept / reject incoming requests
───────────────────────────────────────────── */
function DoctorAppointmentsView() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | Status>("all");

  const load = async () => {
    setLoading(true);
    try {
      const appts = await fetchAppointments(undefined, undefined, user?.patientId) as Appointment[];
      setAppointments(appts);
    } catch {
      setAppointments(demoDoctorAppointments());
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, [user?.patientId]);

  const handleAccept = async (id: string) => {
    setUpdating(id);
    try { await updateAppointmentStatus(id, "active"); } catch { /* optimistic */ }
    setAppointments((prev) => prev.map((a) => a._id === id ? { ...a, status: "active" } : a));
    setUpdating(null);
  };

  const handleReject = async (id: string) => {
    setUpdating(id);
    try { await updateAppointmentStatus(id, "cancelled"); } catch { /* optimistic */ }
    setAppointments((prev) => prev.map((a) => a._id === id ? { ...a, status: "cancelled" } : a));
    setUpdating(null);
  };

  const pending = appointments.filter((a) => a.status === "scheduled");
  const active = appointments.filter((a) => a.status === "active");
  const past = appointments.filter((a) => a.status === "completed" || a.status === "cancelled");

  const filtered = filter === "all" ? appointments : appointments.filter((a) => a.status === filter);

  return (
    <AppLayout userType="clinician">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest mb-2">
              <ListChecks size={13} /> Appointment Inbox
            </div>
            <h1 className="text-4xl font-extrabold text-foreground font-[Manrope] leading-tight">
              Patient Requests
            </h1>
            <p className="text-muted-foreground mt-1">
              Review incoming consultation requests. Accept to open the video room, or reject with a reason.
            </p>
          </div>
          <button
            onClick={load}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl border text-sm font-bold hover:bg-muted transition-colors shrink-0"
          >
            <Activity size={15} /> Refresh
          </button>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-3 gap-4">
          {[
            { label: "Pending Review", value: pending.length, icon: Hourglass, color: "text-amber-500 bg-amber-50 dark:bg-amber-950/30" },
            { label: "Active Calls", value: active.length, icon: Video, color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30" },
            { label: "Total Today", value: appointments.filter((a) => new Date(a.scheduledAt).toDateString() === new Date().toDateString()).length, icon: Calendar, color: "text-primary bg-primary/10" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-card border rounded-2xl p-5 flex items-center gap-4">
              <div className={`p-3 rounded-2xl ${color} shrink-0`}><Icon size={20} /></div>
              <div>
                <p className="text-3xl font-black font-[Manrope]">{value}</p>
                <p className="text-xs text-muted-foreground font-semibold mt-0.5">{label}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Pending banner */}
        {pending.length > 0 && (
          <section className="rounded-2xl border-l-4 border-l-amber-500 bg-amber-50 dark:bg-amber-950/20 p-5 flex items-center gap-4">
            <Hourglass className="text-amber-600 shrink-0" size={20} />
            <p className="text-sm font-semibold">
              <span className="font-black text-amber-700 dark:text-amber-400">{pending.length} request{pending.length > 1 ? "s" : ""}</span>
              {" "}awaiting your decision.
              {pending.some((a) => a.urgency === "emergency") && (
                <span className="ml-2 font-black text-red-600">⚠ Includes emergency request</span>
              )}
            </p>
          </section>
        )}

        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap">
          {(["all", "scheduled", "active", "completed", "cancelled"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all border ${filter === f ? "bg-primary text-white border-primary" : "border-border text-muted-foreground hover:border-primary hover:text-primary"}`}
            >
              {f === "all" ? "All" : f === "scheduled" ? "Pending" : STATUS_LABELS[f as Status]}
              {f !== "all" && (
                <span className="ml-1.5 opacity-70">
                  ({appointments.filter((a) => a.status === f).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Appointment list */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-card border rounded-2xl p-14 text-center">
            <Stethoscope className="mx-auto mb-4 text-muted-foreground" size={40} />
            <h3 className="font-bold text-lg mb-2">No appointments here</h3>
            <p className="text-muted-foreground text-sm">New patient requests will appear here automatically.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((appt) => {
              const cfg = URGENCY_CONFIG[appt.urgency];
              const Icon = cfg.icon;
              const scheduledDate = new Date(appt.scheduledAt);
              const isPending = appt.status === "scheduled";
              const isActive = appt.status === "active";
              const isWorking = updating === appt._id;

              return (
                <div
                  key={appt._id}
                  className={`bg-card border rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center gap-5 transition-all ${isPending ? "border-amber-300 dark:border-amber-700/50 shadow-sm" : ""}`}
                >
                  {/* Urgency icon */}
                  <div className={`p-3 rounded-2xl ${cfg.badge} shrink-0 self-start sm:self-center`}>
                    <Icon size={20} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex items-center gap-1.5 font-bold text-foreground">
                        <User size={14} className="text-muted-foreground" />
                        {appt.patientName ?? "Unknown Patient"}
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${STATUS_COLORS[appt.status]}`}>
                        {STATUS_LABELS[appt.status]}
                      </span>
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${cfg.badge}`}>
                        {cfg.label.split(" — ")[0]}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{appt.reason}</p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground font-medium">
                      <span className="flex items-center gap-1">
                        <Clock size={11} />
                        {scheduledDate.toLocaleDateString()} {scheduledDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                      {appt.riskScore !== undefined && (
                        <span className={`flex items-center gap-1 font-bold ${appt.riskScore >= 70 ? "text-red-600" : appt.riskScore >= 40 ? "text-amber-600" : "text-muted-foreground"}`}>
                          <Zap size={11} /> Risk: {appt.riskScore}%
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 shrink-0 min-w-[160px]">
                    {isPending && (
                      <>
                        <Button
                          className="rounded-xl font-bold flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20"
                          disabled={isWorking}
                          onClick={() => handleAccept(appt._id)}
                        >
                          {isWorking ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <CheckCheck size={16} />
                          )}
                          Accept
                        </Button>
                        <Button
                          variant="ghost"
                          className="rounded-xl font-bold flex items-center gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive border border-destructive/20"
                          disabled={isWorking}
                          onClick={() => handleReject(appt._id)}
                        >
                          <XCircle size={16} /> Reject
                        </Button>
                      </>
                    )}
                    {isActive && (
                      <Button
                        className="rounded-xl font-bold flex items-center gap-2 shadow-md shadow-primary/20"
                        onClick={() => navigate(`/call/${appt.callRoomId}`)}
                      >
                        <Video size={16} /> Join Call
                      </Button>
                    )}
                    {(appt.status === "completed" || appt.status === "cancelled") && (
                      <span className="text-xs text-muted-foreground font-semibold text-center px-2">
                        {appt.status === "completed" ? "Session ended" : "Rejected"}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

/* ─────────────────────────────────────────────
   PATIENT VIEW — book consultations
───────────────────────────────────────────── */
function PatientAppointmentsView() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const live = useLiveVitals();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [urgency, setUrgency] = useState<Urgency>("urgent");
  const [reason, setReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");

  const riskLevel = live.riskScore >= 70 ? "emergency" : live.riskScore >= 40 ? "urgent" : "routine";
  const showRiskAlert = live.riskScore >= 40;

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [appts, docs] = await Promise.all([
          fetchAppointments(user?.patientId),
          fetchDoctors(),
        ]);
        setAppointments(appts as Appointment[]);
        setDoctors(docs as Doctor[]);
        if ((docs as Doctor[]).length > 0) setSelectedDoctor((docs[0] as Doctor).doctorId);
      } catch {
        setAppointments(generateDemoAppointments());
        setDoctors(demoDoctors());
        setSelectedDoctor("DR-001");
      }
      setLoading(false);
    };
    load();
  }, [user?.patientId]);

  const handleBook = async () => {
    if (!reason && !customReason) return;
    setBooking(true);
    try {
      const appt = await bookAppointment({
        patientId: user?.patientId ?? "PT-001",
        patientName: user?.name ?? "Patient",
        doctorId: selectedDoctor,
        urgency,
        reason: customReason || reason,
        riskScore: live.riskScore,
        biomarkerTrigger: live.riskScore >= 40 ? `Risk score ${live.riskScore}%` : undefined,
      });
      const newAppt = appt as Appointment;
      setAppointments((prev) => [newAppt, ...prev]);
      setShowForm(false);
      setReason(""); setCustomReason("");
      if (urgency === "emergency") navigate(`/call/${newAppt.callRoomId}`);
    } catch {
      const demo: Appointment = {
        _id: Date.now().toString(),
        doctorName: doctors.find((d) => d.doctorId === selectedDoctor)?.doctorName ?? "Dr. Sarah Chen",
        doctorSpecialty: doctors.find((d) => d.doctorId === selectedDoctor)?.doctorSpecialty ?? "Neurology",
        urgency,
        status: "scheduled",
        scheduledAt: new Date(Date.now() + (urgency === "emergency" ? 5 : urgency === "urgent" ? 7200 : 86400) * 1000).toISOString(),
        reason: customReason || reason,
        callRoomId: `room-demo-${Date.now()}`,
        riskScore: live.riskScore,
      };
      setAppointments((prev) => [demo, ...prev]);
      setShowForm(false);
      setReason(""); setCustomReason("");
      if (urgency === "emergency") navigate(`/call/${demo.callRoomId}`);
    }
    setBooking(false);
  };

  const handleCancel = async (id: string) => {
    try { await cancelAppointment(id); } catch { /* optimistic */ }
    setAppointments((prev) => prev.map((a) => a._id === id ? { ...a, status: "cancelled" } : a));
  };

  const UrgIcon = URGENCY_CONFIG[urgency].icon;

  return (
    <AppLayout userType="patient">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest mb-2">
              <PhoneCall size={13} /> Telemedicine
            </div>
            <h1 className="text-4xl font-extrabold text-foreground font-[Manrope] leading-tight">
              Appointment & Video Calls
            </h1>
            <p className="text-muted-foreground mt-1">
              Book urgent or routine consultations. Emergency connects you in under 5 minutes.
            </p>
          </div>
          <Button className="rounded-2xl px-7 py-5 text-base font-bold shadow-lg shadow-primary/20 glow-pulse" onClick={() => setShowForm(true)}>
            <Calendar className="mr-2" size={18} /> Book Appointment
          </Button>
        </section>

        {/* Risk Alert Banner */}
        {showRiskAlert && (
          <section className={`rounded-2xl border-l-4 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${riskLevel === "emergency" ? "border-l-red-500 bg-red-50 dark:bg-red-950/30" : "border-l-amber-500 bg-amber-50 dark:bg-amber-950/30"}`}>
            <div className="flex items-start gap-4">
              <AlertTriangle className={`mt-0.5 ${riskLevel === "emergency" ? "text-red-600" : "text-amber-600"}`} size={22} />
              <div>
                <p className="font-bold text-foreground">
                  {riskLevel === "emergency" ? "Critical Risk Score Detected" : "Elevated Risk Score"}
                </p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Current risk: <strong>{live.riskScore}%</strong>. Your care team recommends {riskLevel === "emergency" ? "an immediate consultation." : "same-day review."}
                </p>
              </div>
            </div>
            <Button
              className={`shrink-0 rounded-xl font-bold ${riskLevel === "emergency" ? "bg-red-600 hover:bg-red-700 text-white" : "bg-amber-600 hover:bg-amber-700 text-white"}`}
              onClick={() => { setUrgency(riskLevel); setShowForm(true); }}
            >
              {riskLevel === "emergency" ? "Connect Now" : "Book Urgent Call"}
            </Button>
          </section>
        )}

        {/* Booking Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-card border rounded-[2rem] shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[92vh]">
              <div className="flex items-center justify-between p-7 border-b shrink-0">
                <h2 className="text-2xl font-bold font-[Manrope]">Book Consultation</h2>
                <button onClick={() => setShowForm(false)} className="p-2 rounded-xl hover:bg-muted text-muted-foreground">
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 p-7 space-y-6 overflow-y-auto min-h-0">

                {/* Urgency */}
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground block mb-3">Urgency Level</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["emergency", "urgent", "routine"] as Urgency[]).map((u) => {
                      const cfg = URGENCY_CONFIG[u];
                      const Icon = cfg.icon;
                      return (
                        <button
                          key={u}
                          onClick={() => setUrgency(u)}
                          className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 text-center transition-all ${urgency === u ? cfg.color + " border-current scale-[1.03] shadow-md" : "border-border hover:border-muted-foreground"}`}
                        >
                          <Icon size={20} className={urgency === u ? (u === "emergency" ? "text-red-600" : u === "urgent" ? "text-amber-600" : "text-primary") : "text-muted-foreground"} />
                          <div>
                            <p className="text-xs font-black leading-tight">{cfg.label.split(" — ")[0]}</p>
                            <p className="text-[10px] text-muted-foreground font-semibold">{cfg.time}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 font-medium">{URGENCY_CONFIG[urgency].description}</p>
                </div>

                {/* Doctor */}
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground block mb-3">Doctor</label>
                  <div className="space-y-2">
                    {doctors.filter((d) => d.available).map((doc) => (
                      <button
                        key={doc.doctorId}
                        onClick={() => setSelectedDoctor(doc.doctorId)}
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${selectedDoctor === doc.doctorId ? "border-primary bg-primary/5 shadow-sm" : "border-border hover:border-muted-foreground"}`}
                      >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-black shrink-0">
                          {doc.doctorName.charAt(4)}
                        </div>
                        <div>
                          <p className="font-bold text-sm">{doc.doctorName}</p>
                          <p className="text-xs text-muted-foreground">{doc.doctorSpecialty}</p>
                        </div>
                        {selectedDoctor === doc.doctorId && <CheckCircle2 className="ml-auto text-primary" size={18} />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reason */}
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground block mb-3">Reason for Visit</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {DEFAULT_REASONS.map((r) => (
                      <button
                        key={r}
                        onClick={() => setReason(r)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${reason === r ? "bg-primary text-white border-primary" : "border-border text-muted-foreground hover:border-primary hover:text-primary"}`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                  <input
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    placeholder="Or describe your concern…"
                    className="w-full px-4 py-3 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>

                <Button
                  className="w-full py-5 text-base font-bold rounded-xl shadow-lg shadow-primary/20"
                  disabled={booking || (!reason && !customReason)}
                  onClick={handleBook}
                >
                  {booking ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Booking...
                    </span>
                  ) : urgency === "emergency" ? (
                    <span className="flex items-center gap-2"><Video size={18} /> Connect Now — Emergency</span>
                  ) : (
                    <span className="flex items-center gap-2"><UrgIcon size={18} /> Confirm Appointment</span>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* How It Works */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { icon: AlertTriangle, title: "Biomarker Alert", desc: "Your risk score triggers an automatic urgent appointment suggestion.", color: "text-destructive bg-destructive/10" },
            { icon: Video, title: "Instant Video Call", desc: "Emergency connects you within 5 minutes directly via your browser camera.", color: "text-primary bg-primary/10" },
            { icon: ShieldCheck, title: "Secure & Clinical", desc: "End-to-end encrypted, HIPAA-aligned. Your health data stays private.", color: "text-secondary bg-secondary/10" },
          ].map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="bg-card border rounded-2xl p-6 card-hover">
              <div className={`p-3 rounded-2xl ${color} inline-flex mb-4`}><Icon size={22} /></div>
              <h3 className="font-bold text-lg mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </section>

        {/* Appointments list */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold font-[Manrope]">Your Appointments</h2>
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          ) : appointments.length === 0 ? (
            <div className="bg-card border rounded-2xl p-12 text-center">
              <Stethoscope className="mx-auto mb-4 text-muted-foreground" size={40} />
              <h3 className="font-bold text-lg mb-2">No appointments yet</h3>
              <p className="text-muted-foreground">Book your first consultation above.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map((appt) => {
                const cfg = URGENCY_CONFIG[appt.urgency];
                const Icon = cfg.icon;
                const scheduledDate = new Date(appt.scheduledAt);
                const isJoinable = appt.status === "active";
                const isPending = appt.status === "scheduled";

                return (
                  <div key={appt._id} className="bg-card border rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center gap-5 card-hover">
                    <div className={`p-3 rounded-2xl ${cfg.badge} shrink-0 self-start sm:self-center`}><Icon size={20} /></div>
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-foreground">{appt.doctorName}</h3>
                        <span className="text-xs text-muted-foreground font-medium">{appt.doctorSpecialty}</span>
                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${STATUS_COLORS[appt.status]}`}>
                          {STATUS_LABELS[appt.status]}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{appt.reason}</p>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground font-medium">
                        <span className="flex items-center gap-1"><Clock size={11} /> {scheduledDate.toLocaleDateString()} {scheduledDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                        <span className={`font-bold px-2 py-0.5 rounded-full ${cfg.badge}`}>{cfg.label}</span>
                        {appt.riskScore !== undefined && (
                          <span className="flex items-center gap-1"><Zap size={11} /> Risk: {appt.riskScore}%</span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                      {isJoinable && (
                        <Button
                          className="rounded-xl font-bold shadow-md shadow-primary/20 flex items-center gap-2"
                          onClick={() => navigate(`/call/${appt.callRoomId}`)}
                        >
                          <Video size={16} /> Join Video Call
                        </Button>
                      )}
                      {isPending && (
                        <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-semibold px-2">
                          <Hourglass size={12} /> Awaiting doctor
                        </div>
                      )}
                      {isPending && (
                        <Button
                          variant="ghost"
                          className="rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10 text-xs font-bold"
                          onClick={() => handleCancel(appt._id)}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </AppLayout>
  );
}

/* ── Demo data ── */
function demoDoctorAppointments(): Appointment[] {
  return [
    { _id: "d1", patientName: "Alex Carter", patientId: "PT-001", doctorName: "Dr. Priya Mehta", doctorSpecialty: "General Practice", urgency: "emergency", status: "scheduled", scheduledAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(), reason: "Sudden increase in tremor severity and voice instability", callRoomId: "room-demo-1", riskScore: 82 },
    { _id: "d2", patientName: "Sofia Reyes", patientId: "PT-002", doctorName: "Dr. Priya Mehta", doctorSpecialty: "General Practice", urgency: "urgent", status: "scheduled", scheduledAt: new Date(Date.now() + 90 * 60 * 1000).toISOString(), reason: "Difficulty breathing after morning walk", callRoomId: "room-demo-2", riskScore: 55 },
    { _id: "d3", patientName: "James Wu", patientId: "PT-003", doctorName: "Dr. Priya Mehta", doctorSpecialty: "General Practice", urgency: "routine", status: "active", scheduledAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(), reason: "Monthly check-in and medication review", callRoomId: "room-demo-3", riskScore: 24 },
    { _id: "d4", patientName: "Maria Lopez", patientId: "PT-004", doctorName: "Dr. Priya Mehta", doctorSpecialty: "General Practice", urgency: "routine", status: "completed", scheduledAt: new Date(Date.now() - 2 * 86400 * 1000).toISOString(), reason: "Follow-up on medication adjustment", callRoomId: "room-demo-4", riskScore: 31 },
  ];
}

function generateDemoAppointments(): Appointment[] {
  return [
    { _id: "demo-1", doctorName: "Dr. Sarah Chen", doctorSpecialty: "Neurology", urgency: "urgent", status: "scheduled", scheduledAt: new Date(Date.now() + 3600000).toISOString(), reason: "Increased tremor severity in morning session", callRoomId: "room-demo-active", riskScore: 52 },
    { _id: "demo-2", doctorName: "Dr. Marcus Webb", doctorSpecialty: "Pulmonology", urgency: "routine", status: "completed", scheduledAt: new Date(Date.now() - 86400000 * 3).toISOString(), reason: "Breathing check-up", callRoomId: "room-demo-done", riskScore: 28 },
  ];
}

function demoDoctors(): Doctor[] {
  return [
    { doctorId: "DR-001", doctorName: "Dr. Sarah Chen", doctorSpecialty: "Neurology", available: true },
    { doctorId: "DR-002", doctorName: "Dr. Marcus Webb", doctorSpecialty: "Pulmonology", available: true },
    { doctorId: "DR-003", doctorName: "Dr. Priya Mehta", doctorSpecialty: "General Practice", available: true },
  ];
}
