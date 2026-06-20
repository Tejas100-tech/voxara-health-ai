import { Router, type IRouter } from "express";
import healthRouter from "./health";
import sessionsRouter from "./sessions";
import notificationsRouter from "./notifications";
import authRouter from "./auth";
import patientsRouter from "./patients";
import clinicianRouter from "./clinician";
import aiRouter from "./ai";
import appointmentsRouter from "./appointments";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(sessionsRouter);
router.use(notificationsRouter);
router.use(patientsRouter);
router.use(clinicianRouter);
router.use(aiRouter);
router.use(appointmentsRouter);

export default router;
