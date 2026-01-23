import { supabase } from "./supabase";

export const authAPI = {
  login: async (username, password) => {
    try {
      console.log("Login attempt for:", username);

      if (username.includes("@")) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: username,
          password,
        });

        if (error) throw error;

        return {
          access: data.session.access_token,
          refresh: data.session.refresh_token,
          user: data.user,
        };
      }

      const { data: profiles, error: lookupError } = await supabase
        .from("profiles")
        .select("email")
        .ilike("username", username)
        .limit(1);

      if (lookupError || !profiles?.length) {
        throw new Error("User not found");
      }

      const userEmail = profiles[0].email;

      const { data, error } = await supabase.auth.signInWithPassword({
        email: userEmail,
        password,
      });

      if (error) throw error;

      return {
        access: data.session.access_token,
        refresh: data.session.refresh_token,
        user: data.user,
      };
    } catch (error) {
      console.error("Login failed:", error.message);
      throw new Error("Invalid username or password");
    }
  },

  register: async (userData) => {
    try {
      // 1. Signup
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: { data: { username: userData.username } },
      });

      if (authError) {
        if (authError.message.includes("already registered")) {
          const { data: loginData, error: loginError } =
            await supabase.auth.signInWithPassword({
              email: userData.email,
              password: userData.password,
            });

          if (loginError) throw loginError;

          return {
            message: "Login successful (account exists)",
            user: loginData.user,
          };
        }
        throw authError;
      }

      if (authData.user) {
        const { error: profileError } = await supabase.from("profiles").insert({
          id: authData.user.id,
          username: userData.username,
          email: userData.email,
        });

        if (profileError) {
          console.warn("Profile not created:", profileError.message);
        }
      }

      return {
        message: authData.user
          ? "Registration successful"
          : "Check email to verify",
        user: authData.user,
      };
    } catch (error) {
      console.error("Registration error:", error.message);
      throw new Error("Registration failed. Try different credentials.");
    }
  },

  logout: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Logout error:", error);
  },
};

export const taskAPI = {
  getAll: async () => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error("⚠️ User fetch error:", userError.message);
        // Try to refresh session
        await supabase.auth.refreshSession();
        return [];
      }

      if (!user) {
        console.warn("⚠️ No user authenticated");
        return [];
      }

      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("❌ Get tasks error:", error.message);
        throw error;
      }

      console.log("✅ Tasks fetched:", data?.length);
      return data || [];
    } catch (error) {
      console.error("❌ Tasks fetch exception:", error.message);
      return [];
    }
  },

  create: async (taskData) => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error("⚠️ User fetch error:", userError.message);
        await supabase.auth.refreshSession();
        throw new Error("Auth session expired. Please refresh the page.");
      }

      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("tasks")
        .insert({ ...taskData, user_id: user.id })
        .select()
        .single();

      if (error) {
        console.error("❌ Create error:", error.message);
        throw error;
      }

      console.log("✅ Task created:", data?.id);
      return data;
    } catch (error) {
      console.error("❌ Create task exception:", error.message);
      throw new Error(error.message || "Failed to create task");
    }
  },

  update: async (id, taskData) => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error("⚠️ User fetch error:", userError.message);
        await supabase.auth.refreshSession();
        throw new Error("Auth session expired. Please refresh the page.");
      }

      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("tasks")
        .update(taskData)
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) {
        console.error("❌ Update error:", error.message);
        throw error;
      }

      console.log("✅ Task updated:", id);
      return data;
    } catch (error) {
      console.error("❌ Update task exception:", error.message);
      throw new Error(error.message || "Failed to update task");
    }
  },

  delete: async (id) => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error("⚠️ User fetch error:", userError.message);
        await supabase.auth.refreshSession();
        throw new Error("Auth session expired. Please refresh the page.");
      }

      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("tasks")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) {
        console.error("❌ Delete error:", error.message);
        throw error;
      }

      console.log("✅ Task deleted:", id);
    } catch (error) {
      console.error("❌ Delete task exception:", error.message);
      throw new Error(error.message || "Failed to delete task");
    }
  },
};

export default { authAPI, taskAPI };
