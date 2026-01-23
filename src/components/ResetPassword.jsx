import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import "./ResetPassword.css";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        setError("Invalid or expired reset link. Please request a new one.");
        setIsLoading(false);
        return;
      }

      if (!session) {
        setError("No active session. Please use the link from your email.");
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
    } catch (err) {
      setError("Invalid reset link. Please request a new one.");
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!newPassword || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      await supabase.auth.signOut();

      setMessage("✅ Password reset successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      setError(err.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-container">
      {/* NAV */}
      <header className="reset-header">
        <a
          href="https://29rl.dev/?from=taskmanager&return=/"
          className="reset-portfolio-link"
        >
          ← Portfolio
        </a>
      </header>

      {/* MAIN */}
      <main className="reset-main">
        <div className="reset-card">
          <h1 className="reset-title">Reset Password</h1>
          <p className="reset-subtitle">Enter your new password</p>

          {error && <div className="reset-error-msg">{error}</div>}

          {message && <div className="reset-success-msg">{message}</div>}

          {isLoading ? (
            <div className="reset-loading-text">Loading...</div>
          ) : error ? (
            <div className="reset-loading-text">{error}</div>
          ) : (
            <form onSubmit={handleResetPassword} className="reset-form">
              <input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="reset-input"
              />
              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="reset-input"
              />
              <button disabled={loading} className="reset-button">
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="reset-footer">
        <a
          href="https://29rl.dev"
          target="_blank"
          rel="noreferrer"
          className="reset-footer-link"
        >
          Built by 29RL.DEV
        </a>
      </footer>
    </div>
  );
};

export default ResetPassword;
