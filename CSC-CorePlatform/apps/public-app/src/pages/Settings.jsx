const hubRoles = ["apc_admin", "apc_security_reviewer", "csc_supervisor"];

export default function Settings({ role, onNavigate }) {
  const items = [
    "Profile",
    "Privacy & Security",
    "Notification Preferences",
    "Organization Access",
    "Contact Armstrong Pack Company",
  ];

  return (
    <div>
      {items.map((item) => (
        <div key={item} style={{ background: "#fff", borderRadius: 18, padding: 18, boxShadow: "var(--shadow)", marginBottom: 10 }}>
          {item}
        </div>
      ))}
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
