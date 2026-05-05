export default function IncidentCard({ incident, onShowModal }) {
  const handleClick = () => {
    onShowModal(
      `Incident: ${incident.type}`,
      <div>
        <div style={{ display: "grid", gap: 12, marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600 }}>STATUS</div>
            <div style={{ color: incident.status === "active" ? "var(--red)" : "var(--green)", fontWeight: 600, marginTop: 4 }}>
              {incident.status.toUpperCase()}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600 }}>LOCATION</div>
            <div style={{ color: "var(--navy)", fontWeight: 600, marginTop: 4 }}>{incident.location}</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600 }}>NOTES</div>
            <div style={{ color: "var(--text)", marginTop: 4 }}>{incident.notes}</div>
          </div>
        </div>
      </div>,
      [{ label: "Close", primary: true }]
    );
  };

  return (
    <div
      onClick={handleClick}
      style={{
        background: "#fff",
        borderRadius: 20,
        padding: 18,
        boxShadow: "var(--shadow)",
        marginBottom: 12,
        cursor: "pointer",
        transition: "all 0.3s ease",
        border: "1px solid var(--line)",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 12px 36px rgba(31, 58, 90, 0.18)")}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "var(--shadow)")}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <strong style={{ color: "var(--navy)" }}>{incident.type}</strong>
        <span style={{ color: incident.status === "active" ? "var(--red)" : "var(--green)", fontWeight: "600" }}>
          {incident.status}
        </span>
      </div>
      <div style={{ color: "var(--muted)", fontSize: 14, marginTop: 6 }}>{incident.location}</div>
      <div style={{ color: "var(--muted)", fontSize: 13, marginTop: 8 }}>{incident.notes}</div>
    </div>
  );
}
