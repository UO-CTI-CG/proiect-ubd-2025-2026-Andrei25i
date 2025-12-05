import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import api from "../services/api";
import toast from "react-hot-toast";

const useFavoritesStore = create(
  persist(
    (set, get) => ({
      favorites: [],
      isLoading: false,
      error: null,
      isLoaded: false,

      fetchFavorites: async (filters = {}) => {
        set({ isLoading: true, error: null });
        try {
          const params = new URLSearchParams();

          Object.keys(filters).forEach((key) => {
            if (filters[key]) {
              params.append(key, filters[key]);
            }
          });

          const response = await api.get(`/favorites?${params.toString()}`);

          set({ favorites: response.data, isLoading: false, isLoaded: true });
        } catch (error) {
          console.error("Eroare la fetch favorites:", error);
          set({ error: error.message, isLoading: false });
          toast.error(error.message);
        }
      },

      toggleFavorite: async (ad) => {
        const { favorites } = get();
        const isAlreadyFav = favorites.some((fav) => fav.id === ad.id);

        const previousFavorites = favorites;

        if (isAlreadyFav) {
          set({ favorites: favorites.filter((fav) => fav.id !== ad.id) });
        } else {
          set({ favorites: [...favorites, ad] });
        }

        try {
          if (isAlreadyFav) {
            await api.delete(`/favorites/${ad.id}`);
          } else {
            await api.post(`/favorites/${ad.id}`);
          }
        } catch (error) {
          console.error("Eroare la server:", error);
          set({ favorites: previousFavorites });
          toast.error("A apărut o eroare. Modificarea nu s-a salvat.");
        }
      },

      clearFavorites: () => set({ favorites: [], isLoaded: false }),
    }),
    {
      name: "favorite-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ favorites: state.favorites }),
    }
  )
);

export default useFavoritesStore;
