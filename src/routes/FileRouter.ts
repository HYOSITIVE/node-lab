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
router.get("/video", FileController.getReadStream);

export default router;
