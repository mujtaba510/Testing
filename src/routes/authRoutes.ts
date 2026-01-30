import { Router } from "express";
import { signup, verifyOTP, login } from "../controllers/authController";

const router = Router();

// POST /api/auth/signup
router.post("/signup", signup);

// POST /api/auth/verify-otp
router.post("/verify-otp", verifyOTP);

// POST /api/auth/login
router.post("/login", login);

export default router;
