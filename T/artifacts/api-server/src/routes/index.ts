import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import patientsRouter from "./patients";
import clinicianRouter from "./clinician";
import aiRouter from "./ai";
import appointmentsRouter from "./appointments";
import intakeRouter from "./clinical-intake";
import documentsRouter from "./documents";
import clinicalSummaryRouter from "./clinical-summary";
import consentRouter from "./consent";
import doctorsRouter from "./doctors";
import videoRouter from "./video";
import chatbotRouter from "./chatbot";
import namasteIcd11Router from "./namaste-icd11";
import prescriptionTrainingRouter from "./prescription-training";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(patientsRouter);
router.use(clinicianRouter);
router.use(aiRouter);
router.use(appointmentsRouter);
router.use(intakeRouter);
router.use(documentsRouter);
router.use(clinicalSummaryRouter);
router.use(consentRouter);
router.use(doctorsRouter);
router.use(videoRouter);
router.use(chatbotRouter);
router.use(namasteIcd11Router);
router.use(prescriptionTrainingRouter);

export default router;
