import { Link } from "react-router-dom";
import styles from "./NotFound.module.css";
import BackButton from "../../components/ui/BackButton";

const NotFoundPage = () => {
  return (
    <div className={styles.notFoundContainer}>
      <BackButton />
      
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