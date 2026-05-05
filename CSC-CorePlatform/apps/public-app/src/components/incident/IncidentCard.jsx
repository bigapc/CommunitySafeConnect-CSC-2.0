export default function IncidentCard({ incident }) {
  const handleClick = () => {
    alert(`Incident Details\n\nType: ${incident.type}\nLocation: ${incident.location}\nStatus: ${incident.status}\n\nNotes: ${incident.notes}\n\nClick to view full details and response record.`);
  };

  return (
    <div onClick={handleClick} style={{ background: "#fff", borderRadius: 20, padding: 18, boxShadow: "var(--shadow)", marginBottom: 12, cursor: "pointer", transition: "all 0.3s ease", border: "1px solid var(--line)" }} onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 12px 36px rgba(31, 58, 90, 0.18)"} onMouseLeave={(e) => e.currentTarget.style.boxShadow = "var(--shadow)"} >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <strong style={{ color: "var(--navy)" }}>{incident.type}</strong>
        <span style={{ color: incident.status === "active" ? "var(--red)" : "var(--green)", fontWeight: "600" }}>{incident.status}</span>
      </div>
      <div style={{ color: "var(--muted)", fontSize: 14, marginTop: 6 }}>{incident.location}</div>
      <div style={{ color: "var(--muted)", fontSize: 13, marginTop: 8 }}>{incident.notes}</div>
    </div>
  );
}
