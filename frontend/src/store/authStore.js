import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

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
    }),

    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useAuthStore;