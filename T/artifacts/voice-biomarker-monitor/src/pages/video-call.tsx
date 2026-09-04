import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useParams } from "wouter";
import { AppLayout } from "@/components/layout";
import {
  Video, VideoOff, Mic, MicOff, PhoneOff,
  ScreenShare, ScreenShareOff, User,
  Loader2, AlertCircle, MessageSquare, X, Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useLanguage } from "@/lib/language";
import { joinVideoRoom, leaveVideoRoom, endVideoCall } from "@/lib/api";

const ICE_SERVERS: RTCIceServer[] = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
];

const VIDEO_CALL_STRINGS: Record<string, {
  connecting: string; waitingDoctor: string; waitingPatient: string;
  connected: string; roomLabel: string; participants: string;
  muted: string; unmute: string; cameraOn: string; cameraOff: string;
  shareScreen: string; stopShare: string; endCall: string;
  callFailed: string; backToAppts: string; callDuration: string;
  chatPlaceholder: string;
}> = {
  en: { connecting: "Connecting to video call...", waitingDoctor: "Waiting for doctor to join...", waitingPatient: "Waiting for patient to join...", connected: "Connected", roomLabel: "Room", participants: "participant", muted: "Unmute", unmute: "Mute", cameraOn: "Turn on camera", cameraOff: "Turn off camera", shareScreen: "Share screen", stopShare: "Stop sharing", endCall: "End call", callFailed: "Call Failed", backToAppts: "Back to Appointments", callDuration: "Call Duration", chatPlaceholder: "Type a message..." },
  hi: { connecting: "वीडियो कॉल से जुड़ रहे हैं...", waitingDoctor: "डॉक्टर के जुड़ने की प्रतीक्षा...", waitingPatient: "मरीज़ के जुड़ने की प्रतीक्षा...", connected: "जुड़ गया", roomLabel: "कमरा", participants: "प्रतिभागी", muted: "अनम्यूट", unmute: "म्यूट", cameraOn: "कैमरा चालू करें", cameraOff: "कैमरा बंद करें", shareScreen: "स्क्रीन शेयर करें", stopShare: "शेयर बंद करें", endCall: "कॉल समाप्त", callFailed: "कॉल विफल", backToAppts: "अपॉइंटमेंट पर वापस", callDuration: "कॉल अवधि", chatPlaceholder: "संदेश टाइप करें..." },
  ta: { connecting: "வீடியோ அழைப்பில் இணைகிறது...", waitingDoctor: "மருத்துவர் இணைய காத்திருக்கிறது...", waitingPatient: "நோயாளர் இணைய காத்திருக்கிறது...", connected: "இணைக்கப்பட்டது", roomLabel: "அறை", participants: "பங்கேற்பாளர்", muted: "முடக்கு", unmute: "நீக்கு", cameraOn: "கேமரா இயக்கு", cameraOff: "கேமரா நிறுத்து", shareScreen: "திரை பகிர்", stopShare: "பகிர்வு நிறுத்து", endCall: "அழைப்பு முடி", callFailed: "அழைப்பு தோல்வி", backToAppts: "சந்திப்புக்கு திரும்பு", callDuration: "அழைப்பு காலம்", chatPlaceholder: "செய்தியை தட்டச்சு செய்யுங்கள்..." },
  te: { connecting: "వీడియో కాల్‌కు కనెక్ట్ అవుతోంది...", waitingDoctor: "వైద్యుడు చేరడానికి వేచి ఉంది...", waitingPatient: "రోగి చేరడానికి వేచి ఉంది...", connected: "కనెక్ట్ అయింది", roomLabel: "గది", participants: "పాల్గొనేవారు", muted: "మ్యూట్", unmute: "అన్‌మ్యూట్", cameraOn: "కెమెరా ఆన్", cameraOff: "కెమెరా ఆఫ్", shareScreen: "స్క్రీన్ షేర్", stopShare: "షేర్ ఆపు", endCall: "కాల్ ముగించు", callFailed: "కాల్ విఫలం", backToAppts: "అపాయింట్‌మెంట్‌కు తిరిగి", callDuration: "కాల్ వ్యవధి", chatPlaceholder: "సందేశం టైప్ చేయండి..." },
  bn: { connecting: "ভিডিয়ো কলে সংযোগ হচ্ছে...", waitingDoctor: "ডাক্তারের যোগ দেওয়ার অপেক্ষা...", waitingPatient: "রোগীর যোগ দেওয়ার অপেক্ষা...", connected: "সংযুক্ত", roomLabel: "ঘর", participants: "অংশগ্রহণকারী", muted: "মিউট", unmute: "আনমিউট", cameraOn: "ক্যামেরা চালু", cameraOff: "ক্যামেরা বন্ধ", shareScreen: "স্ক্রিন শেয়ার", stopShare: "শেয়ার বন্ধ", endCall: "কল শেষ", callFailed: "কল ব্যর্থ", backToAppts: "অ্যাপয়েন্টমেন্টে ফিরুন", callDuration: "কল সময়কাল", chatPlaceholder: "বার্তা টাইপ করুন..." },
  mr: { connecting: "व्हिडिओ कॉलशी जोडले जात आहे...", waitingDoctor: "डॉक्टर जोडण्यासाठी प्रतीक्षा...", waitingPatient: "रुग्ण जोडण्यासाठी प्रतीक्षा...", connected: "जोडले", roomLabel: "खोली", participants: "सहभागी", muted: "म्यूट", unmute: "अनम्यूट", cameraOn: "कॅमेरा चालू", cameraOff: "कॅमेरा बंद", shareScreen: "स्क्रीन शेअर", stopShare: "शेअर बंद", endCall: "कॉल संपवा", callFailed: "कॉल अयशस्वी", backToAppts: "अपॉइंटमेंटवर परत", callDuration: "कॉल कालावधी", chatPlaceholder: "संदेश टाइप करा..." },
  gu: { connecting: "વિડિયો કૉલ સાથે કનેક્ટ થઈ રહ્યું છે...", waitingDoctor: "ડૉક્ટર જોડાવા માટે રાહ જોઈ રહ્યા છીએ...", waitingPatient: "દર્દી જોડાવા માટે રાહ જોઈ રહ્યા છીએ...", connected: "જોડાયેલ", roomLabel: "ખંડ", participants: "સહભાગી", muted: "મ્યૂટ", unmute: "અનમ્યૂટ", cameraOn: "કૅમેરા ચાલુ", cameraOff: "કૅમેરા બંધ", shareScreen: "સ્ક્રીન શેર", stopShare: "શેર બંધ", endCall: "કૉલ સમાપ્ત", callFailed: "કૉલ નિષ્ફળ", backToAppts: "અપોઇન્ટમેન્ટ પર પાછા", callDuration: "કૉલ સમયગાળો", chatPlaceholder: "સંદેશ ટાઇપ કરો..." },
  kn: { connecting: "ವೀಡಿಯೊ ಕರೆಗೆ ಸಂಪರ್ಕಿಸಲಾಗುತ್ತಿದೆ...", waitingDoctor: "ವೈದ್ಯರು ಸೇರಲು ಕಾಯುತ್ತಿದ್ದಾರೆ...", waitingPatient: "ರೋಗಿ ಸೇರಲು ಕಾಯುತ್ತಿದ್ದಾರೆ...", connected: "ಸಂಪರ್ಕಿಸಲಾಗಿದೆ", roomLabel: "ಕೊಠಡಿ", participants: "ಪಾಲ್ಗೊಳ್ಳುವವರು", muted: "ಮ್ಯೂಟ್", unmute: "ಅನ್‌ಮ್ಯೂಟ್", cameraOn: "ಕ್ಯಾಮೆರಾ ಆನ್", cameraOff: "ಕ್ಯಾಮೆರಾ ಆಫ್", shareScreen: "ಸ್ಕ್ರೀನ್ ಹಂಚಿಕೊಳ್ಳಿ", stopShare: "ಹಂಚಿಕೆ ನಿಲ್ಲಿಸಿ", endCall: "ಕರೆ ಮುಗಿಸಿ", callFailed: "ಕರೆ ವಿಫಲ", backToAppts: "ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್‌ಗೆ ಹಿಂತಿರುಗಿ", callDuration: "ಕರೆ ಅವಧಿ", chatPlaceholder: "ಸಂದೇಶ ಟೈಪ್ ಮಾಡಿ..." },
  ml: { connecting: "വീഡിയോ കോളിലേക്ക് കണക്റ്റ് ചെയ്യുന്നു...", waitingDoctor: "ഡോക്ടർ ചേരാൻ കാത്തിരിക്കുന്നു...", waitingPatient: "രോഗി ചേരാൻ കാത്തിരിക്കുന്നു...", connected: "കണക്റ്റ് ചെയ്തു", roomLabel: "മുറി", participants: "പങ്കെടുക്കുന്നവർ", muted: "മ്യൂട്ട്", unmute: "അൺമ്യൂട്ട്", cameraOn: "ക്യാമറ ഓൺ", cameraOff: "ക്യാമറ ഓഫ്", shareScreen: "സ്ക്രീൻ ഷെയർ", stopShare: "ഷെയർ നിർത്തുക", endCall: "കോൾ അവസാനിപ്പിക്കുക", callFailed: "കോൾ പരാജയം", backToAppts: "അപ്പോയിൻ്റ്മെൻ്റിലേക്ക് തിരിച്ചു", callDuration: "കോൾ ദൈർഘ്യം", chatPlaceholder: "സന്ദേശം ടൈപ്പ് ചെയ്യുക..." },
  pa: { connecting: "ਵੀਡੀਓ ਕਾਲ ਨਾਲ ਜੁੜ ਰਿਹਾ ਹੈ...", waitingDoctor: "ਡਾਕਟਰ ਦੇ ਜੁੜਨ ਦੀ ਉਡੀਕ...", waitingPatient: "ਮਰੀਜ਼ ਦੇ ਜੁੜਨ ਦੀ ਉਡੀਕ...", connected: "ਜੁੜ ਗਿਆ", roomLabel: "ਕਮਰਾ", participants: "ਹਿੱਸਾ ਲੈਣ ਵਾਲੇ", muted: "ਮਿਊਟ", unmute: "ਅਨਮਿਊਟ", cameraOn: "ਕੈਮਰਾ ਚਾਲੂ", cameraOff: "ਕੈਮਰਾ ਬੰਦ", shareScreen: "ਸਕ੍ਰੀਨ ਸ਼ੇਅਰ", stopShare: "ਸ਼ੇਅਰ ਬੰਦ", endCall: "ਕਾਲ ਖਤਮ", callFailed: "ਕਾਲ ਅਸਫਲ", backToAppts: "ਐਪੋਇੰਟਮੈਂਟ ਤੇ ਵਾਪਸ", callDuration: "ਕਾਲ ਅਵਧੀ", chatPlaceholder: "ਸੁਨੇਹਾ ਟਾਈਪ ਕਰੋ..." },
  or: { connecting: "ଭିଡିଓ କଲ୍ ସହ ସଂଯୋଗ ହେଉଛି...", waitingDoctor: "ଡାକ୍ତର ଯୋଗ ଦେବାକୁ ଅପେକ୍ଷା...", waitingPatient: "ରୋଗୀ ଯୋଗ ଦେବାକୁ ସଂଯୁକ୍ତ", connected: "ସଂଯୁକ୍ତ", roomLabel: "ଘର", participants: "ଅଂଶଗ୍ରହଣକାରୀ", muted: "ମ୍ୟୁଟ୍", unmute: "ଅନ୍‌ମ୍ୟୁଟ୍", cameraOn: "କ୍ୟାମେରା ଅନ୍", cameraOff: "କ୍ୟାମେରା ଅଫ୍", shareScreen: "ସ୍କ୍ରିନ୍ ସେୟାର୍", stopShare: "ସେୟାର୍ ବନ୍ଦ", endCall: "କଲ୍ ସମାପ୍ତ", callFailed: "କଲ୍ ବିଫଳ", backToAppts: "ଆପୋଇଣ୍ଟମେଣ୍ଟକୁ ଫେରନ୍ତୁ", callDuration: "କଲ୍ ଅବଧି", chatPlaceholder: "ବାର୍ତ୍ତା ଟାଇପ୍ କରନ୍ତୁ..." },
  as: { connecting: "ভিডিঅ কলল সংযোগ কৰি আছে...", waitingDoctor: "চিকিৎসক যোগ দিবলৈ অপেক্ষা...", waitingPatient: "ৰোগী যোগ দিবলৈ অপেক্ষা...", connected: "সংযুক্ত", roomLabel: "ঘৰ", participants: "অংশগ্ৰহণকাৰী", muted: "মিউট", unmute: "আনমিউট", cameraOn: "কেমেৰা অন", cameraOff: "কেমেৰা অফ", shareScreen: "স্ক্ৰিন শ্বেয়াৰ", stopShare: "শ্বেয়াৰ বন্ধ", endCall: "কল শেষ", callFailed: "কল ব্যৰ্থ", backToAppts: "এপয়েণ্টমেণ্টলৈ উভতি", callDuration: "কল সময়", chatPlaceholder: "বাৰ্তা টাইপ কৰক..." },
  ur: { connecting: "ویڈیو کال سے جوڑ رہے ہیں...", waitingDoctor: "ڈاکٹر کے جڑنے کا انتظار...", waitingPatient: "مریض کے جڑنے کا انتظار...", connected: "جڑ گیا", roomLabel: "کمرہ", participants: "شریک", muted: "میوٹ", unmute: "انمیوٹ", cameraOn: "کیمرا چالو", cameraOff: "کیمرا بند", shareScreen: "سکرین شیئر", stopShare: "شیئر بند", endCall: "کال ختم", callFailed: "کال ناکام", backToAppts: "اپوائنٹمنٹ پر واپس", callDuration: "کال کا وقت", chatPlaceholder: "پیغام ٹائپ کریں..." },
  sa: { connecting: "भिडियो कलं सह संयोज्यते...", waitingDoctor: "वैद्यस्य आगमनप्रतीक्षा...", waitingPatient: "रोगिणः आगमनप्रतीक्षा...", connected: "संयुक्तम्", roomLabel: "कक्षः", participants: "सहभागिनः", muted: "म्यूट", unmute: "अन्म्यूट", cameraOn: "दृश्यपटः चालू", cameraOff: "दृश्यपटः बन्ध", shareScreen: "पटः साझा", stopShare: "साझा बन्ध", endCall: "कलं समापय", callFailed: "कलं विफलम्", backToAppts: "नियोजनं प्रति प्रत्यागच्छ", callDuration: "कलस्य अवधिः", chatPlaceholder: "सन्देशं टाइप कुरु..." },
  ne: { connecting: "भिडियो कलसँग जोडिँदैछ...", waitingDoctor: "डाक्टर जोडिन पर्खिँदै...", waitingPatient: "बिरामी जोडिन पर्खिँदै...", connected: "जोडियो", roomLabel: "कोठा", participants: "सहभागी", muted: "म्युट", unmute: "अनम्युट", cameraOn: "क्यामेरा चालू", cameraOff: "क्यामेरा बन्द", shareScreen: "स्क्रिन साझा", stopShare: "साझा बन्द", endCall: "कल समाप्त", callFailed: "कल असफल", backToAppts: "एपोइन्टमेन्टमा फर्क", callDuration: "कल अवधि", chatPlaceholder: "सन्देश टाइप गर्नुहोस्..." },
};

export default function VideoCallPage() {
  const params = useParams();
  const roomId = params.roomId || "";
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const [, setLocation] = useLocation();

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const endedRef = useRef(false);
  const pendingIceRef = useRef<RTCIceCandidateInit[]>([]);
  const reconnectTimerRef = useRef<NodeJS.Timeout | null>(null);
  const httpFallbackStartedRef = useRef(false);
  const wsAttemptsRef = useRef(0);
  const endCallRef = useRef<() => void>(() => { });

  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(true);
  const [audioMuted, setAudioMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);
  const [screenSharing, setScreenSharing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const [participantCount, setParticipantCount] = useState(0);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ from: string; text: string; time: string }[]>([]);
  const [chatInput, setChatInput] = useState("");

  const durationRef = useRef<NodeJS.Timeout | null>(null);
  const pollRef = useRef<NodeJS.Timeout | null>(null);
  const lang = VIDEO_CALL_STRINGS[language] || VIDEO_CALL_STRINGS.en;

  // ── WebSocket Signaling ────────────────────────────────────────────────
  const sendWs = useCallback((msg: object) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(msg));
    }
  }, []);

  // ── Initialize WebRTC + WebSocket ──────────────────────────────────────
  useEffect(() => {
    if (!roomId || !user) return;

    endedRef.current = false;
    let cancelled = false;
    let pc: RTCPeerConnection | null = null;

    async function init() {
      try {
        // Get local media
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" },
          audio: { echoCancellation: true, noiseSuppression: true },
        });

        if (cancelled) { stream.getTracks().forEach((t) => t.stop()); return; }
        streamRef.current = stream;
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;

        // Create peer connection
        pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
        peerRef.current = pc;

        stream.getTracks().forEach((track) => pc!.addTrack(track, stream));

        // Handle remote stream
        pc.ontrack = (event) => {
          if (remoteVideoRef.current && event.streams[0]) {
            remoteVideoRef.current.srcObject = event.streams[0];
          }
          setConnected(true);
          setConnecting(false);
        };

        pc.onconnectionstatechange = () => {
          const state = pc?.connectionState;
          if (state === "connected") {
            setConnected(true);
            setConnecting(false);
          } else if (state === "failed" || state === "disconnected") {
            // Peer link dropped — show the waiting state; a rejoin /
            // renegotiation from the other side will reconnect media.
            setConnected(false);
          }
        };

        // ICE candidates → send via WebSocket
        pc.onicecandidate = (event) => {
          if (event.candidate) {
            sendWs({ type: "ice-candidate", candidate: event.candidate.toJSON() });
          }
        };

        // Connect WebSocket — with automatic reconnect + backoff so a call
        // survives network blips between two devices.
        const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
        const wsUrl = `${wsProtocol}//${window.location.host}/ws/signaling`;

        const flushPendingIce = async () => {
          if (!pc) { pendingIceRef.current = []; return; }
          const pending = pendingIceRef.current.splice(0, pendingIceRef.current.length);
          for (const c of pending) {
            try { await pc.addIceCandidate(new RTCIceCandidate(c)); } catch { /* ignore */ }
          }
        };

        const openSocket = () => {
          if (cancelled || endedRef.current) return;
          const ws = new WebSocket(wsUrl);
          wsRef.current = ws;

          ws.onopen = () => {
            if (cancelled || endedRef.current) return;
            wsAttemptsRef.current = 0;
            // Live socket is back — stop the HTTP fallback if it had started
            if (httpFallbackStartedRef.current) {
              httpFallbackStartedRef.current = false;
              if (pollRef.current) clearInterval(pollRef.current);
            }
            ws.send(JSON.stringify({
              type: "join",
              roomId,
              participantId: user!.patientId,
              participantName: user!.name,
            }));
          };

          ws.onmessage = async (event) => {
            if (cancelled) return;
            const msg = JSON.parse(event.data);

            switch (msg.type) {
              case "room-joined":
                setParticipantCount(msg.participantCount);
                // I'm the latest joiner — if others are already here I create the
                // offer (I'm the polite peer). This also fires after a reconnect,
                // which re-negotiates media with the other device.
                if (msg.participants.length > 0 && pc && pc.signalingState === "stable") {
                  try {
                    const offer = await pc.createOffer();
                    await pc.setLocalDescription(offer);
                    ws.send(JSON.stringify({ type: "offer", sdp: pc.localDescription!.toJSON() }));
                  } catch (e) { console.error("Failed to create offer on room-joined:", e); }
                }
                break;

              case "participant-joined":
                setParticipantCount(msg.participantCount);
                // A new participant joined AFTER me — I was here first, so I wait
                // for their offer. Do NOT create an offer here — that causes glare.
                break;

              case "offer":
                if (pc && pc.signalingState === "stable") {
                  await pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
                  await flushPendingIce();
                  const answer = await pc.createAnswer();
                  await pc.setLocalDescription(answer);
                  ws.send(JSON.stringify({ type: "answer", sdp: pc.localDescription!.toJSON() }));
                }
                break;

              case "answer":
                if (pc && pc.signalingState === "have-local-offer") {
                  await pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
                  await flushPendingIce();
                }
                break;

              case "ice-candidate":
                if (pc && msg.candidate) {
                  if (pc.remoteDescription) {
                    try { await pc.addIceCandidate(new RTCIceCandidate(msg.candidate)); } catch { }
                  } else {
                    // Remote description not ready yet — buffer and apply later
                    pendingIceRef.current.push(msg.candidate);
                  }
                }
                break;

              case "participant-left":
                setParticipantCount((c) => Math.max(0, c - 1));
                setConnected(false);
                break;

              case "call-ended":
                setConnected(false);
                endCallRef.current();
                break;

              case "room-full":
                if (!cancelled) {
                  setError("This call room already has two participants.");
                  setConnecting(false);
                }
                break;

              case "chat":
                setChatMessages((prev) => [...prev, {
                  from: msg.from,
                  text: msg.text,
                  time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                }]);
                break;
            }
          };

          ws.onerror = () => {
            try { ws.close(); } catch { /* noop */ }
          };

          ws.onclose = () => {
            if (cancelled || endedRef.current) return;
            if (wsRef.current === ws) wsRef.current = null;
            const attempt = wsAttemptsRef.current++;
            if (attempt < 4) {
              // Reconnect with backoff (1s → 2s → 3s → 4s)
              reconnectTimerRef.current = setTimeout(openSocket, Math.min(1000 * (attempt + 1), 4000));
            } else if (pc && !httpFallbackStartedRef.current) {
              // WebSocket unavailable — degrade to HTTP polling
              httpFallbackStartedRef.current = true;
              startHttpPolling(pc, roomId, user!.patientId);
            }
          };
        };

        openSocket();

        // Register room via HTTP too
        await joinVideoRoom(roomId, user!.patientId, user!.name);

        setConnecting(false);
      } catch (err: any) {
        if (!cancelled) {
          setError(err.message || "Failed to start video call");
          setConnecting(false);
        }
      }
    }

    // ── HTTP Polling Fallback ──────────────────────────────────────────────
    function startHttpPolling(pcRef: RTCPeerConnection, rid: string, pid: string) {
      if (pollRef.current) clearInterval(pollRef.current);

      let sentOffer = false;
      pollRef.current = setInterval(async () => {
        if (cancelled || pcRef.signalingState === "closed") {
          if (pollRef.current) clearInterval(pollRef.current);
          return;
        }

        try {
          // Check if room has another participant
          const roomRes = await fetch(`/api/video/room/${rid}`);
          const roomData = await roomRes.json();
          setParticipantCount(roomData.participantCount);

          // Only create offer if I'm the later joiner and in stable state
          // Use a deterministic rule: the participant with the later timestamp joins second
          // For simplicity, only create offer once when first seeing 2 participants
          if (roomData.participantCount >= 2 && !sentOffer && pcRef.signalingState === "stable") {
            // Only create offer if I joined AFTER the other participant
            // Use a simple heuristic: if I haven't received an offer, I'm the offerer
            // But first check if there's already an offer from the other side
            let hasOffer = false;
            for (const otherId of roomData.participants) {
              if (otherId === pid) continue;
              try {
                const offerRes = await fetch(`/api/video/room/${rid}/offer/${otherId}`);
                if (offerRes.ok) { hasOffer = true; break; }
              } catch { }
            }

            if (hasOffer && pcRef.signalingState === "stable") {
              // Receive offer, create answer
              for (const otherId of roomData.participants) {
                if (otherId === pid) continue;
                const offerRes = await fetch(`/api/video/room/${rid}/offer/${otherId}`);
                if (offerRes.ok) {
                  const { sdp } = await offerRes.json();
                  await pcRef.setRemoteDescription(new RTCSessionDescription(sdp));
                  const answer = await pcRef.createAnswer();
                  await pcRef.setLocalDescription(answer);
                  await fetch(`/api/video/room/${rid}/answer`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ from: pid, sdp: pcRef.localDescription!.toJSON() }),
                  });
                  sentOffer = true;
                  break;
                }
              }
            } else if (!hasOffer && pcRef.signalingState === "stable") {
              // No existing offer — I'm the first to connect, create offer
              const offer = await pcRef.createOffer();
              await pcRef.setLocalDescription(offer);
              await fetch(`/api/video/room/${rid}/offer`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ from: pid, sdp: pcRef.localDescription!.toJSON() }),
              });
              sentOffer = true;
            }
          }

          // Check for answer (if I sent the offer)
          if (sentOffer && pcRef.signalingState === "have-local-offer") {
            const ansRes = await fetch(`/api/video/room/${rid}/answer/${pid}`);
            if (ansRes.ok) {
              const { sdp } = await ansRes.json();
              await pcRef.setRemoteDescription(new RTCSessionDescription(sdp));
            }
          }
        } catch { }
      }, 1500);
    }

    init();

    return () => {
      cancelled = true;
      endedRef.current = true;
      if (pollRef.current) clearInterval(pollRef.current);
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
      if (streamRef.current) streamRef.current.getTracks().forEach((track) => track.stop());
      if (peerRef.current) peerRef.current.close();
      if (wsRef.current) wsRef.current.close();
      leaveVideoRoom(roomId, user?.patientId || "").catch(() => { });
    };
  }, [roomId, user, sendWs]);

  // ── Call timer ────────────────────────────────────────────────────────
  useEffect(() => {
    if (connected) {
      durationRef.current = setInterval(() => setCallDuration((s) => s + 1), 1000);
    }
    return () => { if (durationRef.current) clearInterval(durationRef.current); };
  }, [connected]);

  // ── Controls ──────────────────────────────────────────────────────────
  const toggleAudio = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach((t) => { t.enabled = audioMuted; });
      setAudioMuted(!audioMuted);
    }
  }, [audioMuted]);

  const toggleVideo = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getVideoTracks().forEach((t) => { t.enabled = videoOff; });
      setVideoOff(!videoOff);
    }
  }, [videoOff]);

  const toggleScreenShare = useCallback(async () => {
    try {
      if (screenSharing) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        const videoTrack = stream.getVideoTracks()[0];
        if (peerRef.current) {
          const sender = peerRef.current.getSenders().find((s) => s.track?.kind === "video");
          sender?.replaceTrack(videoTrack);
        }
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;
        streamRef.current = stream;
        setScreenSharing(false);
      } else {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const screenTrack = screenStream.getVideoTracks()[0];
        if (peerRef.current) {
          const sender = peerRef.current.getSenders().find((s) => s.track?.kind === "video");
          sender?.replaceTrack(screenTrack);
        }
        if (localVideoRef.current) localVideoRef.current.srcObject = screenStream;
        screenTrack.onended = () => toggleScreenShare();
        setScreenSharing(true);
      }
    } catch { }
  }, [screenSharing]);

  const endCall = useCallback(async () => {
    endedRef.current = true;
    if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
    if (pollRef.current) clearInterval(pollRef.current);
    sendWs({ type: "end-call" });
    try { wsRef.current?.close(); } catch { /* noop */ }
    if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
    if (peerRef.current) peerRef.current.close();
    await endVideoCall(roomId).catch(() => { });
    if (user?.role === "clinician") {
      setLocation("/clinician/appointments");
    } else {
      setLocation("/appointments");
    }
  }, [roomId, setLocation, user, sendWs]);
  endCallRef.current = endCall;

  const sendChatMessage = useCallback(() => {
    if (!chatInput.trim()) return;
    sendWs({ type: "chat", text: chatInput.trim() });
    setChatMessages((prev) => [...prev, {
      from: user?.patientId || "me",
      text: chatInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }]);
    setChatInput("");
  }, [chatInput, sendWs, user]);

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  if (error) {
    return (
      <AppLayout userType={user?.role === "clinician" ? "clinician" : "patient"}>
        <div className="max-w-lg mx-auto text-center py-20">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">{lang.callFailed}</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={() => setLocation(user?.role === "clinician" ? "/clinician/appointments" : "/appointments")} className="rounded-xl font-bold">
            {lang.backToAppts}
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <div className="h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="bg-black/80 backdrop-blur-sm px-6 py-3 flex items-center justify-between text-white z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-cyan-600 flex items-center justify-center">
            <Video size={16} />
          </div>
          <div>
            <div className="font-bold text-sm">MediKiosk Video</div>
            <div className="text-xs text-white/60">{lang.roomLabel}: {roomId.slice(-8)}</div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-white/60">{participantCount} {lang.participants}</span>
          {connected && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs font-mono text-cyan-400">{formatDuration(callDuration)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Video Area */}
      <div className="flex-1 relative">
        <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />

        {/* Local PiP */}
        <div className="absolute top-4 right-4 w-48 h-36 rounded-xl overflow-hidden border-2 border-white/20 shadow-lg z-10">
          <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover transform scale-x-[-1]" />
          {videoOff && (
            <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
              <User size={32} className="text-gray-400" />
            </div>
          )}
        </div>

        {connecting && (
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white z-20">
            <Loader2 size={40} className="animate-spin mb-4" />
            <p className="font-bold">{lang.connecting}</p>
            <p className="text-sm text-white/60">{lang.roomLabel}: {roomId}</p>
          </div>
        )}

        {!connecting && !connected && (
          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white z-20">
            <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mb-4">
              <User size={40} className="text-white/60" />
            </div>
            <p className="font-bold">
              {user?.role === "clinician" ? lang.waitingPatient : lang.waitingDoctor}
            </p>
            <p className="text-sm text-white/60">{lang.roomLabel}: {roomId}</p>
          </div>
        )}

        {/* In-call chat overlay */}
        {showChat && (
          <div className="absolute bottom-20 right-4 w-80 bg-card/95 backdrop-blur-xl rounded-2xl border shadow-2xl z-30 flex flex-col" style={{ height: "320px" }}>
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <span className="font-bold text-sm">{language === "hi" ? "चैट" : "Chat"}</span>
              <button onClick={() => setShowChat(false)} className="p-1 rounded-lg hover:bg-muted"><X size={16} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`text-xs ${msg.from === user?.patientId ? "text-right" : ""}`}>
                  <span className={`inline-block px-3 py-1.5 rounded-xl ${msg.from === user?.patientId ? "bg-cyan-600 text-white" : "bg-muted"}`}>
                    {msg.text}
                  </span>
                  <div className="text-muted-foreground mt-0.5">{msg.time}</div>
                </div>
              ))}
            </div>
            <div className="border-t p-2 flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendChatMessage()}
                placeholder={lang.chatPlaceholder}
                className="flex-1 h-9 rounded-lg border bg-background px-3 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
              <button onClick={sendChatMessage} className="h-9 w-9 rounded-lg bg-cyan-600 text-white flex items-center justify-center">
                <Send size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-black/90 backdrop-blur-sm px-6 py-4 flex items-center justify-center gap-3 z-10">
        <button onClick={toggleAudio}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${audioMuted ? "bg-red-600 text-white" : "bg-white/10 text-white hover:bg-white/20"}`}
          title={audioMuted ? lang.muted : lang.unmute}>
          {audioMuted ? <MicOff size={22} /> : <Mic size={22} />}
        </button>

        <button onClick={toggleVideo}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${videoOff ? "bg-red-600 text-white" : "bg-white/10 text-white hover:bg-white/20"}`}
          title={videoOff ? lang.cameraOn : lang.cameraOff}>
          {videoOff ? <VideoOff size={22} /> : <Video size={22} />}
        </button>

        <button onClick={toggleScreenShare}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${screenSharing ? "bg-blue-600 text-white" : "bg-white/10 text-white hover:bg-white/20"}`}
          title={screenSharing ? lang.stopShare : lang.shareScreen}>
          {screenSharing ? <ScreenShareOff size={22} /> : <ScreenShare size={22} />}
        </button>

        <button onClick={() => setShowChat(!showChat)}
          className="w-14 h-14 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-all"
          title={language === "hi" ? "चैट" : "Chat"}>
          <MessageSquare size={22} />
        </button>

        <button onClick={endCall}
          className="w-16 h-16 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition-all shadow-lg shadow-red-600/30"
          title={lang.endCall}>
          <PhoneOff size={24} />
        </button>
      </div>
    </div>
  );
}
