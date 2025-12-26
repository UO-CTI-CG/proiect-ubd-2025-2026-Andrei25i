import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";
import { uploadImagesToCloudinary } from "../../services/cloudinary";
import LocationSelector from "../../components/ui/LocationSelector";
import CategorySelector from "../../components/ui/CategorySelector";
import ImageSelector from "../../components/ui/ImageSelector";
import styles from "./CreateAd.module.css";
import useAuthStore from "../../store/authStore";

const CreateAd = () => {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login?redirect=create-ad", { replace: true });
    }
  }, [navigate]);

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
  const [loading, setLoading] = useState(false);

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

      setSelectedImages((prevImages) => prevImages.concat(filesArray));
    }
  };

  const removeImage = (index) => {
    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
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

    setLoading(true);

    try {
      const imageUrls = await uploadImagesToCloudinary(selectedImages);

      const finalAdData = {
        ...formData,
        city: `${city}, ${county}`,
        images: imageUrls,
      };

      await api.post(`/ads`, finalAdData);
      toast.success("Anunț adăugat cu succes!");
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 3000);
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Adaugă un anunț nou</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formField}>
          <label htmlFor="title">Titlu</label>
          <input
            id="title"
            name="title"
            placeholder="Numele produsului..."
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formField}>
          <label htmlFor="description">Descriere</label>
          <textarea
            id="description"
            name="description"
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
              placeholder="Prețul produsului..."
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formField}>
            <label htmlFor="currency">Monedă</label>
            <select id="currency" name="currency" onChange={handleChange}>
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
            onImageRemove={removeImage}
          />
        </div>

        <button
          type="submit"
          className={styles.submitButton}
          disabled={loading}
        >
          {loading ? "Se postează..." : "Postează"}
        </button>
      </form>
    </div>
  );
};

export default CreateAd;
