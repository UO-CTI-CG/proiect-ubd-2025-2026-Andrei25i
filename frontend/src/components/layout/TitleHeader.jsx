import { useNavigate } from "react-router-dom";
import BackIcon from "../icons/BackIcon";
import styles from "./TitleHeader.module.css";

const TitleHeader = ({ title, icon }) => {
  const navigate = useNavigate();

  const handleClick = () => navigate(-1);

  return (
    <section className={styles.container}>
      <div className={styles.backButton} onClick={handleClick}>
        <BackIcon />
      </div>

      <div className={styles.title}>
        {icon && (
          <div className={styles.icon}>
            <img src={icon} alt={`${title} icon`} />
          </div>
        )}

        <h1>{title}</h1>
      </div>
    </section>
  );
};

export default TitleHeader;
