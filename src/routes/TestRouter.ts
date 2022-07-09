import { Router } from "express";
import TestController from "../controllers/TestController";

const router: Router = Router();

router.get('/date', TestController.testDate);

export default router;