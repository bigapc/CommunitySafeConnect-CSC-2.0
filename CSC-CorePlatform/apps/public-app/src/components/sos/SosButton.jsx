export default function SosButton({ onActivate }) {
  return (
    <button
      onClick={onActivate}
      style={{
        width: "100%",
        border: 0,
        borderRadius: 999,
        padding: "28px 20px",
        background: "radial-gradient(circle at center, #f26d75 0%, var(--red) 60%, #bf3d45 100%)",
        color: "#fff",
        fontWeight: 800,
        fontSize: 24,
        boxShadow: "0 20px 50px rgba(217,84,93,.32)",
        cursor: "pointer",
      }}
    >
      Tap if you need help
    </button>
  );
}
