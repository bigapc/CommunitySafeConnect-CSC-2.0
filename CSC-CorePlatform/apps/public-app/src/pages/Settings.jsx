import { useState } from "react";

const hubRoles = ["apc_admin", "apc_security_reviewer", "csc_supervisor"];

export default function Settings({ role, onNavigate, onShowModal }) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationSharing, setLocationSharing] = useState(true);

  const handleProfileClick = () => {
    onShowModal(
      "Your Profile",
      <div>
        <div style={{ marginBottom: 16 }}>
          <p style={{ color: "var(--muted)", fontSize: 13, marginBottom: 4 }}>Name</p>
          <p style={{ fontWeight: 600, color: "var(--navy)" }}>Community Member</p>
        </div>
        <div style={{ marginBottom: 16 }}>
          <p style={{ color: "var(--muted)", fontSize: 13, marginBottom: 4 }}>Email</p>
          <p style={{ fontWeight: 600, color: "var(--navy)" }}>user@example.com</p>
        </div>
        <div style={{ marginBottom: 16 }}>
          <p style={{ color: "var(--muted)", fontSize: 13, marginBottom: 4 }}>Role</p>
          <p style={{ fontWeight: 600, color: "var(--navy)" }}>{role || "Community Member"}</p>
        </div>
        <div style={{ marginBottom: 16 }}>
          <p style={{ color: "var(--muted)", fontSize: 13, marginBottom: 4 }}>Account Status</p>
          <p style={{ fontWeight: 600, color: "var(--green)" }}>✓ Verified & Active</p>
        </div>
      </div>,
      [{ label: "Done", primary: true }]
    );
  };

  const handlePrivacyClick = () => {
    onShowModal(
      "Privacy & Security",
      <div>
        <div style={{ marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid var(--line)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <label style={{ fontWeight: 600, color: "var(--navy)" }}>Share Location</label>
            <input 
              type="checkbox" 
              checked={locationSharing} 
              onChange={(e) => setLocationSharing(e.target.checked)}
              style={{ cursor: "pointer" }}
            />
          </div>
          <p style={{ color: "var(--muted)", fontSize: 13 }}>Allow Command Center to access your location during incidents.</p>
        </div>
        <div style={{ marginBottom: 16 }}>
          <p style={{ color: "var(--muted)", fontSize: 13, marginBottom: 4 }}>Last Security Audit</p>
          <p style={{ fontWeight: 600, color: "var(--navy)" }}>Today at 2:30 PM</p>
        </div>
      </div>,
      [{ label: "Save", primary: true }]
    );
  };

  const handleNotificationsClick = () => {
    onShowModal(
      "Notification Preferences",
      <div>
        <div style={{ marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid var(--line)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <label style={{ fontWeight: 600, color: "var(--navy)" }}>Enable Notifications</label>
            <input 
              type="checkbox" 
              checked={notificationsEnabled} 
              onChange={(e) => setNotificationsEnabled(e.target.checked)}
              style={{ cursor: "pointer" }}
            />
          </div>
          <p style={{ color: "var(--muted)", fontSize: 13 }}>Receive alerts and updates from Command Center</p>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", marginBottom: 12 }}>
            <input type="checkbox" defaultChecked style={{ cursor: "pointer" }} />
            <span style={{ color: "var(--navy)", fontWeight: 600 }}>Emergency Alerts</span>
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", marginBottom: 12 }}>
            <input type="checkbox" defaultChecked style={{ cursor: "pointer" }} />
            <span style={{ color: "var(--navy)", fontWeight: 600 }}>Safety Circle Notifications</span>
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
            <input type="checkbox" style={{ cursor: "pointer" }} />
            <span style={{ color: "var(--navy)", fontWeight: 600 }}>Community Updates</span>
          </label>
        </div>
      </div>,
      [{ label: "Save", primary: true }]
    );
  };

  const handleOrganizationAccess = () => {
    onShowModal(
      "Organization Access",
      <div>
        <p style={{ color: "var(--muted)", marginBottom: 12 }}>
          Your organization membership is currently active.
        </p>
        <div style={{ background: "var(--bg-soft)", borderRadius: 12, padding: 12, marginBottom: 12 }}>
          <div style={{ color: "var(--muted)", fontSize: 12 }}>Current Role</div>
          <div style={{ color: "var(--navy)", fontWeight: 700 }}>{role || "community_member"}</div>
        </div>
        <p style={{ color: "var(--muted)", fontSize: 13, margin: 0 }}>
          For role changes or additional organization invitations, contact your supervisor.
        </p>
      </div>,
      [
        { label: "Open Organization Hub", primary: false, onClick: () => onNavigate("organization") },
        { label: "Close", primary: true },
      ]
    );
  };

  const handleContactCompany = () => {
    onShowModal(
      "Contact Armstrong Pack Company",
      <div>
        <p style={{ color: "var(--muted)", marginBottom: 12 }}>
          Choose a support channel for product help or account assistance.
        </p>
        <div style={{ display: "grid", gap: 10 }}>
          <a
            href="mailto:support@armstrongpack.example"
            style={{ border: "1px solid var(--line)", borderRadius: 10, padding: 12, color: "var(--navy)", fontWeight: 600 }}
          >
            support@armstrongpack.example
          </a>
          <a
            href="tel:+15550102020"
            style={{ border: "1px solid var(--line)", borderRadius: 10, padding: 12, color: "var(--navy)", fontWeight: 600 }}
          >
            +1 (555) 010-2020
          </a>
        </div>
      </div>,
      [{ label: "Done", primary: true }]
    );
  };

  return (
    <div>
      <button 
        onClick={handleProfileClick}
        style={{ 
          width: "100%", 
          background: "#fff", 
          borderRadius: 18, 
          padding: 18, 
          boxShadow: "var(--shadow)", 
          marginBottom: 10,
          border: 0,
          cursor: "pointer",
          textAlign: "left",
          fontWeight: 600,
          color: "var(--navy)"
        }}
      >
        👤 Profile
      </button>

      <button 
        onClick={handlePrivacyClick}
        style={{ 
          width: "100%", 
          background: "#fff", 
          borderRadius: 18, 
          padding: 18, 
          boxShadow: "var(--shadow)", 
          marginBottom: 10,
          border: 0,
          cursor: "pointer",
          textAlign: "left",
          fontWeight: 600,
          color: "var(--navy)"
        }}
      >
        🔒 Privacy & Security
      </button>

      <button 
        onClick={handleNotificationsClick}
        style={{ 
          width: "100%", 
          background: "#fff", 
          borderRadius: 18, 
          padding: 18, 
          boxShadow: "var(--shadow)", 
          marginBottom: 10,
          border: 0,
          cursor: "pointer",
          textAlign: "left",
          fontWeight: 600,
          color: "var(--navy)"
        }}
      >
        🔔 Notification Preferences
      </button>

      <button 
        onClick={handleOrganizationAccess}
        style={{ 
          width: "100%", 
          background: "#fff", 
          borderRadius: 18, 
          padding: 18, 
          boxShadow: "var(--shadow)", 
          marginBottom: 10,
          border: 0,
          cursor: "pointer",
          textAlign: "left",
          fontWeight: 600,
          color: "var(--navy)"
        }}
      >
        🏢 Organization Access
      </button>

      <button 
        onClick={handleContactCompany}
        style={{ 
          width: "100%", 
          background: "#fff", 
          borderRadius: 18, 
          padding: 18, 
          boxShadow: "var(--shadow)", 
          marginBottom: 10,
          border: 0,
          cursor: "pointer",
          textAlign: "left",
          fontWeight: 600,
          color: "var(--navy)"
        }}
      >
        📞 Contact Armstrong Pack Company
      </button>

      {hubRoles.includes(role) ? (
        <button
          onClick={() => onNavigate("control-hub")}
          style={{ width: "100%", border: 0, borderRadius: 18, padding: 16, background: "var(--navy)", color: "#fff", fontWeight: 700, marginTop: 2, cursor: "pointer" }}
        >
          Launch CSC Control Hub
        </button>
      ) : null}
      <div style={{ color: "var(--muted)", textAlign: "center", fontSize: 12, marginTop: 18 }}>
        CommunitySafeConnect-CSC-2.0 · Powered by Armstrong Pack Company
      </div>
    </div>
  );
}
