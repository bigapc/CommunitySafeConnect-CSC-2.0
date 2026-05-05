const hubRoles = ["apc_admin", "apc_security_reviewer", "csc_supervisor"];

const quickTiles = [
  { label: "Active Alerts", value: "4", tone: "#d9545d" },
  { label: "Open Incidents", value: "7", tone: "#18355d" },
  { label: "Verified Responders", value: "18", tone: "#58b88a" },
  { label: "Safe Zones", value: "12", tone: "#18355d" },
];

const pendingItems = [
  "Northside Corridor SOS escalation",
  "Campus perimeter alert follow-up",
  "Responder verification queue: 2 pending",
];

export default function ControlHub({ role, onRoleChange }) {
  const canAccess = hubRoles.includes(role);

  if (!canAccess) {
    return (
      <div style={{ background: "#fff", borderRadius: 24, padding: 22, boxShadow: "var(--shadow)" }}>
        <h1 style={{ marginTop: 0, color: "var(--navy)" }}>Access Restricted</h1>
        <p style={{ color: "var(--muted)", lineHeight: 1.6 }}>
          The CSC Control Hub route is limited to Admin and CSC-Supervisor roles.
        </p>
        <p style={{ color: "var(--muted)", fontSize: 13 }}>Current role: {role}</p>
        <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
          <button
            onClick={() => onRoleChange("apc_admin")}
            style={{ border: 0, borderRadius: 14, padding: "12px 14px", background: "var(--navy)", color: "#fff", fontWeight: 700, cursor: "pointer" }}
          >
            Switch to Admin (Demo)
          </button>
          <button
            onClick={() => onRoleChange("csc_supervisor")}
            style={{ border: "1px solid var(--line)", borderRadius: 14, padding: "12px 14px", background: "#fff", color: "var(--navy)", fontWeight: 700, cursor: "pointer" }}
          >
            Switch to CSC-Supervisor (Demo)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ background: "#fff", borderRadius: 24, padding: 20, boxShadow: "var(--shadow)", marginBottom: 14 }}>
        <div style={{ color: "var(--muted)", fontSize: 12 }}>Admin Route</div>
        <h1 style={{ margin: "6px 0 2px", color: "var(--navy)" }}>CSC Control Hub</h1>
        <div style={{ color: "var(--muted)", fontSize: 14 }}>Internal operations view on the same app route.</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
        {quickTiles.map((tile) => (
          <div key={tile.label} style={{ background: "#fff", borderRadius: 18, padding: 16, boxShadow: "var(--shadow)" }}>
            <div style={{ color: "var(--muted)", fontSize: 13 }}>{tile.label}</div>
            <div style={{ color: tile.tone, fontWeight: 800, fontSize: 24, marginTop: 4 }}>{tile.value}</div>
          </div>
        ))}
      </div>

      <div style={{ background: "#fff", borderRadius: 18, padding: 16, boxShadow: "var(--shadow)" }}>
        <h2 style={{ marginTop: 0, color: "var(--navy)", fontSize: 18 }}>Priority Queue</h2>
        {pendingItems.map((item) => (
          <div key={item} style={{ padding: "10px 0", borderBottom: "1px solid var(--line)", color: "var(--text)" }}>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
