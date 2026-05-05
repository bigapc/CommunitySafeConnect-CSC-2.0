export default function MetricCard({ label, value, tone = "blue" }) {
  const tones = {
    blue: "var(--hub-blue)",
    green: "var(--hub-green)",
    red: "var(--hub-red)",
  };
  return (
    <div style={{ background: "var(--hub-panel)", borderRadius: 20, padding: 18, boxShadow: "var(--hub-shadow)" }}>
      <div style={{ color: "var(--hub-muted)", fontSize: 13 }}>{label}</div>
      <div style={{ color: tones[tone], fontWeight: 800, fontSize: 30, marginTop: 6 }}>{value}</div>
    </div>
  );
}
