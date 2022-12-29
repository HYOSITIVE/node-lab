import { Router } from "express";
import { FileController } from "../controllers";
import upload from "../config/multer";

const router: Router = Router();

router.post("/upload", upload.single("file"), FileController.uploadFileToS3);
router.post(
  "/uploadMultiple",
  upload.array("file"),
  FileController.uploadFilesToS3
);
router.get("/video-simple", FileController.getVideoByOnlyStream);
router.get("/video-ejs", FileController.getVideoByStream);
router.get("/video-url", FileController.getVideoByUrl);

export default router;
