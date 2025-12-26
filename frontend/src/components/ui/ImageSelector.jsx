import imageIcon from "../../assets/img.png";
import styles from "./ImageSelector.module.css";

const ImageSelector = ({ images, onImageChange, onImageRemove }) => {
  return (
    <>
      <label htmlFor="images">Imagini</label>

      <label htmlFor="images" className={styles.fileDropzone}>
        <div className={styles.uploadPlaceholder}>
          <img src={imageIcon} alt="Img" />
          <span>Apasă pentru a încărca imagini</span>
          <small>Maxim 10 fișiere</small>
        </div>
      </label>

      <input
        id="images"
        type="file"
        multiple
        style={{ display: "none" }}
        onChange={onImageChange}
        accept="image/jpeg, image/png, image/webp, image/jpg"
      />

      {images.length > 0 && (
        <div className={styles.previewContainer}>
          {images.map((file, index) => (
            <div key={index} className={styles.previewItem}>
              <img
                src={URL.createObjectURL(file)}
                alt={`preview ${index}`}
                className={styles.thumbnail}
              />
              <button
                type="button"
                onClick={() => onImageRemove(index)}
                className={styles.removeBtn}
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}

      {images.length > 0 && <p className={styles.obs}>{images.length}/10</p>}

      <p className={styles.obs}>
        Formate acceptate: <strong>JPG, JPEG, PNG, WEBP</strong>
      </p>
    </>
  );
};

export default ImageSelector;
