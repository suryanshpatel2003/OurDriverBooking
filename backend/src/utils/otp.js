// src/utils/otp.js
import { sendEmail } from "./sendEmail.js";

const otpStore = new Map();

export const generateOTP = async (email) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  otpStore.set(email, otp);

  setTimeout(() => otpStore.delete(email), 5 * 60 * 1000);

  await sendEmail({
    to: email,
    subject: "Verify your email",
    html: `
      <h2>Email Verification</h2>
      <p>Your OTP is:</p>
      <h1>${otp}</h1>
      <p>Valid for 5 minutes</p>
    `,
  });

  return otp;
};

export const verifyOTP = (email, otp) => {
  return otpStore.get(email) === otp;
};
