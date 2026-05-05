import { mockHubIncidents } from "../data/mockIncidents";

export default function IncidentRecords() {
  return (
    <div>
      <h2>Incident Records</h2>
      {mockHubIncidents.map((incident) => (
        <div key={incident.id} style={{ background: "var(--hub-panel)", borderRadius: 18, padding: 16, boxShadow: "var(--hub-shadow)", marginBottom: 10 }}>
          <div style={{ fontWeight: 700 }}>{incident.title}</div>
          <div style={{ color: "var(--hub-muted)", marginTop: 6 }}>{incident.location}</div>
          <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
            <button style={{ border: 0, borderRadius: 12, padding: "10px 14px", background: "var(--hub-blue)", color: "#07131f", fontWeight: 700 }}>Export</button>
            <button style={{ border: "1px solid var(--hub-line)", borderRadius: 12, padding: "10px 14px", background: "transparent", color: "var(--hub-text)" }}>Archive</button>
            <button style={{ border: "1px solid var(--hub-line)", borderRadius: 12, padding: "10px 14px", background: "transparent", color: "var(--hub-text)" }}>Escalate</button>
          </div>
        </div>
      ))}
    </div>
  );
}
