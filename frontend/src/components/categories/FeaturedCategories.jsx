import { Link } from "react-router-dom";
import LoadingSpinner from "../ui/LoadingSpinner";

import { getCategoryIcon } from "../../utils/categoryIcons";
import styles from "./FeaturedCategories.module.css";
import useCategories from "../../hooks/useCategories";

const FeaturedCategories = ({ count = null }) => {
  const { categories, loading, error } = useCategories({ count });

  if (loading) {
    return (
      <section
        className={styles.container}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <LoadingSpinner size={60} />
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.container}>
        <div className={styles.message}>
          <p style={{ color: "#666" }}>{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.container}>
      <div className={styles.featured}>
        {categories.map((item) => (
          <Link
            key={item.id}
            to={`/categories/${item.id}`}
            className={styles.card}
          >
            <div className={styles.icon}>
              <img src={getCategoryIcon(item.id)} alt={item.id} />
            </div>
            <span className={styles.name}>{item.name}</span>
          </Link>
        ))}

        <Link to="/categories" className={styles.card}>
          <div className={styles.icon}>
            <img src={getCategoryIcon()} alt="..." />
          </div>
          <span className={styles.name}>Toate Categoriile</span>
        </Link>
      </div>
    </section>
  );
};

export default FeaturedCategories;
