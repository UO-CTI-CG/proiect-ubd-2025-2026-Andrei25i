import BackButton from "./BackButton";
import HeartIcon from "../icons/HeartIcon";
import useFavoritesStore from "../../store/favoritesStore";
import useAuthStore from "../../store/authStore";
import deleteIcon from "../../assets/delete.svg";
import editIcon from "../../assets/edit.svg";
import styles from "./AdActionsBar.module.css";
import api from "../../services/api";
import { showConfirmation } from "../../utils/ShowConfirmation";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AdActionsBar = ({ ad }) => {
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const isFavorite = useFavoritesStore((state) =>
    state.favorites.some((fav) => fav.id === ad.id)
  );

  const loggedUser = useAuthStore((state) => state.user);
  const isOwner = loggedUser?.id === ad?.user?.id;

  const navigate = useNavigate();

  const handleDelete = (id) => {
    showConfirmation({
      message: "Sigur vreți să ștergeți anunțul?",
      onConfirm: async () => {
        try {
          await api.delete(`/ads/${id}`);
          navigate("/", { replace: true });
        } catch (err) {
          console.error("Eroare la ștergere:", err);
          toast.error("Anunțul nu a putut fi șters. Încearcați din nou.");
        }
      },
    });
  };

  return (
    <div className={styles.container}>
      <BackButton size={45} />

      <div className={styles.actions}>
        {isOwner && (
          <>
            <button className={styles.btn} onClick={() => handleDelete(ad.id)}>
              <img src={deleteIcon} alt="Șterge" />
            </button>

            <button
              className={styles.btn}
              onClick={() => navigate(`/ads/${ad.id}/edit`)}
            >
              <img src={editIcon} alt="Edit" />
            </button>
          </>
        )}

        <button
          className={`${styles.btn} ${isFavorite ? styles.activeFav : ""}`}
          onClick={() => toggleFavorite(ad)}
        >
          <HeartIcon filled={isFavorite} />
        </button>
      </div>
    </div>
  );
};

export default AdActionsBar;
