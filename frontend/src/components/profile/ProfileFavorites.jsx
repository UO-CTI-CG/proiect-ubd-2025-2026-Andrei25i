import { useEffect } from "react";
import { Link } from "react-router-dom";
import useFavoritesStore from "../../store/favoritesStore";
import AdCard from "../../components/ui/AdCard";
import styles from "./ProfileAds.module.css";

const ProfileFavorites = () => {
  const favorites = useFavoritesStore((state) => state.favorites);
  const fetchFavorites = useFavoritesStore((state) => state.fetchFavorites);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2>Anunțuri favorite</h2>
        {favorites.length > 4 && (
          <Link to="/favorites" className={styles.seeMoreBtn}>
            Vezi toate ({favorites.length})
          </Link>
        )}
      </div>

      {favorites.length === 0 ? (
        <div className={styles.emptyState}>
          <p>Nu ai salvat niciun anunț la favorite.</p>
          <Link to="/" className={styles.browseLink}>
            Explorați anunțuri
          </Link>
        </div>
      ) : (
        <div className={styles.grid}>
          {favorites.slice(0, 4).map((ad) => (
            <AdCard key={ad.id} ad={ad} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileFavorites;
