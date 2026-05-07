import { useState } from "react";
import SosButton from "../components/sos/SosButton";
import SectionHeader from "../components/ui/SectionHeader";
import StatCard from "../components/ui/StatCard";
import { mockNotifications } from "../data/mockNotifications";

const hubRoles = ["apc_admin", "apc_security_reviewer", "csc_supervisor"];

function IncidentReportForm({ onCreateIncident, onShowModal }) {
  const [type, setType] = useState("Suspicious activity");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = () => {
    if (!description.trim() || !location.trim()) {
      onShowModal(
        "Missing Information",
        <p style={{ color: "var(--muted)" }}>Please add both a description and location before submitting.</p>,
        [{ label: "Close", primary: true }]
      );
      return;
    }

    onCreateIncident?.({
      type,
      status: "submitted",
      location: location.trim(),
      notes: description.trim(),
    });

    onShowModal(
      "Report Submitted",
      <div>
        <p style={{ color: "var(--muted)", marginBottom: 8 }}>Your report has been sent to the Command Center.</p>
        <p style={{ color: "var(--navy)", fontWeight: 700, margin: 0 }}>Type: {type}</p>
        <p style={{ color: "var(--navy)", fontWeight: 700, margin: 0 }}>Location: {location.trim()}</p>
      </div>,
      [{ label: "Done", primary: true }]
    );
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 6, fontWeight: 600, color: "var(--navy)" }}>Type of incident</label>
        <select
          value={type}
          onChange={(event) => setType(event.target.value)}
          style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid var(--line)", fontFamily: "inherit" }}
        >
          <option>Suspicious activity</option>
          <option>Safety concern</option>
          <option>Environmental hazard</option>
          <option>Noise complaint</option>
          <option>Other</option>
        </select>
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 6, fontWeight: 600, color: "var(--navy)" }}>Description</label>
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid var(--line)", fontFamily: "inherit", minHeight: 80 }}
          placeholder="Describe what you observed..."
        />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 6, fontWeight: 600, color: "var(--navy)" }}>Location</label>
        <input
          type="text"
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          placeholder="Enter location"
          style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid var(--line)", fontFamily: "inherit" }}
        />
      </div>
      <p style={{ color: "var(--muted)", fontSize: 13 }}>Your location will be shared with the Command Center for faster response.</p>
      <button
        onClick={handleSubmit}
        style={{ width: "100%", border: 0, borderRadius: 12, padding: 12, background: "var(--navy)", color: "#fff", fontWeight: 700, cursor: "pointer" }}
      >
        Submit Report
      </button>
    </div>
  );
}

export default function Home({ onNavigate, role, onShowModal, onCreateIncident }) {
  const canAccessHub = hubRoles.includes(role);

  const handleSosActivate = () => {
    onCreateIncident?.({
      type: "SOS",
      status: "active",
      notes: "SOS triggered from Home quick action.",
    });
    onNavigate("sos");
  };

  const handleReportIncident = () => {
    onShowModal(
      "Report an Incident",
      <IncidentReportForm onCreateIncident={onCreateIncident} onShowModal={onShowModal} />,
      [{ label: "Cancel", primary: false }]
    );
  };

  return (
    <div>
      <div style={{ background: "linear-gradient(155deg, #ffffff, var(--bg-soft))", borderRadius: 28, padding: 20, boxShadow: "var(--shadow)", marginBottom: 18, border: "1px solid var(--line)" }}>
        <div style={{ color: "var(--muted)", marginBottom: 14 }}>Calm guidance. Verified support. Real-time coordination.</div>
        <SosButton onActivate={handleSosActivate} />
        <div style={{ marginTop: 16, color: "var(--navy)", fontWeight: 600 }}>You're connected</div>
        <div style={{ color: "var(--muted)", fontSize: 14 }}>No active alerts right now. Command Center is monitoring.</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
        <StatCard label="Safe Zones Nearby" value="12" tone="green" />
        <StatCard label="Trusted Contacts" value="3" />
        <StatCard label="Response Time" value="2m" tone="blue" />
        <StatCard label="Community Members" value="842" />
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

      <button 
        onClick={handleReportIncident}
        style={{ 
          width: "100%", 
          border: 0, 
          borderRadius: 18, 
          padding: 14, 
          background: "var(--accent)", 
          color: "#fff", 
          fontWeight: 700, 
          marginBottom: 20, 
          cursor: "pointer" 
        }}
      >
        📝 Report an Incident
      </button>

      <SectionHeader title="Real-Time Status" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
        <div style={{ background: "#fff", borderRadius: 18, padding: 16, boxShadow: "var(--shadow)", border: "1px solid var(--line)" }}>
          <div style={{ color: "var(--muted)", fontSize: 13, fontWeight: 600 }}>🟢 Command Center</div>
          <div style={{ fontWeight: 700, color: "var(--green)", marginTop: 6 }}>Active & Monitoring</div>
        </div>
        <div style={{ background: "#fff", borderRadius: 18, padding: 16, boxShadow: "var(--shadow)", border: "1px solid var(--line)" }}>
          <div style={{ color: "var(--muted)", fontSize: 13, fontWeight: 600 }}>🛡️ Your Status</div>
          <div style={{ fontWeight: 700, color: "var(--navy)", marginTop: 6 }}>Safe & Connected</div>
        </div>
      </div>

      <SectionHeader title="Updates" />
      {mockNotifications.map((item) => (
        <div
          key={item.id}
          onClick={() =>
            onShowModal(
              item.title,
              <div>
                <p style={{ color: "var(--muted)", lineHeight: 1.6 }}>{item.message}</p>
                <p style={{ color: "var(--navy-2)", fontSize: 12, fontWeight: 600 }}>
                  {new Date().toLocaleDateString()}
                </p>
              </div>,
              [{ label: "Dismiss", primary: true }]
            )
          }
          style={{
            background: "#fff",
            borderRadius: 18,
            padding: 16,
            boxShadow: "var(--shadow)",
            marginBottom: 10,
            cursor: "pointer",
            transition: "all 0.2s ease",
            border: "1px solid var(--line)",
          }}
        >
          <div style={{ fontWeight: 700, color: "var(--navy)" }}>{item.title}</div>
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
