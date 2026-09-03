import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { AppLayout } from "@/components/layout";
import {
  Calendar, Clock, Video, AlertTriangle, CheckCircle2,
  XCircle, ArrowRight, User, Stethoscope, Loader2,
  Phone, Bell, PhoneOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useLanguage } from "@/lib/language";
import {
  getAppointments, updateAppointmentStatus,
  type Appointment,
} from "@/lib/api";

export default function ClinicianAppointments() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [, setLocation] = useLocation();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filter, setFilter] = useState<"all" | "active" | "scheduled" | "completed">("all");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    // In demo mode, show all appointments (in production, filter by doctorId)
    getAppointments().then(setAppointments).catch(() => {});
  }, []);

  const handleAccept = async (apt: Appointment) => {
    setActionLoading(apt.id);
    try {
      await updateAppointmentStatus(apt.id, "active");
      setAppointments((prev) => prev.map((a) => a.id === apt.id ? { ...a, status: "active", joinedAt: new Date().toISOString() } : a));
      // Auto-start video call
      setLocation(`/call/${apt.callRoomId}`);
    } catch (err) {
      console.error(err);
    }
    setActionLoading(null);
  };

  const handleReject = async (apt: Appointment) => {
    setActionLoading(apt.id);
    try {
      await updateAppointmentStatus(apt.id, "cancelled", "Doctor unavailable");
      setAppointments((prev) => prev.map((a) => a.id === apt.id ? { ...a, status: "cancelled" } : a));
    } catch (err) {
      console.error(err);
    }
    setActionLoading(null);
  };

  const handleComplete = async (apt: Appointment) => {
    setActionLoading(apt.id);
    try {
      await updateAppointmentStatus(apt.id, "completed");
      setAppointments((prev) => prev.map((a) => a.id === apt.id ? { ...a, status: "completed", endedAt: new Date().toISOString() } : a));
    } catch (err) {
      console.error(err);
    }
    setActionLoading(null);
  };

  const joinCall = (roomId: string) => {
    setLocation(`/call/${roomId}`);
  };

  const filtered = filter === "all" ? appointments : appointments.filter((a) => a.status === filter);
  const activeCount = appointments.filter((a) => a.status === "active").length;
  const scheduledCount = appointments.filter((a) => a.status === "scheduled").length;
  const emergencyCount = appointments.filter((a) => a.urgency === "emergency" && a.status !== "completed" && a.status !== "cancelled").length;

  return (
    <AppLayout userType="clinician">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold font-[Manrope] mb-1">Appointment Management</h2>
            <p className="text-muted-foreground text-sm">Manage incoming patient appointments and video consultations.</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-card border rounded-xl p-4 text-center">
            <div className="text-2xl font-black text-cyan-600">{scheduledCount}</div>
            <div className="text-[10px] text-muted-foreground font-bold uppercase">Scheduled</div>
          </div>
          <div className="bg-card border rounded-xl p-4 text-center">
            <div className="text-2xl font-black text-blue-600">{activeCount}</div>
            <div className="text-[10px] text-muted-foreground font-bold uppercase">Active</div>
          </div>
          <div className="bg-card border rounded-xl p-4 text-center">
            <div className="text-2xl font-black text-red-600">{emergencyCount}</div>
            <div className="text-[10px] text-muted-foreground font-bold uppercase">Emergencies</div>
          </div>
          <div className="bg-card border rounded-xl p-4 text-center">
            <div className="text-2xl font-black text-muted-foreground">{appointments.length}</div>
            <div className="text-[10px] text-muted-foreground font-bold uppercase">Total</div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2">
          {(["all", "scheduled", "active", "completed"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                filter === f
                  ? "bg-cyan-600 text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              {f === "scheduled" && scheduledCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 bg-white/20 rounded-full text-[10px]">{scheduledCount}</span>
              )}
            </button>
          ))}
        </div>

        {/* Emergency Alert Banner */}
        {emergencyCount > 0 && (
          <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-500 flex items-center justify-center text-white animate-pulse">
              <Bell size={22} />
            </div>
            <div className="flex-1">
              <div className="font-bold text-red-700 dark:text-red-400">Emergency appointments awaiting!</div>
              <div className="text-xs text-red-600 dark:text-red-400">{emergencyCount} patient{emergencyCount > 1 ? "s" : ""} need immediate attention</div>
            </div>
            <Button
              onClick={() => {
                const emergency = appointments.find((a) => a.urgency === "emergency" && a.status === "scheduled");
                if (emergency) handleAccept(emergency);
              }}
              className="bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl"
            >
              <Phone size={16} className="mr-2" /> Respond Now
            </Button>
          </div>
        )}

        {/* Appointments List */}
        {filtered.length === 0 ? (
          <div className="bg-card border rounded-[2rem] p-12 text-center">
            <Calendar size={48} className="text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="font-bold text-lg mb-2">No {filter === "all" ? "" : filter} appointments</h3>
            <p className="text-muted-foreground text-sm">
              {filter === "scheduled" ? "No pending appointments to review." : "Appointments will appear here."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((apt) => (
              <div
                key={apt.id}
                className={`bg-card border rounded-2xl p-5 ${
                  apt.urgency === "emergency" && apt.status === "scheduled"
                    ? "border-red-300 dark:border-red-700 shadow-md shadow-red-500/10"
                    : ""
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Patient Avatar */}
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-lg ${
                    apt.urgency === "emergency" ? "bg-gradient-to-br from-red-500 to-red-600" :
                    apt.urgency === "urgent" ? "bg-gradient-to-br from-amber-500 to-orange-500" :
                    "bg-gradient-to-br from-sky-500 to-cyan-400"
                  }`}>
                    {apt.patientName.charAt(0)}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold">{apt.patientName}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        apt.urgency === "emergency" ? "bg-red-100 text-red-700" :
                        apt.urgency === "urgent" ? "bg-amber-100 text-amber-700" :
                        "bg-cyan-100 text-cyan-700"
                      }`}>{apt.urgency}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        apt.status === "active" ? "bg-blue-100 text-blue-700" :
                        apt.status === "completed" ? "bg-cyan-100 text-cyan-700" :
                        apt.status === "cancelled" ? "bg-slate-100 text-slate-600" :
                        "bg-amber-100 text-amber-700"
                      }`}>{apt.status}</span>
                    </div>
                    <div className="text-sm text-muted-foreground mb-1">{apt.reason}</div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar size={11} /> {new Date(apt.scheduledAt).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1"><Clock size={11} /> {new Date(apt.scheduledAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                      <span className="flex items-center gap-1"><Stethoscope size={11} /> {apt.duration} min</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 shrink-0">
                    {apt.status === "scheduled" && (
                      <>
                        <Button
                          onClick={() => handleAccept(apt)}
                          disabled={actionLoading === apt.id}
                          className="rounded-xl font-bold bg-cyan-600 hover:bg-cyan-700"
                        >
                          {actionLoading === apt.id ? <Loader2 size={16} className="animate-spin mr-2" /> : <Video size={16} className="mr-2" />}
                          Accept & Call
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleReject(apt)}
                          disabled={actionLoading === apt.id}
                          className="rounded-xl text-red-600 hover:bg-red-50 border-red-200"
                        >
                          <XCircle size={16} />
                        </Button>
                      </>
                    )}
                    {apt.status === "active" && (
                      <Button
                        onClick={() => joinCall(apt.callRoomId)}
                        className="rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Video size={16} className="mr-2" /> Join Call
                      </Button>
                    )}
                    {apt.status === "completed" && (
                      <Button
                        variant="outline"
                        onClick={() => joinCall(apt.callRoomId)}
                        className="rounded-xl"
                      >
                        <Phone size={14} className="mr-1" /> Replay
                      </Button>
                    )}
                  </div>
                </div>

                {/* Active call indicator */}
                {apt.status === "active" && (
                  <div className="mt-3 flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-800">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-xs font-bold text-blue-700 dark:text-blue-400">Call in progress</span>
                    <span className="text-[10px] text-blue-600">Patient: {apt.patientName}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleComplete(apt)}
                      className="ml-auto rounded-lg text-xs"
                    >
                      End Call
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
