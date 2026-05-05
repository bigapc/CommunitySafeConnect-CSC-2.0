export default function AlertFeed({ items }) {
  return (
    <div style={{ background: "var(--hub-panel)", borderRadius: 20, padding: 18, boxShadow: "var(--hub-shadow)" }}>
      <h3 style={{ marginTop: 0 }}>Live Alerts</h3>
      {items.map((item) => (
        <div key={item.id} style={{ padding: "12px 0", borderBottom: "1px solid var(--hub-line)" }}>
          <div style={{ fontWeight: 700 }}>{item.title}</div>
          <div style={{ color: "var(--hub-muted)", fontSize: 14 }}>{item.location}</div>
        </div>
      ))}
    </div>
  );
}
