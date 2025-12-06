import { useCallback, useEffect, useState } from "react";
import api from "../services/api";

const useAds = (filters = {}) => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const buildQueryString = (params) => {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        searchParams.append(key, value);
      }
    });

    return searchParams.toString();
  };

  const fetchAds = useCallback(async () => {
    setLoading(true);
    setError(null);

    const controller = new AbortController();

    try {
      const queryString = buildQueryString(filters);

      const response = await api.get(`/ads?${queryString}`, {
        signal: controller.signal,
      });

      setAds(response.data);
    } catch (err) {
      console.error("Eroare la preluarea anunțurilor:", err);
      setError("Nu s-au putut încărca anunțurile.");
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }

    return () => controller.abort();
  }, [filters]);

  useEffect(() => {
    const cancelRequest = fetchAds();

    return () => {
      if (typeof cancelRequest === "function") cancelRequest();
    };
  }, [fetchAds]);

  return { ads, loading, error };
};

export default useAds;
