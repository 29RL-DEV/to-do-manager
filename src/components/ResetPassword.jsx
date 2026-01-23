import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [validToken, setValidToken] = useState(false);
  const [checkingToken, setCheckingToken] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log("🔍 Starting token validation...");
        console.log("📍 Current URL:", window.location.href);

        // 1. Wait for Supabase to process the URL
        await new Promise((resolve) => setTimeout(resolve, 500));

        // 2. Check if Supabase detected the session from URL
        const {
          data: { session },
        } = await supabase.auth.getSession();

        console.log("🔍 Session check:", session ? "✅ Valid" : "❌ None");

        if (session) {
          console.log("✅ Session found from URL!");
          setValidToken(true);
          setCheckingToken(false);
          return;
        }

        // 3. Manual check - parse URL hash parameters
        const hashParams = new URLSearchParams(
          window.location.hash.substring(1),
        );
        const accessToken = hashParams.get("access_token");
        const type = hashParams.get("type");

        console.log("🔍 URL hash params:", {
          type,
          accessTokenLength: accessToken ? accessToken.length : 0,
        });

        if (type === "recovery" && accessToken) {
          console.log("🔍 Recovery token found in URL");
          console.log("🔄 Setting valid token without verification...");

          // For recovery flow with PKCE, Supabase should have already processed it
          // If detectSessionInUrl is true, the session should be set automatically
          // If not, we just mark it as valid so user can reset password
          setValidToken(true);
        } else {
          console.error(
            "❌ Missing type or token:",
            type,
            accessToken ? "✅" : "❌",
          );
          setError("Invalid or expired reset link. Please request a new one.");
        }
      } catch (err) {
        console.error("❌ Session check error:", err);
        setError(
          err.message || "Error validating reset link. Please try again.",
        );
      } finally {
        setCheckingToken(false);
      }
    };

    checkSession();
  }, []);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      console.log("🔄 Attempting to update password...");

      // Get current session to verify we're authenticated
      const {
        data: { session },
      } = await supabase.auth.getSession();

      console.log("🔍 Current session before update:", session ? "✅" : "❌");

      if (!session) {
        throw new Error(
          "No active session. Reset link may have expired. Please request a new one.",
        );
      }

      // updateUser trebuie folosit cu sesiune validă
      const { data, error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        console.error("❌ Password update error:", updateError);
        throw updateError;
      }

      console.log("✅ Password updated successfully!");

      // Sign out după reset
      await supabase.auth.signOut();

      setMessage("✅ Password reset successful! Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error("❌ Password reset exception:", err);
      setError(err.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-main)] text-[var(--text-main)]">
      <header className="fixed top-0 left-0 right-0 h-12 bg-[var(--bg-nav)] flex items-center px-4 z-50">
        <a
          href="https://29rl.dev/?from=taskmanager&return=/"
          className="text-green-400 text-xs font-semibold border border-green-400/40 px-3 py-1 rounded-md hover:bg-green-400/10 transition"
        >
          ← Portfolio
        </a>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 pt-20 pb-16">
        <div className="bg-custom-card w-full max-w-md p-6 rounded-2xl shadow-2xl">
          <h1 className="text-2xl font-bold text-center mb-2">
            Reset Password
          </h1>
          <p className="text-sm text-muted text-center mb-6">
            Enter your new password
          </p>

          {checkingToken && (
            <div className="mb-4 text-sm text-blue-300 bg-blue-500/10 border border-blue-500/40 p-3 rounded-lg text-center">
              Validating reset link...
            </div>
          )}

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

          {!checkingToken && !validToken && (
            <div className="text-center">
              <button
                onClick={() => navigate("/login")}
                className="w-full py-3 bg-green-600 hover:bg-green-500 rounded-lg font-semibold transition"
              >
                Go to Login
              </button>
            </div>
          )}

          {validToken && !message && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-transparent border border-[var(--border-main)] focus:border-green-400 outline-none text-sm"
                disabled={loading}
              />
              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-transparent border border-[var(--border-main)] focus:border-green-400 outline-none text-sm"
                disabled={loading}
              />
              <button
                disabled={loading}
                className="w-full py-3 bg-green-600 hover:bg-green-500 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}
        </div>
      </main>

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
