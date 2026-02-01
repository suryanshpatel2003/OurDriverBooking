// src/pages/auth/Login.jsx
import { useState, useContext } from "react";
import { loginUser, sendLoginOTP } from "../../services/auth.api";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    otp: "",
  });

  const [loginByOTP, setLoginByOTP] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const redirectUser = (res) => {
    login(res.data.data.token, res.data.data.role);
    res.data.data.role === "client"
      ? navigate("/client")
      : navigate("/driver");
  };

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      const res = await loginUser({
        email: form.email,
        password: form.password,
      });
      redirectUser(res);
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async () => {
    setError("");
    if (!form.email)
      return setError("Please enter your email first");

    try {
      setLoading(true);
      await sendLoginOTP(form.email);
    } catch {
      setError("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleOTPLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      const res = await loginUser({
        email: form.email,
        otp: form.otp,
      });
      redirectUser(res);
    } catch {
      setError("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-black px-4">
      <div className="w-full max-w-md rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-8 text-white">
        
        {/* Brand */}
        <h1 className="text-3xl font-bold text-center tracking-wide">
          Driver<span className="text-indigo-400">Book</span>
        </h1>
        <p className="text-center text-sm text-white/70 mt-1">
          Book trusted drivers instantly
        </p>

        {/* Toggle */}
        <div className="mt-6 flex bg-white/10 rounded-lg p-1">
          <ToggleButton
            active={!loginByOTP}
            onClick={() => setLoginByOTP(false)}
          >
            Password
          </ToggleButton>
          <ToggleButton
            active={loginByOTP}
            onClick={() => setLoginByOTP(true)}
          >
            OTP
          </ToggleButton>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-4 text-sm bg-red-500/20 border border-red-500/40 text-red-200 p-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Form */}
        <form
          className="mt-6 space-y-4"
          onSubmit={loginByOTP ? handleOTPLogin : handlePasswordLogin}
        >
          <GlassInput
            name="email"
            placeholder="Email address"
            value={form.email}
            onChange={handleChange}
          />

          {!loginByOTP && (
            <GlassInput
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
            />
          )}

          {loginByOTP && (
            <>
              <button
                type="button"
                onClick={handleSendOTP}
                className="w-full h-11 rounded-lg border border-white/30 hover:bg-white/10 transition"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>

              <GlassInput
                name="otp"
                placeholder="Enter 6-digit OTP"
                value={form.otp}
                onChange={handleChange}
              />
            </>
          )}

          <button
            disabled={loading}
            className="w-full h-11 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition font-medium shadow-lg disabled:opacity-60"
          >
            {loading ? "Please wait..." : "Login"}
          </button>
        </form>
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

function ToggleButton({ active, children, ...props }) {
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
