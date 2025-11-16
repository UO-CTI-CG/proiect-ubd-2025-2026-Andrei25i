"use client";

import { useState } from "react";
import EyeOff from "../icons/EyeOff";
import Eye from "../icons/Eye";
import styles from "./FormInput.module.css";

const FormInput = ({ type, id, ...rest }) => {
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  if (type === "password") {
    return (
      <div className={styles.passwordContainer}>
        <input
          className={styles.formInput}
          type={`${showPassword ? "text" : "password"}`}
          id={id}
          onChange={(e) => setPassword(e.target.value)}
          {...rest}
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
    );
  }

  return <input className={styles.formInput} type={type} id={id} {...rest} />;
};

export default FormInput;
