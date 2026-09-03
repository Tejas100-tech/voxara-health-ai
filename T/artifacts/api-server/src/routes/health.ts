import { Router, type IRouter } from "express";
import { getMongoDBStatus } from "../lib/mongodb";

const router: IRouter = Router();

router.get("/healthz", (_req, res) => {
  res.json({ status: "ok", mongodb: getMongoDBStatus() });
});

export default router;
