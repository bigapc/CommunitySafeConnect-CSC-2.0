import { useEffect } from "react";

export default function Toast({ message, type = "success", duration = 3000, onClose }) {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose]);

  if (!message) return null;

  const bgColor = {
    success: "var(--green)",
    error: "var(--red)",
    info: "var(--navy)",
    warning: "#f59e0b",
  }[type];

  const icon = {
    success: "✓",
    error: "✕",
    info: "ⓘ",
    warning: "⚠",
  }[type];

  return (
    <div
      style={{
        position: "fixed",
        bottom: 88,
        right: 14,
        background: bgColor,
        color: "#fff",
        borderRadius: 12,
        padding: 14,
        boxShadow: "0 12px 32px rgba(31, 58, 90, 0.2)",
        display: "flex",
        alignItems: "center",
        gap: 10,
        zIndex: 998,
        animation: "slideInUp 0.3s ease",
        maxWidth: "100%",
        fontSize: 14,
        fontWeight: 600,
      }}
    >
      <span style={{ fontSize: 18 }}>{icon}</span>
      <span>{message}</span>
    </div>
  );
}
