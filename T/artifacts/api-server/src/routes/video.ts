import { Router } from "express";
import { logger } from "../lib/logger";

const router = Router();

// ── In-memory signaling store ─────────────────────────────────────────────
// In production, this would use WebSocket/Socket.io for real-time signaling
// For demo, we use HTTP polling endpoints
const rooms: Record<string, {
  roomId: string;
  participants: string[];
  iceCandidates: Record<string, any[]>;
  offers: Record<string, any>;
  answers: Record<string, any>;
  createdAt: string;
}> = {};

// ── Create or join a video call room ──────────────────────────────────────
router.post("/video/room", (req, res) => {
  try {
    const { roomId, participantId, participantName } = req.body;
    if (!roomId || !participantId) {
      res.status(400).json({ error: "roomId and participantId are required" });
      return;
    }

    if (!rooms[roomId]) {
      rooms[roomId] = {
        roomId,
        participants: [],
        iceCandidates: {},
        offers: {},
        answers: {},
        createdAt: new Date().toISOString(),
      };
    }

    const room = rooms[roomId];
    if (!room.participants.includes(participantId)) {
      room.participants.push(participantId);
    }

    logger.info({ roomId, participantId, participantName }, "Joined video room");
    res.json({
      roomId,
      participants: room.participants,
      participantCount: room.participants.length,
    });
  } catch (err) {
    logger.error({ err }, "Failed to join video room");
    res.status(500).json({ error: "Failed to join room" });
  }
});

// ── Get room status ───────────────────────────────────────────────────────
router.get("/video/room/:roomId", (req, res) => {
  const room = rooms[String(req.params.roomId)];
  if (!room) { res.status(404).json({ error: "Room not found" }); return; }
  res.json({
    roomId: room.roomId,
    participants: room.participants,
    participantCount: room.participants.length,
  });
});

// ── Leave a room ──────────────────────────────────────────────────────────
router.post("/video/room/:roomId/leave", (req, res) => {
  const room = rooms[String(req.params.roomId)];
  if (!room) { res.status(404).json({ error: "Room not found" }); return; }

  const { participantId } = req.body;
  room.participants = room.participants.filter((p) => p !== participantId);

  if (room.participants.length === 0) {
    delete rooms[room.roomId];
    logger.info({ roomId: room.roomId }, "Room closed (empty)");
  }

  res.json({ ok: true, participants: room.participants });
});

// ── WebRTC Signaling: Post Offer ──────────────────────────────────────────
router.post("/video/room/:roomId/offer", (req, res) => {
  const room = rooms[String(req.params.roomId)];
  if (!room) { res.status(404).json({ error: "Room not found" }); return; }

  const { from, sdp } = req.body;
  room.offers[from] = sdp;
  res.json({ ok: true });
});

// ── WebRTC Signaling: Get Offer ───────────────────────────────────────────
router.get("/video/room/:roomId/offer/:from", (req, res) => {
  const room = rooms[String(req.params.roomId)];
  if (!room) { res.status(404).json({ error: "Room not found" }); return; }

  const sdp = room.offers[String(req.params.from)];
  if (!sdp) { res.status(404).json({ error: "No offer found" }); return; }
  res.json({ sdp });
});

// ── WebRTC Signaling: Post Answer ─────────────────────────────────────────
router.post("/video/room/:roomId/answer", (req, res) => {
  const room = rooms[String(req.params.roomId)];
  if (!room) { res.status(404).json({ error: "Room not found" }); return; }

  const { from, sdp } = req.body;
  room.answers[from] = sdp;
  res.json({ ok: true });
});

// ── WebRTC Signaling: Get Answer ──────────────────────────────────────────
router.get("/video/room/:roomId/answer/:from", (req, res) => {
  const room = rooms[String(req.params.roomId)];
  if (!room) { res.status(404).json({ error: "Room not found" }); return; }

  const sdp = room.answers[String(req.params.from)];
  if (!sdp) { res.status(404).json({ error: "No answer found" }); return; }
  res.json({ sdp });
});

// ── WebRTC Signaling: Post ICE Candidate ──────────────────────────────────
router.post("/video/room/:roomId/ice", (req, res) => {
  const room = rooms[String(req.params.roomId)];
  if (!room) { res.status(404).json({ error: "Room not found" }); return; }

  const { from, candidate } = req.body;
  if (!room.iceCandidates[from]) room.iceCandidates[from] = [];
  room.iceCandidates[from].push(candidate);
  res.json({ ok: true });
});

// ── WebRTC Signaling: Get ICE Candidates ──────────────────────────────────
router.get("/video/room/:roomId/ice/:from", (req, res) => {
  const room = rooms[String(req.params.roomId)];
  if (!room) { res.status(404).json({ error: "Room not found" }); return; }

  const candidates = room.iceCandidates[String(req.params.from)] || [];
  res.json({ candidates });
});

// ── End a call ────────────────────────────────────────────────────────────
router.post("/video/room/:roomId/end", (req, res) => {
  const room = rooms[String(req.params.roomId)];
  if (!room) { res.status(404).json({ error: "Room not found" }); return; }

  delete rooms[room.roomId];
  logger.info({ roomId: room.roomId }, "Video call ended");
  res.json({ ok: true });
});

export default router;
