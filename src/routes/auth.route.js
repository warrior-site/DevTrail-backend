import express from "express";
import { authLimiter } from "../middleware/security.js";
import { checkAuth, githubLoginClerk, login, logout, register } from "../controllers/auth.controller.js";
import { checkAuthMiddle } from "../middleware/authChecker.middleware.js";
const router = express.Router();

router.get("/check-auth",checkAuthMiddle,checkAuth)
router.post("/register",authLimiter,register)
router.post("/login",authLimiter,login)
router.post("/login/github",authLimiter,githubLoginClerk)
router.post("/logout",authLimiter,logout);

export default router;