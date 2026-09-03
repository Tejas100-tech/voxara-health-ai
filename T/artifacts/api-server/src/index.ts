import dotenv from "dotenv";
import path from "path";
// Load from monorepo root .env and .env.local, then override with local .env
dotenv.config({ path: path.resolve(process.cwd(), "../../.env.local"), override: false });
dotenv.config({ path: path.resolve(process.cwd(), "../../.env"), override: false });
// Freebuff writes .env.local to project root — also load from there
dotenv.config({ path: path.resolve(process.cwd(), "../../../.env.local"), override: false });
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
