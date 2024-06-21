import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import { fetchUser } from "@/lib/db";

const useAuthStore = create((set) => ({
  session: null,
  user: null,
  setSession: async (session) => {
    if (session) {
      const { username } = session.user.user_metadata;
      const user = await fetchUser(username);
      set({ session, user });
    } else {
      set({ session: null, user: null });
    }
  },
  fetchSession: async () => {
    const { data } = await supabase.auth.getSession();
    if (data && data.session) {
      const { session } = data;
      set({ session });
    } else {
      set({ session: null, user: null });
    }
  },
}));

export default useAuthStore;
