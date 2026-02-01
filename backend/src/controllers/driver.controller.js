import DriverStatus from "../models/DriverStatus.model.js";
import KYC from "../models/KYC.model.js";
import { getIO } from "../config/socket.js";

export const updateDriverLocation = async (req, res) => {
  const { rideId, lat, lng } = req.body;
  const io = getIO();

  io.to(rideId).emit("driver_location_update", {
    rideId,
    lat,
    lng,
  });

  res.json({
    success: true,
    message: "Location broadcasted",
  });
};


/**
 * Toggle Driver Online / Offline
 */
export const toggleOnlineStatus = async (req, res) => {
  try {
    const { isOnline, lat, lng } = req.body;

    // ✅ KYC check ONLY when going ONLINE
    if (isOnline === true) {
      const kyc = await KYC.findOne({ userId: req.user._id });

      if (!kyc || kyc.status !== "approved") {
        return res.status(403).json({
          success: false,
          message: "Complete KYC to go online",
        });
      }
    }

    const status = await DriverStatus.findOneAndUpdate(
      { driverId: req.user._id },
      {
        isOnline,
        location: isOnline ? { lat, lng } : null,
        lastSeen: new Date(),
      },
      { upsert: true, new: true }
    );

    return res.json({
      success: true,
      message: `Driver is now ${isOnline ? "Online" : "Offline"}`,
      data: status,
    });
  } catch (err) {
    console.error("Toggle status error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// controllers/driver.controller.js
export const getDriverStatus = async (req, res) => {
  const status = await DriverStatus.findOne({
    driverId: req.user._id,
  });

  res.json({
    success: true,
    data: {
      isOnline: status?.isOnline || false,
    },
  });
};
