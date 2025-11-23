import { Link } from "react-router-dom";
import styles from "./Navbar.module.css";
import logo from "../../../assets/logo.png";

const NavbarSimple = () => {
  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.logo}>
        <img
          src={logo}
          alt="Logo"
          width={100}
          height={100}
        />
      </Link>
    </nav>
  );
};

export default NavbarSimple;
