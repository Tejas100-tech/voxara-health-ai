import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "wouter";
import {
  Search, MapPin, Star, Clock, Video, MessageSquare, Stethoscope,
  Filter, ChevronDown, Calendar, IndianRupee, Globe, Users, ArrowRight,
  Phone, BadgeCheck, Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AppLayout } from "@/components/layout";
import { useAuth } from "@/lib/auth";
import { useLanguage } from "@/lib/language";
import { searchDoctors, getDoctorSpecialties, getDoctorCities, type Doctor } from "@/lib/api";

const INDIAN_CITIES = [
  "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai",
  "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Lucknow",
  "Chandigarh", "Kochi",
];

export default function FindDoctors() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState(user?.city || "");
  const [specialty, setSpecialty] = useState("");
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState("");
  const [liveCount, setLiveCount] = useState(0);
  const [newDoctorFlash, setNewDoctorFlash] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  // ── Real-time WebSocket connection ────────────────────────────────
  const connectWebSocket = useCallback(() => {
    try {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const host = window.location.host;
      const ws = new WebSocket(`${protocol}//${host}/ws/discovery`);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("Connected to doctor discovery channel");
        // Subscribe to current city
        if (city) {
          ws.send(JSON.stringify({ type: "subscribe", city }));
        }
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === "doctor-added") {
            const newDoc = msg.doctor as Doctor;
            // Add to list if not already present
            setDoctors((prev) => {
              if (prev.some((d) => d.doctorId === newDoc.doctorId)) return prev;
              // If city filter is active and new doctor doesn't match, still add (they can search later)
              return [newDoc, ...prev];
            });
            setLiveCount((c) => c + 1);
            setNewDoctorFlash(newDoc.doctorId);
            setTimeout(() => setNewDoctorFlash(null), 3000);
          } else if (msg.type === "doctor-status-changed") {
            setDoctors((prev) =>
              prev.map((d) =>
                d.doctorId === msg.doctorId ? { ...d, available: msg.available } : d
              )
            );
          } else if (msg.type === "doctor-updated") {
            // A doctor changed their fee / clinic / slots / availability
            setDoctors((prev) =>
              prev.map((d) =>
                d.doctorId === msg.doctor.doctorId ? { ...d, ...msg.doctor } : d
              )
            );
          }
        } catch {
          // ignore malformed messages
        }
      };

      ws.onclose = () => {
        // Reconnect after 3 seconds
        setTimeout(connectWebSocket, 3000);
      };

      ws.onerror = () => {
        ws.close();
      };
    } catch {
      // WebSocket not available
    }
  }, [city]);

  useEffect(() => {
    getDoctorSpecialties().then(setSpecialties).catch(() => {});
    fetchDoctors();
    connectWebSocket();

    return () => {
      wsRef.current?.close();
    };
  }, []);

  const fetchDoctors = async (cityFilter?: string, specFilter?: string) => {
    setLoading(true);
    setError("");
    try {
      const result = await searchDoctors({
        city: cityFilter || city || undefined,
        specialty: specFilter || specialty || undefined,
        available: true,
      });
      setDoctors(result.doctors);
    } catch {
      setError("Failed to load doctors. Please try again.");
    }
    setLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDoctors();
  };

  const handleUseMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          setLoading(true);
          try {
            const { latitude, longitude } = pos.coords;
            const result = await searchDoctors({
              lat: latitude,
              lng: longitude,
              radius: 100,
              specialty: specialty || undefined,
              available: true,
            });
            setDoctors(result.doctors);
            // Try reverse geocoding the nearest city
            if (result.doctors.length > 0 && result.doctors[0].city) {
              setCity(result.doctors[0].city);
            }
          } catch {
            setError("Failed to find nearby doctors.");
          }
          setLoading(false);
        },
        () => {
          setError("Location access denied. Please select a city manually.");
        }
      );
    }
  };

  const getSpecialtyIcon = (spec: string) => {
    const s = spec.toLowerCase();
    if (s.includes("cardio")) return "❤️";
    if (s.includes("neuro")) return "🧠";
    if (s.includes("pediat") || s.includes("child")) return "👶";
    if (s.includes("derma") || s.includes("skin")) return "🧴";
    if (s.includes("ortho") || s.includes("bone")) return "🦴";
    if (s.includes("eye") || s.includes("ophthal")) return "👁️";
    if (s.includes("ent")) return "👂";
    if (s.includes("psych") || s.includes("mental")) return "🧠";
    if (s.includes("gyn") || s.includes("women")) return "👩";
    if (s.includes("ayush") || s.includes("ayur")) return "🌿";
    if (s.includes("pulmon") || s.includes("lung")) return "🫁";
    if (s.includes("onco") || s.includes("cancer")) return "🎗️";
    if (s.includes("gastro")) return "🩺";
    if (s.includes("nephro") || s.includes("kidney")) return "🫘";
    if (s.includes("uro")) return "🩺";
    if (s.includes("endo")) return "⚡";
    return "🩺";
  };

  return (
    <AppLayout userType="patient">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#011C40] via-[#023859] to-[#011C40] text-white p-8 md:p-10 shadow-2xl shadow-[#54ACBF]/15">
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_85%_15%,rgba(84,172,191,.32),transparent_38%),radial-gradient(ellipse_at_10%_90%,rgba(38,101,140,.26),transparent_40%)]" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold tracking-wider uppercase text-cyan-200 border border-white/10 mb-4">
              <Stethoscope size={13} /> Find the Right Doctor
            </div>
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <h2 className="text-3xl md:text-4xl font-extrabold font-[Manrope] leading-tight">
                Search Doctors{" "}
                <span className="text-cyan-200">Near You</span>
              </h2>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/20 backdrop-blur-md rounded-full text-xs font-bold text-emerald-300 border border-emerald-400/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> LIVE
              </div>
            </div>
            <p className="text-cyan-100/75 text-base leading-relaxed max-w-2xl">
              Find trusted doctors in your city or nearby. Filter by specialty, check ratings, and book an appointment — all in one place.
            </p>
          </div>
        </section>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <MapPin size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#54ACBF]" />
            <select
              value={city}
              onChange={(e) => { setCity(e.target.value); }}
              className="w-full h-12 pl-11 pr-4 rounded-2xl border border-[#B9DCE3] bg-white text-[#011C40] text-sm font-semibold focus:outline-none focus:border-[#54ACBF] appearance-none"
            >
              <option value="">All Cities</option>
              {INDIAN_CITIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="flex-1 relative">
            <Stethoscope size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#54ACBF]" />
            <select
              value={specialty}
              onChange={(e) => { setSpecialty(e.target.value); }}
              className="w-full h-12 pl-11 pr-4 rounded-2xl border border-[#B9DCE3] bg-white text-[#011C40] text-sm font-semibold focus:outline-none focus:border-[#54ACBF] appearance-none"
            >
              <option value="">All Specialties</option>
              {specialties.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <Button type="submit" className="h-12 rounded-2xl px-8 luna-btn-teal font-bold text-sm hover:brightness-105">
              <Search size={16} className="mr-2" /> Search
            </Button>
            <Button type="button" variant="outline" onClick={handleUseMyLocation}
              className="h-12 rounded-2xl px-4 border-[#B9DCE3] text-[#26658C] hover:bg-[#A7EBF2]/45 font-bold text-sm">
              <MapPin size={16} /> Near Me
            </Button>
          </div>
        </form>

        {/* Results */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm font-semibold">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-[1.5rem] border border-[#DCEFF2] p-6 animate-pulse">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#A7EBF2]/50" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-[#A7EBF2]/50 rounded-lg w-3/4" />
                    <div className="h-3 bg-[#A7EBF2]/30 rounded-lg w-1/2" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-[#A7EBF2]/30 rounded-lg w-full" />
                  <div className="h-3 bg-[#A7EBF2]/30 rounded-lg w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : doctors.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-3xl bg-[#A7EBF2]/30 flex items-center justify-center mx-auto mb-4">
              <Search size={32} className="text-[#54ACBF]" />
            </div>
            <h3 className="text-xl font-bold text-[#011C40] mb-2">No doctors found</h3>
            <p className="text-[#5d7a8c] text-sm">Try a different city or specialty, or broaden your search.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <p className="text-sm font-bold text-[#5d7a8c]">
                <span className="text-[#011C40]">{doctors.length}</span> doctor{doctors.length !== 1 ? "s" : ""} found
                {city && <span> in <span className="text-[#26658C]">{city}</span></span>}
                {specialty && <span> for <span className="text-[#26658C]">{specialty}</span></span>}
              </p>
                {liveCount > 0 && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-[10px] font-bold text-emerald-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> {liveCount} new doctor{liveCount !== 1 ? 's' : ''} joined live
                  </span>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {doctors.map((doc) => (
                <div key={doc.doctorId}
                  className={`group bg-white rounded-[1.5rem] border p-6 hover:shadow-xl hover:shadow-[#54ACBF]/10 hover:border-[#54ACBF]/30 transition-all duration-300 ${
                    newDoctorFlash === doc.doctorId
                      ? "border-emerald-400 shadow-lg shadow-emerald-400/20 animate-[pulse_1s_ease-in-out_3]"
                      : "border-[#DCEFF2]"
                  }`}>
                  {/* Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#54ACBF] to-[#26658C] flex items-center justify-center text-white text-xl font-black shrink-0 shadow-lg shadow-[#26658C]/20">
                      {getSpecialtyIcon(doc.specialty)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-[#011C40] text-base truncate">{doc.name}</h3>
                        <BadgeCheck size={16} className="text-[#54ACBF] shrink-0" />
                        {newDoctorFlash === doc.doctorId && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[9px] font-black uppercase tracking-wider animate-pulse">
                            NEW
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-bold text-[#26658C]">{doc.specialty}</p>
                      <p className="text-[11px] text-[#5d7a8c] flex items-center gap-1 mt-0.5">
                        <MapPin size={10} /> {doc.clinic || doc.city}
                      </p>
                    </div>
                  </div>

                  {/* Stats Row */}
                  <div className="flex items-center gap-3 mb-4 flex-wrap">
                    <div className="flex items-center gap-1 text-xs font-bold">
                      <Star size={12} className="text-amber-500 fill-amber-500" />
                      <span className="text-[#011C40]">{doc.rating}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-[#5d7a8c]">
                      <Users size={11} /> {doc.totalPatients?.toLocaleString()} patients
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-[#5d7a8c]">
                      <Clock size={11} /> {doc.experience}yr exp
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-2.5 mb-4">
                    <div className="flex items-center gap-2 text-xs">
                      <MapPin size={12} className="text-[#54ACBF] shrink-0" />
                      <span className="text-[#5d7a8c] font-semibold">{doc.city}, {doc.region}</span>
                      {doc.distance && (
                        <span className="text-[#54ACBF] font-bold ml-auto">{doc.distance.toFixed(0)} km away</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <IndianRupee size={12} className="text-[#54ACBF] shrink-0" />
                      <span className="text-[#011C40] font-bold">₹{doc.consultationFee}</span>
                      <span className="text-[#5d7a8c]">consultation</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <Globe size={12} className="text-[#54ACBF] shrink-0" />
                      <span className="text-[#5d7a8c] font-semibold">{doc.languages?.join(", ")}</span>
                    </div>
                  </div>

                  {/* Consultation Types */}
                  <div className="flex gap-1.5 mb-4 flex-wrap">
                    {doc.consultationTypes?.map((ct) => (
                      <span key={ct} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#A7EBF2]/40 text-[#26658C]">
                        {ct === "video" && <Video size={10} />}
                        {ct === "chat" && <MessageSquare size={10} />}
                        {ct === "in-person" && <Stethoscope size={10} />}
                        {ct}
                      </span>
                    ))}
                  </div>

                  {/* Available Slots */}
                  {doc.availableSlots && doc.availableSlots.length > 0 && (
                    <div className="mb-4">
                      <p className="text-[10px] font-bold text-[#5d7a8c] uppercase tracking-wider mb-1.5">Available Today</p>
                      <div className="flex gap-1.5 flex-wrap">
                        {doc.availableSlots.slice(0, 3).map((slot) => (
                          <span key={slot} className="px-2 py-1 rounded-lg text-[10px] font-bold bg-[#F7FCFD] border border-[#DCEFF2] text-[#26658C]">
                            {slot}
                          </span>
                        ))}
                        {doc.availableSlots.length > 3 && (
                          <span className="px-2 py-1 rounded-lg text-[10px] font-bold text-[#54ACBF]">
                            +{doc.availableSlots.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action */}
                  <Link href={`/appointments?book=${doc.doctorId}`}>
                    <Button className="w-full rounded-xl py-2.5 luna-btn-teal hover:brightness-105 text-xs font-bold group-hover:shadow-md group-hover:shadow-[#54ACBF]/20 transition-all">
                      <Calendar size={14} className="mr-2" />
                      Book Appointment
                      <ArrowRight size={14} className="ml-2 group-hover:translate-x-0.5 transition-transform" />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
