import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import useAuthStore from "../../store/authStore";
import ProfileAds from "../../components/profile/ProfileAds";
import ProfileFavorites from "../../components/profile/ProfileFavorites";
import { showConfirmation } from "../../utils/ShowConfirmation";
import DeleteAccountModal from "../../components/modals/DeleteAccountModal";
import styles from "./ProfilePage.module.css";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import BackIcon from "../../components/icons/BackIcon";

const ProfilePage = () => {
  const { id } = useParams();
  const authUser = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const [publicUser, setPublicUser] = useState(null);
  const [loadingPublic, setLoadingPublic] = useState(false);

  const navigate = useNavigate();

  const isOwnProfile = !id || (authUser && id === authUser.id.toString());

  useEffect(() => {
    if (id && !isOwnProfile) {
      const fetchPublicProfile = async () => {
        setLoadingPublic(true);
        try {
          const response = await api.get(`/user/${id}`);
          setPublicUser(response.data);
        } catch (err) {
          console.error("Utilizatorul nu a fost găsit.");
        } finally {
          setLoadingPublic(false);
        }
      };
      fetchPublicProfile();
    }
  }, [id, isOwnProfile]);

  const displayUser = isOwnProfile ? authUser : publicUser;

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

  if (loadingPublic) {
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: 50 }}>
        <LoadingSpinner size={60} full />
      </div>
    );
  }

  if (!displayUser) return null;

  return (
    <>
      <div className={styles.profileHeader}>
        <div className={styles.profileTitle}>
          <div className={styles.backButton} onClick={() => navigate(-1)}>
            <BackIcon />
          </div>

          <div className={styles.userDetails}>
            <h1>
              {displayUser.first_name} {displayUser.last_name}
            </h1>

            {isOwnProfile && (
              <>
                <p className={styles.infoRow}>
                  <span className={styles.label}>Email: </span>
                  <span className={styles.value}>{displayUser.email}</span>
                </p>

                <p className={styles.infoRow}>
                  <span className={styles.label}>Telefon: </span>
                  <span className={styles.value}>
                    {displayUser.phone_number}
                  </span>
                </p>

                <p className={styles.infoRow}>
                  <span className={styles.label}>Adresă: </span>
                  <span className={styles.value}>{displayUser.city}</span>
                </p>
              </>
            )}

            <p className={styles.metaInfo}>
              Cont creat în{" "}
              {new Date(displayUser.created_at).toLocaleDateString("ro-RO")}
            </p>
          </div>
        </div>

        {isOwnProfile && (
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
        )}
      </div>

      <ProfileAds userId={displayUser.id} />
      {isOwnProfile && <ProfileFavorites />}
      {isOwnProfile && (
        <DeleteAccountModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </>
  );
};

export default ProfilePage;
