import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuth();
    setupAuthListener();
  }, []);

  const checkAuth = async () => {
    try {
      setError(null);
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      setUser(session?.user || null);
    } catch (err) {
      console.error("Auth check failed:", err);
      setError(err.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const setupAuthListener = () => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      setLoading(false);
    });

    return () => subscription?.unsubscribe();
  };

  const login = async (email, password) => {
    setError(null);
    setLoading(true);
    try {
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });
      if (signInError) throw signInError;
      setUser(data.user);
      return { success: true };
    } catch (err) {
      const message =
        err.message || "Login failed. Check your email and password.";
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email, password, username) => {
    setError(null);
    setLoading(true);
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username },
        },
      });
      if (signUpError) throw signUpError;
      setUser(data.user);
      return { success: true };
    } catch (err) {
      const message = err.message || "Signup failed. Please try again.";
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setError(null);
    try {
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) throw signOutError;
      setUser(null);
      return { success: true };
    } catch (err) {
      const message = err.message || "Logout failed.";
      setError(message);
      return { success: false, error: message };
    }
  };

  const resetPassword = async (email) => {
    setError(null);
    try {
      console.log("🔄 Sending reset password email to:", email);

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: "https://to-do-manager-smoky.vercel.app/reset-password",
        },
      );

      if (resetError) {
        console.error("❌ Reset password error:", resetError);
        throw resetError;
      }

      console.log("✅ Reset password email sent successfully!");
      return {
        success: true,
        message: "Password reset email sent! Check your inbox.",
      };
    } catch (err) {
      const message = err.message || "Reset password email failed.";
      console.error("❌ Reset password exception:", message);
      setError(message);
      return { success: false, error: message };
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    signup,
    logout,
    resetPassword,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
       