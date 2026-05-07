import MetricCard from "../components/dashboard/MetricCard";
import AlertFeed from "../components/dashboard/AlertFeed";
import { useMemo, useState } from "react";

export default function Dashboard({ dashboardMetrics, incidents = [], onNavigate, showModal }) {
  const [selectedIncidentId, setSelectedIncidentId] = useState(incidents[0]?.id || null);
  const selectedIncident = incidents.find((incident) => incident.id === selectedIncidentId) || incidents[0];

  const mapSrc = useMemo(() => {
    const center = selectedIncident?.coordinates || [40.7128, -74.006];
    const [lat, lng] = center;
    return `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.03}%2C${lat - 0.02}%2C${lng + 0.03}%2C${lat + 0.02}&layer=mapnik&marker=${lat}%2C${lng}`;
  }, [selectedIncident]);

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 20 }}>
        <MetricCard label="Active Alerts" value={dashboardMetrics.activeAlerts} tone="red" />
        <MetricCard label="Pending Incidents" value={dashboardMetrics.pendingIncidents} tone="blue" />
        <MetricCard label="Verified Responders" value={dashboardMetrics.verifiedResponders} tone="green" />
        <MetricCard label="Safe Zones" value={dashboardMetrics.safeZones} />
        <MetricCard label="Organizations" value={dashboardMetrics.organizations} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr .8fr", gap: 16 }}>
        <div style={{ background: "var(--hub-panel)", borderRadius: 20, minHeight: 320, padding: 18, boxShadow: "var(--hub-shadow)", border: "1px solid var(--hub-line)" }}>
          <h3 style={{ marginTop: 0 }}>Live Map</h3>
          <div style={{ color: "var(--hub-muted)", fontSize: 13, marginBottom: 10 }}>
            Centered on {selectedIncident?.title || "active incidents"}
          </div>
          <iframe
            title="Dispatcher live map"
            src={mapSrc}
            style={{ width: "100%", minHeight: 250, border: "1px solid var(--hub-line)", borderRadius: 14 }}
          />
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <button
              onClick={() => onNavigate("incidents")}
              style={{ border: 0, borderRadius: 10, padding: "8px 10px", background: "var(--hub-blue)", color: "#07131f", fontWeight: 700, cursor: "pointer" }}
            >
              Open Incident Console
            </button>
            <button
              onClick={() =>
                showModal(
                  "Map Context",
                  <p style={{ color: "var(--hub-muted)" }}>Map is sourced from OpenStreetMap and centers on selected active incidents for dispatcher context.</p>,
                  [{ label: "Close", primary: true }]
                )
              }
              style={{ border: "1px solid var(--hub-line)", borderRadius: 10, padding: "8px 10px", background: "transparent", color: "var(--hub-text)", fontWeight: 600, cursor: "pointer" }}
            >
              Source Details
            </button>
          </div>
        </div>
        <AlertFeed items={incidents} onSelect={(incident) => setSelectedIncidentId(incident.id)} />
      </div>
    </div>
  );
}
