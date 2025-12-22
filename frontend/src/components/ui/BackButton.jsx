import { useNavigate } from "react-router-dom";
import backIcon from "../../assets/backIcon.svg";

const BackButton = ({ size = 50 }) => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        backgroundColor: "#1b1b1b",
        alignSelf: "flex-start",
        marginLeft: "4%",
        marginBottom: "2%",
        width: `${size}px`,
        height: `${size}px`,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "50%",
        cursor: "pointer",
      }}
      onClick={() => navigate(-1)}
    >
      <img src={backIcon} alt="Back" />
    </div>
  );
};

export default BackButton;
