export default function SosButton({ onActivate }) {
  const handleTap = () => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate([40, 50, 40]);
    }
    onActivate();
  };

  return (
    <button
      onClick={handleTap}
      style={{
        width: "100%",
        border: 0,
        borderRadius: 999,
        padding: "28px 20px",
        background: "linear-gradient(135deg, var(--navy), var(--navy-2))",
        color: "#fff",
        fontWeight: 800,
        fontSize: 22,
        boxShadow: "0 18px 40px rgba(31, 58, 90, .24)",
        cursor: "pointer",
      }}
    >
      Tap if you need help
    </button>
  );
}
