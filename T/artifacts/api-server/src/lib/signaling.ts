import { WebSocketServer, WebSocket } from "ws";
import type { Server } from "http";
import { logger } from "./logger";

interface SignalingMessage {
  type: "join" | "offer" | "answer" | "ice-candidate" | "peer-joined" | "peer-left" | "error";
  roomId?: string;
  sdp?: any;
  candidate?: any;
  peerId?: string;
}

const rooms = new Map<string, Map<string, WebSocket>>();

function genId() {
  return Math.random().toString(36).slice(2, 10);
}

function send(ws: WebSocket, msg: SignalingMessage) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(msg));
  }
}

function broadcast(roomId: string, msg: SignalingMessage, exclude: string) {
  const room = rooms.get(roomId);
  if (!room) return;
  room.forEach((ws, id) => {
    if (id !== exclude) send(ws, msg);
  });
}

export function attachSignaling(server: Server) {
  const wss = new WebSocketServer({ server, path: "/ws" });

  wss.on("connection", (ws) => {
    const peerId = genId();
    let currentRoom: string | null = null;

    ws.on("message", (raw) => {
      try {
        const msg: SignalingMessage = JSON.parse(raw.toString());

        if (msg.type === "join" && msg.roomId) {
          currentRoom = msg.roomId;
          if (!rooms.has(currentRoom)) rooms.set(currentRoom, new Map());
          const room = rooms.get(currentRoom)!;

          if (room.size >= 2) {
            send(ws, { type: "error", roomId: currentRoom });
            return;
          }

          room.set(peerId, ws);
          logger.info({ roomId: currentRoom, peerId, peers: room.size }, "Peer joined room");

          // Notify existing peers so they initiate the offer
          broadcast(currentRoom, { type: "peer-joined", peerId }, peerId);

        } else if (msg.type === "offer" && currentRoom) {
          broadcast(currentRoom, { type: "offer", sdp: msg.sdp }, peerId);

        } else if (msg.type === "answer" && currentRoom) {
          broadcast(currentRoom, { type: "answer", sdp: msg.sdp }, peerId);

        } else if (msg.type === "ice-candidate" && currentRoom) {
          broadcast(currentRoom, { type: "ice-candidate", candidate: msg.candidate }, peerId);
        }
      } catch {
        /* ignore malformed messages */
      }
    });

    ws.on("close", () => {
      if (currentRoom) {
        rooms.get(currentRoom)?.delete(peerId);
        broadcast(currentRoom, { type: "peer-left", peerId }, peerId);
        if (rooms.get(currentRoom)?.size === 0) rooms.delete(currentRoom);
        logger.info({ roomId: currentRoom, peerId }, "Peer left room");
      }
    });
  });

  logger.info("WebSocket signaling server attached at /ws");
}
