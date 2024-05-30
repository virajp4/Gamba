"use client";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import useAuthStore from "@/stores/useAuthStore";

export default function AuthProvider({ children }) {
  const setSession = useAuthStore((state) => state.setSession);
  const fetchSession = useAuthStore((state) => state.fetchSession);

  useEffect(() => {
    fetchSession();
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
    });
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [fetchSession]);

  return <>{children}</>;
}
