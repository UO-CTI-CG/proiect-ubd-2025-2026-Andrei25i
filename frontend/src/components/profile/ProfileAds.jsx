import { useMemo } from "react";
import useAds from "../../hooks/useAds";
import { Link } from "react-router-dom";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import AdCard from "../../components/ui/AdCard";
import styles from "./ProfileAds.module.css";
import useAuthStore from "../../store/authStore";

const ProfileAds = ({ userId }) => {
  const authUser = useAuthStore((state) => state.user);
  const isOwnProfile =
    authUser && userId && authUser.id.toString() === userId.toString();

  const adsFilters = useMemo(() => {
    return userId ? { userId, sort: "date_desc" } : {};
  }, [userId]);

  const { ads, loading } = useAds(adsFilters);

  const sectionTitle = isOwnProfile
    ? "Anunțurile mele"
    : "Anunțurile utilizatorului";
  const seeMoreLink = isOwnProfile ? "/profile/ads" : `/profile/${userId}/ads`;

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2>{sectionTitle}</h2>
        {ads.length > 4 && (
          <Link to={seeMoreLink} className={styles.seeMoreBtn}>
            Vezi toate ({ads.length})
          </Link>
        )}
      </div>

      {loading ? (
        <div className={styles.loadingContainer}>
          <LoadingSpinner size={40} />
        </div>
      ) : ads.length === 0 ? (
        <div className={styles.emptyState}>
          <p>Niciun anunț publicat încă.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {ads.slice(0, 4).map((ad) => (
            <AdCard key={ad.id} ad={ad} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileAds;
