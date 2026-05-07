export default function AlertFeed({ items, onSelect }) {
  return (
    <div style={{ background: "var(--hub-panel)", borderRadius: 20, padding: 18, boxShadow: "var(--hub-shadow)" }}>
      <h3 style={{ marginTop: 0 }}>Live Alerts</h3>
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onSelect?.(item)}
          style={{
            width: "100%",
            textAlign: "left",
            padding: "12px 0",
            borderBottom: "1px solid var(--hub-line)",
            background: "transparent",
            borderTop: 0,
            borderLeft: 0,
            borderRight: 0,
            color: "inherit",
            cursor: "pointer",
          }}
        >
          <div style={{ fontWeight: 700 }}>{item.title}</div>
          <div style={{ color: "var(--hub-muted)", fontSize: 14 }}>{item.location}</div>
        </button>
      ))}
    </div>
  );
}
