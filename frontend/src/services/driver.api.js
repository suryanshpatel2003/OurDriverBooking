// src/services/driver.api.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/driver",
});

/**
 * 🔐 Attach JWT token to every request automatically
 */
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* ================== DRIVER APIs ================== */

// ONLINE / OFFLINE
export const toggleDriverStatus = (data) =>
  API.post("/toggle-status", data);

// GET DRIVER STATUS (FOR REFRESH FIX)
export const getDriverStatus = () =>
  API.get("/status");

// RIDE REQUEST
export const getRideRequest = () =>
  API.get("/ride-request");

// ACCEPT / REJECT
export const acceptRide = (rideId) =>
  API.put(`/ride/${rideId}/accept`);

export const rejectRide = (rideId) =>
  API.put(`/ride/${rideId}/reject`);
