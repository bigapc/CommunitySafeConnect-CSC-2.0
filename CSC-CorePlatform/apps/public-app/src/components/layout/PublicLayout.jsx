import BottomNav from "./BottomNav";
import CalmNavigator from "../ui/CalmNavigator";

export default function PublicLayout({ children, route, onNavigate, role, user }) {
  const avatarText = user?.avatar || user?.fullName?.slice(0, 2).toUpperCase() || "CP";

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <header style={{ padding: "20px 20px 8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: 20, color: "var(--navy)" }}>CommunitySafeConnect</div>
          <div style={{ color: "var(--muted)", fontSize: 12 }}>
            {user ? `Signed in as ${user.fullName}` : "Calm response platform"}
          </div>
        </div>
        <button
          onClick={() => onNavigate("profile")}
          title="My Profile"
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            background: route === "profile" ? "var(--navy)" : "#fff",
            border: "1px solid var(--line)",
            boxShadow: "var(--shadow)",
            display: "grid",
            placeItems: "center",
            color: route === "profile" ? "#fff" : "var(--navy)",
            fontWeight: 700,
            cursor: "pointer",
            fontSize: 14,
          }}
        >
          {avatarText}
        </button>
      </header>
      <main style={{ padding: "12px 20px 96px" }}>{children}</main>
      <CalmNavigator route={route} />
      <BottomNav route={route} onNavigate={onNavigate} />
    </div>
  );
}
