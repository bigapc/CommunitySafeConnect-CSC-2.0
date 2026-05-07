import HubSidebar from "./HubSidebar";

export default function HubLayout({ children, route, onNavigate, user, onSignOut }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex" }}>
      <HubSidebar route={route} onNavigate={onNavigate} />
      <div style={{ flex: 1, padding: 24 }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
          <div>
            <div style={{ color: "var(--hub-muted)", fontSize: 13 }}>CommunitySafeConnect</div>
            <div style={{ fontWeight: 800, fontSize: 28 }}>Dispatcher Control Hub</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontWeight: 700 }}>{user?.fullName || "Authorized User"}</div>
              <div style={{ color: "var(--hub-muted)", fontSize: 12 }}>{user?.role || "dispatcher"}</div>
            </div>
            <button
              onClick={onSignOut}
              style={{
                border: "1px solid var(--hub-line)",
                borderRadius: 12,
                padding: "9px 12px",
                background: "transparent",
                color: "var(--hub-text)",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Sign Out
            </button>
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}
