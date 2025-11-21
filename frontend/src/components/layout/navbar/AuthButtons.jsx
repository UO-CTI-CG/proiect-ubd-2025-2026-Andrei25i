import { Link } from "react-router-dom";
import styles from "./Navbar.module.css";

const AuthButtons = () => {
  return (
    <div className={styles.authButtons}>
        <Link to="/login" className={styles.loginButton}>Login</Link>
        <Link to="/register" className={styles.signupButton}>Sign Up</Link>
    </div>
  )
}

export default AuthButtons;
