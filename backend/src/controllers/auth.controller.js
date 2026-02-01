// src/controllers/auth.controller.js
import User from "../models/User.model.js";
import bcrypt from "bcryptjs";
import { generateOTP, verifyOTP } from "../utils/otp.js";
import { generateToken } from "../utils/jwt.js";

/**
 * SEND OTP
 */
export const signup = async (req, res) => {
  try {
    let { email } = req.body;

    if (typeof email === "object") email = email.email;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: "Email exists" });
    }

    await generateOTP(email);

    res.json({ success: true, message: "OTP sent to email" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * VERIFY OTP & CREATE USER
 */
export const verifySignupOTP = async (req, res) => {
  try {
    const { name, email, mobile, password, role, otp } = req.body;

    if (!verifyOTP(email, otp)) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      mobile,
      password: hashedPassword,
      role,
      isVerified: true,
    });

    const token = generateToken(user);

    res.json({
      success: true,
      message: "Signup successful",
      data: { token, role: user.role },
    });
  } catch (err) {
    console.error("Verify OTP error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * LOGIN
 */
export const login = async (req, res) => {
  try {
    const { email, password, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    if (otp) {
      if (!verifyOTP(email, otp))
        return res.status(400).json({ success: false, message: "Invalid OTP" });
    } else {
      const match = await bcrypt.compare(password, user.password);
      if (!match)
        return res.status(401).json({ success: false, message: "Wrong password" });
    }

    const token = generateToken(user);

    res.json({
      success: true,
      message: "Login successful",
      data: { token, role: user.role },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getMe = async (req, res) => {
  res.json({ success: true, data: req.user });
};


// src/controllers/auth.controller.js

/**
 * SEND OTP FOR LOGIN
 */
export const sendLoginOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await generateOTP(email);

    res.json({
      success: true,
      message: "OTP sent to email",
    });
  } catch (err) {
    console.error("Send Login OTP error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
