import { useCallback, useEffect } from "react";
import TitleHeader from "../../components/layout/TitleHeader";
import redHeart from "../../assets/redHeart.svg";
import AdCard from "../../components/ui/AdCard";
import useFavoritesStore from "../../store/favoritesStore";
import SearchFilters from "../../components/results/SearchFilters";
import { FAVORITES_SORT_OPTIONS } from "../../utils/sortOptions";
import useCategories from "../../hooks/useCategories";
import PaginatedList from "../../components/ui/PaginatedList";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

const Favorites = () => {
  const favorites = useFavoritesStore((state) => state.favorites);
  const fetchFavorites = useFavoritesStore((state) => state.fetchFavorites);
  const isLoading = useFavoritesStore((state) => state.isLoading);
  const error = useFavoritesStore((state) => state.error);

  const { categories } = useCategories({ sort: "name_asc" });

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const handleFilterChange = useCallback(
    (newFilters) => {
      fetchFavorites(newFilters);
    },
    [fetchFavorites]
  );

  return (
    <>
      <TitleHeader title="Favorite" icon={redHeart} />

      <SearchFilters
        onFilterChange={handleFilterChange}
        categories={categories}
        sortOptions={FAVORITES_SORT_OPTIONS}
      />

      {isLoading ? (
        <LoadingSpinner size={60} />
      ) : (
        <PaginatedList
          items={favorites}
          itemsPerPage={20}
          renderItem={(item) => <AdCard key={item.id} ad={item} />}
        />
      )}
    </>
  );
};

export default Favorites;
