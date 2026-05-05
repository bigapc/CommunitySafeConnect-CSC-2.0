import BottomNav from "./BottomNav";

export default function PublicLayout({ children, route, onNavigate }) {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <header style={{ padding: "20px 20px 8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: 20, color: "var(--navy)" }}>CommunitySafeConnect-CSC-2.0</div>
          <div style={{ color: "var(--muted)", fontSize: 12 }}>Powered by Armstrong Pack Company</div>
        </div>
        <div style={{ width: 40, height: 40, borderRadius: 20, background: "#fff", boxShadow: "var(--shadow)", display: "grid", placeItems: "center" }}>CP</div>
      </header>
      <main style={{ padding: "12px 20px 96px" }}>{children}</main>
      <BottomNav route={route} onNavigate={onNavigate} />
    </div>
  );
}
