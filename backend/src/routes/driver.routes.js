import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { toggleOnlineStatus, updateDriverLocation,getDriverStatus } from "../controllers/driver.controller.js";
import {
  getDriverRideRequest,
  acceptRide,
  rejectRide,
  
} from "../controllers/driverRide.controller.js";

const router = express.Router();

router.post("/toggle-status", protect, toggleOnlineStatus);
router.get("/ride-request", protect, getDriverRideRequest);
router.put("/ride/:rideId/accept", protect, acceptRide);
router.put("/ride/:rideId/reject", protect, rejectRide);
router.post("/location", protect, updateDriverLocation);
// src/routes/driver.routes.js
// routes/driver.routes.js
router.get("/status", protect, getDriverStatus);

export default router;
