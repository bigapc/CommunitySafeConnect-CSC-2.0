export default function IncidentRow({ incident, responders = [], onAction }) {
  const statusColor = {
    active: "var(--hub-red)",
    acknowledged: "var(--hub-blue)",
    resolved: "var(--hub-green)",
    archived: "var(--hub-muted)",
  };

  const availableResponders = responders.filter((responder) => responder.status === "verified");

  return (
    <div style={{ padding: 14, background: "var(--hub-panel)", borderRadius: 16, marginBottom: 10, border: "1px solid var(--hub-line)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr .8fr .8fr", gap: 12 }}>
        <div>
          <div style={{ fontWeight: 700 }}>{incident.title}</div>
          <div style={{ color: "var(--hub-muted)", fontSize: 13 }}>{incident.location}</div>
          <div style={{ color: "var(--hub-muted)", fontSize: 12, marginTop: 4 }}>ID: {incident.id}</div>
        </div>
        <div>{incident.assignedTo || "Unassigned"}</div>
        <div style={{ color: incident.priority === "critical" ? "var(--hub-red)" : "var(--hub-blue)", fontWeight: 700 }}>{incident.priority}</div>
        <div style={{ color: statusColor[incident.status] || "var(--hub-text)", fontWeight: 700 }}>{incident.status}</div>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
        <button
          onClick={() => onAction?.("acknowledge", incident)}
          style={{ border: 0, borderRadius: 10, padding: "8px 10px", background: "var(--hub-blue)", color: "#07131f", fontWeight: 700, cursor: "pointer" }}
        >
          Acknowledge
        </button>
        <button
          onClick={() => onAction?.("resolve", incident)}
          style={{ border: 0, borderRadius: 10, padding: "8px 10px", background: "var(--hub-green)", color: "#07131f", fontWeight: 700, cursor: "pointer" }}
        >
          Resolve
        </button>
        <button
          onClick={() => onAction?.("escalate", incident)}
          style={{ border: "1px solid var(--hub-line)", borderRadius: 10, padding: "8px 10px", background: "transparent", color: "var(--hub-text)", fontWeight: 600, cursor: "pointer" }}
        >
          Escalate
        </button>
        <select
          defaultValue=""
          onChange={(event) => {
            if (event.target.value) {
              onAction?.("assign", incident, event.target.value);
              event.target.value = "";
            }
          }}
          style={{ borderRadius: 10, border: "1px solid var(--hub-line)", background: "var(--hub-panel-2)", color: "var(--hub-text)", padding: "8px 10px" }}
        >
          <option value="">Assign responder</option>
          {availableResponders.map((responder) => (
            <option key={responder.id} value={responder.name}>
              {responder.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
