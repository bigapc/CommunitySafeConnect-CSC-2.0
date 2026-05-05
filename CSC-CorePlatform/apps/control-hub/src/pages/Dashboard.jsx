import MetricCard from "../components/dashboard/MetricCard";
import AlertFeed from "../components/dashboard/AlertFeed";
import { mockDashboard } from "../data/mockDashboard";
import { mockHubIncidents } from "../data/mockIncidents";

export default function Dashboard() {
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 20 }}>
        <MetricCard label="Active Alerts" value={mockDashboard.activeAlerts} tone="red" />
        <MetricCard label="Pending Incidents" value={mockDashboard.pendingIncidents} tone="blue" />
        <MetricCard label="Verified Responders" value={mockDashboard.verifiedResponders} tone="green" />
        <MetricCard label="Safe Zones" value={mockDashboard.safeZones} />
        <MetricCard label="Organizations" value={mockDashboard.organizations} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr .8fr", gap: 16 }}>
        <div style={{ background: "var(--hub-panel)", borderRadius: 20, minHeight: 320, padding: 18, boxShadow: "var(--hub-shadow)" }}>
          <h3 style={{ marginTop: 0 }}>Live Map</h3>
          <div style={{ minHeight: 240, borderRadius: 18, background: "linear-gradient(180deg, #18314d, #12243a)", display: "grid", placeItems: "center", color: "var(--hub-muted)" }}>
            Dispatcher map placeholder
          </div>
        </div>
        <AlertFeed items={mockHubIncidents} />
      </div>
    </div>
  );
}
