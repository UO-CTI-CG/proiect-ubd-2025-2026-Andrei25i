import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import PageNavigationHandler from "./components/layout/PageNavigationHandler";
import AppRouter from "./routes/AppRouter";
import Navbar from "./components/layout/navbar";
import useAuthStore from "./store/authStore";
import useFavoritesStore from "./store/favoritesStore";
import { useEffect } from "react";

function App() {
  const { user } = useAuthStore();
  const { fetchFavorites, clearFavorites } = useFavoritesStore();

  useEffect(() => {
    if (user) {
      fetchFavorites();
    } else {
      clearFavorites();
    }
  }, [user, fetchFavorites, clearFavorites]);

  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <PageNavigationHandler />

      <Navbar />

      <main>
        <AppRouter />
      </main>
    </BrowserRouter>
  );
}

export default App;
