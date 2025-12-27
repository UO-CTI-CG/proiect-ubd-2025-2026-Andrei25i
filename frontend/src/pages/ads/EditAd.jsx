import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { uploadImagesToCloudinary } from "../../services/cloudinary";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import LocationSelector from "../../components/ui/LocationSelector";
import CategorySelector from "../../components/ui/CategorySelector";
import ImageSelector from "../../components/ui/ImageSelector";
import styles from "./CreateAd.module.css";

const EditAd = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    currency: "RON",
    category_id: "",
  });

  const [county, setCounty] = useState("");
  const [city, setCity] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [loadingAd, setLoadingAd] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);

  useEffect(() => {
    const fetchAd = async () => {
      setLoadingAd(true);
      try {
        const response = await api.get(`ads/${id}`);
        const data = response.data;
        setFormData({
          title: data.title,
          description: data.description,
          price: data.price,
          currency: data.currency,
          category_id: data.category.id,
        });

        if (data.city) {
          const parts = data.city.split(", ");
          setCity(parts[0] || "");
          setCounty(parts[1] || "");
        }

        const existingImages = data.images.map((img) => ({
          ...img,
          isExisting: true,
        }));
        setSelectedImages(existingImages);
      } catch (err) {
        console.error("Eroare la încărcarea anunțului:", err);
        navigate("/");
      } finally {
        setLoadingAd(false);
      }
    };

    fetchAd();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      category_id: value,
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);

      if (selectedImages.length + filesArray.length > 10) {
        toast.error("Poți încărca maxim 10 imagini.");
        return;
      }

      const newImages = filesArray.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        isExisting: false,
      }));

      setSelectedImages((prev) => [...prev, ...newImages]);
    }
  };

  const handleImageRemove = (index) => {
    const imageToRemove = selectedImages[index];

    if (imageToRemove.isExisting) {
      setImagesToDelete((prev) => [...prev, imageToRemove.public_id]);
    } else {
      URL.revokeObjectURL(imageToRemove.preview);
    }

    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.title.length > 255) {
      return toast.error("Titlul este prea lung (maxim 255 caractere).");
    }

    if (formData.description.length > 5000) {
      return toast.error("Descrierea este prea lungă (maxim 5000 caractere).");
    }

    if (!county || !city) {
      toast.error("Te rugăm să selectezi locația");
      return;
    }

    if (selectedImages.length === 0) {
      return toast.error("Te rugăm să adaugi cel puțin o imagine.");
    }

    if (selectedImages.length > 10) {
      return toast.error("Te rugăm să adaugi cel mult 10 imagini.");
    }

    setLoadingEdit(true);

    try {
      const existingRemaining = selectedImages.filter((img) => img.isExisting);
      const newFilesToUpload = selectedImages
        .filter((img) => !img.isExisting)
        .map((img) => img.file);

      let newlyUploaded = [];
      if (newFilesToUpload.length > 0) {
        newlyUploaded = await uploadImagesToCloudinary(newFilesToUpload);
      }

      const allImages = [...existingRemaining, ...newlyUploaded];
      const cleanImagesForDB = allImages.map(({ url, public_id }) => ({
        url,
        public_id,
      }));

      const finalAdData = {
        ...formData,
        price: parseFloat(formData.price),
        city: `${city}, ${county}`,
        images: cleanImagesForDB,
        deletedPublicIds: imagesToDelete,
      };

      await api.put(`ads/${id}`, finalAdData);
      toast.success("Anunț actualizat cu succes!");
      setTimeout(() => {
        navigate(`/ads/${id}`, { replace: true });
      }, 3000);
    } catch (err) {
      setLoadingEdit(false);
      toast.error("Eroare la actualizare.");
    }
  };

  if (loadingAd) return <LoadingSpinner size={60} full />;

  return (
    <div className={styles.container}>
      <h2>Editează anunțul</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formField}>
          <label htmlFor="title">Titlu</label>
          <input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            maxLength={255}
            required
          />
        </div>

        <div className={styles.formField}>
          <label htmlFor="description">Descriere</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            rows="5"
            placeholder="Descrie starea produsului..."
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.rowGroup}>
          <div className={`${styles.formField}`}>
            <label htmlFor="price">Preț</label>
            <input
              id="price"
              name="price"
              type="number"
              min={1}
              step={0.01}
              value={formData.price}
              onChange={handleChange}
              placeholder="Prețul produsului..."
              required
            />
          </div>

          <div className={styles.formField}>
            <label htmlFor="currency">Monedă</label>
            <select
              id="currency"
              name="currency"
              value={formData.currency}
              onChange={handleChange}
            >
              <option value="RON">RON</option>
              <option value="EUR">EUR</option>
            </select>
          </div>
        </div>

        <div className={styles.formField}>
          <LocationSelector
            selectedCounty={county}
            selectedCity={city}
            onCountyChange={setCounty}
            onCityChange={setCity}
            register={false}
          />
        </div>

        <div className={styles.formField}>
          <CategorySelector
            selectedCategory={formData.category_id}
            onCategoryChange={handleCategoryChange}
            showAllOption={false}
            required={true}
          />
        </div>

        <div className={styles.formField}>
          <ImageSelector
            images={selectedImages}
            onImageChange={handleImageChange}
            onImageRemove={handleImageRemove}
          />
        </div>

        <div className={styles.buttonGroup}>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={loadingEdit}
          >
            {loadingEdit ? "Se editează..." : "Editează"}
          </button>

          <button
            type="button"
            className={styles.cancelButton}
            onClick={() => navigate(`/ads/${id}`)}
            disabled={loadingEdit}
          >
            Anulează
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditAd;
