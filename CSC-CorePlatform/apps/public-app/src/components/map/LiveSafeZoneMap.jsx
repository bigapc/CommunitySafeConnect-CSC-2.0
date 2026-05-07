import { useMemo } from "react";
import { Circle, MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function RecenterMap({ center }) {
  const map = useMap();
  map.setView(center, map.getZoom(), { animate: true });
  return null;
}

export default function LiveSafeZoneMap({ userPosition, zones, selectedZone, nearbyZoneIds = [], onSelectZone }) {
  const fallbackCenter = [40.7128, -74.006];
  const zoneCenter = selectedZone?.coordinates || zones[0]?.coordinates;
  const center = userPosition || zoneCenter || fallbackCenter;

  const safeZones = useMemo(
    () => zones.filter((zone) => Array.isArray(zone.coordinates) && zone.coordinates.length === 2),
    [zones]
  );

  return (
    <div style={{ borderRadius: 24, overflow: "hidden", border: "1px solid var(--line)", boxShadow: "var(--shadow)", marginBottom: 16 }}>
      <MapContainer center={center} zoom={13} style={{ minHeight: 280, width: "100%" }} scrollWheelZoom={false}>
        <RecenterMap center={center} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {userPosition ? (
          <>
            <Circle center={userPosition} pathOptions={{ color: "#1f3a5a", fillColor: "#1f3a5a", fillOpacity: 0.12 }} radius={250} />
            <Marker position={userPosition}>
              <Popup>You are here</Popup>
            </Marker>
          </>
        ) : null}

        {safeZones.map((zone) => (
          <>
            {nearbyZoneIds.includes(zone.id) ? (
              <Circle
                key={`nearby-${zone.id}`}
                center={zone.coordinates}
                radius={120}
                pathOptions={{ color: "#1f8f59", fillColor: "#1f8f59", fillOpacity: 0.12 }}
              />
            ) : null}
            {selectedZone?.id === zone.id ? (
              <Circle
                key={`selected-${zone.id}`}
                center={zone.coordinates}
                radius={180}
                pathOptions={{ color: "#1f3a5a", fillColor: "#1f3a5a", fillOpacity: 0.08 }}
              />
            ) : null}
            <Marker key={zone.id} position={zone.coordinates} eventHandlers={{ click: () => onSelectZone?.(zone) }}>
              <Popup>
                <div style={{ minWidth: 160 }}>
                  <strong>{zone.name}</strong>
                  <div>{zone.type}</div>
                  <div>{zone.distanceLabel || zone.distance} away</div>
                  <div style={{ color: zone.status === "verified" ? "#1f8f59" : "#a26a00", fontWeight: 700, marginTop: 4 }}>
                    {zone.status === "verified" ? "Verified" : "Pending review"}
                  </div>
                </div>
              </Popup>
            </Marker>
          </>
        ))}
      </MapContainer>
    </div>
  );
}