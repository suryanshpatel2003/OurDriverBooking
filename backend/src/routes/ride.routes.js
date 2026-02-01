import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  createRide,
  cancelRideByClient,
  markDriverArrived,
  verifyRideOTP,
  getDriverActiveRide,
  markPaymentReceived,
  completeRide,
} from "../controllers/ride.controller.js";



const router = express.Router();

router.post("/", protect, createRide);
router.put("/:rideId/cancel", protect, cancelRideByClient);

router.put("/:rideId/arrived", protect, markDriverArrived);
router.put("/:rideId/verify-otp", protect, verifyRideOTP);
router.get(
  "/driver/active",
  protect,
  getDriverActiveRide
);

router.post(
  "/:rideId/payment-received",
  protect,
  markPaymentReceived
);

router.post(
  "/:rideId/complete",
  protect,
  completeRide
);


export default router;
