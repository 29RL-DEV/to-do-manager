import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

export default function Auth() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [mode, setMode] = useState("login"); // login | register | forgot
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      navigate("/dashboard");
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-card">Loading...</div>
        </div>
      </div>
    );
  }

  if (user) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || (mode !== "forgot" && !password)) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        navigate("/dashboard");
      }

      if (mode === "register") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setSuccess("Account created. You can login now.");
        setMode("login");
      }

      if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: "https://saas-rho-one.vercel.app/reset-password",
        });
        if (error) throw error;
        setSuccess("Reset email sent. Check your inbox.");
        setMode("login");
      }
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="auth-page">
      {/* BACK TO PORTFOLIO */}
      <a
        href="https://29rl.dev"
        target="_blank"
        rel="noopener noreferrer"
        className="auth-back"
      >
        ← Portfolio
      </a>

      {/* AUTH CONTAINER */}
      <div className="auth-container">
        <div className="auth-card">
          {mode !== "forgot" && (
            <div className="auth-tabs">
              <button
                type="button"
                className={mode === "login" ? "active" : ""}
                onClick={() => setMode("login")}
              >
                Login
              </button>
              <button
                type="button"
                className={mode === "register" ? "active" : ""}
                onClick={() => setMode("register")}
              >
                Register
              </button>
            </div>
          )}

          {error && <div className="auth-error">{error}</div>}
          {success && <div className="auth-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <input
              className="auth-input"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {mode !== "forgot" && (
              <input
                className="auth-input"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            )}

            <button className="auth-button" disabled={loading}>
              {mode === "login" && "Login"}
              {mode === "register" && "Create account"}
              {mode === "forgot" && "Send reset email"}
            </button>
          </form>

          {mode === "login" && (
            <button
              type="button"
              className="auth-link-button"
              onClick={() => setMode("forgot")}
            >
              Forgot password?
            </button>
          )}

          {mode === "forgot" && (
            <button
              type="button"
              className="auth-link-button"
              onClick={() => setMode("login")}
            >
              Back to login
            </button>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <footer className="app-footer">
        Built by{" "}
        <a href="https://29rl.dev" target="_blank" rel="noopener noreferrer">
          29RL.DEV
        </a>
      </footer>
    </div>
  );
}
