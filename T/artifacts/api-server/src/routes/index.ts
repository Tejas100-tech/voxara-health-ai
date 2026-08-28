import { Router, type IRouter } from "express";
import healthRouter from "./health";
import sessionsRouter from "./sessions";
import notificationsRouter from "./notifications";
import authRouter from "./auth";
import patientsRouter from "./patients";
import clinicianRouter from "./clinician";
import aiRouter from "./ai";
import appointmentsRouter from "./appointments";
import medikioskRouter from "./medikiosk";
import sosRouter from "./sos";
import ayushRouter from "./ayush";
import healthchatRouter from "./healthchat";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(sessionsRouter);
router.use(notificationsRouter);
router.use(patientsRouter);
router.use(clinicianRouter);
router.use(aiRouter);
router.use(appointmentsRouter);
router.use(medikioskRouter);
router.use(sosRouter);
router.use(ayushRouter);
router.use(healthchatRouter);

export default router;
