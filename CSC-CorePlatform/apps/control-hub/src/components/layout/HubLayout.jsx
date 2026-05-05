import HubSidebar from "./HubSidebar";

export default function HubLayout({ children, route, onNavigate }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex" }}>
      <HubSidebar route={route} onNavigate={onNavigate} />
      <div style={{ flex: 1, padding: 24 }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
          <div>
            <div style={{ color: "var(--hub-muted)", fontSize: 13 }}>CommunitySafeConnect</div>
            <div style={{ fontWeight: 800, fontSize: 28 }}>Dispatcher Control Hub</div>
          </div>
          <div style={{ color: "var(--hub-muted)" }}>Powered by Armstrong Pack Company</div>
        </header>
        {children}
      </div>
    </div>
  );
}
