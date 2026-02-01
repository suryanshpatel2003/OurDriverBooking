import { useState } from "react";
import { markArrived, verifyRideOTP } from "../../services/rideOtp.api";
import OTPBox from "../../components/OTPBox";
import ChatBox from "../../components/ChatBox";
import { useNavigate } from "react-router-dom";

export default function DriverRideStart({ ride }) {
  const navigate = useNavigate();

  const [arrived, setArrived] = useState(false);
  const [loading, setLoading] = useState(false);

  /* ================= MARK ARRIVED ================= */
  const handleArrived = async () => {
    try {
      setLoading(true);
      await markArrived(ride._id);
      setArrived(true);
      alert("✅ Arrived marked. Ask client for OTP.");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to mark arrival");
    } finally {
      setLoading(false);
    }
  };

  /* ================= VERIFY OTP ================= */
  const handleOTPSubmit = async (otp) => {
    try {
      if (!otp || otp.length !== 4) {
        alert("Enter valid 4-digit OTP");
        return;
      }

      setLoading(true);
      await verifyRideOTP(ride._id, otp);

      alert("🚗 Ride Started Successfully");
      navigate(`/driver/live/${ride._id}`);
    } catch (err) {
      alert(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border p-4 space-y-4 bg-white rounded">
      <h2 className="font-bold text-lg">Pickup Location Reached</h2>

      {/* MARK ARRIVED BUTTON */}
      {!arrived && (
        <button
          disabled={loading}
          onClick={handleArrived}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Marking..." : "Mark Arrived"}
        </button>
      )}

      {/* OTP BOX */}
      {arrived && (
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            Enter OTP from client to start ride
          </p>
          <OTPBox onSubmit={handleOTPSubmit} />
        </div>
      )}

      {/* 💬 CHAT BOX */}
      <ChatBox rideId={ride._id} userId="driver" />
    </div>
  );
}
