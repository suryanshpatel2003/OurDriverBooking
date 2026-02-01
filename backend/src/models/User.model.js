// src/models/User.model.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, required: true, unique: true, lowercase: true },
    mobile: String,
    password: String,
    role: {
      type: String,
      enum: ["client", "driver"],
      required: true,
    },
    isVerified: { type: Boolean, default: false },
    cancelCountToday: { type: Number, default: 0 },
    blockedUntil: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
