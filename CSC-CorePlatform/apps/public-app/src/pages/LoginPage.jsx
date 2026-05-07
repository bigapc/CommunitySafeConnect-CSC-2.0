import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login, authError, clearError, demoAccounts } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password);
  };

  const fillDemo = (account) => {
    setEmail(account.email);
    setPassword(account.password);
    setShowDemo(false);
    clearError();
  };

  const roleLabel = {
    apc_admin: "Admin",
    csc_supervisor: "Supervisor",
    apc_responder: "Responder",
    community_member: "Community Member",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 20px",
      }}
    >
      {/* Brand */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 20,
            background: "var(--navy)",
            display: "grid",
            placeItems: "center",
            margin: "0 auto 12px",
            fontSize: 28,
          }}
        >
          🛡️
        </div>
        <div style={{ fontWeight: 800, fontSize: 22, color: "var(--navy)" }}>CommunitySafeConnect</div>
        <div style={{ color: "var(--muted)", fontSize: 13, marginTop: 4 }}>
          Calm response platform by Armstrong Pack Company
        </div>
      </div>

      {/* Card */}
      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          padding: "28px 24px",
          width: "100%",
          maxWidth: 400,
          boxShadow: "var(--shadow)",
        }}
      >
        <h2 style={{ fontWeight: 800, color: "var(--navy)", margin: "0 0 4px" }}>Sign In</h2>
        <p style={{ color: "var(--muted)", fontSize: 14, margin: "0 0 24px" }}>
          Access your community safety platform
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontWeight: 600, color: "var(--navy)", marginBottom: 6, fontSize: 14 }}>
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); clearError(); }}
              required
              autoComplete="email"
              placeholder="you@example.com"
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 10,
                border: authError ? "1px solid #e53e3e" : "1px solid var(--line)",
                fontFamily: "inherit",
                fontSize: 15,
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: 8 }}>
            <label style={{ display: "block", fontWeight: 600, color: "var(--navy)", marginBottom: 6, fontSize: 14 }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); clearError(); }}
                required
                autoComplete="current-password"
                placeholder="Your password"
                style={{
                  width: "100%",
                  padding: "10px 40px 10px 12px",
                  borderRadius: 10,
                  border: authError ? "1px solid #e53e3e" : "1px solid var(--line)",
                  fontFamily: "inherit",
                  fontSize: 15,
                  boxSizing: "border-box",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                style={{
                  position: "absolute",
                  right: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--muted)",
                  fontSize: 16,
                  padding: "0 4px",
                }}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {authError && (
            <p style={{ color: "#e53e3e", fontSize: 13, margin: "6px 0 12px", fontWeight: 500 }}>
              ⚠ {authError}
            </p>
          )}

          <button
            type="submit"
            style={{
              width: "100%",
              border: 0,
              borderRadius: 12,
              padding: "13px 0",
              background: "var(--navy)",
              color: "#fff",
              fontWeight: 700,
              fontSize: 16,
              cursor: "pointer",
              marginTop: 12,
            }}
          >
            Sign In
          </button>
        </form>

        {/* Demo accounts */}
        <div style={{ marginTop: 20, borderTop: "1px solid var(--line)", paddingTop: 16 }}>
          <button
            onClick={() => setShowDemo((v) => !v)}
            style={{
              background: "none",
              border: "1px solid var(--line)",
              borderRadius: 10,
              padding: "8px 14px",
              width: "100%",
              cursor: "pointer",
              color: "var(--navy)",
              fontWeight: 600,
              fontSize: 13,
            }}
          >
            {showDemo ? "Hide" : "Show"} Demo Accounts
          </button>

          {showDemo && (
            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
              {demoAccounts.map((a) => (
                <button
                  key={a.id}
                  onClick={() => fillDemo(a)}
                  style={{
                    background: "var(--bg)",
                    border: "1px solid var(--line)",
                    borderRadius: 10,
                    padding: "10px 12px",
                    textAlign: "left",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ fontWeight: 700, color: "var(--navy)", fontSize: 14 }}>{a.fullName}</div>
                  <div style={{ color: "var(--muted)", fontSize: 12 }}>
                    {roleLabel[a.role] || a.role} • {a.email}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <p style={{ color: "var(--muted)", fontSize: 12, marginTop: 24, textAlign: "center" }}>
        © 2026 Armstrong Pack Company. CommunitySafeConnect™.
      </p>
    </div>
  );
}
