import { useEffect, useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import api from "../../services/api";
import toast from "react-hot-toast";
import useAuthStore from "../../store/authStore";

import FormInput from "../../components/ui/FormInput";
import ArrowIcon from "../../components/icons/ArrowIcon";
import styles from "./Login.module.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const isExpired = searchParams.get("expired");
    if (isExpired) {
      toast.error("Sesiunea a expirat. Te rugăm să te autentifici din nou.", {
        duration: 5000,
      });
      navigate("/login", { replace: true });
    }
  }, [navigate, searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        { email, password }
      );

      const { token, user } = response.data;
      login(user, token);
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Eroare la login:", err);
      toast.error(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "A apărut o eroare. Vă rugăm încercați din nou.",
        { duration: 10000 }
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <h2>Login</h2>

      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <div className={styles.formField}>
          <label htmlFor="email">Adresa de Email</label>
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
          <label htmlFor="password">Parola</label>
          <FormInput
            type={"password"}
            id={"password"}
            placeholder={"Introduceți parola"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Link to="/forgot-password" className={styles.forgotPassword}>
            Ați uitat parola?
          </Link>
        </div>

        <button
          type="submit"
          className={styles.submitButton}
          disabled={isLoading}
        >
          {isLoading ? "Login..." : "Login"}
        </button>

        <p className={styles.newAccount}>
          Nu aveți un cont?{" "}
          <Link to="/register" className={styles.createLink}>
            Creați unul
            <ArrowIcon size={20} />
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
