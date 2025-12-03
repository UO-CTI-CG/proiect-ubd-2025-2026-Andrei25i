import styles from "./AdCard.module.css";
import getOptimizedImageUrl from "../../utils/getOptimizedImageUrl";
import { useNavigate } from "react-router-dom";
import useFavoritesStore from "../../store/favoritesStore";
import formatPrice from "../../utils/formatPrice";
import HeartIcon from "../icons/HeartIcon";

const AdCard = ({ ad }) => {
  const navigate = useNavigate();

  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const isFavorite = useFavoritesStore((state) =>
    state.favorites.some((fav) => fav.id === ad.id)
  );

  const imageUrl =
    ad.images && ad.images.length > 0
      ? ad.images[0].url
      : "https://placehold.co/600x400?text=Fără+Poză";
  const optimizedUrl = getOptimizedImageUrl(imageUrl);

  const handleHeartClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    toggleFavorite(ad);
  };

  return (
    <div className={styles.card} onClick={() => navigate(`/ads/${ad.id}`)}>
      <div className={styles.imageWrapper}>
        <img
          src={optimizedUrl}
          alt={ad.title}
          className={styles.image}
          loading="lazy"
        />
      </div>

      <div className={styles.favButton} onClick={handleHeartClick}>
        <HeartIcon filled={isFavorite} />
      </div>

      <div className={styles.content}>
        <p className={styles.price}>{formatPrice(ad.price, ad.currency)}</p>
        <h3 className={styles.title}>{ad.title}</h3>
        <p className={styles.city}>{ad.city}</p>
      </div>
    </div>
  );
};

export default AdCard;
