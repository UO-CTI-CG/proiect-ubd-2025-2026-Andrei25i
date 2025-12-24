import useCategories from "../../hooks/useCategories";
import styles from "./LocationSelector.module.css";

const CategorySelector = ({
  selectedCategory,
  onCategoryChange,
  showAllOption = true,
  label = "Categorie",
  showLabel = true,
  required = false,
}) => {
  const { categories, loading } = useCategories({ sort: "name_asc" });

  return (
    <>
      {showLabel && <label htmlFor="category">{label}</label>}

      <select
        id="category"
        name="category"
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
        className={`${styles.select} ${styles.hasValue}`}
        disabled={loading}
        required={required}
      >
        {showAllOption && <option value="">Toate categoriile</option>}
        {!showAllOption && <option value="">Alege o categorie</option>}

        {categories?.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>
    </>
  );
};

export default CategorySelector;
