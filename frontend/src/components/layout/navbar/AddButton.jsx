import { Link } from "react-router-dom";
import plusIcon from "../../../assets/plusIcon.svg";
import styles from "./Navbar.module.css";


const AddButton = () => {
  return (
    <Link to="/new-ad" className={styles.newAdButton}>
      <img src={plusIcon} alt="+" />
      <p>Anunț nou</p>
    </Link>
  )
}

export default AddButton;
