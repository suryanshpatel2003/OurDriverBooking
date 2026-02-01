import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  toggleDriverStatus,
  getRideRequest,
  acceptRide,
  rejectRide,
  getDriverStatus,
} from "../../services/driver.api";

import { getKYCStatus } from "../../services/kyc.api";
import RideRequestCard from "../../components/RideRequestCard";
import DriverRideStart from "./DriverRideStart";

export default function DriverDashboard() {
  const navigate = useNavigate();

  // null = loading, true = online, false = offline
  const [online, setOnline] = useState(null);
  const [ride, setRide] = useState(null);
  const [kycStatus, setKycStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ================== LOAD KYC ================== */
  useEffect(() => {
    getKYCStatus().then((res) => {
      setKycStatus(res.data.data?.status);
    });
  }, []);

  /* ================== LOAD DRIVER STATUS ================== */
  useEffect(() => {
    const loadStatus = async () => {
      try {
        const res = await getDriverStatus();
        setOnline(res.data.data.isOnline);
      } catch {
        setOnline(false);
      }
    };
    loadStatus();
  }, []);

  /* ================== TOGGLE STATUS ================== */
  const toggleStatus = async () => {
    setError("");
    try {
      setLoading(true);
      const res = await toggleDriverStatus({
        isOnline: !online,
        lat: 28.6,
        lng: 77.2,
      });
      setOnline(res.data.data.isOnline);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to change status");
    } finally {
      setLoading(false);
    }
  };

  /* ================== POLL RIDES ================== */
  useEffect(() => {
    if (online !== true || ride) return;

    const interval = setInterval(async () => {
      const res = await getRideRequest();
      if (res.data.data) setRide(res.data.data);
    }, 5000);

    return () => clearInterval(interval);
  }, [online, ride]);

  /* ================== ACCEPT ================== */
  const handleAccept = async () => {
    const res = await acceptRide(ride._id);
    setRide({ ...ride, status: "ACCEPTED", otp: res.data?.data?.otp });
  };

  /* ================== REJECT ================== */
  const handleReject = async () => {
    await rejectRide(ride._id);
    setRide(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      {/* HEADER */}
      <div className="max-w-4xl mx-auto space-y-4">

        <h1 className="text-2xl font-semibold text-slate-900">
          Driver Dashboard
        </h1>

        {/* KYC BANNER */}
        {kycStatus !== "approved" && (
          <div className="flex items-center justify-between bg-yellow-100 border border-yellow-300 rounded-xl p-4">
            <div>
              <p className="font-medium text-yellow-900">
                KYC not completed
              </p>
              <p className="text-sm text-yellow-800">
                Complete KYC to start receiving rides
              </p>
            </div>
            <button
              onClick={() => navigate("/driver/kyc")}
              className="px-4 py-2 rounded-lg bg-yellow-600 text-white hover:bg-yellow-700"
            >
              Complete KYC
            </button>
          </div>
        )}

        {/* STATUS CARD */}
        <div className="bg-white rounded-2xl shadow p-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">Current Status</p>
            <p
              className={`text-xl font-semibold ${
                online ? "text-green-600" : "text-red-600"
              }`}
            >
              {online === null
                ? "Checking..."
                : online
                ? "Online"
                : "Offline"}
            </p>
          </div>

          <button
            disabled={loading || online === null || kycStatus !== "approved"}
            onClick={toggleStatus}
            className={`h-12 px-6 rounded-full text-white font-medium transition
              ${
                online
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-green-600 hover:bg-green-700"
              }
              disabled:opacity-50
            `}
          >
            {loading
              ? "Please wait..."
              : online
              ? "Go Offline"
              : "Go Online"}
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 p-3 rounded-lg">
            {error}
          </div>
        )}

        {/* ACTIONS */}
        <div className="flex justify-end">
          <button
            onClick={() => navigate("/driver/history")}
            className="text-sm text-slate-600 hover:text-slate-900 underline"
          >
            View Ride History
          </button>
        </div>

        {/* RIDE REQUEST */}
        {ride && ride.status === "REQUESTED" && (
          <RideRequestCard
            ride={ride}
            onAccept={handleAccept}
            onReject={handleReject}
          />
        )}

        {/* ACCEPTED */}
        {ride && ride.status === "ACCEPTED" && (
          <DriverRideStart ride={ride} />
        )}
      </div>
    </div>
  );
}
