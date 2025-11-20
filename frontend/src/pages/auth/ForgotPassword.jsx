import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import FormInput from "../../components/ui/FormInput";
import styles from "./ForgotPassword.module.css";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/forgot-password`,
        { email }
      );
      toast.success(response.data.message, { duration: 10000 });
      setEmail("");

    } catch (err) {
      console.error("Eroare la solicitarea resetării parolei:", err);
      toast.error(
        "A apărut o eroare la trimiterea cererii. Vă rugăm încercați mai târziu.",
        { duration: 10000 }
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.forgotPassContainer}>
      <h2>Ați uitat parola?</h2>
      <p className={styles.subtitle}>
        Nicio problemă. Introduceți adresa de email asociată contului și vă vom
        trimite un link pentru a o reseta.
      </p>

      <form onSubmit={handleSubmit} className={styles.forgotPassForm}>
        <div className={styles.formField}>
          <label htmlFor="email">Adresa de email</label>
          <FormInput
            type={"email"}
            id={"email"}
            placeholder={"Introduceți adresa de email"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className={styles.submitButton}
          disabled={isLoading}
        >
          {isLoading ? "Se trimite..." : "Trimiteți link-ul de resetare"}
        </button>

        <div className={styles.backToLogin}>
          <Link to="/login">Înapoi la pagina de login</Link>
        </div>
      </form>
    </div>
  );
};

export default ForgotPasswordPage;
