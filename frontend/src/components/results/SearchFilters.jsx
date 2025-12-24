import { useState } from "react";
import romanian_locations from "../../data/romanian_locations.json";
import searchIcon from "../../assets/searchIcon.svg";
import styles from "./SearchFilters.module.css";
import CategorySelector from "../ui/CategorySelector";

const SearchFilters = ({
  onFilterChange,
  sortOptions = [],
  showCategorySelect = true,
}) => {
  const countiesList = Object.keys(romanian_locations);

  const [filters, setFilters] = useState({
    search: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    city: "",
    sort: sortOptions[0]?.value || "date_desc",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);

    if (["sort", "category", "city"].includes(name)) {
      onFilterChange(newFilters);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilterChange(filters);
  };

  const handleReset = () => {
    const resetFilters = {
      search: "",
      category: "",
      minPrice: "",
      maxPrice: "",
      city: "",
      sort: sortOptions[0]?.value || "date_desc",
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <form className={styles.filterContainer} onSubmit={handleSubmit}>
      <div className={styles.topRow}>
        <div className={styles.search}>
          <img src={searchIcon} alt="Cauta" />
          <input
            type="text"
            name="search"
            placeholder="Caută anunț..."
            value={filters.search}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>

        <select
          name="city"
          value={filters.city}
          onChange={handleChange}
          className={styles.select}
        >
          <option value="">Toate Județele</option>
          {countiesList.map((countyName) => (
            <option key={countyName} value={countyName}>
              {countyName}
            </option>
          ))}
        </select>
        <button type="submit" className={styles.searchBtn}>
          Caută
        </button>
      </div>

      <div className={styles.bottomRow}>
        <div className={styles.priceGroup}>
          <input
            type="number"
            name="minPrice"
            min={0}
            placeholder="Preț min"
            value={filters.minPrice}
            onChange={handleChange}
            className={styles.smallInput}
          />
          <span>-</span>
          <input
            type="number"
            name="maxPrice"
            min={0}
            placeholder="Preț max"
            value={filters.maxPrice}
            onChange={handleChange}
            className={styles.smallInput}
          />
        </div>

        {showCategorySelect && (
          <CategorySelector
            selectedCategory={filters.category}
            onCategoryChange={(val) =>
              handleChange({
                target: { name: "category", value: val },
              })
            }
            showLabel={false}
          />
        )}

        <select
          name="sort"
          value={filters.sort}
          onChange={handleChange}
          className={styles.select}
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <button type="button" onClick={handleReset} className={styles.resetBtn}>
          Reset
        </button>
      </div>
    </form>
  );
};

export default SearchFilters;
