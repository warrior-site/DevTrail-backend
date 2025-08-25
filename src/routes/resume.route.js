import express from "express"
import {autoGenerateResume, updateResume, deleteEitherOneProjectOrRepo, polishResume,getResume} from "../controllers/resume.controller.js";

const router = express.Router();

router.post("/auto-generate", autoGenerateResume);
router.put("/update", updateResume);
router.get("/get/:userId", getResume);
router.delete("/delete", deleteEitherOneProjectOrRepo);
router.post("/polish", polishResume);

export default router