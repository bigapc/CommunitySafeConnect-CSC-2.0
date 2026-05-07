export default function ResponderCard({ responder, onVerify, onSuspend }) {
  return (
    <div style={{ background: "var(--hub-panel)", borderRadius: 18, padding: 16, boxShadow: "var(--hub-shadow)", marginBottom: 10, display: "flex", justifyContent: "space-between", border: "1px solid var(--hub-line)" }}>
      <div>
        <div style={{ fontWeight: 700 }}>{responder.name}</div>
        <div style={{ color: "var(--hub-muted)", fontSize: 14 }}>{responder.type}</div>
        {responder.lastSeen ? <div style={{ color: "var(--hub-muted)", fontSize: 12, marginTop: 4 }}>Last seen: {responder.lastSeen}</div> : null}
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ color: responder.status === "verified" ? "var(--hub-green)" : "var(--hub-blue)", fontWeight: 700, textTransform: "capitalize" }}>
          {responder.status}
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
          <button
            onClick={() => onVerify?.(responder)}
            style={{ border: 0, borderRadius: 10, padding: "8px 10px", background: "var(--hub-green)", color: "#07131f", fontWeight: 700, cursor: "pointer" }}
          >
            Verify
          </button>
          <button
            onClick={() => onSuspend?.(responder)}
            style={{ border: "1px solid var(--hub-line)", borderRadius: 10, padding: "8px 10px", background: "transparent", color: "var(--hub-text)", fontWeight: 600, cursor: "pointer" }}
          >
            Suspend
          </button>
        </div>
      </div>
    </div>
  );
}
