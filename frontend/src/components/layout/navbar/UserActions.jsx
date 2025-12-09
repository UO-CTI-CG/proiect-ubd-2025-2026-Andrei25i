import { Link } from "react-router-dom";
import useAuthStore from "../../../store/authStore";
import Heart from "../../icons/Heart";
import styles from "./Navbar.module.css";

const UserActions = ({ user }) => {
  const logout = useAuthStore((state) => state.logout);
  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <div className={styles.userActions}>
      <div className={styles.profileWrapper}>
        <Link to="/profile" className={styles.userAvatar}>
          <div>{user.first_name[0] + user.last_name[0]}</div>
          <p>Cont</p>
        </Link>

        <div className={styles.dropdownMenu}>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Log Out
          </button>
        </div>
      </div>

      <Link to="/favorites" className={styles.favorites}>
        <Heart className={styles.heartIcon} />
        <p>Favorite</p>
      </Link>
    </div>
  );
};

export default UserActions;
