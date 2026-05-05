export default function ResponderCard({ responder }) {
  return (
    <div style={{ background: "var(--hub-panel)", borderRadius: 18, padding: 16, boxShadow: "var(--hub-shadow)", marginBottom: 10, display: "flex", justifyContent: "space-between" }}>
      <div>
        <div style={{ fontWeight: 700 }}>{responder.name}</div>
        <div style={{ color: "var(--hub-muted)", fontSize: 14 }}>{responder.type}</div>
      </div>
      <div style={{ color: responder.status === "verified" ? "var(--hub-green)" : "var(--hub-blue)" }}>{responder.status}</div>
    </div>
  );
}
