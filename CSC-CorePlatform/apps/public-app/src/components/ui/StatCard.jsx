export default function StatCard({ label, value, tone = "navy" }) {
  const colors = {
    navy: ["var(--navy)", "#eef3fb"],
    green: ["var(--green)", "#edf8f3"],
    red: ["var(--red)", "#fff1f2"],
  };
  const [fg, bg] = colors[tone];
  return (
    <div style={{ background: bg, borderRadius: 20, padding: 18 }}>
      <div style={{ color: "var(--muted)", fontSize: 13 }}>{label}</div>
      <div style={{ color: fg, fontWeight: 800, fontSize: 24, marginTop: 4 }}>{value}</div>
    </div>
  );
}
