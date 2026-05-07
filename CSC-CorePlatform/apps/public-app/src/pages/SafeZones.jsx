import { useMemo, useState } from "react";
import SectionHeader from "../components/ui/SectionHeader";
import SafeZoneCard from "../components/map/SafeZoneCard";
import LiveSafeZoneMap from "../components/map/LiveSafeZoneMap";
import { mockSafeZones } from "../data/mockSafeZones";

export default function SafeZones({ onShowModal }) {
  const [filter, setFilter] = useState("all");
  const [userPosition, setUserPosition] = useState(null);
  const [selectedZone, setSelectedZone] = useState(null);

  const filteredZones = useMemo(
    () => (filter === "all" ? mockSafeZones : mockSafeZones.filter((zone) => zone.type === filter)),
    [filter]
  );
  const zoneTypes = ["all", "School", "Hospital", "Police Station", "Community Center"];

  const locateUser = () => {
    if (!navigator.geolocation) {
      onShowModal(
        "Location Unavailable",
        <p style={{ color: "var(--muted)" }}>Your browser does not support geolocation. You can still select a safe zone and get directions.</p>,
        [{ label: "Close", primary: true }]
      );
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserPosition([position.coords.latitude, position.coords.longitude]);
      },
      () => {
        onShowModal(
          "Location Permission Needed",
          <p style={{ color: "var(--muted)" }}>Please allow location access to center the map around your position.</p>,
          [{ label: "Close", primary: true }]
        );
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const openDirections = (zone) => {
    if (!Array.isArray(zone.coordinates) || zone.coordinates.length !== 2) {
      return;
    }
    const [lat, lng] = zone.coordinates;
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, "_blank", "noopener,noreferrer");
  };

  const handleSelectZone = (zone) => {
    setSelectedZone(zone);
    onShowModal(
      `${zone.name}`,
      <div>
        <div style={{ marginBottom: 16 }}>
          <p style={{ color: "var(--muted)", marginBottom: 8 }}>
            <strong>Type:</strong> {zone.type}
          </p>
          <p style={{ color: "var(--muted)", marginBottom: 8 }}>
            <strong>Distance:</strong> {zone.distance}
          </p>
          <p style={{ color: "var(--muted)", marginBottom: 8 }}>
            <strong>Address:</strong> {zone.address || "123 Main St"}
          </p>
          <p style={{ color: "var(--muted)", marginBottom: 8 }}>
            <strong>Hours:</strong> {zone.hours || "24/7"}
          </p>
          <p style={{ color: "var(--muted)", marginBottom: 8 }}>
            <strong>Contact:</strong> {zone.phone || "N/A"}
          </p>
          <p style={{ color: "var(--green)", fontWeight: 600, marginBottom: 8 }}>
            ✓ Verified & Secure
          </p>
        </div>
        <p style={{ color: "var(--muted)", fontSize: 13, marginBottom: 12 }}>
          This location has been verified by our Command Center and is recognized as a safe zone in the CommunitySafeConnect network.
        </p>
      </div>,
      [
        { label: "Close", primary: false },
        { label: "Get Directions", primary: true, onClick: () => openDirections(zone) },
      ]
    );
  };

  return (
    <div>
      <SectionHeader title="Verified Safe Zones" />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ color: "var(--muted)", fontSize: 13 }}>Live map with {filteredZones.length} verified zones</div>
        <button
          onClick={locateUser}
          style={{
            border: 0,
            borderRadius: 12,
            padding: "8px 12px",
            background: "var(--navy)",
            color: "#fff",
            fontWeight: 600,
            cursor: "pointer",
            fontSize: 12,
          }}
        >
          Use My Location
        </button>
      </div>
      <LiveSafeZoneMap
        userPosition={userPosition}
        zones={filteredZones}
        selectedZone={selectedZone}
        onSelectZone={handleSelectZone}
      />

      <div style={{ marginBottom: 16, display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8 }}>
        {zoneTypes.map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            style={{
              border: 0,
              borderRadius: 20,
              padding: "8px 14px",
              background: filter === type ? "var(--navy)" : "#fff",
              color: filter === type ? "#fff" : "var(--navy)",
              fontWeight: 600,
              cursor: "pointer",
              whiteSpace: "nowrap",
              boxShadow: "var(--shadow)",
            }}
          >
            {type === "all" ? "All Zones" : type}
          </button>
        ))}
      </div>

      {filteredZones.map((zone) => (
        <SafeZoneCard key={zone.id} zone={zone} onShowModal={onShowModal} onSelect={handleSelectZone} />
      ))}
    </div>
  );
}
