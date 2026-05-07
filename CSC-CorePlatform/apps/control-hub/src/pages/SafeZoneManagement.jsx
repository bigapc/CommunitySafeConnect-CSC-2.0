import ZoneRow from "../components/safezones/ZoneRow";

export default function SafeZoneManagement({ zones = [], setZones, showModal }) {
  const handleToggleStatus = (zone) => {
    setZones((prev) =>
      prev.map((item) => (item.id === zone.id ? { ...item, status: item.status === "verified" ? "pending" : "verified" } : item))
    );
  };

  const handleOpenMap = (zone) => {
    if (!Array.isArray(zone.coordinates) || zone.coordinates.length !== 2) {
      return;
    }
    const [lat, lng] = zone.coordinates;
    window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div>
      <h2>Safe Zone Management</h2>
      {zones.map((zone) => (
        <ZoneRow
          key={zone.id}
          zone={zone}
          onOpenMap={handleOpenMap}
          onToggleStatus={(item) => {
            showModal(
              "Update Zone Status",
              <p style={{ color: "var(--hub-muted)" }}>Change status for {item.name}?</p>,
              [
                { label: "Cancel", primary: false },
                { label: "Confirm", primary: true, onClick: () => handleToggleStatus(item) },
              ]
            );
          }}
        />
      ))}
    </div>
  );
}
