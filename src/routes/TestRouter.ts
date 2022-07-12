import { Router } from "express";
import TestController from "../controllers/TestController";

const router: Router = Router();

router.get('/date', TestController.testDate);
router.post('/self-reference', TestController.testSelfReference);
router.post('/subschedule', TestController.createSubSchedule);

export default router;