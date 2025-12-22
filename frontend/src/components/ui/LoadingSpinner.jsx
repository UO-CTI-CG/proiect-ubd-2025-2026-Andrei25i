import styles from "./Spinner.module.css";

const LoadingSpinner = ({
  size = 40,
  color = "#4376FB",
  thickness = 4,
  className = "",
  full,
}) => {
  return (
    <div
      className={`${full ? styles.center : ""}`}
      style={{ display: "flex", justifyContent: "center" }}
    >
      <div
        className={`${styles.spinner} ${className}`}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderWidth: `${thickness}px`,
          borderColor: "rgba(0, 0, 0, 0.1)",
          borderTopColor: color,
        }}
      />
    </div>
  );
};

export default LoadingSpinner;
