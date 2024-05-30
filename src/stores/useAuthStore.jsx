import { create } from "zustand";
import { supabase } from "@/lib/supabase";

const useAuthStore = create((set) => ({
  session: null,
  user: null,
  setSession: (session) => {
    if (session) {
      const user = session.user;
      set({ session, user });
    } else {
      set({ session: null, user: null });
    }
  },
  fetchSession: async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      const { session } = data;
      const { user } = data.session;
      set({ session, user });
    } else {
      set({ session: null, user: null });
    }
  },
}));

export default useAuthStore;
