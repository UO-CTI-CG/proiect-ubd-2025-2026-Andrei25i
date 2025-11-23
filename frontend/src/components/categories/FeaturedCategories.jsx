import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import api from "../../services/api";
import { getCategoryIcon } from "../../utils/categoryIcons";
import styles from "./FeaturedCategories.module.css";

const FeaturedCategories = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get(
          `${import.meta.env.VITE_API_URL}/categories`
        );
        setCategories(response.data.slice(0, 6));
      } catch (err) {
        if (!err.response) {
          setError(
            "Eroare la conexiunea cu serverul."
          );
        } else if (err.response.status >= 500) {
          setError(
            "Serviciul întâmpină probleme momentan. Încercați din nou mai târziu."
          );
        } else {
          setError("Nu s-au putut încărca categoriile.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <section className={styles.container}>
        <div className={styles.featured}>
          {Array(7)
            .fill(0)
            .map((_, index) => (
              <div key={index} className={styles.card}>
                <div
                  className={styles.icon}
                  style={{ backgroundColor: "transparent" }}
                >
                  <Skeleton circle height="100%" />
                </div>

                <div style={{ width: "80%" }}>
                  <Skeleton height={12} />
                </div>
              </div>
            ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.container}>
        <div className={styles.message}>
          <p>{error}</p>
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
