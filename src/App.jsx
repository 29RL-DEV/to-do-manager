import React, { useState } from "react";
import "./index.css";
import TaskList from "./components/TaskList";
import LoginForm from "./components/LoginForm";
import { AuthProvider, useAuth } from "./context/AuthContext";

/* =========================
   ERROR BOUNDARY
========================= */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">
              Oops! Something went wrong
            </h2>
            <p className="text-muted mb-6">{this.state.error?.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

/* =========================
   APP CONTENT
========================= */
function AppContent() {
  const { isAuthenticated, loading, logout } = useAuth();
  const [error, setError] = useState(null);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm onLoginSuccess={() => setError(null)} />;
  }

  return (
    <>
      {/* ================= NAV ================= */}
      <nav className="app-nav">
        <div className="nav-inner">
          <h1 className="nav-title">📋 To-do List</h1>
          <button className="nav-button" onClick={logout}>
            Logout
          </button>
        </div>
      </nav>

      {/* ================= ERROR ================= */}
      {error && (
        <div className="error-box">
          {error}
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

      {/* ================= MAIN ================= */}
      <main className="app-main">
        <ErrorBoundary>
          <TaskList />
        </ErrorBoundary>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="app-footer">Built by 29RL.DEV</footer>
    </>
  );
}

/* =========================
   APP ROOT
========================= */
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
