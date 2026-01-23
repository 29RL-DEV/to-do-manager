import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

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
    <div className="min-h-screen flex flex-col bg-[var(--bg-main)] text-[var(--text-main)]">
      {/* NAV */}
      <header className="fixed top-0 left-0 right-0 h-12 bg-[var(--bg-nav)] flex items-center px-4 z-50">
        <a
          href="https://29rl.dev/?from=taskmanager&return=/"
          className="text-green-400 text-xs font-semibold border border-green-400/40 px-3 py-1 rounded-md hover:bg-green-400/10 transition"
        >
          ← Portfolio
        </a>
      </header>

      {/* MAIN */}
      <main className="flex-1 flex items-center justify-center px-4 pt-20 pb-16">
        <div className="bg-custom-card w-full max-w-md p-6 rounded-2xl shadow-2xl">
          <h1 className="text-2xl font-bold text-center mb-2">
            Reset Password
          </h1>
          <p className="text-sm text-muted text-center mb-6">
            Enter your new password
          </p>

          {error && (
            <div className="mb-4 text-sm text-red-300 bg-red-500/10 border border-red-500/40 p-3 rounded-lg">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-4 text-sm text-green-300 bg-green-500/10 border border-green-500/40 p-3 rounded-lg">
              {message}
            </div>
          )}

          {isLoading ? (
            <div className="text-center text-muted">Loading...</div>
          ) : error ? (
            <div className="text-center text-red-300">{error}</div>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-transparent border border-[var(--border-main)] focus:border-green-400 outline-none text-sm"
              />
              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-transparent border border-[var(--border-main)] focus:border-green-400 outline-none text-sm"
              />
              <button
                disabled={loading}
                className="w-full py-3 bg-green-600 hover:bg-green-500 rounded-lg font-semibold transition"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="h-12 flex items-center justify-center text-xs text-muted border-t border-[var(--border-main)]">
        <a
          href="https://29rl.dev"
          target="_blank"
          rel="noreferrer"
          className="hover:text-green-400 transition"
        >
          Built by 29RL.DEV
        </a>
      </footer>
    </div>
  );
};

export default ResetPassword;
