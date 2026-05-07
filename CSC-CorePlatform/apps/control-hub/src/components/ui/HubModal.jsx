export default function HubModal({ isOpen, title, onClose, children, actions = [] }) {
  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(5, 10, 18, 0.68)",
          zIndex: 1200,
        }}
      />
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "min(90vw, 680px)",
          maxHeight: "84vh",
          overflowY: "auto",
          background: "var(--hub-panel)",
          border: "1px solid var(--hub-line)",
          borderRadius: 20,
          boxShadow: "var(--hub-shadow)",
          zIndex: 1201,
          padding: 20,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <h3 style={{ margin: 0 }}>{title}</h3>
          <button
            onClick={onClose}
            style={{
              border: 0,
              borderRadius: 10,
              padding: "6px 10px",
              background: "transparent",
              color: "var(--hub-muted)",
              cursor: "pointer",
              fontSize: 20,
              lineHeight: 1,
            }}
          >
            x
          </button>
        </div>

        <div style={{ marginBottom: actions.length ? 16 : 0 }}>{children}</div>

        {actions.length ? (
          <div style={{ display: "grid", gridTemplateColumns: actions.length > 1 ? "1fr 1fr" : "1fr", gap: 10 }}>
            {actions.map((action, index) => (
              <button
                key={`${action.label}-${index}`}
                onClick={() => {
                  action.onClick?.();
                  if (!action.keepOpen) {
                    onClose();
                  }
                }}
                style={{
                  border: action.primary ? 0 : "1px solid var(--hub-line)",
                  borderRadius: 12,
                  padding: "10px 14px",
                  background: action.primary ? "var(--hub-blue)" : "transparent",
                  color: action.primary ? "#08121c" : "var(--hub-text)",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {action.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </>
  );
}
