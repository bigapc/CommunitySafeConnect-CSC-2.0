export default function SafeZoneCard({ zone }) {
  return (
    <div style={{ background: "#fff", borderRadius: 20, padding: 18, boxShadow: "var(--shadow)", marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <div>
          <div style={{ fontWeight: 700 }}>{zone.name}</div>
          <div style={{ color: "var(--muted)", fontSize: 14 }}>{zone.address}</div>
          <div style={{ color: "var(--green)", marginTop: 6, fontSize: 13 }}>{zone.hours}</div>
        </div>
        <div style={{ color: "var(--navy)", fontWeight: 700 }}>{zone.distance}</div>
      </div>
    </div>
  );
}
