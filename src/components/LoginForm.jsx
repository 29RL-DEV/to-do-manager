import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

const LoginForm = () => {
  const { login, signup, resetPassword, error } = useAuth();

  const [mode, setMode] = useState("login"); // login | register | recovery
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    fullName: "",
    email: "",
    password: "",
    password2: "",
  });

  const handleLoginChange = (e) =>
    setLoginData({ ...loginData, [e.target.name]: e.target.value });

  const handleRegisterChange = (e) =>
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });

  /* ================= LOGIN ================= */
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    await login(loginData.email, loginData.password);

    setLoading(false);
  };

  /* ================= REGISTER ================= */
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (registerData.password !== registerData.password2) {
      setLoading(false);
      return;
    }

    const result = await signup(
      registerData.email,
      registerData.password,
      registerData.fullName,
    );

    if (result.success) {
      setMessage("Account created. You can login now.");
      setMode("login");
    }

    setLoading(false);
  };

  /* ================= RECOVERY ================= */
  const handleRecovery = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const result = await resetPassword(loginData.email);

    if (result.success) {
      setMessage(
        result.message || "Password reset email sent! Check your inbox.",
      );
      setLoginData({ email: "", password: "" });
      setTimeout(() => {
        setMode("login");
        setMessage("");
      }, 3000);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-main)] text-[var(--text-main)] px-4">
      <div className="bg-custom-card w-full max-w-md p-6 rounded-2xl shadow-2xl">
        <h1 className="text-2xl font-bold text-center mb-6">
          To-do List Web App
        </h1>

        {/* TABS */}
        <div className="flex mb-6 bg-black/20 rounded-lg p-1">
          <button
            onClick={() => setMode("login")}
            className={`flex-1 py-2 rounded-lg ${
              mode === "login" ? "bg-green-600" : "opacity-60"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setMode("register")}
            className={`flex-1 py-2 rounded-lg ${
              mode === "register" ? "bg-green-600" : "opacity-60"
            }`}
          >
            Register
          </button>
        </div>

        {error && (
          <div className="mb-4 text-sm text-red-300 bg-red-500/10 p-3 rounded-lg">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-4 text-sm text-green-300 bg-green-500/10 p-3 rounded-lg">
            {message}
          </div>
        )}

        {/* LOGIN */}
        {mode === "login" && (
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={loginData.email}
              onChange={handleLoginChange}
              className="w-full px-4 py-3 border rounded-lg bg-transparent"
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={loginData.password}
              onChange={handleLoginChange}
              className="w-full px-4 py-3 border rounded-lg bg-transparent"
            />

            <div className="text-right">
              <button
                type="button"
                onClick={() => setMode("recovery")}
                className="text-xs text-green-400 hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <button
              disabled={loading}
              className="w-full py-3 bg-green-600 rounded-lg"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        )}

        {/* REGISTER */}
        {mode === "register" && (
          <form onSubmit={handleRegister} className="space-y-4">
            <input
              name="fullName"
              placeholder="Full name"
              onChange={handleRegisterChange}
              className="w-full px-4 py-3 border rounded-lg bg-transparent"
            />
            <input
              name="email"
              placeholder="Email"
              onChange={handleRegisterChange}
              className="w-full px-4 py-3 border rounded-lg bg-transparent"
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleRegisterChange}
              className="w-full px-4 py-3 border rounded-lg bg-transparent"
            />
            <input
              name="password2"
              type="password"
              placeholder="Confirm password"
              onChange={handleRegisterChange}
              className="w-full px-4 py-3 border rounded-lg bg-transparent"
            />

            <button className="w-full py-3 bg-green-600 rounded-lg">
              Register
            </button>
          </form>
        )}

        {/* RECOVERY */}
        {mode === "recovery" && (
          <form onSubmit={handleRecovery} className="space-y-4">
            <input
              name="email"
              placeholder="Enter your email"
              value={loginData.email}
              onChange={handleLoginChange}
              className="w-full px-4 py-3 border rounded-lg bg-transparent"
            />

            <button className="w-full py-3 bg-green-600 rounded-lg">
              Send reset link
            </button>

            <button
              type="button"
              onClick={() => setMode("login")}
              className="w-full text-xs text-muted mt-2"
            >
              ← Back to login
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginForm;