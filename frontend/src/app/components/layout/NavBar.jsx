import Image from "next/image";
import Link from "next/link";

import styles from "./NavBar.module.css";

const NavBar = () => {
  return (
    <nav className={styles.navBar}>
      <Link href="/">
        <Image
          className={styles.logo}
          src={"/logo.png"}
          alt="Logo"
          width={100}
          height={100}
        />
      </Link>
    </nav>
  );
};

export default NavBar;
