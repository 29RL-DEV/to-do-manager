import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./LoginForm.css";

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
      setMessage("Password reset email sent. Check your inbox.");
      setMode("login");
    }

    setLoading(false);
  };

  return (
    <div className="login-container">
      <a
        href="https://29rl.dev"
        className="login-back-btn"
        target="_blank"
        rel="noreferrer"
      >
        ← Portfolio
      </a>
      <div className="login-card">
        <h1 className="login-title">To-do List Web App</h1>

        {/* TABS */}
        <div className="login-tabs">
          <button
            onClick={() => setMode("login")}
            className={`login-tab-btn ${mode === "login" ? "active" : ""}`}
          >
            Login
          </button>
          <button
            onClick={() => setMode("register")}
            className={`login-tab-btn ${mode === "register" ? "active" : ""}`}
          >
            Register
          </button>
        </div>

        {error && <div className="login-error-msg">{error}</div>}

        {message && <div className="login-success-msg">{message}</div>}

        {/* LOGIN */}
        {mode === "login" && (
          <form onSubmit={handleLogin} className="login-form">
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={loginData.email}
              onChange={handleLoginChange}
              className="login-input"
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={loginData.password}
              onChange={handleLoginChange}
              className="login-input"
            />

            <div className="login-forgot-link">
              <a onClick={() => setMode("recovery")}>Forgot password?</a>
            </div>

            <button disabled={loading} className="login-btn-submit">
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        )}

        {/* REGISTER */}
        {mode === "register" && (
          <form onSubmit={handleRegister} className="login-form">
            <input
              name="fullName"
              placeholder="Full name"
              onChange={handleRegisterChange}
              className="login-input"
            />
            <input
              name="email"
              placeholder="Email"
              onChange={handleRegisterChange}
              className="login-input"
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleRegisterChange}
              className="login-input"
            />
            <input
              name="password2"
              type="password"
              placeholder="Confirm password"
              onChange={handleRegisterChange}
              className="login-input"
            />

            <button className="login-btn-submit">Register</button>
          </form>
        )}

        {/* RECOVERY */}
        {mode === "recovery" && (
          <form onSubmit={handleRecovery} className="login-form">
            <input
              name="email"
              placeholder="Enter your email"
              value={loginData.email}
              onChange={handleLoginChange}
              className="login-input"
            />

            <button className="login-btn-submit">Send reset link</button>

            <button
              type="button"
              onClick={() => setMode("login")}
              className="login-btn-secondary"
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
