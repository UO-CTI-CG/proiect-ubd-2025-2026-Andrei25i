import { useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import useAds from "../../hooks/useAds";
import api from "../../services/api";
import { getCategoryIcon } from "../../utils/categoryIcons";
import { ADS_SORT_OPTIONS } from "../../utils/sortOptions";
import SearchFilters from "../../components/results/SearchFilters";
import PaginatedList from "../../components/ui/PaginatedList";
import AdCard from "../../components/ui/AdCard";
import TitleHeader from "../../components/layout/TitleHeader";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

const CategoryPage = () => {
  const { id } = useParams();

  const [categoryName, setCategoryName] = useState(null);
  const [loadingCategory, setLoadingCategory] = useState(true);

  const [filters, setFilters] = useState({
    search: "",
    minPrice: "",
    maxPrice: "",
    city: "",
    sort: "date_desc",
  });

  useEffect(() => {
    const fetchCategoryDetails = async () => {
      setLoadingCategory(true);
      try {
        const response = await api.get(`/categories/${id}`);
        setCategoryName(response.data["name"]);
      } catch (err) {
        console.error("Eroare categorie:", err);
        toast.error("Nu s-au putut încărca detaliile categoriei");
      } finally {
        setLoadingCategory(false);
      }
    };

    if (id) fetchCategoryDetails();
  }, [id]);

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  useEffect(() => {
    setFilters({
      search: "",
      minPrice: "",
      maxPrice: "",
      city: "",
      sort: "date_desc",
    });
  }, [id]);

  const activeFilters = useMemo(() => {
    return { ...filters, category: id };
  }, [filters, id]);

  const { ads, loading: loadingAds, error } = useAds(activeFilters);

  return (
    <>
      <TitleHeader
        loading={loadingCategory}
        title={categoryName}
        icon={getCategoryIcon(id)}
      />

      <SearchFilters
        onFilterChange={handleFilterChange}
        sortOptions={ADS_SORT_OPTIONS}
        showCategorySelect={false}
      />

      {loadingAds ? (
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
          <p>{error}</p>
        </div>
      ) : (
        <PaginatedList
          items={ads}
          renderItem={(item) => <AdCard key={item.id} ad={item} />}
        />
      )}
    </>
  );
};

export default CategoryPage;
