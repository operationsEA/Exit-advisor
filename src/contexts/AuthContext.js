"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "@/supabase/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const supabase = createBrowserSupabaseClient();

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Manually fetch and update session
  const fetchSession = async () => {
    try {
      console.log("Fetching session...");
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      console.log("Session fetched:", { user: session?.user?.email, error });

      if (error) {
        console.error("Session fetch error:", error.message);
        setUser(null);
      } else {
        setUser(session?.user ?? null);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Fetch initial session
    fetchSession();

    // Also set up listener for real-time changes (logout in another tab, etc.)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const value = {
    user,
    isAuth: !!user,
    isLoading,
    refreshAuth: fetchSession, // Explicitly refresh auth
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
