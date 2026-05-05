const items = [
  ["home", "Home"],
  ["safezones", "Map"],
  ["incidents", "Activity"],
  ["organization", "Organization"],
  ["settings", "Settings"],
];

export default function BottomNav({ route, onNavigate }) {
  return (
    <nav style={{ position: "fixed", left: 12, right: 12, bottom: 12, background: "#fff", borderRadius: 24, boxShadow: "var(--shadow)", display: "grid", gridTemplateColumns: "repeat(5,1fr)", padding: 10, gap: 8 }}>
      {items.map(([key, label]) => (
        <button
          key={key}
          onClick={() => onNavigate(key)}
          style={{
            border: 0,
            background: route === key ? "var(--navy)" : "transparent",
            color: route === key ? "#fff" : "var(--muted)",
            borderRadius: 18,
            padding: "10px 6px",
            cursor: "pointer",
          }}
        >
          {label}
        </button>
      ))}
    </nav>
  );
}
