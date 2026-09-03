import type { Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { logger } from "./logger";

// ── Room state ───────────────────────────────────────────────────────────
interface Participant {
  ws: WebSocket;
  id: string;
  name: string;
}

interface Room {
  id: string;
  participants: Map<string, Participant>;
  createdAt: number;
}

const rooms = new Map<string, Room>();

function getOrCreateRoom(roomId: string): Room {
  if (!rooms.has(roomId)) {
    rooms.set(roomId, {
      id: roomId,
      participants: new Map(),
      createdAt: Date.now(),
    });
  }
  return rooms.get(roomId)!;
}

// ── Broadcast to other participants ───────────────────────────────────────
function broadcast(room: Room, senderId: string, message: object) {
  const data = JSON.stringify(message);
  room.participants.forEach((p, id) => {
    if (id !== senderId && p.ws.readyState === WebSocket.OPEN) {
      p.ws.send(data);
    }
  });
}

// ── Attach to HTTP server ────────────────────────────────────────────────
export function attachSignaling(server: Server) {
  const wss = new WebSocketServer({ server, path: "/ws/signaling" });

  wss.on("connection", (ws: WebSocket) => {
    let currentRoom: Room | null = null;
    let participantId: string | null = null;

    logger.info("WebSocket client connected to signaling");

    ws.on("message", (raw: Buffer) => {
      try {
        const msg = JSON.parse(raw.toString());

        switch (msg.type) {
          // ── Join a room ────────────────────────────────────────────────
          case "join": {
            const { roomId, participantId: pid, participantName } = msg;
            if (!roomId || !pid) break;

            // Leave previous room if any
            if (currentRoom && participantId) {
              currentRoom.participants.delete(participantId);
              broadcast(currentRoom, participantId, {
                type: "participant-left",
                participantId,
              });
              if (currentRoom.participants.size === 0) {
                rooms.delete(currentRoom.id);
              }
            }

            const room = getOrCreateRoom(roomId);

            // Notify existing participants before adding new one
            const existingParticipants = Array.from(room.participants.keys());

            room.participants.set(pid, {
              ws,
              id: pid,
              name: participantName || pid,
            });

            currentRoom = room;
            participantId = pid;

            // Tell the joiner about existing participants
            ws.send(
              JSON.stringify({
                type: "room-joined",
                roomId: room.id,
                participants: existingParticipants,
                participantCount: room.participants.size,
              })
            );

            // Tell existing participants about the new joiner
            broadcast(room, pid, {
              type: "participant-joined",
              participantId: pid,
              participantName: participantName || pid,
              participantCount: room.participants.size,
            });

            logger.info(
              { roomId, pid, participantName, count: room.participants.size },
              "Participant joined signaling room"
            );
            break;
          }

          // ── WebRTC Offer ───────────────────────────────────────────────
          case "offer": {
            if (!currentRoom || !participantId) break;
            broadcast(currentRoom, participantId, {
              type: "offer",
              from: participantId,
              sdp: msg.sdp,
            });
            logger.debug({ from: participantId }, "Relayed offer");
            break;
          }

          // ── WebRTC Answer ──────────────────────────────────────────────
          case "answer": {
            if (!currentRoom || !participantId) break;
            broadcast(currentRoom, participantId, {
              type: "answer",
              from: participantId,
              sdp: msg.sdp,
            });
            logger.debug({ from: participantId }, "Relayed answer");
            break;
          }

          // ── ICE Candidate ──────────────────────────────────────────────
          case "ice-candidate": {
            if (!currentRoom || !participantId) break;
            broadcast(currentRoom, participantId, {
              type: "ice-candidate",
              from: participantId,
              candidate: msg.candidate,
            });
            break;
          }

          // ── End call ───────────────────────────────────────────────────
          case "end-call": {
            if (!currentRoom || !participantId) break;
            broadcast(currentRoom, participantId, {
              type: "call-ended",
              by: participantId,
            });
            currentRoom.participants.delete(participantId);
            if (currentRoom.participants.size === 0) {
              rooms.delete(currentRoom.id);
            }
            currentRoom = null;
            participantId = null;
            break;
          }

          // ── Chat message (in-call text) ────────────────────────────────
          case "chat": {
            if (!currentRoom || !participantId) break;
            broadcast(currentRoom, participantId, {
              type: "chat",
              from: participantId,
              text: msg.text,
              timestamp: Date.now(),
            });
            break;
          }
        }
      } catch (err) {
        logger.error({ err }, "Error processing signaling message");
      }
    });

    ws.on("close", () => {
      if (currentRoom && participantId) {
        currentRoom.participants.delete(participantId);
        broadcast(currentRoom, participantId, {
          type: "participant-left",
          participantId,
        });
        if (currentRoom.participants.size === 0) {
          rooms.delete(currentRoom.id);
          logger.debug({ roomId: currentRoom.id }, "Room cleaned up (empty)");
        }
      }
      logger.info("WebSocket client disconnected from signaling");
    });

    ws.on("error", (err) => {
      logger.error({ err }, "WebSocket signaling error");
    });
  });

  logger.info("WebSocket signaling server attached at /ws/signaling");
}
