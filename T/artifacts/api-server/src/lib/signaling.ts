import type { Server, IncomingMessage } from "http";
import type { Duplex } from "stream";
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

// Sockets that answered our last heartbeat ping
const alive = new WeakSet<WebSocket>();

const HEARTBEAT_INTERVAL_MS = 30_000;
const MAX_ROOM_SIZE = 2; // one patient + one doctor

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

// ── Attach to HTTP server (noServer mode — see note below) ───────────────
// IMPORTANT: we must NOT use `new WebSocketServer({ server, path })` here.
// ws 8.21 breaks when two path-filtered WebSocketServers are attached to the
// same HTTP server (this one + the discovery channel): upgrades from the
// second server corrupt the first server's connections, so video calls can
// never exchange a single frame. Each channel therefore runs its own
// `noServer` WebSocketServer and is routed by URL pathname in the shared
// `upgrade` event, which leaves sockets it does not own untouched.
export function attachSignaling(server: Server) {
  const wss = new WebSocketServer({ noServer: true });

  server.on("upgrade", (req: IncomingMessage, socket: Duplex, head: Buffer) => {
    const pathname = (req.url || "/").split("?")[0];
    if (pathname !== "/ws/signaling") return;
    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit("connection", ws, req);
    });
  });

  wss.on("connection", (ws: WebSocket) => {
    let currentRoom: Room | null = null;
    let participantId: string | null = null;

    alive.add(ws);
    ws.on("pong", () => alive.add(ws));

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
              const prevRoom = currentRoom;
              prevRoom.participants.delete(participantId);
              broadcast(prevRoom, participantId, {
                type: "participant-left",
                participantId,
              });
              if (prevRoom.participants.size === 0) {
                rooms.delete(prevRoom.id);
              }
            }

            const room = getOrCreateRoom(roomId);

            // Evict dead sockets (e.g. a device that lost network without a
            // clean close) so they cannot block the room or inflate its count.
            for (const [existingId, existing] of room.participants) {
              if (existing.ws.readyState !== WebSocket.OPEN) {
                room.participants.delete(existingId);
                broadcast(room, existingId, {
                  type: "participant-left",
                  participantId: existingId,
                });
              }
            }

            const prior = room.participants.get(pid);
            const reconnecting = !!prior;
            if (prior && prior.ws !== ws) {
              // Same participant reconnecting after a network blip — replace
              // the stale socket instead of counting it twice. Terminating it
              // fires its close handler, which is guarded to only remove this
              // exact socket, so the fresh entry survives.
              try {
                prior.ws.terminate();
              } catch {
                // ignore
              }
            }

            if (!room.participants.has(pid) && room.participants.size >= MAX_ROOM_SIZE) {
              ws.send(
                JSON.stringify({
                  type: "room-full",
                  roomId: room.id,
                  participantCount: room.participants.size,
                })
              );
              setTimeout(() => {
                try {
                  ws.close();
                } catch {
                  // ignore
                }
              }, 150);
              break;
            }

            const others = Array.from(room.participants.keys());
            room.participants.set(pid, {
              ws,
              id: pid,
              name: participantName || pid,
            });

            currentRoom = room;
            participantId = pid;

            ws.send(
              JSON.stringify({
                type: "room-joined",
                roomId: room.id,
                participants: others,
                participantCount: room.participants.size,
              })
            );

            // Only announce genuinely new participants. A reconnect replaces
            // the entry silently — the re-joined client re-creates an offer
            // on room-joined, so media re-negotiates without glare.
            if (!reconnecting) {
              broadcast(room, pid, {
                type: "participant-joined",
                participantId: pid,
                participantName: participantName || pid,
                participantCount: room.participants.size,
              });
            }

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
        const entry = currentRoom.participants.get(participantId);
        // Guard: only remove if this socket is still the room's entry for this
        // participant — a stale socket closing after a reconnect must not
        // delete the participant's fresh replacement entry.
        if (entry && entry.ws === ws) {
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
      }
      logger.info("WebSocket client disconnected from signaling");
    });

    ws.on("error", (err) => {
      logger.error({ err }, "WebSocket signaling error");
    });
  });

  // ── Heartbeat: evict peers whose network died without a clean close ────
  const heartbeat = setInterval(() => {
    for (const room of rooms.values()) {
      for (const [pid, participant] of room.participants) {
        if (participant.ws.readyState !== WebSocket.OPEN) {
          // Socket in a broken state — evict directly.
          room.participants.delete(pid);
          continue;
        }
        if (!alive.has(participant.ws)) {
          // Missed a heartbeat — drop it. The close handler cleans up the room.
          logger.info({ roomId: room.id, pid }, "Evicting unresponsive signaling peer");
          try {
            participant.ws.terminate();
          } catch {
            room.participants.delete(pid);
          }
        } else {
          alive.delete(participant.ws);
          try {
            participant.ws.ping();
          } catch {
            // ignore
          }
        }
      }
      if (room.participants.size === 0) {
        rooms.delete(room.id);
      }
    }
  }, HEARTBEAT_INTERVAL_MS);
  heartbeat.unref?.();

  logger.info("WebSocket signaling server attached at /ws/signaling");
}
