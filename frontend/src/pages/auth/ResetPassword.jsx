import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

import FormInput from "../../components/ui/FormInput";
import styles from "./ResetPassword.module.css";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Parola trebuie să aibă minim 6 caractere.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Parolele nu coincid.");
      return;
    }

    if (!token) {
      toast.error("Link-ul de resetare este invalid. Vă rugăm solicitați altul.");
      return;
    }

    setIsLoading(true);

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/reset-password`,
        { token: token, newPassword: password }
      );

      toast.success("Parola a fost resetată cu succes.");
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 3000);
    } catch (err) {
      console.error("Eroare la resetarea parolei:", err);
      toast.error(
        err.response?.data.error ||
          "A apărut o eroare. Vă rugăm încercați din nou.",
        { duration: 10000 }
      );
    }
  };

  return (
    <div className={styles.resetPasswordContainer}>
      <h2>Setați o parolă nouă</h2>

      <form onSubmit={handleSubmit} className={styles.resetPasswordForm}>
        <div className={styles.formField}>
          <label htmlFor="password">Parola nouă</label>
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
          <label htmlFor="password">Confirmați parola</label>
          <FormInput
            type={"password"}
            id={"password"}
            placeholder={"Introduceți din nou parola"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <button
          type="submit"
          className={styles.submitButton}
          disabled={isLoading}
        >
          {"Resetați parola"}
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
