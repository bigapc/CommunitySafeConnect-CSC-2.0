import { useEffect, useMemo, useState } from "react";
import SectionHeader from "../components/ui/SectionHeader";
import SafeZoneCard from "../components/map/SafeZoneCard";
import LiveSafeZoneMap from "../components/map/LiveSafeZoneMap";
import { mockSafeZones } from "../data/mockSafeZones";

const hubStateStorageKey = "csc-control-hub-state-v1";
const zonePreferencesKey = "csc-public-safe-zone-preferences-v1";

function getCoordinateKey(coordinates = []) {
  if (!Array.isArray(coordinates) || coordinates.length !== 2) {
    return null;
  }

  return `${coordinates[0].toFixed(4)}:${coordinates[1].toFixed(4)}`;
}

function readZonePreferences() {
  if (typeof window === "undefined") {
    return { filter: "all", sort: "recommended" };
  }

  try {
    const raw = window.localStorage.getItem(zonePreferencesKey);
    if (!raw) {
      return { filter: "all", sort: "recommended" };
    }
    const parsed = JSON.parse(raw);
    return {
      filter: parsed.filter || "all",
      sort: parsed.sort || "recommended",
    };
  } catch {
    return { filter: "all", sort: "recommended" };
  }
}

function readMergedZones() {
  if (typeof window === "undefined") {
    return mockSafeZones;
  }

  try {
    const raw = window.localStorage.getItem(hubStateStorageKey);
    if (!raw) {
      return mockSafeZones;
    }

    const parsed = JSON.parse(raw);
    const hubZones = Array.isArray(parsed.zones) ? parsed.zones : [];
    const hubZoneByCoordinates = new Map(
      hubZones
        .filter((zone) => getCoordinateKey(zone.coordinates))
        .map((zone) => [getCoordinateKey(zone.coordinates), zone])
    );

    return mockSafeZones.map((zone) => {
      const hubZone = hubZoneByCoordinates.get(getCoordinateKey(zone.coordinates));
      if (!hubZone) {
        return zone;
      }

      return {
        ...zone,
        status: hubZone.status || zone.status,
        hubLabel: hubZone.name && hubZone.name !== zone.name ? hubZone.name : undefined,
      };
    });
  } catch {
    return mockSafeZones;
  }
}

function toRadians(value) {
  return (value * Math.PI) / 180;
}

function calculateDistanceMiles(from, to) {
  if (!Array.isArray(from) || !Array.isArray(to) || from.length !== 2 || to.length !== 2) {
    return null;
  }

  const earthRadiusMiles = 3958.8;
  const [fromLat, fromLng] = from;
  const [toLat, toLng] = to;
  const deltaLat = toRadians(toLat - fromLat);
  const deltaLng = toRadians(toLng - fromLng);
  const startLat = toRadians(fromLat);
  const endLat = toRadians(toLat);

  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(startLat) * Math.cos(endLat) * Math.sin(deltaLng / 2) ** 2;

  return earthRadiusMiles * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatDistance(distanceMiles, fallbackLabel) {
  if (typeof distanceMiles !== "number") {
    return fallbackLabel;
  }

  if (distanceMiles < 0.2) {
    return `${Math.round(distanceMiles * 5280)} ft`;
  }

  return `${distanceMiles.toFixed(1)} mi`;
}

export default function SafeZones({ onShowModal, onCreateIncident, onNavigate, incidents = [] }) {
  const initialPreferences = readZonePreferences();
  const [filter, setFilter] = useState(initialPreferences.filter);
  const [sort, setSort] = useState(initialPreferences.sort);
  const [userPosition, setUserPosition] = useState(null);
  const [selectedZone, setSelectedZone] = useState(null);
  const [zones, setZones] = useState(readMergedZones);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(zonePreferencesKey, JSON.stringify({ filter, sort }));
  }, [filter, sort]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const syncZones = () => setZones(readMergedZones());
    const onStorage = (event) => {
      if (event.key === hubStateStorageKey) {
        syncZones();
      }
    };

    syncZones();
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const zoneTypes = useMemo(() => ["all", "nearby", ...new Set(zones.map((zone) => zone.type))], [zones]);

  const filteredZones = useMemo(() => {
    const withMetrics = zones.map((zone) => {
      const distanceMiles = userPosition ? calculateDistanceMiles(userPosition, zone.coordinates) : null;
      const linkedIncidentCount = incidents.filter(
        (incident) => incident.safeZoneName === zone.name || incident.location === zone.name
      ).length;

      return {
        ...zone,
        distanceMiles,
        distanceLabel: formatDistance(distanceMiles, zone.distance),
        linkedIncidentCount,
        isNearby: typeof distanceMiles === "number" ? distanceMiles <= 1.5 : false,
      };
    });

    const byFilter = withMetrics.filter((zone) => {
      if (filter === "all") {
        return true;
      }
      if (filter === "nearby") {
        return zone.isNearby;
      }
      return zone.type === filter;
    });

    return [...byFilter].sort((left, right) => {
      if (sort === "alphabetical") {
        return left.name.localeCompare(right.name);
      }
      if (sort === "nearest") {
        if (typeof left.distanceMiles !== "number" && typeof right.distanceMiles !== "number") {
          return left.name.localeCompare(right.name);
        }
        if (typeof left.distanceMiles !== "number") {
          return 1;
        }
        if (typeof right.distanceMiles !== "number") {
          return -1;
        }
        return left.distanceMiles - right.distanceMiles;
      }

      if (left.isNearby !== right.isNearby) {
        return left.isNearby ? -1 : 1;
      }
      if (left.status !== right.status) {
        return left.status === "verified" ? -1 : 1;
      }
      return left.name.localeCompare(right.name);
    });
  }, [filter, incidents, sort, userPosition, zones]);

  const nearbyZoneIds = useMemo(
    () => filteredZones.filter((zone) => zone.isNearby).map((zone) => zone.id),
    [filteredZones]
  );

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
          {typeof zone.linkedIncidentCount === "number" ? (
            <p style={{ color: "var(--muted)", marginBottom: 8 }}>
              <strong>Linked incidents:</strong> {zone.linkedIncidentCount}
            </p>
          ) : null}
          <p style={{ color: "var(--muted)", marginBottom: 8 }}>
            <strong>Address:</strong> {zone.address || "123 Main St"}
          </p>
          <p style={{ color: "var(--muted)", marginBottom: 8 }}>
            <strong>Hours:</strong> {zone.hours || "24/7"}
          </p>
          <p style={{ color: "var(--muted)", marginBottom: 8 }}>
            <strong>Contact:</strong> {zone.phone || "N/A"}
          </p>
          <p style={{ color: zone.status === "verified" ? "var(--green)" : "#a26a00", fontWeight: 600, marginBottom: 8 }}>
            {zone.status === "verified" ? "✓ Verified & Secure" : "Pending control-hub review"}
          </p>
        </div>
        <p style={{ color: "var(--muted)", fontSize: 13, marginBottom: 12 }}>
          This location has been verified by our Command Center and is recognized as a safe zone in the CommunitySafeConnect network.
        </p>
        {zone.hubLabel ? (
          <p style={{ color: "var(--muted)", fontSize: 13, marginBottom: 0 }}>
            Hub record: {zone.hubLabel}
          </p>
        ) : null}
      </div>,
      [
        { label: "Close", primary: false },
        {
          label: "Report Nearby Incident",
          primary: false,
          onClick: () => {
            onCreateIncident?.({
              type: "Safety concern",
              status: "submitted",
              location: zone.name,
              notes: `Incident reported near safe zone ${zone.name} at ${zone.address}.`,
              safeZoneId: zone.id,
              safeZoneName: zone.name,
              safeZoneType: zone.type,
            });
            onShowModal(
              "Incident Linked To Safe Zone",
              <div>
                <p style={{ color: "var(--muted)", marginBottom: 10 }}>
                  Your report has been attached to {zone.name} for faster dispatcher context.
                </p>
                <p style={{ color: "var(--navy)", fontWeight: 700, margin: 0 }}>Location: {zone.name}</p>
              </div>,
              [{ label: "Open Incident Log", primary: true, onClick: () => onNavigate?.("incidents") }]
            );
          },
        },
        { label: "Get Directions", primary: true, onClick: () => openDirections(zone) },
      ]
    );
  };

  return (
    <div>
      <SectionHeader title="Verified Safe Zones" />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ color: "var(--muted)", fontSize: 13 }}>Live map with {filteredZones.length} visible zones</div>
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

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 12 }}>
        <div style={{ background: "#fff", borderRadius: 16, padding: 14, boxShadow: "var(--shadow)" }}>
          <div style={{ color: "var(--muted)", fontSize: 12 }}>Nearby Zones</div>
          <div style={{ color: "var(--navy)", fontSize: 24, fontWeight: 800 }}>{filteredZones.filter((zone) => zone.isNearby).length}</div>
        </div>
        <div style={{ background: "#fff", borderRadius: 16, padding: 14, boxShadow: "var(--shadow)" }}>
          <div style={{ color: "var(--muted)", fontSize: 12 }}>Verified</div>
          <div style={{ color: "var(--navy)", fontSize: 24, fontWeight: 800 }}>{filteredZones.filter((zone) => zone.status === "verified").length}</div>
        </div>
        <div style={{ background: "#fff", borderRadius: 16, padding: 14, boxShadow: "var(--shadow)" }}>
          <div style={{ color: "var(--muted)", fontSize: 12 }}>Linked Incidents</div>
          <div style={{ color: "var(--navy)", fontSize: 24, fontWeight: 800 }}>{filteredZones.reduce((total, zone) => total + zone.linkedIncidentCount, 0)}</div>
        </div>
      </div>

      <LiveSafeZoneMap
        userPosition={userPosition}
        zones={filteredZones}
        selectedZone={selectedZone}
        nearbyZoneIds={nearbyZoneIds}
        onSelectZone={handleSelectZone}
      />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <div style={{ color: "var(--muted)", fontSize: 13 }}>Preferences are saved on this device.</div>
        <select
          value={sort}
          onChange={(event) => setSort(event.target.value)}
          style={{
            border: "1px solid var(--line)",
            borderRadius: 12,
            padding: "8px 10px",
            background: "#fff",
            color: "var(--navy)",
            fontFamily: "inherit",
            fontWeight: 600,
          }}
        >
          <option value="recommended">Recommended</option>
          <option value="nearest">Nearest</option>
          <option value="alphabetical">A-Z</option>
        </select>
      </div>

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
            {type === "all" ? "All Zones" : type === "nearby" ? "Nearby" : type}
          </button>
        ))}
      </div>

      {filteredZones.map((zone) => (
        <SafeZoneCard
          key={zone.id}
          zone={zone}
          isSelected={selectedZone?.id === zone.id}
          onShowModal={onShowModal}
          onSelect={handleSelectZone}
          onReportIncident={(item) => handleSelectZone(item)}
        />
      ))}
    </div>
  );
}
