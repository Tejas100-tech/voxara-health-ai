import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Phone, X, MapPin, Loader2, Check } from "lucide-react";
import { useAuth } from "@/lib/auth";

interface SosAlertResult {
  alertId: string;
  status: string;
  message: string;
  location: {
    latitude: number | null;
    longitude: number | null;
    accuracy: number | null;
    label: string | null;
  };
  triggeredAt: string;
}

const HOLD_DURATION_MS = 5000; // 5 seconds

export function SosButton() {
  const { user } = useAuth();
  const [holding, setHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<SosAlertResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [locationGranted, setLocationGranted] = useState(true);
  const holdTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  const getGeolocation = useCallback((): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation not supported"));
        return;
      }
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      });
    });
  }, []);

  const triggerSOS = useCallback(async () => {
    setSending(true);
    setError(null);

    let latitude: number | null = null;
    let longitude: number | null = null;
    let accuracy: number | null = null;

    try {
      const pos = await getGeolocation();
      latitude = pos.coords.latitude;
      longitude = pos.coords.longitude;
      accuracy = pos.coords.accuracy;
    } catch (geoErr) {
      console.warn("Geolocation unavailable:", geoErr);
      setLocationGranted(false);
      // Proceed anyway — send alert without location
    }

    try {
      const res = await fetch("/api/sos/trigger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: user?.patientId || "PT-UNKNOWN",
          patientName: user?.name || "Unknown Patient",
          latitude,
          longitude,
          accuracy,
          message: "Emergency SOS triggered by patient via MediKiosk",
        }),
      });

      if (!res.ok) throw new Error("Server returned an error");
      const data: SosAlertResult = await res.json();
      setResult(data);
    } catch (err) {
      console.error("SOS trigger failed:", err);
      setError("Failed to send alert. Please call emergency services directly.");
    } finally {
      setSending(false);
    }
  }, [getGeolocation, user]);

  // ─── Hold-to-trigger logic ───────────────────────────────────────────────

  const startHold = useCallback(() => {
    if (showConfirm || sending || result) return;
    setHolding(true);
    setHoldProgress(0);
    startTimeRef.current = Date.now();

    holdTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const progress = Math.min(100, (elapsed / HOLD_DURATION_MS) * 100);
      setHoldProgress(progress);

      if (progress >= 100) {
        if (holdTimerRef.current) clearInterval(holdTimerRef.current);
        setHolding(false);
        setHoldProgress(0);
        setShowConfirm(true);
      }
    }, 50);
  }, [showConfirm, sending, result]);

  const cancelHold = useCallback(() => {
    if (holdTimerRef.current) clearInterval(holdTimerRef.current);
    setHolding(false);
    setHoldProgress(0);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (holdTimerRef.current) clearInterval(holdTimerRef.current);
    };
  }, []);

  const resetSOS = () => {
    setResult(null);
    setError(null);
    setShowConfirm(false);
    setSending(false);
  };

  return (
    <>
      {/* ─── Floating SOS Button ──────────────────────────────────────── */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          onMouseDown={startHold}
          onMouseUp={cancelHold}
          onMouseLeave={cancelHold}
          onTouchStart={startHold}
          onTouchEnd={cancelHold}
          whileTap={{ scale: 0.95 }}
          className="relative w-20 h-20 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-2xl shadow-red-600/40 flex items-center justify-center select-none cursor-pointer transition-colors"
          title="Hold for 5 seconds to trigger SOS"
        >
          {/* Progress ring */}
          {holding && (
            <svg
              className="absolute inset-0 w-20 h-20 -rotate-90"
              viewBox="0 0 80 80"
            >
              <circle
                cx="40"
                cy="40"
                r="36"
                fill="none"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="4"
              />
              <circle
                cx="40"
                cy="40"
                r="36"
                fill="none"
                stroke="white"
                strokeWidth="4"
                strokeDasharray={`${2 * Math.PI * 36}`}
                strokeDashoffset={`${2 * Math.PI * 36 * (1 - holdProgress / 100)}`}
                strokeLinecap="round"
                className="transition-none"
              />
            </svg>
          )}
          <div className="flex flex-col items-center gap-0.5">
            <Phone size={24} />
            <span className="text-[10px] font-black tracking-wider">SOS</span>
          </div>
        </motion.button>
        {!holding && !showConfirm && !result && (
          <p className="text-[9px] text-center text-muted-foreground mt-1 font-bold w-24">
            Hold 5s for emergency
          </p>
        )}
      </div>

      {/* ─── Confirmation Modal ────────────────────────────────────────── */}
      <AnimatePresence>
        {showConfirm && !result && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget && !sending) resetSOS();
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-sm w-full shadow-2xl"
            >
              {sending ? (
                <div className="text-center space-y-4">
                  <Loader2 className="animate-spin text-red-600 mx-auto" size={48} />
                  <h3 className="text-xl font-extrabold">Sending Emergency Alert...</h3>
                  <p className="text-sm text-muted-foreground">
                    Locating you and notifying hospital staff...
                  </p>
                </div>
              ) : (
                <>
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                      <AlertTriangle size={32} className="text-red-600" />
                    </div>
                    <h3 className="text-xl font-extrabold text-red-600 mb-2">
                      🚨 Confirm Emergency SOS
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      This will send your <strong>current location</strong> and an emergency
                      alert to the hospital immediately. Only use for genuine emergencies.
                    </p>
                  </div>

                  {!locationGranted && (
                    <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 rounded-xl">
                      <p className="text-xs text-amber-700 dark:text-amber-300 font-bold">
                        ⚠ Location access was denied. Alert will be sent without your
                        location. Please call emergency services if you need immediate help.
                      </p>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={resetSOS}
                      className="flex-1 py-3 rounded-xl border font-bold text-sm hover:bg-muted transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={triggerSOS}
                      className="flex-1 py-3 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Phone size={16} />
                      Send SOS
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Success / Error Result ────────────────────────────────────── */}
      <AnimatePresence>
        {(result || error) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) resetSOS();
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-sm w-full shadow-2xl"
            >
              {error ? (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto">
                    <X size={32} className="text-red-600" />
                  </div>
                  <h3 className="text-xl font-extrabold">Alert Failed</h3>
                  <p className="text-sm text-muted-foreground">{error}</p>
                  <p className="text-sm font-bold text-red-600">
                    📞 Please call emergency services: <strong>108</strong> (India) or your
                    local emergency number
                  </p>
                  <button
                    onClick={resetSOS}
                    className="w-full py-3 rounded-xl bg-muted font-bold text-sm hover:bg-muted/80 transition-colors"
                  >
                    Close
                  </button>
                </div>
              ) : result ? (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-cyan-100 flex items-center justify-center mx-auto">
                    <Check size={32} className="text-cyan-600" />
                  </div>
                  <h3 className="text-xl font-extrabold text-cyan-600">
                    ✅ Emergency Alert Sent
                  </h3>
                  <p className="text-sm text-muted-foreground">{result.message}</p>

                  {result.location?.label && (
                    <div className="p-3 bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800/30 rounded-xl text-left">
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin size={14} className="text-cyan-600" />
                        <span className="text-[10px] font-black uppercase tracking-wider text-cyan-700">
                          Your Location Sent
                        </span>
                      </div>
                      <p className="text-xs text-cyan-800 dark:text-cyan-200 break-words">
                        {result.location.label}
                      </p>
                    </div>
                  )}

                  <p className="text-xs text-muted-foreground">
                    Alert ID: {result.alertId}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Time: {new Date(result.triggeredAt).toLocaleTimeString("en-IN")}
                  </p>

                  <button
                    onClick={resetSOS}
                    className="w-full py-3 rounded-xl bg-muted font-bold text-sm hover:bg-muted/80 transition-colors"
                  >
                    Close
                  </button>
                </div>
              ) : null}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
