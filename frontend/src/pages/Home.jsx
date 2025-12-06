import { useState } from "react";
import FeaturedCategories from "../components/categories/FeaturedCategories";
import SearchFilters from "../components/results/SearchFilters";
import useCategories from "../hooks/useCategories";
import { ADS_SORT_OPTIONS } from "../utils/sortOptions";
import PaginatedList from "../components/ui/PaginatedList";
import AdCard from "../components/ui/AdCard";
import useAds from "../hooks/useAds";
import LoadingSpinner from "../components/ui/LoadingSpinner";

export default function Home() {
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    city: "",
    sort: "date_desc",
  });

  const { ads, loading, error } = useAds(filters);
  const { categories } = useCategories({ sort: "name_asc" });

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  return (
    <>
      <FeaturedCategories count={6} />

      <SearchFilters
        onFilterChange={handleFilterChange}
        categories={categories}
        sortOptions={ADS_SORT_OPTIONS}
      />

      {loading ? (
        <LoadingSpinner size={60} />
      ) : error ? (
        <div style={{ textAlign: "center", marginTop: "40px", color: "#666" }}>
          {error}
        </div>
      ) : (
        <PaginatedList
          items={ads}
          itemsPerPage={20}
          renderItem={(item) => <AdCard key={item.id} ad={item} />}
        />
      )}
    </>
  );
}
