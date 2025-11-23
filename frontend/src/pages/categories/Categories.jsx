import TitleHeader from "../../components/layout/TitleHeader";
import categoriesIcon from "../../assets/categories.png";
import useCategories from "../../hooks/useCategories";
import { getCategoryIcon } from "../../utils/categoryIcons";
import styles from "./Categories.module.css";
import { Link } from "react-router-dom";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

const CategoriesPage = () => {
  const { categories, error, loading } = useCategories({ sort: "name_asc" });

  if (loading) {
    return (
      <>
        <TitleHeader title={"Categorii"} icon={categoriesIcon} />

        <div style={{ marginTop: "50px" }}>
          <LoadingSpinner size={60} />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <TitleHeader title={"Categorii"} icon={categoriesIcon} />

        <div style={{ marginTop: "50px" }}>
          <p style={{ color: "#666", textAlign: "center" }}>{error}</p>
        </div>
      </>
    );
  }

  return (
    <>
      <TitleHeader title={"Categorii"} icon={categoriesIcon} />

      <div className={styles.categoriesContainer}>
        {categories.map((item) => (
          <Link
            to={`/categories/${item.id}`}
            key={item.id}
            className={styles.categoryCard}
          >
            <div className={styles.categoryCardImage}>
              <img src={getCategoryIcon(item.id)} alt="" />
            </div>
            <h2>{item.name}</h2>
          </Link>
        ))}
      </div>
    </>
  );
};

export default CategoriesPage;
