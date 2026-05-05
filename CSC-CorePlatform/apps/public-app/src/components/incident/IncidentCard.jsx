export default function IncidentCard({ incident }) {
  return (
    <div style={{ background: "#fff", borderRadius: 20, padding: 18, boxShadow: "var(--shadow)", marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <strong>{incident.type}</strong>
        <span style={{ color: incident.status === "active" ? "var(--red)" : "var(--green)" }}>{incident.status}</span>
      </div>
      <div style={{ color: "var(--muted)", fontSize: 14, marginTop: 6 }}>{incident.location}</div>
      <div style={{ color: "var(--muted)", fontSize: 13, marginTop: 8 }}>{incident.notes}</div>
    </div>
  );
}
