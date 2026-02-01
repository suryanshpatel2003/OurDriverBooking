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

  /* ---------------- VALIDATION ---------------- */

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-black px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8 text-white">

        {/* Brand */}
        <h1 className="text-3xl font-bold text-center tracking-wide">
          Driver<span className="text-indigo-400">Book</span>
        </h1>
        <p className="text-center text-sm text-white/70 mt-1">
          Trusted drivers. Your car. Your control.
        </p>

        {/* Step Indicator */}
        <StepIndicator step={step} />

        {/* Error */}
        {error && (
          <div className="mt-4 text-sm bg-red-500/20 border border-red-500/40 text-red-200 p-3 rounded-lg">
            {error}
          </div>
        )}

        {/* STEP 1 */}
        {step === "EMAIL" && (
          <form className="mt-6 space-y-4">
            <GlassInput
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <PrimaryButton loading={loading} onClick={handleSendOTP}>
              Send OTP
            </PrimaryButton>
          </form>
        )}

        {/* STEP 2 */}
        {step === "OTP" && (
          <form className="mt-6 space-y-4">
            <GlassInput
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
              className="w-full text-sm text-white/70 hover:text-white"
            >
              Change email
            </button>
          </form>
        )}

        {/* STEP 3 */}
        {step === "DETAILS" && (
          <form className="mt-6 space-y-4">
            <GlassInput
              placeholder="Full name"
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <GlassInput
              placeholder="Mobile number"
              onChange={(e) =>
                setForm({ ...form, mobile: e.target.value })
              }
            />

            <GlassInput
              type="password"
              placeholder="Password"
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />

            {/* Role Selector */}
            <div className="flex bg-white/10 rounded-lg p-1">
              <RoleButton
                active={form.role === "client"}
                onClick={() => setForm({ ...form, role: "client" })}
              >
                Client
              </RoleButton>
              <RoleButton
                active={form.role === "driver"}
                onClick={() => setForm({ ...form, role: "driver" })}
              >
                Driver
              </RoleButton>
            </div>

            <PrimaryButton loading={loading} onClick={handleCompleteSignup}>
              Complete Signup
            </PrimaryButton>
          </form>
        )}
      </div>
    </div>
  );
}

/* ---------------- UI COMPONENTS ---------------- */

function GlassInput(props) {
  return (
    <input
      {...props}
      required
      className="w-full h-11 rounded-lg bg-white/10 border border-white/30
      px-3 placeholder:text-white/50 focus:outline-none focus:ring-2
      focus:ring-indigo-500"
    />
  );
}

function PrimaryButton({ children, loading, ...props }) {
  return (
    <button
      {...props}
      disabled={loading}
      className="w-full h-11 rounded-lg bg-indigo-600 hover:bg-indigo-500
      transition font-medium shadow-lg disabled:opacity-60"
    >
      {loading ? "Please wait..." : children}
    </button>
  );
}

function RoleButton({ active, children, ...props }) {
  return (
    <button
      {...props}
      type="button"
      className={`flex-1 h-9 rounded-md text-sm font-medium transition
        ${active ? "bg-indigo-600 shadow" : "text-white/70 hover:bg-white/10"}
      `}
    >
      {children}
    </button>
  );
}

function StepIndicator({ step }) {
  const steps = ["EMAIL", "OTP", "DETAILS"];
  return (
    <div className="mt-6 flex justify-between text-xs text-white/60">
      {steps.map((s) => (
        <span
          key={s}
          className={step === s ? "text-indigo-400 font-medium" : ""}
        >
          {s}
        </span>
      ))}
    </div>
  );
}
