import { useState, useCallback } from "react";
import useAuthStore from "@/stores/useAuthStore";

const useFetch = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const session = useAuthStore((state) => state.session);

  const fetchWithAuth = useCallback(
    async (url, options) => {
      if (loading) return;
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
        });
        const data = await response.json();
        setLoading(false);
        return data;
      } catch (err) {
        setError(err);
        setLoading(false);
        throw err;
      }
    },
    [session, loading]
  );

  return { fetchWithAuth, loading, error };
};

export default useFetch;
