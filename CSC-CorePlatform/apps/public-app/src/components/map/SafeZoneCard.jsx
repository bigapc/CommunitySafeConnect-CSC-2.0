export default function SafeZoneCard({ zone, onNavigate, onShowModal }) {
  const handleSelectZone = () => {
    onShowModal(
      `Safe Zone: ${zone.name}`,
      <div>
        <div style={{ display: "grid", gap: 12, marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600 }}>ADDRESS</div>
            <div style={{ color: "var(--navy)", fontWeight: 600, marginTop: 4 }}>{zone.address}</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600 }}>HOURS</div>
            <div style={{ color: "var(--green)", fontWeight: 600, marginTop: 4 }}>{zone.hours}</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600 }}>DISTANCE</div>
            <div style={{ color: "var(--navy)", fontWeight: 600, marginTop: 4 }}>{zone.distance}</div>
          </div>
        </div>
        <p style={{ color: "var(--muted)", fontSize: 13, marginBottom: 0 }}>
          🎯 Verified safe community zone with professional monitoring and support services.
        </p>
      </div>,
      [
        { label: "Close", primary: false },
        { label: "Navigate", primary: true },
      ]
    );
  };

  return (
    <div
      onClick={handleSelectZone}
      style={{
        background: "#fff",
        borderRadius: 20,
        padding: 18,
        boxShadow: "var(--shadow)",
        marginBottom: 12,
        cursor: "pointer",
        transition: "all 0.3s ease",
        border: "1px solid var(--line)",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 12px 36px rgba(31, 58, 90, 0.18)")}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "var(--shadow)")}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <div>
          <div style={{ fontWeight: 700, color: "var(--navy)" }}>{zone.name}</div>
          <div style={{ color: "var(--muted)", fontSize: 14 }}>{zone.address}</div>
          <div style={{ color: "var(--green)", marginTop: 6, fontSize: 13 }}>{zone.hours}</div>
        </div>
        <div style={{ color: "var(--navy)", fontWeight: 700 }}>{zone.distance}</div>
      </div>
    </div>
  );
}
