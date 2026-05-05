export default function ZoneRow({ zone }) {
  return (
    <div style={{ background: "var(--hub-panel)", borderRadius: 16, padding: 16, boxShadow: "var(--hub-shadow)", marginBottom: 10, display: "flex", justifyContent: "space-between" }}>
      <div>{zone.name}</div>
      <strong style={{ color: zone.status === "verified" ? "var(--hub-green)" : "var(--hub-blue)" }}>{zone.status}</strong>
    </div>
  );
}
