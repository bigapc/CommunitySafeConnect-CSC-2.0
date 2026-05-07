import { useMemo, useState } from "react";

export default function IncidentRecords({ incidents = [], exportIncidentsCsv, updateIncident, addIncidentEvent, showModal }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) {
      return incidents;
    }
    return incidents.filter((incident) =>
      [incident.id, incident.title, incident.location, incident.status].join(" ").toLowerCase().includes(needle)
    );
  }, [incidents, query]);

  return (
    <div>
      <h2>Incident Records</h2>
      <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by ID, location, status"
          style={{
            flex: 1,
            borderRadius: 10,
            border: "1px solid var(--hub-line)",
            background: "var(--hub-panel)",
            color: "var(--hub-text)",
            padding: "10px 12px",
          }}
        />
        <button
          onClick={exportIncidentsCsv}
          style={{ border: 0, borderRadius: 12, padding: "10px 14px", background: "var(--hub-blue)", color: "#07131f", fontWeight: 700, cursor: "pointer" }}
        >
          Export CSV
        </button>
      </div>

      {filtered.map((incident) => (
        <div key={incident.id} style={{ background: "var(--hub-panel)", borderRadius: 18, padding: 16, boxShadow: "var(--hub-shadow)", marginBottom: 10, border: "1px solid var(--hub-line)" }}>
          <div style={{ fontWeight: 700 }}>{incident.title}</div>
          <div style={{ color: "var(--hub-muted)", marginTop: 6 }}>{incident.location}</div>
          <div style={{ color: "var(--hub-muted)", fontSize: 12, marginTop: 4 }}>
            {incident.id} - {incident.status} - Priority: {incident.priority}
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
            <button
              onClick={exportIncidentsCsv}
              style={{ border: 0, borderRadius: 12, padding: "10px 14px", background: "var(--hub-blue)", color: "#07131f", fontWeight: 700, cursor: "pointer" }}
            >
              Export
            </button>
            <button
              onClick={() => {
                updateIncident(incident.id, { status: "archived" });
                addIncidentEvent(incident.id, "Incident record archived.");
              }}
              style={{ border: "1px solid var(--hub-line)", borderRadius: 12, padding: "10px 14px", background: "transparent", color: "var(--hub-text)", cursor: "pointer" }}
            >
              Archive
            </button>
            <button
              onClick={() =>
                showModal(
                  "Escalate Record",
                  <p style={{ color: "var(--hub-muted)" }}>Escalate this incident record for immediate executive review?</p>,
                  [
                    { label: "Cancel", primary: false },
                    {
                      label: "Escalate",
                      primary: true,
                      onClick: () => {
                        updateIncident(incident.id, { priority: "critical", status: "acknowledged" });
                        addIncidentEvent(incident.id, "Incident record escalated from records module.");
                      },
                    },
                  ]
                )
              }
              style={{ border: "1px solid var(--hub-line)", borderRadius: 12, padding: "10px 14px", background: "transparent", color: "var(--hub-text)", cursor: "pointer" }}
            >
              Escalate
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
