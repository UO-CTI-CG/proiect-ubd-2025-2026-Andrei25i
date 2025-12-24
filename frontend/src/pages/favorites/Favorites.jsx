import { useCallback, useEffect } from "react";
import useFavoritesStore from "../../store/favoritesStore";
import TitleHeader from "../../components/layout/TitleHeader";
import SearchFilters from "../../components/results/SearchFilters";
import AdCard from "../../components/ui/AdCard";
import PaginatedList from "../../components/ui/PaginatedList";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import redHeart from "../../assets/redHeart.svg";
import { FAVORITES_SORT_OPTIONS } from "../../utils/sortOptions";

const Favorites = () => {
  const favorites = useFavoritesStore((state) => state.favorites);
  const fetchFavorites = useFavoritesStore((state) => state.fetchFavorites);
  const isLoading = useFavoritesStore((state) => state.isLoading);
  const error = useFavoritesStore((state) => state.error);

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
        sortOptions={FAVORITES_SORT_OPTIONS}
      />

      {isLoading ? (
        <div style={{ minHeight: "800px" }}>
          <LoadingSpinner size={60} />
        </div>
      ) : error ? (
        <div
          style={{
            textAlign: "center",
            marginTop: "40px",
            color: "#666",
            minHeight: "800px",
          }}
        >
          <h3>A apărut o problemă la conexiunea cu serverul</h3>
          <p>{error}</p>
        </div>
      ) : (
        <PaginatedList
          items={favorites}
          renderItem={(item) => <AdCard key={item.id} ad={item} />}
        />
      )}
    </>
  );
};

export default Favorites;
