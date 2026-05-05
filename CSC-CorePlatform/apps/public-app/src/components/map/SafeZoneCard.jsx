export default function SafeZoneCard({ zone, onNavigate }) {
  const handleSelectZone = () => {
    alert(`Selected Safe Zone: ${zone.name}\n\n${zone.address}\nOpen Hours: ${zone.hours}\nDistance: ${zone.distance}\n\nNavigating to this location...`);
  };

  return (
    <div onClick={handleSelectZone} style={{ background: "#fff", borderRadius: 20, padding: 18, boxShadow: "var(--shadow)", marginBottom: 12, cursor: "pointer", transition: "all 0.3s ease", border: "1px solid var(--line)" }} onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 12px 36px rgba(31, 58, 90, 0.18)"} onMouseLeave={(e) => e.currentTarget.style.boxShadow = "var(--shadow)"} >
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
