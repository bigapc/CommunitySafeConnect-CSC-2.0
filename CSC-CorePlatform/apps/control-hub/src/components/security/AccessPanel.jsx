export default function AccessPanel() {
  return (
    <div style={{ background: "var(--hub-panel)", borderRadius: 20, padding: 18, boxShadow: "var(--hub-shadow)" }}>
      <h3 style={{ marginTop: 0 }}>Access Control</h3>
      <p style={{ color: "var(--hub-muted)", lineHeight: 1.6 }}>
        Records are preserved by default. Supervisory roles are view-first. Restricted access, sensitive review, and exceptional actions require Armstrong Pack Company senior security coordination.
      </p>
      <div style={{ display: "flex", gap: 10 }}>
        <button style={{ border: 0, borderRadius: 14, padding: "12px 16px", background: "var(--hub-blue)", color: "#07131f", fontWeight: 700 }}>Request Review</button>
        <button style={{ border: "1px solid var(--hub-line)", borderRadius: 14, padding: "12px 16px", background: "transparent", color: "var(--hub-text)" }}>Export Audit</button>
      </div>
    </div>
  );
}
