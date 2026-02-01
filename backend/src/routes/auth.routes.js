import express from "express";
import {
  signup,
  verifySignupOTP,
  login,
  getMe,
  sendLoginOTP,
} from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/verify-otp", verifySignupOTP);
router.post("/login", login);
router.get("/me", protect, getMe);
// src/routes/auth.routes.js

router.post("/login-otp", sendLoginOTP);


export default router;
