import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { SocketContext } from "../../context/SocketContext";

import DriverWaiting from "./DriverWaiting";
import ChatBox from "../../components/ChatBox";
import SOSButton from "../../components/SOSButton";
import CompleteRideButton from "../../components/CompleteRideButton";

export default function DriverLiveRide() {
  const navigate = useNavigate();
  const { socket } = useContext(SocketContext);

  const [ride, setRide] = useState(null);
  const [sendingLocation, setSendingLocation] = useState(false);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  /* ================= FETCH ACTIVE RIDE ================= */
  useEffect(() => {
    axios
      .get("http://localhost:5000/rides/driver/active", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setRide(res.data.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  /* ================= JOIN RIDE SOCKET ================= */
  useEffect(() => {
    if (!socket || !ride?._id) return;
    socket.emit("join_ride", ride._id);
  }, [socket, ride]);

  /* ================= LIVE LOCATION STREAM ================= */
  useEffect(() => {
    if (!ride?._id) return;

    setSendingLocation(true);

    const interval = setInterval(() => {
      axios.post(
        "http://localhost:5000/driver/location",
        {
          rideId: ride._id,
          lat: 28.6 + Math.random() / 100,
          lng: 77.2 + Math.random() / 100,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    }, 3000);

    return () => {
      clearInterval(interval);
      setSendingLocation(false);
    };
  }, [ride]);

  /* ================= SOCKET LISTENERS ================= */
  useEffect(() => {
    if (!socket) return;

    socket.on("payment_received", () => {
      setRide((prev) => ({
        ...prev,
        paymentStatus: "PAID",
      }));
    });

    socket.on("sos_triggered", () => {
      alert("🚨 SOS ALERT RECEIVED!");
    });

    return () => {
      socket.off("payment_received");
      socket.off("sos_triggered");
    };
  }, [socket]);

  /* ================= PAYMENT HANDLER ================= */
  const markPaymentReceived = async () => {
    await axios.post(
      `http://localhost:5000/rides/${ride._id}/payment-received`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setRide((prev) => ({
      ...prev,
      paymentStatus: "PAID",
    }));
  };

  /* ================= UI STATES ================= */
  if (loading) {
    return <p className="p-6">Loading ride...</p>;
  }

  if (!ride) {
    return <p className="p-6">No active ride</p>;
  }

  return (
    <div className="p-6 space-y-4 bg-gray-100 min-h-screen">
      <h2 className="text-xl font-bold">Ride in Progress</h2>

      {/* LIVE LOCATION STATUS */}
      <div className="bg-white p-3 rounded">
        <p>
          Live Location:
          <span className="ml-2 text-green-600">
            {sendingLocation ? "Sending" : "Stopped"}
          </span>
        </p>
      </div>

      {/* WAITING TIME */}
      <DriverWaiting rideId={ride._id} />

      {/* TRIP DETAILS */}
      <div className="bg-white p-4 rounded space-y-2">
        <h3 className="font-semibold text-lg">Trip Details</h3>

        <p><b>Pickup:</b> {ride.pickupLocation.address}</p>
        <p><b>Drop:</b> {ride.dropLocation.address}</p>
        <p><b>Ride Type:</b> {ride.rideType}</p>

        <p className="font-semibold mt-2">
          Total Fare: ₹{ride.fareBreakdown.totalFare}
        </p>

        {ride.paymentStatus === "PAID" ? (
          <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded text-sm">
            Paid
          </span>
        ) : (
          ride.paymentMode === "pay_after_ride" && (
            <div className="space-y-2">
              <span className="inline-block px-3 py-1 bg-red-100 text-red-700 rounded text-sm">
                Unpaid
              </span>

              <div className="border p-3 rounded text-center">
                <p className="text-sm mb-2">
                  Show this QR to client
                </p>
                <img
                  src="/upi-qr.png"
                  alt="Payment QR"
                  className="mx-auto w-40"
                />
              </div>

              <button
                onClick={markPaymentReceived}
                className="w-full bg-green-600 text-white py-2 rounded"
              >
                Mark Payment Received
              </button>
            </div>
          )
        )}
      </div>

      {/* CHAT */}
      <ChatBox rideId={ride._id} userId="driver" />

      {/* ACTIONS */}
      <div className="flex gap-3">
        <SOSButton rideId={ride._id} />

        <CompleteRideButton
          rideId={ride._id}
          disabled={ride.paymentStatus !== "PAID"}
          onComplete={() => navigate("/driver")}
        />

      </div>
    </div>
  );
}
