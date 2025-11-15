"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";
import Link from "next/link";
import axios from "axios";
import ArrowIcon from "../components/icons/ArrowIcon";
import EyeOff from "../components/icons/EyeOff";
import Eye from "../components/icons/Eye";
import styles from "./login.module.css";
import NavBar from "../components/layout/NavBar";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

  const login = useAuthStore((state) => state.login);
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        { email, password }
      );

      const { token, user } = response.data;
      login(user, token);
      router.replace("/");
    } catch (err) {
      console.error("Eroare la login:", err);
      if (err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("A apărut o eroare. Vă rugăm încercați din nou.");
      }
    }
  };

  return (
    <>
      <NavBar />

      <div className={styles.loginContainer}>
        <h2>Login</h2>

        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <div className={styles.formField}>
            <label htmlFor="email">Adresa de Email</label>
            <input
              type="email"
              id="email"
              value={email}
              placeholder="Introduceți adresa de email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.formField}>
            <label htmlFor="password">Parola</label>
            <div className={styles.passwordContainer}>
              <input
                type={`${showPassword ? "text" : "password"}`}
                id="password"
                value={password}
                placeholder="Introduceți parola"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className={styles.showPassword}
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <EyeOff size={20} className={styles.eyeIcon} />
                ) : (
                  <Eye size={20} className={styles.eyeIcon} />
                )}
              </button>
            </div>
            <Link href="/#" className={styles.forgotPassword}>
              Ați uitat parola?
            </Link>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.submitButton}>
            Login
          </button>

          <p className={styles.newAccount}>
            Nu aveți un cont?{" "}
            <Link href="/register" className={styles.createLink}>
              Creați unul
              <ArrowIcon size={20} />
            </Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default LoginPage;
