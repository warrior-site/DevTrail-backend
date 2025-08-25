import express from "express"
import multer from "multer"
import { updateUserProfile } from "../controllers/user.controller.js";
const router = express.Router();

const upload = multer({ dest: "uploads/" });


router.post("/update-user/:userId",
    upload.fields([{ name: "avatar", maxCount: 1 }, { name: "backgroundImage", maxCount: 1 }]),
    updateUserProfile);

export default router;