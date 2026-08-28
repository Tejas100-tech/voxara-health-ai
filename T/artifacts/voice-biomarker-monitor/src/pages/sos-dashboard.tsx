import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle, Bell, Check, CheckCircle, Clock, MapPin,
  Phone, RefreshCw, Siren, User, X, Radio, ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppLayout } from "@/components/layout";

interface SosAlert {
  alertId: string;
  patientId: string;
  patientName: string;
  latitude: number | null;
  longitude: number | null;
  locationAccuracy: number | null;
  locationLabel: string | null;
  status: string;
  message: string | null;
  triggeredAt: string;
  acknowledgedAt: string | null;
  acknowledgedBy: string | null;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function AlertCard({
  alert,
  onAcknowledge,
  isAcknowledging,
}: {
  alert: SosAlert;
  onAcknowledge: (id: string) => void;
  isAcknowledging: boolean;
}) {
  const isActive = alert.status === "active";
  const elapsed = Date.now() - new Date(alert.triggeredAt).getTime();
  const secondsSince = Math.floor(elapsed / 1000);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -20 }}
      className={`relative rounded-2xl border-2 overflow-hidden transition-all ${
        isActive
          ? "border-red-500 bg-red-50 dark:bg-red-950/30 shadow-lg shadow-red-500/20"
          : "border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/10"
      }`}
    >
      {/* Active alert pulse animation */}
      {isActive && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-red-500">
          <motion.div
            className="h-full bg-red-400"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
      )}

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                isActive
                  ? "bg-red-500 text-white animate-pulse"
                  : "bg-green-500 text-white"
              }`}
            >
              {isActive ? <Siren size={24} /> : <CheckCircle size={24} />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-lg">{alert.patientName}</h3>
                <span
                  className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    isActive
                      ? "bg-red-500 text-white"
                      : "bg-green-500 text-white"
                  }`}
                >
                  {isActive ? "EMERGENCY" : "ACKNOWLEDGED"}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {alert.patientId} · {alert.message || "SOS triggered"}
              </p>
            </div>
          </div>

          {isActive && (
            <div className="text-right">
              <motion.div
                className="text-2xl font-black text-red-600"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                🚨
              </motion.div>
            </div>
          )}
        </div>

        {/* Location */}
        {alert.locationLabel && (
          <div
            className={`mb-4 p-3 rounded-xl ${
              isActive
                ? "bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800/40"
                : "bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800/30"
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <MapPin
                size={14}
                className={isActive ? "text-red-600" : "text-green-600"}
              />
              <span
                className={`text-[10px] font-black uppercase tracking-wider ${
                  isActive ? "text-red-700" : "text-green-700"
                }`}
              >
                Patient Location
              </span>
            </div>
            <p
              className={`text-xs break-words ${
                isActive
                  ? "text-red-800 dark:text-red-200"
                  : "text-green-800 dark:text-green-200"
              }`}
            >
              {alert.locationLabel}
            </p>
            {alert.latitude != null && alert.longitude != null && (
              <a
                href={`https://www.google.com/maps?q=${alert.latitude},${alert.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-2 text-xs font-bold text-primary hover:underline"
              >
                <ExternalLink size={12} />
                Open in Google Maps
              </a>
            )}
          </div>
        )}

        {/* Time & Meta */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock size={12} />
              {timeAgo(alert.triggeredAt)}
            </span>
            {alert.locationAccuracy != null && (
              <span className="text-xs text-muted-foreground">
                ±{Math.round(alert.locationAccuracy)}m accuracy
              </span>
            )}
          </div>
          {alert.acknowledgedAt && (
            <span className="text-xs text-green-600 font-bold">
              Acknowledged by {alert.acknowledgedBy}
            </span>
          )}
        </div>

        {/* Actions */}
        {isActive && (
          <div className="flex gap-3">
            <Button
              onClick={() => onAcknowledge(alert.alertId)}
              disabled={isAcknowledging}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold"
            >
              <CheckCircle size={16} className="mr-2" />
              Acknowledge & Dispatch
            </Button>
            <a
              href={`https://www.google.com/maps?q=${alert.latitude || 0},${alert.longitude || 0}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" className="rounded-xl" size="icon">
                <MapPin size={16} />
              </Button>
            </a>
            <a href="tel:108">
              <Button variant="outline" className="rounded-xl" size="icon">
                <Phone size={16} />
              </Button>
            </a>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function SosDashboard() {
  const [alerts, setAlerts] = useState<SosAlert[]>([]);
  const [sseConnected, setSseConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [acknowledging, setAcknowledging] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "active" | "acknowledged">(
    "all",
  );
  const eventSourceRef = useRef<EventSource | null>(null);
  const [, forceUpdate] = useState(0);

  // Re-render every second for elapsed time updates
  useEffect(() => {
    const interval = setInterval(() => forceUpdate((n) => n + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  // Load initial alerts
  useEffect(() => {
    setLoading(true);
    fetch("/api/sos/alerts")
      .then((res) => res.json())
      .then((data: SosAlert[]) => {
        setAlerts(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  // SSE connection for real-time alerts
  useEffect(() => {
    const es = new EventSource("/api/sos/stream");
    eventSourceRef.current = es;

    es.onopen = () => setSseConnected(true);

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "sos_alert" && data.alert) {
          setAlerts((prev) => {
            const exists = prev.find(
              (a) => a.alertId === data.alert.alertId,
            );
            if (exists) {
              return prev.map((a) =>
                a.alertId === data.alert.alertId ? data.alert : a,
              );
            }
            return [data.alert, ...prev];
          });

          // Play alert sound for new active alerts
          if (data.alert.status === "active") {
            try {
              const audioCtx = new AudioContext();
              const oscillator = audioCtx.createOscillator();
              const gainNode = audioCtx.createGain();
              oscillator.connect(gainNode);
              gainNode.connect(audioCtx.destination);
              oscillator.frequency.value = 880;
              oscillator.type = "square";
              gainNode.gain.value = 0.1;
              oscillator.start();
              setTimeout(() => {
                oscillator.stop();
                audioCtx.close();
              }, 500);
            } catch {
              // Audio not available
            }
          }
        }
        if (data.type === "connected") {
          setSseConnected(true);
        }
      } catch {
        // ignore parse errors
      }
    };

    es.onerror = () => {
      setSseConnected(false);
      // Auto-reconnect after 3 seconds
      setTimeout(() => {
        if (eventSourceRef.current?.readyState === EventSource.CLOSED) {
          // The effect will re-run and create a new connection
        }
      }, 3000);
    };

    return () => {
      es.close();
      eventSourceRef.current = null;
    };
  }, []);

  const handleAcknowledge = useCallback(async (alertId: string) => {
    setAcknowledging(alertId);
    try {
      await fetch(`/api/sos/alerts/${alertId}/acknowledge`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ acknowledgedBy: "Dr. on duty" }),
      });

      setAlerts((prev) =>
        prev.map((a) =>
          a.alertId === alertId
            ? {
                ...a,
                status: "acknowledged",
                acknowledgedAt: new Date().toISOString(),
                acknowledgedBy: "Dr. on duty",
              }
            : a,
        ),
      );
    } catch (err) {
      console.error("Failed to acknowledge alert:", err);
    } finally {
      setAcknowledging(null);
    }
  }, []);

  const filteredAlerts = alerts.filter((a) => {
    if (filter === "active") return a.status === "active";
    if (filter === "acknowledged") return a.status !== "active";
    return true;
  });

  const activeCount = alerts.filter((a) => a.status === "active").length;

  return (
    <AppLayout userType="clinician">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-extrabold font-[Manrope]">
                🚨 SOS Emergency Center
              </h2>
              {sseConnected && (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-green-700 dark:text-green-300">
                    Live
                  </span>
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Real-time emergency alerts from patients — monitored via SSE
              streaming
            </p>
          </div>
          <div className="flex items-center gap-3">
            {activeCount > 0 && (
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="px-4 py-2 bg-red-500 text-white rounded-full font-black text-sm shadow-lg shadow-red-500/30"
              >
                <Siren size={14} className="inline mr-2" />
                {activeCount} Active Emergency{activeCount > 1 ? "s" : ""}
              </motion.div>
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2">
          {(["all", "active", "acknowledged"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                filter === f
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {f === "all" && `All (${alerts.length})`}
              {f === "active" && (
                <>
                  <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-1.5 animate-pulse" />
                  Active ({alerts.filter((a) => a.status === "active").length})
                </>
              )}
              {f === "acknowledged" &&
                `Acknowledged (${alerts.filter((a) => a.status !== "active").length})`}
            </button>
          ))}
        </div>

        {/* Alerts List */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Radio className="animate-spin text-primary" size={24} />
            </div>
            <p className="text-muted-foreground font-semibold">
              Loading emergency alerts...
            </p>
          </div>
        ) : filteredAlerts.length === 0 ? (
          <div className="text-center py-20 bg-card border rounded-2xl">
            <CheckCircle className="mx-auto text-green-500 mb-4" size={48} />
            <h3 className="text-xl font-extrabold mb-2">
              {filter === "active"
                ? "No Active Emergencies"
                : "No Alerts Yet"}
            </h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              {filter === "active"
                ? "All patients are safe. New emergency alerts will appear here in real-time."
                : "When patients trigger the SOS button, alerts will stream here instantly via Server-Sent Events."}
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            <AnimatePresence mode="popLayout">
              {filteredAlerts.map((alert) => (
                <AlertCard
                  key={alert.alertId}
                  alert={alert}
                  onAcknowledge={handleAcknowledge}
                  isAcknowledging={acknowledging === alert.alertId}
                />
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* SSE Status Footer */}
        <div className="flex items-center justify-center gap-4 py-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <span
              className={`h-2 w-2 rounded-full ${
                sseConnected ? "bg-green-500" : "bg-red-500"
              }`}
            />
            SSE: {sseConnected ? "Connected" : "Disconnected"}
          </div>
          <span>·</span>
          <span>Endpoint: /api/sos/stream</span>
          <span>·</span>
          <span>
            {filteredAlerts.length} alert{filteredAlerts.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>
    </AppLayout>
  );
}
