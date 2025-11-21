import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import toast from "react-hot-toast";

import FormInput from "../../components/ui/FormInput";
import LocationSelector from "../../components/ui/LocationSelector";
import ArrowIcon from "../../components/icons/ArrowIcon";
import styles from "./Login.module.css";

const RegisterPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [county, setCounty] = useState("");
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handlePhoneChange = (e) => {
    const val = e.target.value;

    if (/^\+?\d*$/.test(val)) {
      if (val.length <= 16) {
        setPhone(val);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Parola trebuie să aibă minim 6 caractere.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Parolele nu coincid.");
      return;
    }

    if (!county || !city) {
      setError("Vă rugăm să selectați județul și localitatea.");
      toast.error("Locația este obligatorie.");
      return;
    }

    setIsLoading(true);

    try {
      const locationString = `${city}, ${county}`;

      await api.post(`${import.meta.env.VITE_API_URL}/auth/register`, {
        first_name: firstName,
        last_name: lastName,
        email: email,
        phone_number: phone,
        password: password,
        city: locationString,
      });

      toast.success("Cont creat cu succes.");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error("Eroare la înregistrare:", err);

      if (err.response && err.response.data && err.response.data.error) {
        toast.error(err.response.data.error);
      } else {
        toast.error("A apărut o eroare la crearea contului. Încearcă din nou.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <h2>Sign Up</h2>

      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <div className={styles.nameGroup}>
          <div className={styles.formField}>
            <label htmlFor="nume">Nume *</label>
            <FormInput
              type={"text"}
              id={"nume"}
              placeholder={"Nume"}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          <div className={styles.formField}>
            <label htmlFor="prenume">Prenume *</label>
            <FormInput
              type={"text"}
              id={"prenume"}
              placeholder={"Prenume"}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
        </div>

        <div className={styles.formField}>
          <label htmlFor="phone">Număr de telefon *</label>
          <FormInput
            type={"tel"}
            id={"phone"}
            placeholder={"Introduceți numărul de telefon"}
            value={phone}
            onChange={(e) => handlePhoneChange(e)}
            required
          />
        </div>

        <div className={styles.formField}>
          <LocationSelector
            selectedCounty={county}
            selectedCity={city}
            onCountyChange={setCounty}
            onCityChange={setCity}
          />
        </div>

        <div className={styles.formField}>
          <label htmlFor="email">Adresa de Email *</label>
          <FormInput
            type={"email"}
            id={"email"}
            placeholder={"Introduceți adresa de email"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className={styles.formField}>
          <label htmlFor="password">Parola *</label>
          <FormInput
            type={"password"}
            id={"password"}
            placeholder={"Introduceți parola"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className={styles.formField}>
          <label htmlFor="password">Confirmați parola *</label>
          <FormInput
            type={"password"}
            id={"password"}
            placeholder={"Introduceți din nou parola"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <div className={styles.Obs}>
          <p>* Câmp obligatoriu</p>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <button
          type="submit"
          className={styles.submitButton}
          disabled={isLoading}
        >
          {isLoading ? "Sign Up..." : "Sign Up"}
        </button>

        <p className={styles.newAccount}>
          Aveți deja un cont?{" "}
          <Link to="/login" className={styles.createLink}>
            Login
            <ArrowIcon size={20} />
          </Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;
