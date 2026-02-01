export default function DriverTripDetails({
  pickup,
  drop,
  distance,
  fare,
  paymentStatus,
  qrUrl,
}) {
  return (
    <div className="bg-white p-4 rounded space-y-3">
      <h3 className="font-semibold text-lg">Trip Details</h3>

      <div className="text-sm text-gray-700 space-y-1">
        <p><b>Pickup:</b> {pickup}</p>
        <p><b>Drop:</b> {drop}</p>
        <p><b>Distance:</b> {distance} km</p>

        <p className="font-semibold mt-2">
          Total Fare: ₹{fare}
        </p>
      </div>

      {paymentStatus === "PAID" ? (
        <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded text-sm">
          Paid
        </span>
      ) : (
        <div className="space-y-2">
          <span className="inline-block px-3 py-1 bg-red-100 text-red-700 rounded text-sm">
            Unpaid
          </span>

          <div className="border p-3 rounded text-center">
            <p className="text-sm mb-2">Show this QR to client</p>
            <img
              src={qrUrl}
              alt="Payment QR"
              className="mx-auto w-40"
            />
          </div>
        </div>
      )}
    </div>
  );
}
