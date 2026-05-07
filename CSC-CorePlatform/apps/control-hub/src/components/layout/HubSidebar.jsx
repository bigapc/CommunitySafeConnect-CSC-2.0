const items = [
  ["dashboard", "Dashboard"],
  ["master", "APC Master Control"],
  ["incidents", "Incident Console"],
  ["organizations", "Organizations"],
  ["responders", "Responder Verification"],
  ["zones", "Safe Zones"],
  ["records", "Incident Records"],
  ["security", "Security Review"],
  ["broadcasts", "Broadcasts"],
  ["settings", "Settings"],
];

export default function HubSidebar({ route, onNavigate }) {
  return (
    <aside style={{ width: 280, background: "var(--hub-panel)", padding: 18, borderRight: "1px solid var(--hub-line)" }}>
      <div style={{ marginBottom: 26 }}>
        <div style={{ fontWeight: 800, fontSize: 22 }}>APC CSC Control Hub</div>
        <div style={{ color: "var(--hub-muted)", fontSize: 12 }}>Admin-only dispatcher backend</div>
      </div>
      <div style={{ display: "grid", gap: 8 }}>
        {items.map(([key, label]) => (
          <button
            key={key}
            onClick={() => onNavigate(key)}
            style={{
              border: 0,
              textAlign: "left",
              background: route === key ? "var(--hub-blue)" : "transparent",
              color: route === key ? "#09131f" : "var(--hub-text)",
              borderRadius: 16,
              padding: "12px 14px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </aside>
  );
}
