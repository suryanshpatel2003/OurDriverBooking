import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/auth",
});

export const signupEmail = (email) =>
  API.post("/signup", { email });

export const verifySignupOTP = (data) =>
  API.post("/verify-otp", data);

export const loginUser = (data) =>
  API.post("/login", data);

export const getMe = (token) =>
  API.get("/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });


  // src/services/auth.api.js
export const sendLoginOTP = (email) =>
  API.post("/login-otp", { email });
