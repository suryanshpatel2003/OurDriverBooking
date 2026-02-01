import { useState, useContext } from "react";
import { signupEmail, verifySignupOTP } from "../../services/auth.api";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [step, setStep] = useState("EMAIL"); // EMAIL | OTP | DETAILS
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    password: "",
    role: "client",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  /* ---------------- VALIDATIONS ---------------- */

  const validateEmail = () =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateOTP = () => otp.length === 6;

  const validateDetails = () => {
    if (form.name.trim().length < 3)
      return "Name must be at least 3 characters";

    if (!/^[6-9]\d{9}$/.test(form.mobile))
      return "Enter valid 10-digit mobile number";

    if (form.password.length < 6)
      return "Password must be at least 6 characters";

    return null;
  };

  /* ---------------- HANDLERS ---------------- */

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateEmail())
      return setError("Please enter a valid email address");

    try {
      setLoading(true);
      await signupEmail(email);
      setStep("OTP");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    setError("");

    if (!validateOTP())
      return setError("OTP must be 6 digits");

    setStep("DETAILS");
  };

  const handleCompleteSignup = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validateDetails();
    if (validationError) return setError(validationError);

    try {
      setLoading(true);
      const res = await verifySignupOTP({
        email,
        otp,
        ...form,
      });

      login(res.data.data.token, res.data.data.role);

      res.data.data.role === "client"
        ? navigate("/client")
        : navigate("/driver");
    } catch (err) {
      setError(err?.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <form className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg space-y-6">
        <h2 className="text-2xl font-semibold text-center text-slate-900">
          Create your account
        </h2>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
            {error}
          </div>
        )}

        {/* STEP 1 – EMAIL */}
        {step === "EMAIL" && (
          <>
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <PrimaryButton loading={loading} onClick={handleSendOTP}>
              Send OTP
            </PrimaryButton>
          </>
        )}

        {/* STEP 2 – OTP */}
        {step === "OTP" && (
          <>
            <Input
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <PrimaryButton loading={loading} onClick={handleVerifyOTP}>
              Verify OTP
            </PrimaryButton>

            <button
              type="button"
              onClick={() => setStep("EMAIL")}
              className="w-full text-sm text-slate-600 hover:text-slate-900"
            >
              Change email
            </button>
          </>
        )}

        {/* STEP 3 – DETAILS */}
        {step === "DETAILS" && (
          <>
            <Input
              placeholder="Full name"
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <Input
              placeholder="Mobile number"
              onChange={(e) =>
                setForm({ ...form, mobile: e.target.value })
              }
            />

            <Input
              type="password"
              placeholder="Password"
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />

            <select
              className="w-full h-11 px-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
              onChange={(e) =>
                setForm({ ...form, role: e.target.value })
              }
            >
              <option value="client">Client</option>
              <option value="driver">Driver</option>
            </select>

            <PrimaryButton loading={loading} onClick={handleCompleteSignup}>
              Complete Signup
            </PrimaryButton>
          </>
        )}
      </form>
    </div>
  );
}

/* ---------------- REUSABLE UI ---------------- */

function Input({ ...props }) {
  return (
    <input
      {...props}
      className="w-full h-11 px-3 border border-slate-300 rounded-lg
      focus:outline-none focus:ring-2 focus:ring-slate-900"
    />
  );
}

function PrimaryButton({ children, loading, ...props }) {
  return (
    <button
      {...props}
      disabled={loading}
      className="w-full h-11 bg-slate-900 text-white rounded-lg
      hover:bg-slate-800 transition disabled:opacity-60"
    >
      {loading ? "Please wait..." : children}
    </button>
  );
}
