import { useState, useEffect } from "react";
import FormInput from "../../components/ui/FormInput";
import styles from "./DeleteAccountModal.module.css";

const DeleteAccountModal = ({ isOpen, onClose, onConfirm }) => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await onConfirm(password);
    } catch (err) {
      setError(err.response?.data?.error || "Eroare la ștergerea contului.");
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Ștergere Cont</h2>
        <p className={styles.warning}>
          Această acțiune este <strong>ireversibilă</strong>. Toate anunțurile
          și datele vor fi șterse definitiv. Vă rugăm introduceți parola pentru
          a confirma.
        </p>

        <form onSubmit={handleSubmit}>
          <FormInput
            type="password"
            id="password"
            placeholder="Parola"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            required
          />

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.actions}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelBtn}
              disabled={loading}
            >
              Anulare
            </button>
            <button
              type="submit"
              className={styles.deleteBtn}
              disabled={loading || !password}
            >
              {loading ? "Se șterge..." : "Ștergere Cont"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeleteAccountModal;
