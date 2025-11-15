import { create } from "zustand";
import { persist, createJSONStorage  } from "zustand/middleware";

const storage = createJSONStorage(() => ({
    getItem: (name) => {
        if (typeof window !== 'undefined') {
            return window.localStorage.getItem(name);
        }
        return null;
    },
    setItem: (name, value) => {
        if (typeof window !== 'undefined') {
            window.localStorage.setItem(name, value);
        }
    },
    removeItem: (name) => {
        if (typeof window !== 'undefined') {
            window.localStorage.removeItem(name);
        }
    }
}));

const useAuthStore = create(
    persist(
        (set, get) => ({
            user: null,
            token: null,

            login: (userData, userToken) => {
                set({user: userData, token: userToken});
            },

            logout: () => {
                set({ user: null, token: null});
            },

            isLoggedIn: () => {
                return get().token !== null;
            },
        }),

        {
            name: 'auth-storage',
            storage: storage,
        }
    )
);

export default useAuthStore;