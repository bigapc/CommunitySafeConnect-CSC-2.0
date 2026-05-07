export default function IncidentTimeline({ incident }) {
  const updates = incident?.timeline || [];

  return (
    <div style={{ background: "var(--hub-panel)", borderRadius: 20, padding: 18, boxShadow: "var(--hub-shadow)" }}>
      <h3 style={{ marginTop: 0 }}>Incident Timeline</h3>
      <div style={{ color: "var(--hub-muted)", fontSize: 13, marginBottom: 10 }}>
        {incident ? `${incident.id} - ${incident.title}` : "Select an incident from the console"}
      </div>
      {updates.length ? (
        updates.map((item) => (
          <div key={item.id} style={{ padding: "10px 0", borderBottom: "1px solid var(--hub-line)" }}>
            <div style={{ fontSize: 12, color: "var(--hub-muted)", marginBottom: 3 }}>{new Date(item.at).toLocaleString()}</div>
            <div style={{ color: "var(--hub-text)" }}>{item.message}</div>
          </div>
        ))
      ) : (
        <div style={{ color: "var(--hub-muted)" }}>No timeline entries yet.</div>
      )}
    </div>
  );
}
