export default function IncidentTimeline() {
  const updates = [
    "20:30 - SOS triggered",
    "20:31 - Dispatcher acknowledged",
    "20:33 - Responder Unit 3 assigned",
  ];
  return (
    <div style={{ background: "var(--hub-panel)", borderRadius: 20, padding: 18, boxShadow: "var(--hub-shadow)" }}>
      <h3 style={{ marginTop: 0 }}>Incident Timeline</h3>
      {updates.map((item) => (
        <div key={item} style={{ padding: "10px 0", borderBottom: "1px solid var(--hub-line)", color: "var(--hub-muted)" }}>{item}</div>
      ))}
    </div>
  );
}
