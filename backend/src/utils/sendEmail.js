// src/utils/sendEmail.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false, // 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((err) => {
  if (err) console.error("❌ SMTP ERROR:", err);
  else console.log("✅ SMTP READY");
});

export const sendEmail = async ({ to, subject, html }) => {
  const info = await transporter.sendMail({
    from: `"Driver Booking" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });

  console.log("📧 Mail sent:", info.messageId);
};
