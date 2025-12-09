import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import useAuthStore from "../../store/authStore";
import ProfileAds from "../../components/profile/ProfileAds";
import ProfileFavorites from "../../components/profile/ProfileFavorites";
import { showConfirmation } from "../../utils/ShowConfirmation";
import DeleteAccountModal from "../../components/modals/DeleteAccountModal";
import styles from "./ProfilePage.module.css";

const ProfilePage = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    showConfirmation({
      message: "Sigur vreți să vă deconectați?",
      onConfirm: () => {
        logout();
        navigate("/login");
      },
    });
  };

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const handleConfirmDelete = async (password) => {
    await api.delete("/user", {
      data: {
        password,
      },
    });

    logout();
    navigate("/login");
  };

  if (!user) return null;

  return (
    <>
      <div className={styles.profileHeader}>
        <div className={styles.userDetails}>
          <h1>
            {user.first_name} {user.last_name}
          </h1>
          <p className={styles.infoRow}>
            <span className={styles.label}>Email: </span>
            <span className={styles.value}>{user.email}</span>
          </p>

          <p className={styles.infoRow}>
            <span className={styles.label}>Telefon: </span>
            <span className={styles.value}>{user.phone}</span>
          </p>

          <p className={styles.infoRow}>
            <span className={styles.label}>Adresă: </span>
            <span className={styles.value}>{user.city}</span>
          </p>
          <p className={styles.metaInfo}>
            Cont creat în{" "}
            {new Date(user.created_at).toLocaleDateString("ro-RO")}
          </p>
        </div>

        <div className={styles.actionsColumn}>
          <Link to={"/profile/edit"} className={styles.editButton}>
            Editează Profil
          </Link>

          <button onClick={handleLogout} className={styles.logoutButton}>
            Log Out
          </button>

          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className={styles.deleteLink}
          >
            Șterge Contul
          </button>
        </div>
      </div>

      <ProfileAds userId={user.id} />
      <ProfileFavorites />

      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

export default ProfilePage;
