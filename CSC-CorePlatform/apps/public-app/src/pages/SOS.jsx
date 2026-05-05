export default function SOS() {
  return (
    <div style={{ background: "#fff", borderRadius: 28, padding: 24, boxShadow: "var(--shadow)" }}>
      <h1 style={{ marginTop: 0, color: "var(--navy)" }}>We're with you.</h1>
      <p style={{ color: "var(--muted)" }}>Alert sent. Stay where you are if safe.</p>
      <div style={{ display: "grid", gap: 12, marginTop: 20 }}>
        <button style={{ border: 0, borderRadius: 18, padding: 16, background: "var(--red)", color: "#fff", fontWeight: 700 }}>Hold to Cancel Alert</button>
        <button style={{ border: 0, borderRadius: 18, padding: 16, background: "var(--navy)", color: "#fff", fontWeight: 700 }}>Call Emergency Services</button>
        <button style={{ border: "1px solid var(--line)", borderRadius: 18, padding: 16, background: "#fff", color: "var(--navy)", fontWeight: 700 }}>Message Safety Circle</button>
      </div>
    </div>
  );
}
