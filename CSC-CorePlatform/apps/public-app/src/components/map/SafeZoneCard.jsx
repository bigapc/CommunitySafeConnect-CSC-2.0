export default function SafeZoneCard({ zone, onShowModal, onSelect, onReportIncident, isSelected = false }) {
  const openDirections = () => {
    if (!Array.isArray(zone.coordinates) || zone.coordinates.length !== 2) {
      return;
    }
    const [lat, lng] = zone.coordinates;
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, "_blank", "noopener,noreferrer");
  };

  const handleSelectZone = () => {
    if (onSelect) {
      onSelect(zone);
      return;
    }

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
        { label: "Navigate", primary: true, onClick: openDirections },
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
        border: isSelected ? "1px solid var(--navy)" : "1px solid var(--line)",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 12px 36px rgba(31, 58, 90, 0.18)")}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "var(--shadow)")}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontSize: 11, fontWeight: 700, borderRadius: 999, padding: "4px 8px", background: zone.status === "verified" ? "rgba(31, 143, 89, 0.12)" : "rgba(162, 106, 0, 0.12)", color: zone.status === "verified" ? "#1f8f59" : "#a26a00" }}>
            {zone.status === "verified" ? "Verified" : "Pending"}
          </span>
          {zone.isNearby ? (
            <span style={{ fontSize: 11, fontWeight: 700, borderRadius: 999, padding: "4px 8px", background: "rgba(31, 58, 90, 0.08)", color: "var(--navy)" }}>
              Nearby
            </span>
          ) : null}
          {zone.linkedIncidentCount ? (
            <span style={{ fontSize: 11, fontWeight: 700, borderRadius: 999, padding: "4px 8px", background: "rgba(214, 122, 134, 0.12)", color: "var(--accent)" }}>
              {zone.linkedIncidentCount} linked incidents
            </span>
          ) : null}
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <div>
          <div style={{ fontWeight: 700, color: "var(--navy)" }}>{zone.name}</div>
          <div style={{ color: "var(--muted)", fontSize: 14 }}>{zone.address}</div>
          <div style={{ color: "var(--green)", marginTop: 6, fontSize: 13 }}>{zone.hours}</div>
        </div>
        <div style={{ color: "var(--navy)", fontWeight: 700 }}>{zone.distanceLabel || zone.distance}</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: onReportIncident ? "1fr 1fr" : "1fr", gap: 8, marginTop: 14 }}>
        <button
          onClick={(event) => {
            event.stopPropagation();
            openDirections();
          }}
          style={{
            border: 0,
            borderRadius: 12,
            padding: "10px 12px",
            background: "var(--navy)",
            color: "#fff",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Directions
        </button>
        {onReportIncident ? (
          <button
            onClick={(event) => {
              event.stopPropagation();
              onReportIncident(zone);
            }}
            style={{
              border: "1px solid var(--line)",
              borderRadius: 12,
              padding: "10px 12px",
              background: "#fff",
              color: "var(--navy)",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Report Nearby Incident
          </button>
        ) : null}
      </div>
    </div>
  );
}
