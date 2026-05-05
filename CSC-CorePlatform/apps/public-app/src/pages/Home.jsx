import SosButton from "../components/sos/SosButton";
import SectionHeader from "../components/ui/SectionHeader";
import StatCard from "../components/ui/StatCard";
import { mockNotifications } from "../data/mockNotifications";

const hubRoles = ["apc_admin", "apc_security_reviewer", "csc_supervisor"];

export default function Home({ onNavigate, role }) {
  const canAccessHub = hubRoles.includes(role);

  return (
    <div>
      <div style={{ background: "#fff", borderRadius: 28, padding: 20, boxShadow: "var(--shadow)", marginBottom: 18 }}>
        <div style={{ color: "var(--muted)", marginBottom: 14 }}>Connected protection. Real-time support.</div>
        <SosButton onActivate={() => onNavigate("sos")} />
        <div style={{ marginTop: 16, color: "var(--navy)", fontWeight: 600 }}>You're connected</div>
        <div style={{ color: "var(--muted)", fontSize: 14 }}>No active alerts right now.</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
        <StatCard label="Safe Zones Nearby" value="12" tone="green" />
        <StatCard label="Trusted Contacts" value="3" />
      </div>

      <SectionHeader title="Quick Actions" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
        {[
          ["Safe Zones", "safezones"],
          ["Safety Circle", "circle"],
          ["Incident Log", "incidents"],
          ["My Organization", "organization"],
        ].map(([label, route]) => (
          <button key={route} onClick={() => onNavigate(route)} style={{ border: 0, background: "#fff", padding: 18, borderRadius: 20, boxShadow: "var(--shadow)", cursor: "pointer", textAlign: "left", fontWeight: 700 }}>
            {label}
          </button>
        ))}
      </div>

      <SectionHeader title="Updates" />
      {mockNotifications.map((item) => (
        <div key={item.id} style={{ background: "#fff", borderRadius: 18, padding: 16, boxShadow: "var(--shadow)", marginBottom: 10 }}>
          <div style={{ fontWeight: 700 }}>{item.title}</div>
          <div style={{ color: "var(--muted)", fontSize: 14, marginTop: 6 }}>{item.message}</div>
        </div>
      ))}

      {canAccessHub ? (
        <button
          onClick={() => onNavigate("control-hub")}
          style={{ width: "100%", border: 0, borderRadius: 18, padding: 16, background: "var(--navy)", color: "#fff", fontWeight: 700, marginTop: 8, cursor: "pointer" }}
        >
          Open CSC Control Hub
        </button>
      ) : null}
    </div>
  );
}
