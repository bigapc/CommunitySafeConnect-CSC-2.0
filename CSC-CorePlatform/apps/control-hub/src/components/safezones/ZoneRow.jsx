export default function ZoneRow({ zone, onToggleStatus, onOpenMap }) {
  return (
    <div style={{ background: "var(--hub-panel)", borderRadius: 16, padding: 16, boxShadow: "var(--hub-shadow)", marginBottom: 10, border: "1px solid var(--hub-line)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontWeight: 700 }}>{zone.name}</div>
          {zone.type ? <div style={{ color: "var(--hub-muted)", fontSize: 13 }}>{zone.type}</div> : null}
        </div>
        <strong style={{ color: zone.status === "verified" ? "var(--hub-green)" : "var(--hub-blue)", textTransform: "capitalize" }}>{zone.status}</strong>
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        <button
          onClick={() => onOpenMap?.(zone)}
          style={{ border: 0, borderRadius: 10, padding: "8px 10px", background: "var(--hub-blue)", color: "#07131f", fontWeight: 700, cursor: "pointer" }}
        >
          Open Map
        </button>
        <button
          onClick={() => onToggleStatus?.(zone)}
          style={{ border: "1px solid var(--hub-line)", borderRadius: 10, padding: "8px 10px", background: "transparent", color: "var(--hub-text)", fontWeight: 600, cursor: "pointer" }}
        >
          {zone.status === "verified" ? "Mark Pending" : "Verify"}
        </button>
      </div>
    </div>
  );
}
