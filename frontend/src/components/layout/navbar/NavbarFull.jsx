import { Link } from "react-router-dom";
import styles from "./Navbar.module.css";
import useAuthStore from "../../../store/authStore";
import UserActions from "./UserActions";
import AuthButtons from "./AuthButtons";
import AddButton from "./AddButton";

const NavbarFull = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <nav className={`${styles.navbar} ${styles.full}`}>
      <div className={styles.left}>
        {user ? <UserActions user={user} /> : <AuthButtons />}
      </div>

      <div className={styles.center}>
        <Link to="/" className={styles.logo}>
          <img src={"/logo.png"} alt="Logo" width={100} height={100} />
        </Link>
      </div>

      <div className={styles.right}>
        <AddButton />
      </div>
    </nav>
  );
};

export default NavbarFull;
