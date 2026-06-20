import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useLocation } from "wouter";
import {
  Activity, BrainCircuit, Camera, CameraOff, Clock, Heart,
  MessageSquare, Mic, MicOff, PhoneOff, Radio, Send,
  Stethoscope, Wind, X, Wifi, WifiOff,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useLiveVitals } from "@/lib/realtime";
import { fetchAppointmentByRoom } from "@/lib/api";

interface ChatMsg {
  from: string;
  name: string;
  text: string;
  time: string;
}

interface AppointmentInfo {
  doctorName: string;
  doctorSpecialty: string;
  urgency: string;
  reason: string;
}

const STUN = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" },
  ],
};

function nowStr() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function BioPanel({ live }: { live: ReturnType<typeof useLiveVitals> }) {
  return (
    <div className="space-y-2">
      {[
        { icon: Heart, label: "Health Score", value: `${Math.round((live.vocalStability + live.signalQuality) / 2)}%`, color: "text-primary" },
        { icon: Activity, label: "Tremor", value: `${live.tremorDrift}%`, color: "text-red-400" },
        { icon: Wind, label: "Resp Load", value: `${live.respiratoryLoad}%`, color: "text-secondary" },
        { icon: BrainCircuit, label: "Signal", value: `${live.signalQuality}%`, color: "text-primary" },
      ].map(({ icon: Icon, label, value, color }) => (
        <div key={label} className="flex items-center justify-between bg-white/10 rounded-xl px-3 py-2">
          <div className="flex items-center gap-2 text-white/70 text-xs font-semibold">
            <Icon size={12} className={color} /> {label}
          </div>
          <span className={`font-black text-xs ${color}`}>{value}</span>
        </div>
      ))}
    </div>
  );
}

export default function VideoCallPage() {
  const { id: roomId } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const live = useLiveVitals();

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const makingOfferRef = useRef(false);

  const [apptInfo, setApptInfo] = useState<AppointmentInfo | null>(null);
  const [callState, setCallState] = useState<"connecting" | "active" | "ended">("connecting");
  const [peerConnected, setPeerConnected] = useState(false);
  const [muted, setMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [showBio, setShowBio] = useState(true);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [elapsed, setElapsed] = useState(0);
  const [wsStatus, setWsStatus] = useState<"connecting" | "open" | "closed">("connecting");

  const addMsg = useCallback((from: string, name: string, text: string) => {
    setMessages((prev) => [...prev, { from, name, text, time: nowStr() }]);
  }, []);

  // Fetch appointment info
  useEffect(() => {
    if (!roomId) return;
    fetchAppointmentByRoom(roomId)
      .then((d) => setApptInfo(d as AppointmentInfo))
      .catch(() => {});
  }, [roomId]);

  // Timer
  useEffect(() => {
    if (callState !== "active") return;
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, [callState]);

  // Scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // WebRTC + signaling
  useEffect(() => {
    if (!roomId) return;
    let cancelled = false;

    const createPC = (ws: WebSocket): RTCPeerConnection => {
      const pc = new RTCPeerConnection(STUN);
      pcRef.current = pc;

      // Add local tracks once stream is available
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((t) => pc.addTrack(t, localStreamRef.current!));
      }

      pc.ontrack = (e) => {
        if (cancelled) return;
        const [stream] = e.streams;
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = stream;
        setPeerConnected(true);
        setCallState("active");
      };

      pc.onicecandidate = (e) => {
        if (e.candidate && ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: "ice-candidate", candidate: e.candidate }));
        }
      };

      pc.onconnectionstatechange = () => {
        if (pc.connectionState === "disconnected" || pc.connectionState === "failed") {
          setPeerConnected(false);
        }
      };

      return pc;
    };

    const init = async () => {
      // Start camera first
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" },
          audio: true,
        });
        if (cancelled) { stream.getTracks().forEach((t) => t.stop()); return; }
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
          localVideoRef.current.muted = true;
        }
      } catch {
        addMsg("system", "System", "Camera/microphone access denied. Others cannot see or hear you.");
      }

      // Connect WebSocket signaling
      const proto = window.location.protocol === "https:" ? "wss:" : "ws:";
      const ws = new WebSocket(`${proto}//${window.location.host}/ws`);
      wsRef.current = ws;

      ws.onopen = () => {
        if (cancelled) return;
        setWsStatus("open");
        ws.send(JSON.stringify({ type: "join", roomId }));
        addMsg("system", "System", "Waiting for the other participant to join…");
      };

      ws.onclose = () => {
        if (!cancelled) setWsStatus("closed");
      };

      ws.onerror = () => {
        if (!cancelled) addMsg("system", "System", "Connection error — please refresh.");
      };

      ws.onmessage = async (event) => {
        if (cancelled) return;
        try {
          const msg = JSON.parse(event.data);

          if (msg.type === "peer-joined") {
            // We are the existing peer — initiate offer
            addMsg("system", "System", "Participant joined — connecting video…");
            const pc = createPC(ws);
            makingOfferRef.current = true;
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            makingOfferRef.current = false;
            ws.send(JSON.stringify({ type: "offer", sdp: pc.localDescription }));

          } else if (msg.type === "offer") {
            // We are the new peer — answer
            const pc = createPC(ws);
            await pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            ws.send(JSON.stringify({ type: "answer", sdp: pc.localDescription }));
            addMsg("system", "System", "Connecting video…");

          } else if (msg.type === "answer") {
            if (pcRef.current?.signalingState === "have-local-offer") {
              await pcRef.current.setRemoteDescription(new RTCSessionDescription(msg.sdp));
            }

          } else if (msg.type === "ice-candidate" && msg.candidate) {
            try {
              await pcRef.current?.addIceCandidate(new RTCIceCandidate(msg.candidate));
            } catch { /* ignore stale candidates */ }

          } else if (msg.type === "peer-left") {
            setPeerConnected(false);
            if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
            addMsg("system", "System", "The other participant disconnected.");

          } else if (msg.type === "chat") {
            addMsg(msg.from, msg.name, msg.text);

          } else if (msg.type === "error") {
            addMsg("system", "System", "Room is full. Please check your appointment link.");
          }
        } catch { /* ignore parse errors */ }
      };
    };

    init();

    return () => {
      cancelled = true;
      localStreamRef.current?.getTracks().forEach((t) => t.stop());
      pcRef.current?.close();
      wsRef.current?.close();
    };
  }, [roomId, addMsg]);

  const toggleMute = () => {
    localStreamRef.current?.getAudioTracks().forEach((t) => { t.enabled = muted; });
    setMuted((m) => !m);
  };

  const toggleVideo = () => {
    localStreamRef.current?.getVideoTracks().forEach((t) => { t.enabled = videoOff; });
    setVideoOff((v) => !v);
  };

  const sendMessage = () => {
    if (!chatInput.trim() || !wsRef.current) return;
    const text = chatInput.trim();
    wsRef.current.send(JSON.stringify({ type: "chat", from: user?.patientId ?? "unknown", name: user?.name ?? "You", text }));
    addMsg(user?.patientId ?? "me", "You", text);
    setChatInput("");
  };

  const endCall = () => {
    setCallState("ended");
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    pcRef.current?.close();
    wsRef.current?.close();
    setTimeout(() => navigate("/appointments"), 2500);
  };

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  const remoteName = apptInfo
    ? (user?.role === "clinician" ? "Patient" : apptInfo.doctorName)
    : "Participant";

  if (callState === "ended") {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center animate-in fade-in zoom-in duration-500">
          <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <PhoneOff className="text-red-400" size={36} />
          </div>
          <h2 className="text-3xl font-extrabold font-[Manrope] mb-3">Call Ended</h2>
          <p className="text-white/60 mb-2">Duration: {fmt(elapsed)}</p>
          <p className="text-white/40 text-sm">Redirecting to appointments…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col overflow-hidden">

      {/* Top Bar */}
      <header className="flex items-center justify-between px-6 py-4 bg-slate-900/80 backdrop-blur-xl border-b border-white/10 z-20 shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Stethoscope size={18} />
          </div>
          <div>
            <p className="font-bold text-sm leading-tight">
              {apptInfo ? `${apptInfo.doctorName} · ${apptInfo.doctorSpecialty}` : "Video Consultation"}
            </p>
            <p className="text-white/40 text-xs font-mono">Room: {roomId?.slice(5, 22)}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {callState === "active" && peerConnected && (
            <div className="flex items-center gap-2 bg-red-600/20 border border-red-500/30 rounded-full px-4 py-1.5 text-red-400 text-xs font-black uppercase tracking-widest">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              Live · {fmt(elapsed)}
            </div>
          )}
          {callState === "connecting" && (
            <div className="flex items-center gap-2 text-white/50 text-xs font-semibold">
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              Connecting…
            </div>
          )}
          <div className={`flex items-center gap-1.5 text-xs font-semibold ${wsStatus === "open" ? "text-emerald-400" : "text-red-400"}`}>
            {wsStatus === "open" ? <Wifi size={13} /> : <WifiOff size={13} />}
            {wsStatus === "open" ? "Signaling OK" : "Disconnected"}
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-white/40">
            <Radio size={12} className="animate-pulse text-secondary" /> Biomarkers live
          </div>
        </div>
      </header>

      {/* Main Area */}
      <div className="flex flex-1 overflow-hidden">

        {/* Video pane */}
        <div className="flex-1 relative bg-slate-900 overflow-hidden">

          {/* Remote video (full screen) */}
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className={`absolute inset-0 w-full h-full object-cover ${peerConnected ? "" : "hidden"}`}
          />

          {/* Waiting / avatar placeholder when no remote */}
          {!peerConnected && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-950">
              <div className="flex flex-col items-center gap-6 text-center px-8">
                <div className="w-36 h-36 rounded-full bg-gradient-to-br from-primary/40 to-secondary/40 border border-white/10 flex items-center justify-center shadow-2xl animate-pulse">
                  <Stethoscope size={52} className="text-white/60" />
                </div>
                <div>
                  <p className="text-xl font-bold font-[Manrope] mb-1">{remoteName}</p>
                  <p className="text-white/40 text-sm">
                    {wsStatus === "open" ? "Waiting for them to join the call…" : "Connecting to signaling server…"}
                  </p>
                  <p className="text-white/25 text-xs mt-2 font-mono break-all">Share your room link to invite them</p>
                </div>
              </div>
            </div>
          )}

          {/* Local video PIP */}
          <div className="absolute bottom-6 right-6 w-48 h-36 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl bg-slate-800 z-10">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover scale-x-[-1] ${videoOff ? "hidden" : ""}`}
            />
            {videoOff && (
              <div className="w-full h-full flex items-center justify-center bg-slate-800">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-black text-xl font-[Manrope]">
                  {user?.name.charAt(0) ?? "Y"}
                </div>
              </div>
            )}
            <div className="absolute bottom-1.5 left-2 right-2 flex items-center justify-between">
              <span className="text-[10px] text-white/80 font-bold bg-black/60 rounded px-1.5 py-0.5">{user?.name ?? "You"}</span>
              {muted && <MicOff size={11} className="text-red-400" />}
            </div>
          </div>

          {/* Live biomarkers overlay */}
          {showBio && callState === "active" && (
            <div className="absolute top-4 left-4 w-52 bg-black/60 backdrop-blur-xl rounded-2xl p-4 border border-white/10 z-10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/50 flex items-center gap-1">
                  <Activity size={10} className="animate-pulse text-primary" /> Live Vitals
                </span>
                <button onClick={() => setShowBio(false)} className="text-white/30 hover:text-white/60">
                  <X size={12} />
                </button>
              </div>
              <BioPanel live={live} />
            </div>
          )}
          {!showBio && (
            <button onClick={() => setShowBio(true)} className="absolute top-4 left-4 p-2.5 bg-black/50 border border-white/10 rounded-xl text-white/50 hover:text-white z-10">
              <Activity size={16} />
            </button>
          )}

          {/* Elapsed timer */}
          {callState === "active" && peerConnected && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/60 backdrop-blur-md rounded-full px-4 py-2 border border-white/10 text-xs font-bold text-white/70 z-10">
              <Clock size={13} /> {fmt(elapsed)}
            </div>
          )}
        </div>

        {/* Chat sidebar */}
        {showChat && (
          <aside className="w-80 shrink-0 flex flex-col bg-slate-900 border-l border-white/10">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-2 font-bold text-sm">
                <MessageSquare size={16} /> In-Call Chat
              </div>
              <button onClick={() => setShowChat(false)} className="text-white/30 hover:text-white/60">
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
              {messages.length === 0 && (
                <p className="text-white/25 text-xs text-center mt-4">No messages yet</p>
              )}
              {messages.map((msg, i) => {
                const isMe = msg.from === (user?.patientId ?? "me") || msg.name === "You";
                const isSystem = msg.from === "system";
                if (isSystem) {
                  return (
                    <div key={i} className="flex justify-center">
                      <span className="text-[10px] text-white/30 bg-white/5 rounded-full px-3 py-1">{msg.text}</span>
                    </div>
                  );
                }
                return (
                  <div key={i} className={`flex flex-col gap-1 ${isMe ? "items-end" : "items-start"}`}>
                    <span className="text-[10px] text-white/30 font-semibold">{msg.name} · {msg.time}</span>
                    <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${isMe ? "bg-primary text-white rounded-br-sm" : "bg-white/10 text-white/90 rounded-bl-sm"}`}>
                      {msg.text}
                    </div>
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>

            <div className="p-4 border-t border-white/10 shrink-0">
              <div className="flex gap-2">
                <input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Type a message…"
                  className="flex-1 bg-white/10 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-primary/40"
                />
                <button
                  onClick={sendMessage}
                  className="p-2.5 bg-primary rounded-xl hover:bg-primary/80 transition-colors"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* Controls */}
      <footer className="bg-slate-900/90 backdrop-blur-xl border-t border-white/10 px-6 py-5 flex items-center justify-center gap-4 z-20 shrink-0">
        <button
          onClick={toggleMute}
          className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-1 ${muted ? "bg-red-600 border-red-500 text-white" : "bg-white/10 border-white/15 text-white/80 hover:bg-white/20"}`}
        >
          {muted ? <MicOff size={22} /> : <Mic size={22} />}
          <span className="text-[10px] font-black uppercase tracking-wider">{muted ? "Unmute" : "Mute"}</span>
        </button>

        <button
          onClick={toggleVideo}
          className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-1 ${videoOff ? "bg-red-600 border-red-500 text-white" : "bg-white/10 border-white/15 text-white/80 hover:bg-white/20"}`}
        >
          {videoOff ? <CameraOff size={22} /> : <Camera size={22} />}
          <span className="text-[10px] font-black uppercase tracking-wider">Camera</span>
        </button>

        <button
          onClick={() => setShowChat((c) => !c)}
          className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-1 ${showChat ? "bg-white/20 border-white/30 text-white" : "bg-white/10 border-white/15 text-white/80 hover:bg-white/20"}`}
        >
          <MessageSquare size={22} />
          <span className="text-[10px] font-black uppercase tracking-wider">Chat</span>
        </button>

        <button
          onClick={endCall}
          className="p-4 px-8 rounded-2xl bg-red-600 hover:bg-red-700 text-white transition-all shadow-xl shadow-red-600/30 flex flex-col items-center gap-1"
        >
          <PhoneOff size={22} />
          <span className="text-[10px] font-black uppercase tracking-wider">End Call</span>
        </button>
      </footer>
    </div>
  );
}
