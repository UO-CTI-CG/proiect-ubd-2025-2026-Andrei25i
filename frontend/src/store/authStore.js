import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import api from "../services/api";

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,

      login: (userData, userToken) => {
        set({ user: userData, token: userToken });
      },

      logout: () => {
        set({ user: null, token: null });
      },

      isLoggedIn: () => {
        return get().token !== null;
      },

      refreshUser: async () => {
        const { token, user } = get();

        if (!token || !user?.id) {
          console.warn(
            "Nu se poate actualiza profilul: Lipsește token sau ID."
          );
          return;
        }

        try {
          const response = await api.get(`/user/me`);
          set({ user: response.data });
        } catch (err) {
          console.error("Eroare la refreshProfile:", err);
        }
      },

      updateUser: async (updatedData) => {
        try {
          const response = await api.put("/user", updatedData);
          set({ user: response.data });
          return true;
        } catch (err) {
          console.error("Eroare la actualizare:", err);
          throw err;
        }
      },
    }),

    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useAuthStore;
