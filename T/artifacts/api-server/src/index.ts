import dotenv from "dotenv";
import { resolve } from "path";
// Load .env.local from project root (Freebuff injects env vars here)
const rootEnvPath = resolve(process.cwd(), "..", "..", "..", ".env.local");
dotenv.config({ path: rootEnvPath, override: true });
dotenv.config({ override: true });
import http from "http";
import app from "./app";
import { attachSignaling } from "./lib/signaling";
import { logger } from "./lib/logger";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const server = http.createServer(app);
attachSignaling(server);

server.listen(port, "0.0.0.0", () => {
  logger.info({ port }, "Server listening");
});

server.on("error", (err) => {
  logger.error({ err }, "Error listening on port");
  process.exit(1);
});
