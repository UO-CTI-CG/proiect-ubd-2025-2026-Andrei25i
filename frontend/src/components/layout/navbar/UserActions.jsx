import { Link } from "react-router-dom";
import Heart from "../../icons/Heart";
import styles from "./Navbar.module.css";

const UserActions = ({ user }) => {
  return (
    <div className={styles.userActions}>
      <Link to="/profile" className={styles.userAvatar}>
        <div>{user.first_name[0] + user.last_name[0]}</div>
        <p>Cont</p>
      </Link>

      <Link to="/favorites" className={styles.favorites}>
        <Heart className={styles.heartIcon} />
        <p>Favorite</p>
      </Link>
    </div>
  );
};

export default UserActions;
