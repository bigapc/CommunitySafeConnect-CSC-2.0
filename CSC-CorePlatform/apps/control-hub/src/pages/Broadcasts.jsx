import { mockBroadcasts } from "../data/mockBroadcasts";

export default function Broadcasts() {
  return (
    <div>
      <h2>Broadcasts</h2>
      {mockBroadcasts.map((broadcast) => (
        <div key={broadcast.id} style={{ background: "var(--hub-panel)", borderRadius: 18, padding: 16, boxShadow: "var(--hub-shadow)", marginBottom: 10 }}>
          <div style={{ fontWeight: 700 }}>{broadcast.title}</div>
          <div style={{ color: "var(--hub-muted)", fontSize: 14, marginTop: 6 }}>{broadcast.audience}</div>
        </div>
      ))}
      <button style={{ border: 0, borderRadius: 14, padding: "12px 16px", background: "var(--hub-blue)", color: "#07131f", fontWeight: 700 }}>Create Broadcast</button>
    </div>
  );
}
