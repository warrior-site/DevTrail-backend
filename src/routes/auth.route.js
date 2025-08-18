import express from "express";
import { authLimiter } from "../middleware/security.js";
import { githubLoginClerk, login, logout, register } from "../controllers/auth.controller.js";
const router = express.Router();

router.post("/register",authLimiter,register)
router.post("/login",authLimiter,login)
router.post("/login/github",authLimiter,githubLoginClerk)
router.post("/logout",authLimiter,logout);

export default router;