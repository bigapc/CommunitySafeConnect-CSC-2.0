const primaryItems = [
  ["home", "🏠 Home"],
  ["sos", "🆘 SOS"],
  ["safezones", "📍 Map"],
  ["incidents", "📋 Activity"],
  ["settings", "⚙️ Settings"],
];

const secondaryItems = [
  ["circle", "💬 Circle"],
  ["organization", "🏢 Org"],
  ["feed", "📰 Feed"],
  ["emergency", "📞 Emergency"],
];

export default function BottomNav({ route, onNavigate }) {
  return (
    <>
      <nav style={{ position: "fixed", left: 12, right: 12, bottom: 12, background: "#fff", borderRadius: 24, boxShadow: "var(--shadow)", display: "grid", gridTemplateColumns: "repeat(5,1fr)", padding: 10, gap: 8 }}>
        {primaryItems.map(([key, label]) => (
          <button
            key={key}
            onClick={() => onNavigate(key)}
            title={label.split(" ").pop()}
            style={{
              border: 0,
              background: route === key ? "var(--navy)" : "transparent",
              color: route === key ? "#fff" : "var(--muted)",
              borderRadius: 18,
              padding: "10px 6px",
              cursor: "pointer",
              fontSize: 11,
              fontWeight: 600,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {label}
          </button>
        ))}
      </nav>
      <nav style={{ position: "fixed", left: 12, right: 12, bottom: 68, background: "rgba(255, 255, 255, 0.95)", borderRadius: 20, boxShadow: "var(--shadow)", display: "grid", gridTemplateColumns: "repeat(4,1fr)", padding: 8, gap: 8 }}>
        {secondaryItems.map(([key, label]) => (
          <button
            key={key}
            onClick={() => onNavigate(key)}
            title={label.split(" ").pop()}
            style={{
              border: 0,
              background: route === key ? "var(--blue)" : "transparent",
              color: route === key ? "#fff" : "var(--muted)",
              borderRadius: 14,
              padding: "8px 4px",
              cursor: "pointer",
              fontSize: 10,
              fontWeight: 600,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {label}
          </button>
        ))}
      </nav>
    </>
  );
}
