export default function OrganizationCard({ org, integrationCount = 0, onOpen, onToggleStatus }) {
  return (
    <div style={{ background: "var(--hub-panel)", borderRadius: 18, padding: 16, boxShadow: "var(--hub-shadow)", marginBottom: 10, border: "1px solid var(--hub-line)" }}>
      <div style={{ fontWeight: 700 }}>{org.name}</div>
      <div style={{ color: "var(--hub-muted)", fontSize: 14 }}>{org.type}</div>
      <div style={{ color: "var(--hub-muted)", fontSize: 12, marginTop: 6 }}>Coordinator: {org.coordinator || "N/A"}</div>
      <div style={{ marginTop: 8, textTransform: "capitalize", color: org.status === "active" ? "var(--hub-green)" : "var(--hub-muted)", fontWeight: 700 }}>{org.status}</div>
      <div style={{ color: "var(--hub-muted)", fontSize: 12, marginTop: 6 }}>{integrationCount} integration events queued</div>
      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        <button
          onClick={() => onOpen?.(org)}
          style={{ border: 0, borderRadius: 10, padding: "8px 10px", background: "var(--hub-blue)", color: "#07131f", fontWeight: 700, cursor: "pointer" }}
        >
          View
        </button>
        <button
          onClick={() => onToggleStatus?.(org)}
          style={{ border: "1px solid var(--hub-line)", borderRadius: 10, padding: "8px 10px", background: "transparent", color: "var(--hub-text)", fontWeight: 600, cursor: "pointer" }}
        >
          {org.status === "active" ? "Suspend" : "Activate"}
        </button>
      </div>
    </div>
  );
}
