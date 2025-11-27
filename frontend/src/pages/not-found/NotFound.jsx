import { Link, useNavigate } from "react-router-dom";
import backIcon from "../../assets/backIcon.svg";
import styles from "./NotFound.module.css";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.notFoundContainer}>
      <div className={styles.backButton} onClick={() => navigate(-1)}>
        <img src={backIcon} alt="Back" />
      </div>

      <h1>404</h1>
      <h2>Pagina nu a fost găsită</h2>
      <p>Ne pare rău, dar pagina pe care o cautați nu există.</p>
      <Link to="/" className={styles.homeButton}>
        Înapoi la pagina principală
      </Link>
    </div>
  );
};

export default NotFoundPage;