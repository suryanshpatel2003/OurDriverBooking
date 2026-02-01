import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { SocketContext } from "../../context/SocketContext";

import MapView from "../../components/MapView";
import LiveFare from "../../components/LiveFare";
import ChatBox from "../../components/ChatBox";
import CallButton from "../../components/CallButton";
import SOSButton from "../../components/SOSButton";

export default function LiveRide() {
  const { rideId } = useParams();
  const { socket } = useContext(SocketContext);

  const [driverLocation, setDriverLocation] = useState(null);
  const [fare, setFare] = useState(null);
  const [rideStatus, setRideStatus] = useState("WAITING");
  const [otp, setOtp] = useState(null);

  /* ================= SOCKET SETUP ================= */
  useEffect(() => {
    if (!socket) return;

    socket.emit("join_ride", rideId);

    // Driver location updates
    socket.on("driver_location_update", (data) => {
      setDriverLocation({
        lat: data.lat,
        lng: data.lng,
      });
    });

    // Ride status updates (OTP / ON_RIDE)
    socket.on("ride_status_update", (data) => {
      setRideStatus(data.status);
      if (data.otp) {
        setOtp(data.otp);
      }
    });

    // Waiting fare updates
    socket.on("waiting_time_update", (data) => {
      setFare(data.updatedFare);
    });

    // SOS
    socket.on("sos_triggered", () => {
      alert("🚨 SOS triggered!");
    });

    return () => {
      socket.off("driver_location_update");
      socket.off("ride_status_update");
      socket.off("waiting_time_update");
      socket.off("sos_triggered");
    };
  }, [socket, rideId]);

  /* ================= UI ================= */
  return (
    <div className="p-6 space-y-4 bg-gray-100 min-h-screen">
      <h2 className="text-xl font-bold">Live Ride Tracking</h2>

      {/* STATUS */}
      <div className="bg-white p-3 rounded">
        <p>
          <b>Status:</b> {rideStatus}
        </p>
      </div>

      {/* OTP DISPLAY */}
      {otp && rideStatus !== "ON_RIDE" && (
        <div className="bg-yellow-100 p-4 rounded text-center">
          <p className="font-bold">Your Ride OTP</p>
          <p className="text-3xl tracking-widest">{otp}</p>
          <p className="text-sm text-gray-600">
            Share this OTP with driver
          </p>
        </div>
      )}

      {/* MAP */}
      <MapView driverLocation={driverLocation} />

      {/* LIVE FARE */}
      {fare && <LiveFare fare={fare} />}

      {/* CHAT */}
      <ChatBox rideId={rideId} userId="client" />

      {/* ACTIONS */}
      <div className="flex gap-3">
        <CallButton phone="7896541230" />
        <SOSButton rideId={rideId} />
      </div>
    </div>
  );
}
