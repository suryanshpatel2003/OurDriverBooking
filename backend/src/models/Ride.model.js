import mongoose from "mongoose";

const rideSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    bookingType: {
      type: String,
      enum: ["distance_based", "time_based"],
      required: true,
    },

    bookingDuration: {
      type: Number, // hours (only for time-based)
    },

    pickupLocation: {
      address: String,
      lat: Number,
      lng: Number,
    },

    dropLocation: {
      address: String,
      lat: Number,
      lng: Number,
    },

    rideType: {
      type: String,
      enum: ["one-way", "two-way"],
      required: true,
    },

    waitingTime: {
      type: Number, // minutes
      default: 0,
    },

    fareBreakdown: {
      baseFare: Number,
      distanceFare: Number,
      timeFare: Number,
      waitingCharge: Number,
      totalFare: Number,
    },

    paymentMode: {
      type: String,
      enum: ["pay_now", "pay_after_ride"],
      required: true,
    },

    assignedAt: Date,

    requestExpiresAt: Date,

    otp: {
      type: String,
    },

    otpVerified: {
      type: Boolean,
      default: false,
    },

    completedAt: {
  type: Date,
},

finalFareLocked: {
  type: Boolean,
  default: false,
},



    status: {
  type: String,
  enum: [
    "REQUESTED",
    "ACCEPTED",
    "DRIVER_ARRIVED",   // ✅ ADD THIS
    "ON_RIDE",
    "COMPLETED",
    "CANCELLED_BY_CLIENT",
    "CANCELLED_BY_DRIVER"
  ],
  default: "REQUESTED"
},

paymentStatus: {
  type: String,
  enum: ["UNPAID", "PAID"],
  default: "UNPAID",
},

paymentReceivedAt: Date,




    cancelledAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Ride", rideSchema);
