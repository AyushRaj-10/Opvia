import express from "express";
import multer from "multer";
import { atsCheck } from "../controllers/ats.controller.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/check", upload.single("resume"), atsCheck);

export default router;
