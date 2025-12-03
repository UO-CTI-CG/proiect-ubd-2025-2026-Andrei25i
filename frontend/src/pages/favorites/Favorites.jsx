import { useEffect } from "react";
import TitleHeader from "../../components/layout/TitleHeader";
import redHeart from "../../assets/redHeart.svg";
import AdCard from "../../components/ui/AdCard";
import useFavoritesStore from "../../store/favoritesStore";

const Favorites = () => {
  const favorites = useFavoritesStore((state) => state.favorites);
  const isLoading = useFavoritesStore((state) => state.isLoading);
  const fetchFavorites = useFavoritesStore((state) => state.fetchFavorites);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  return (
    <>
      <TitleHeader title="Favorite" icon={redHeart} />

      {favorites.map((item) => (
        <AdCard key={item.id} ad={item} />
      ))}
    </>
  );
};

export default Favorites;
