import toast from "react-hot-toast";

const ConfirmationContent = ({
  t,
  message,
  onConfirm,
  confirmText,
  cancelText,
  isDanger,
}) => {
  return (
    <div style={{ minWidth: "240px" }}>
      <p
        style={{
          margin: "0 0 15px 0",
          fontSize: "15px",
          fontWeight: "500",
        }}
      >
        {message}
      </p>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
        <button
          onClick={() => toast.dismiss(t.id)}
          style={{
            background: "white",
            border: "1px solid #ddd",
            borderRadius: "6px",
            padding: "8px 16px",
            cursor: "pointer",
            fontWeight: "500",
          }}
        >
          {cancelText}
        </button>

        <button
          onClick={() => {
            onConfirm();
            toast.dismiss(t.id);
          }}
          style={{
            background: isDanger ? "#d32f2f" : "#4376fb",
            color: "white",
            border: "none",
            borderRadius: "6px",
            padding: "8px 16px",
            cursor: "pointer",
            fontWeight: "600",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          {confirmText}
        </button>
      </div>
    </div>
  );
};

export const showConfirmation = ({
  message,
  onConfirm,
  confirmText = "Da",
  cancelText = "Nu",
  isDanger = true,
}) => {
  toast(
    (t) => (
      <ConfirmationContent
        t={t}
        message={message}
        onConfirm={onConfirm}
        confirmText={confirmText}
        cancelText={cancelText}
        isDanger={isDanger}
      />
    ),
    {
      duration: 10000,
    }
  );
};
