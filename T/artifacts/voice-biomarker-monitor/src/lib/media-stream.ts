/**
 * Safe MediaStream Utility for WebRTC Video Calls & Voice Recording.
 * Handles insecure HTTP contexts, missing hardware, permission rejections,
 * legacy browsers, and provides synthetic canvas/audio fallbacks.
 */

export interface SafeMediaResult {
  stream: MediaStream;
  isSimulated: boolean;
  warning?: string;
  hasAudio: boolean;
  hasVideo: boolean;
}

/**
 * Check if the current window context is secure (HTTPS or localhost)
 */
export function isSecureContext(): boolean {
  if (typeof window === "undefined") return false;
  if (window.isSecureContext) return true;
  const hostname = window.location.hostname;
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "[::1]" ||
    hostname.endsWith(".localhost") ||
    window.location.protocol === "https:"
  );
}

/**
 * Creates a synthetic animated MediaStream using HTML5 Canvas & Web Audio API.
 * Guarantees that WebRTC peer connections and local video previews have valid
 * video and audio tracks even without camera/mic hardware or in non-secure HTTP origins.
 */
export function createSimulatedMediaStream(displayName: string = "User"): MediaStream {
  try {
    const canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext("2d");

    let frame = 0;
    let animId: number;

    const initials = displayName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase() || "U";

    function draw() {
      if (!ctx) return;
      frame++;

      // Background gradient
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      grad.addColorStop(0, "#0f172a");
      grad.addColorStop(0.5, "#1e293b");
      grad.addColorStop(1, "#0f172a");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2 - 20;

      // Animated pulsing wave rings
      const pulse1 = (Math.sin(frame * 0.05) + 1) * 0.5;
      const pulse2 = (Math.cos(frame * 0.04) + 1) * 0.5;

      ctx.strokeStyle = `rgba(6, 182, 212, ${0.15 + pulse1 * 0.25})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, cy, 70 + pulse1 * 25, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = `rgba(14, 165, 233, ${0.1 + pulse2 * 0.2})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, 95 + pulse2 * 30, 0, Math.PI * 2);
      ctx.stroke();

      // Center Avatar Circle
      ctx.fillStyle = "#0284c7";
      ctx.beginPath();
      ctx.arc(cx, cy, 55, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 3;
      ctx.stroke();

      // Avatar Initials
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 36px Inter, system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(initials, cx, cy);

      // Display Name
      ctx.fillStyle = "#f8fafc";
      ctx.font = "600 20px Inter, system-ui, sans-serif";
      ctx.fillText(displayName, cx, cy + 90);

      // Status Pill
      ctx.fillStyle = "rgba(15, 23, 42, 0.75)";
      const pillWidth = 240;
      const pillHeight = 28;
      const pillX = cx - pillWidth / 2;
      const pillY = cy + 115;
      ctx.beginPath();
      ctx.roundRect(pillX, pillY, pillWidth, pillHeight, 14);
      ctx.fill();
      ctx.strokeStyle = "rgba(6, 182, 212, 0.5)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Pulse dot
      ctx.fillStyle = "#22c55e";
      ctx.beginPath();
      ctx.arc(pillX + 18, pillY + pillHeight / 2, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#94a3b8";
      ctx.font = "12px Inter, system-ui, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText("Simulated Stream (Demo / HTTP)", pillX + 28, pillY + pillHeight / 2 + 1);

      animId = requestAnimationFrame(draw);
    }

    draw();

    const canvasStream = canvas.captureStream ? canvas.captureStream(25) : (canvas as any).mozCaptureStream?.(25);
    const videoTrack = canvasStream?.getVideoTracks()[0];

    // Create silent Web Audio track
    let audioTrack: MediaStreamTrack | null = null;
    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

      if (AudioContextClass) {
        const audioCtx = new AudioContextClass();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        gain.gain.value = 0; // Silent
        const dest = audioCtx.createMediaStreamDestination();
        osc.connect(gain);
        gain.connect(dest);
        osc.start();
        audioTrack = dest.stream.getAudioTracks()[0] || null;
      }
    } catch {
      // Silent audio fallback not supported
    }

    const tracks: MediaStreamTrack[] = [];
    if (videoTrack) tracks.push(videoTrack);
    if (audioTrack) tracks.push(audioTrack);

    const finalStream = new MediaStream(tracks);

    // Clean up canvas animation when tracks are stopped
    if (videoTrack) {
      const originalStop = videoTrack.stop.bind(videoTrack);
      videoTrack.stop = () => {
        cancelAnimationFrame(animId);
        originalStop();
      };
    }

    return finalStream;
  } catch (err) {
    console.warn("Failed to create canvas simulated stream, returning empty stream:", err);
    return new MediaStream();
  }
}

/**
 * Safely requests media permissions and returns a MediaStream.
 * Tries standard navigator.mediaDevices.getUserMedia -> simpler constraints -> legacy getUserMedia -> synthetic fallback.
 */
export async function getSafeUserMedia(
  constraints: MediaStreamConstraints = { video: true, audio: true },
  displayName: string = "Participant"
): Promise<SafeMediaResult> {
  const secure = isSecureContext();

  // Try standard navigator.mediaDevices.getUserMedia if available
  if (typeof navigator !== "undefined" && navigator?.mediaDevices?.getUserMedia) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      return {
        stream,
        isSimulated: false,
        hasAudio: stream.getAudioTracks().length > 0,
        hasVideo: stream.getVideoTracks().length > 0,
      };
    } catch (err: any) {
      console.warn("Primary getUserMedia failed:", err?.name, err?.message);

      // If HD constraints failed, try simple constraints
      if (err?.name === "OverconstrainedError" || err?.name === "ConstraintNotSatisfiedError") {
        try {
          const fallbackConstraints: MediaStreamConstraints = {
            video: !!constraints.video,
            audio: !!constraints.audio,
          };
          const stream = await navigator.mediaDevices.getUserMedia(fallbackConstraints);
          return {
            stream,
            isSimulated: false,
            hasAudio: stream.getAudioTracks().length > 0,
            hasVideo: stream.getVideoTracks().length > 0,
          };
        } catch {
          // continue to next fallback
        }
      }

      // If video camera is missing or in use, try audio-only
      if (
        (err?.name === "NotFoundError" || err?.name === "DevicesNotFoundError" || err?.name === "NotReadableError") &&
        constraints.video
      ) {
        try {
          const audioOnlyStream = await navigator.mediaDevices.getUserMedia({ audio: true });
          const simStream = createSimulatedMediaStream(displayName);
          const simVideoTrack = simStream.getVideoTracks()[0];
          if (simVideoTrack) {
            audioOnlyStream.addTrack(simVideoTrack);
          }
          return {
            stream: audioOnlyStream,
            isSimulated: true,
            warning: "Camera not detected. Using simulated video stream with live microphone audio.",
            hasAudio: true,
            hasVideo: !!simVideoTrack,
          };
        } catch {
          // continue to synthetic fallback
        }
      }

      // If permission was denied or other error
      if (err?.name === "NotAllowedError" || err?.name === "PermissionDeniedError") {
        const stream = createSimulatedMediaStream(displayName);
        return {
          stream,
          isSimulated: true,
          warning: "Camera & microphone permission denied. Using simulated stream for demo.",
          hasAudio: stream.getAudioTracks().length > 0,
          hasVideo: stream.getVideoTracks().length > 0,
        };
      }

      // For any other getUserMedia error (e.g. AbortError, TypeError, SecurityError)
      const stream = createSimulatedMediaStream(displayName);
      return {
        stream,
        isSimulated: true,
        warning: `Camera access unavailable (${err?.message || err?.name || "device error"}). Using simulated stream.`,
        hasAudio: stream.getAudioTracks().length > 0,
        hasVideo: stream.getVideoTracks().length > 0,
      };
    }
  }

  // Try legacy navigator.getUserMedia polyfills (for older browsers/webviews)
  try {
    const legacyGetUserMedia =
      (navigator as any)?.getUserMedia ||
      (navigator as any)?.webkitGetUserMedia ||
      (navigator as any)?.mozGetUserMedia ||
      (navigator as any)?.msGetUserMedia;

    if (legacyGetUserMedia) {
      const stream: MediaStream = await new Promise((resolve, reject) => {
        legacyGetUserMedia.call(navigator, constraints, resolve, reject);
      });
      return {
        stream,
        isSimulated: false,
        hasAudio: stream.getAudioTracks().length > 0,
        hasVideo: stream.getVideoTracks().length > 0,
      };
    }
  } catch {
    // continue to synthetic fallback
  }

  // Insecure context or unsupported environment: use synthetic stream with clear guidance
  const simStream = createSimulatedMediaStream(displayName);
  const warningMsg = !secure
    ? `Browser requires HTTPS or localhost for real webcam & microphone access (current: ${typeof window !== "undefined" ? window.location.origin : "HTTP"}). Using simulated stream.`
    : "Camera & microphone hardware unavailable or not supported in this browser. Using simulated stream.";

  return {
    stream: simStream,
    isSimulated: true,
    warning: warningMsg,
    hasAudio: simStream.getAudioTracks().length > 0,
    hasVideo: simStream.getVideoTracks().length > 0,
  };
}

/**
 * Safely requests screen sharing stream with graceful fallback
 */
export async function getSafeDisplayMedia(
  options: DisplayMediaStreamOptions = { video: true }
): Promise<MediaStream | null> {
  try {
    if (typeof navigator !== "undefined" && navigator?.mediaDevices?.getDisplayMedia) {
      return await navigator.mediaDevices.getDisplayMedia(options);
    }
  } catch (err: any) {
    if (err?.name !== "NotAllowedError") {
      console.warn("getDisplayMedia failed:", err);
    }
  }
  return null;
}
