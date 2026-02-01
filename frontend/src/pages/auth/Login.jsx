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
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handlePasswordLogin = async (e) => {
    e.preventDefault();

    const res = await loginUser({
      email: form.email,
      password: form.password,
    });

    login(res.data.data.token, res.data.data.role);

    res.data.data.role === "client"
      ? navigate("/client")
      : navigate("/driver");
  };

  const handleSendOTP = async () => {
    await sendLoginOTP(form.email);
    alert("OTP sent to your email");
  };

  const handleOTPLogin = async (e) => {
    e.preventDefault();

    const res = await loginUser({
      email: form.email,
      otp: form.otp,
    });

    login(res.data.data.token, res.data.data.role);

    res.data.data.role === "client"
      ? navigate("/client")
      : navigate("/driver");
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <form
        className="w-96 p-6 shadow space-y-3"
        onSubmit={loginByOTP ? handleOTPLogin : handlePasswordLogin}
      >
        <h2 className="text-xl font-bold">Login</h2>

        <input
          name="email"
          placeholder="Email"
          className="input"
          value={form.email}
          onChange={handleChange}
          required
        />

        {!loginByOTP && (
          <input
            name="password"
            type="password"
            placeholder="Password"
            className="input"
            value={form.password}
            onChange={handleChange}
            required
          />
        )}

        {loginByOTP && (
          <>
            <button
              type="button"
              onClick={handleSendOTP}
              className="w-full border p-2"
            >
              Send OTP
            </button>

            <input
              name="otp"
              placeholder="Enter OTP"
              className="input"
              value={form.otp}
              onChange={handleChange}
              required
            />
          </>
        )}

        <button className="w-full bg-black text-white p-2">
          Login
        </button>

        <p
          className="text-sm text-center text-blue-600 cursor-pointer"
          onClick={() => setLoginByOTP(!loginByOTP)}
        >
          {loginByOTP ? "Login with Password" : "Login by OTP"}
        </p>
      </form>
    </div>
  );
}
