export default function Modal({ isOpen, title, onClose, children, actions, fullWidth = false }) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(31, 58, 90, 0.5)",
          zIndex: 999,
          animation: "fadeIn 0.2s ease",
        }}
      />
      {/* Modal Content */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: "#fff",
          borderRadius: 24,
          padding: 24,
          boxShadow: "0 24px 64px rgba(31, 58, 90, 0.2)",
          zIndex: 1000,
          maxHeight: "85vh",
          overflowY: "auto",
          width: fullWidth ? "85vw" : "90vw",
          maxWidth: fullWidth ? "900px" : "500px",
          animation: "slideUp 0.3s ease",
          border: "1px solid var(--line)",
        }}
      >
        {/* Header */}
        {title && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <h2 style={{ margin: 0, color: "var(--navy)", fontSize: 20 }}>{title}</h2>
            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                fontSize: 24,
                color: "var(--muted)",
                cursor: "pointer",
                padding: 0,
              }}
            >
              ✕
            </button>
          </div>
        )}

        {/* Body */}
        <div style={{ marginBottom: 20, color: "var(--text)", lineHeight: 1.6 }}>{children}</div>

        {/* Footer Actions */}
        {actions && (
          <div style={{ display: "grid", gridTemplateColumns: actions.length > 1 ? "1fr 1fr" : "1fr", gap: 10 }}>
            {actions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => {
                  action.onClick?.();
                  if (!action.keepOpen) onClose();
                }}
                style={{
                  border: 0,
                  borderRadius: 12,
                  padding: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  background: action.primary ? "var(--navy)" : "var(--bg-soft)",
                  color: action.primary ? "#fff" : "var(--navy)",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.opacity = "0.85")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.opacity = "1")
                }
              >
                {action.label}
              </button>
            ))}
          </div>
        )}

        {/* CSS for animations */}
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translate(-50%, -40%);
            }
            to {
              opacity: 1;
              transform: translate(-50%, -50%);
            }
          }
        `}</style>
      </div>
    </>
  );
}
