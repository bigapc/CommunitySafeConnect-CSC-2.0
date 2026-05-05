export default function IncidentRow({ incident }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr .8fr .8fr", gap: 12, padding: "14px 16px", background: "var(--hub-panel)", borderRadius: 16, marginBottom: 10 }}>
      <div>
        <div style={{ fontWeight: 700 }}>{incident.title}</div>
        <div style={{ color: "var(--hub-muted)", fontSize: 13 }}>{incident.location}</div>
      </div>
      <div>{incident.assignedTo}</div>
      <div style={{ color: incident.priority === "critical" ? "var(--hub-red)" : "var(--hub-blue)" }}>{incident.priority}</div>
      <div>{incident.status}</div>
    </div>
  );
}
