import axios from "axios";

export default function CompleteRideButton({
  rideId,
  disabled,
  onComplete,
}) {
  const handleComplete = async () => {
    if (disabled) return; // 🔒 HARD BLOCK

    await axios.post(
      `http://localhost:5000/rides/${rideId}/complete`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    onComplete(); // 🔁 redirect
  };

  return (
    <button
      disabled={disabled}
      onClick={handleComplete}
      className={`px-4 py-2 rounded text-white ${
        disabled
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-blue-600 hover:bg-blue-700"
      }`}
    >
      Complete Ride
    </button>
  );
}
