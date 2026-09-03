import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { AppLayout } from "@/components/layout";
import {
  Calendar, Clock, Video, AlertTriangle, CheckCircle2,
  ArrowRight, ArrowLeft, User, Stethoscope, Loader2,
  Phone, MapPin, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth";
import { useLanguage } from "@/lib/language";
import {
  getAppointments, createAppointment, cancelAppointment,
  type Appointment,
} from "@/lib/api";

const DEMO_DOCTORS = [
  { doctorId: "DR-001", name: "Dr. Priya Sharma", specialty: "General Medicine", available: true },
  { doctorId: "DR-002", name: "Dr. Rajesh Gupta", specialty: "Cardiology", available: true },
  { doctorId: "DR-003", name: "Dr. Ananya Reddy", specialty: "Neurology", available: true },
  { doctorId: "DR-004", name: "Dr. Suresh Patel", specialty: "Orthopedics", available: false },
  { doctorId: "DR-005", name: "Dr. Meena Iyer", specialty: "AYUSH / Ayurveda", available: true },
  { doctorId: "DR-006", name: "Dr. Arjun Singh", specialty: "Pediatrics", available: true },
];

const URGENCY_OPTIONS = [
  { value: "routine", label: "Routine", desc: "Regular consultation (next 24-48 hours)", color: "emerald" },
  { value: "urgent", label: "Urgent", desc: "Within 2 hours", color: "amber" },
  { value: "emergency", label: "Emergency", desc: "Immediate priority (within 5 minutes)", color: "red" },
];

const TIME_SLOTS = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
  "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
  "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM",
];

export default function AppointmentsPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [, setLocation] = useLocation();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showBooking, setShowBooking] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [urgency, setUrgency] = useState("routine");
  const [reason, setReason] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [booking, setBooking] = useState(false);
  const [booked, setBooked] = useState(false);
  const [bookedAppointment, setBookedAppointment] = useState<Appointment | null>(null);

  useEffect(() => {
    if (user) {
      getAppointments({ patientId: user.patientId }).then(setAppointments).catch(() => {});
    }
  }, [user]);

  const handleBook = async () => {
    if (!user || !selectedDoctor || !reason.trim()) return;
    setBooking(true);
    try {
      const scheduledAt = selectedDate && selectedTime
        ? new Date(`${selectedDate}T${convertTo24h(selectedTime)}`).toISOString()
        : undefined;

      const apt = await createAppointment({
        patientId: user.patientId,
        patientName: user.name,
        doctorId: selectedDoctor,
        urgency,
        reason: reason.trim(),
        scheduledAt,
      });
      setBookedAppointment(apt);
      setBooked(true);
      setAppointments((prev) => [apt, ...prev]);
    } catch (err) {
      console.error(err);
    }
    setBooking(false);
  };

  const handleCancel = async (id: string) => {
    try {
      await cancelAppointment(id);
      setAppointments((prev) => prev.map((a) => a.id === id ? { ...a, status: "cancelled" } : a));
    } catch (err) {
      console.error(err);
    }
  };

  const startVideoCall = (roomId: string) => {
    setLocation(`/call/${roomId}`);
  };

  const doctor = DEMO_DOCTORS.find((d) => d.doctorId === selectedDoctor);

  // ── Booking Success View ──────────────────────────────────────────────
  if (booked && bookedAppointment) {
    return (
      <AppLayout userType="patient">
        <div className="max-w-lg mx-auto">
          <div className="bg-card border rounded-[2rem] p-8 text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center mx-auto">
              <CheckCircle2 size={40} className="text-emerald-600" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold font-[Manrope] mb-2">Appointment Booked!</h2>
              <p className="text-muted-foreground">Your appointment has been confirmed.</p>
            </div>
            <div className="bg-muted/30 rounded-xl p-5 text-left space-y-3">
              <div className="flex items-center gap-3">
                <Stethoscope size={16} className="text-emerald-600" />
                <div>
                  <div className="font-bold text-sm">{bookedAppointment.doctorName}</div>
                  <div className="text-xs text-muted-foreground">{bookedAppointment.doctorSpecialty}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar size={16} className="text-emerald-600" />
                <div className="text-sm">{new Date(bookedAppointment.scheduledAt).toLocaleString()}</div>
              </div>
              <div className="flex items-center gap-3">
                <AlertTriangle size={16} className={bookedAppointment.urgency === "emergency" ? "text-red-500" : "text-amber-500"} />
                <div className="text-sm capitalize font-bold">{bookedAppointment.urgency} priority</div>
              </div>
            </div>
            {bookedAppointment.urgency === "emergency" && (
              <Button
                onClick={() => startVideoCall(bookedAppointment.callRoomId)}
                className="w-full h-14 rounded-2xl font-bold bg-red-600 hover:bg-red-700 text-white text-lg"
              >
                <Video size={20} className="mr-2" /> Join Video Call Now
              </Button>
            )}
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => { setBooked(false); setShowBooking(false); }} className="flex-1 rounded-xl font-bold">
                Book Another
              </Button>
              <Button onClick={() => setLocation("/dashboard")} className="flex-1 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700">
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  // ── Booking Form ────────────────────────────────────────────────────
  if (showBooking) {
    return (
      <AppLayout userType="patient">
        <div className="max-w-2xl mx-auto space-y-6">
          <button onClick={() => setShowBooking(false)} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground font-semibold">
            <ArrowLeft size={16} /> Back to Appointments
          </button>

          <div className="bg-card border rounded-[2rem] p-8 space-y-6">
            <div className="text-center mb-4">
              <Calendar size={36} className="text-emerald-600 mx-auto mb-3" />
              <h2 className="text-2xl font-extrabold font-[Manrope] mb-1">Book Appointment</h2>
              <p className="text-muted-foreground text-sm">Select a doctor and schedule your consultation.</p>
            </div>

            {/* Doctor Selection */}
            <div>
              <label className="text-sm font-bold uppercase tracking-wider mb-3 block">Select Doctor</label>
              <div className="grid grid-cols-2 gap-3">
                {DEMO_DOCTORS.map((doc) => (
                  <button
                    key={doc.doctorId}
                    onClick={() => doc.available && setSelectedDoctor(doc.doctorId)}
                    disabled={!doc.available}
                    className={`flex flex-col items-center gap-2 p-4 min-h-[7rem] rounded-2xl border-2 transition-all text-center ${
                      !doc.available ? "border-border opacity-50 cursor-not-allowed" :
                      selectedDoctor === doc.doctorId
                        ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 shadow-md"
                        : "border-border hover:border-emerald-300"
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-emerald-400 flex items-center justify-center text-white font-bold text-sm">
                      {doc.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <div className="font-bold text-xs">{doc.name}</div>
                      <div className="text-[10px] text-muted-foreground">{doc.specialty}</div>
                    </div>
                    {!doc.available && <span className="text-[9px] text-red-500 font-bold">Unavailable</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Urgency */}
            <div>
              <label className="text-sm font-bold uppercase tracking-wider mb-3 block">Urgency Level</label>
              <div className="grid grid-cols-3 gap-2">
                {URGENCY_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setUrgency(opt.value)}
                    className={`flex flex-col items-center gap-1 p-3 min-h-[5rem] rounded-xl border-2 transition-all ${
                      urgency === opt.value
                        ? opt.color === "red" ? "border-red-500 bg-red-50 dark:bg-red-950/40" :
                          opt.color === "amber" ? "border-amber-500 bg-amber-50 dark:bg-amber-950/40" :
                          "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40"
                        : "border-border hover:border-muted-foreground/30"
                    }`}
                  >
                    <span className="font-bold text-sm">{opt.label}</span>
                    <span className="text-[9px] text-muted-foreground text-center">{opt.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Date & Time */}
            {urgency !== "emergency" && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-bold uppercase tracking-wider mb-2 block">Date</label>
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="h-14 rounded-xl text-base"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold uppercase tracking-wider mb-2 block">Time Slot</label>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full h-14 rounded-xl border bg-background px-4 text-base font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">Select time</option>
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Reason */}
            <div>
              <label className="text-sm font-bold uppercase tracking-wider mb-2 block">Reason for Visit</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Describe your symptoms or reason for consultation..."
                className="w-full h-24 rounded-xl border bg-background px-4 py-3 text-base resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Book Button */}
            <Button
              onClick={handleBook}
              disabled={!selectedDoctor || !reason.trim() || booking}
              className="w-full h-16 rounded-2xl font-black text-lg bg-emerald-600 hover:bg-emerald-700 shadow-lg"
            >
              {booking ? <Loader2 size={20} className="animate-spin mr-2" /> : <CheckCircle2 size={20} className="mr-2" />}
              {booking ? "Booking..." : "Confirm Appointment"}
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  // ── Appointments List ────────────────────────────────────────────────
  const upcoming = appointments.filter((a) => a.status === "scheduled" || a.status === "active");
  const past = appointments.filter((a) => a.status === "completed" || a.status === "cancelled");

  return (
    <AppLayout userType="patient">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold font-[Manrope] mb-1">My Appointments</h2>
            <p className="text-muted-foreground text-sm">Book and manage your doctor consultations.</p>
          </div>
          <Button onClick={() => setShowBooking(true)} className="h-12 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700">
            <Calendar size={16} className="mr-2" /> Book Appointment
          </Button>
        </div>

        {/* Upcoming */}
        {upcoming.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-bold text-lg">Upcoming</h3>
            {upcoming.map((apt) => (
              <div key={apt.id} className="bg-card border rounded-2xl p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold ${
                      apt.urgency === "emergency" ? "bg-gradient-to-br from-red-500 to-red-600" :
                      apt.urgency === "urgent" ? "bg-gradient-to-br from-amber-500 to-orange-500" :
                      "bg-gradient-to-br from-emerald-500 to-teal-400"
                    }`}>
                      {apt.status === "active" ? <Video size={20} /> : <Stethoscope size={20} />}
                    </div>
                    <div>
                      <div className="font-bold">{apt.doctorName}</div>
                      <div className="text-xs text-muted-foreground">{apt.doctorSpecialty} · {apt.reason}</div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Calendar size={11} /> {new Date(apt.scheduledAt).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1"><Clock size={11} /> {new Date(apt.scheduledAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {apt.status === "active" && (
                      <Button onClick={() => startVideoCall(apt.callRoomId)} size="sm" className="rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold">
                        <Video size={14} className="mr-1" /> Join
                      </Button>
                    )}
                    {apt.status === "scheduled" && (
                      <Button variant="outline" size="sm" onClick={() => handleCancel(apt.id)} className="rounded-lg text-red-600 hover:bg-red-50">
                        <X size={14} />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Past */}
        {past.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-bold text-lg text-muted-foreground">Past</h3>
            {past.map((apt) => (
              <div key={apt.id} className="bg-card border rounded-2xl p-4 opacity-60">
                <div className="flex items-center gap-3">
                  <Stethoscope size={16} className="text-muted-foreground" />
                  <div className="flex-1">
                    <div className="font-bold text-sm">{apt.doctorName} · {apt.doctorSpecialty}</div>
                    <div className="text-xs text-muted-foreground">{new Date(apt.scheduledAt).toLocaleString()} · {apt.reason}</div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    apt.status === "completed" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
                  }`}>{apt.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {appointments.length === 0 && (
          <div className="bg-card border rounded-[2rem] p-12 text-center">
            <Calendar size={48} className="text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="font-bold text-lg mb-2">No Appointments Yet</h3>
            <p className="text-muted-foreground text-sm mb-6">Book your first consultation with a doctor.</p>
            <Button onClick={() => setShowBooking(true)} className="h-12 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700">
              <Calendar size={16} className="mr-2" /> Book Appointment
            </Button>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

function convertTo24h(time12h: string): string {
  const [time, period] = time12h.split(" ");
  let [hours, minutes] = time.split(":").map(Number);
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}
