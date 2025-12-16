import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import { useEffect, useState } from "react";
import FormInput from "../../components/ui/FormInput";
import LocationSelector from "../../components/ui/LocationSelector";
import { isValidPhone } from "../../utils/validators";
import styles from "../../pages/auth/Login.module.css";

const EditProfilePage = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuthStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selectedCounty, setSelectedCounty] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        phone_number: user.phone_number || "",
      });

      if (user.city && user.city.includes(",")) {
        const parts = user.city.split(",");

        if (parts.length >= 2) {
          const cityPart = parts[0].trim();
          const countyPart = parts[1].trim();

          setSelectedCounty(countyPart);
          setSelectedCity(cityPart);
        }
      }
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone_number") {
      if (!isValidPhone(value)) {
        return;
      }
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    let finalLocationString = "";
    if (selectedCity && selectedCounty) {
      finalLocationString = `${selectedCity}, ${selectedCounty}`;
    }

    const dataToSend = {
      ...formData,
      city: finalLocationString,
    };

    try {
      await updateUser(dataToSend);
      navigate("/profile", { replace: true });
    } catch (err) {
      const message =
        err.response?.data?.error || "Eroare la modificarea datelor.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className={styles.loginContainer} style={{ marginBottom: 80 }}>
      <h2>Editare Profil</h2>

      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <div className={styles.nameGroup}>
          <div className={styles.formField}>
            <label htmlFor="nume">Nume</label>
            <FormInput
              type={"text"}
              name={"last_name"}
              id={"nume"}
              value={formData.last_name}
              onChange={handleChange}
              autoComplete="off"
              required
            />
          </div>

          <div className={styles.formField}>
            <label htmlFor="prenume">Prenume</label>
            <FormInput
              type={"text"}
              name={"first_name"}
              id={"prenume"}
              value={formData.first_name}
              onChange={handleChange}
              autoComplete="off"
              required
            />
          </div>
        </div>

        <div className={styles.formField}>
          <label htmlFor="phone">Număr de telefon</label>
          <FormInput
            type={"tel"}
            name={"phone_number"}
            id={"phone"}
            value={formData.phone_number}
            onChange={handleChange}
            autoComplete="off"
            required
          />
        </div>

        <div className={styles.formField}>
          <LocationSelector
            selectedCounty={selectedCounty}
            selectedCity={selectedCity}
            onCountyChange={setSelectedCounty}
            onCityChange={setSelectedCity}
            register={false}
          />
        </div>

        <div className={styles.formField}>
          <label htmlFor="email">Adresa de Email</label>
          <FormInput
            type={"email"}
            name={"email"}
            id={"email"}
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            gap: "5%",
            marginTop: 15,
          }}
        >
          <button
            type="button"
            onClick={() => navigate("/profile", { replace: true })}
            className={styles.cancelButton}
          >
            Anulează
          </button>

          <button
            type="submit"
            disabled={loading}
            className={styles.submitButton}
          >
            {loading ? "Se salvează..." : "Salvează"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfilePage;
