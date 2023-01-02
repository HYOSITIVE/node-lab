//router index file
import { Router } from "express";
import UserRouter from "./UserRouter";
import ReviewRouter from "./ReviewRouter";
import MovieRouter from "./MovieRouter";
import FileRouter from "./FileRouter";
import TestRouter from "./TestRouter";

const router: Router = Router();

router.use("/user", UserRouter);
router.use("/review", ReviewRouter);
router.use("/movie", MovieRouter);
router.use("/file", FileRouter);
router.use("/test", TestRouter);

export default router;
