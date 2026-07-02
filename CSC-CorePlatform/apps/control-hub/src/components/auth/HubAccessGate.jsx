import { useEffect, useState } from "react";
import { DEMO_ACCOUNTS, HUB_ROLES, authenticateHubUser, loadSession, saveSession } from "../../auth/session";

const allowedAccounts = DEMO_ACCOUNTS.filter((account) => HUB_ROLES.includes(account.role));
const HUB_LOGIN_DISABLED = true;

export default function HubAccessGate({ children }) {
  const [user, setUser] = useState(() => loadSession());
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (HUB_LOGIN_DISABLED) {
    const bypassUser =
      allowedAccounts[0] || {
        id: "hub-bypass-user",
        email: "local@csc.app",
        fullName: "CSC Hub Local Access",
        role: "csc_supervisor",
        org: "CSC Operations",
        avatar: "CS",
      };

    return children({ user: bypassUser, onSignOut: () => null });
  }

  useEffect(() => {
    saveSession(user);
  }, [user]);

  if (!user) {
    return (
      <HubLoginScreen
        email={email}
        password={password}
        error={error}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onSubmit={() => {
          const result = authenticateHubUser(email, password);
          if (!result.ok) {
            setError(result.error);
            return;
          }
          setError("");
          setUser(result.user);
        }}
        onUseDemo={(account) => {
          setEmail(account.email);
          setPassword(account.password);
          setError("");
        }}
      />
    );
  }

  if (!HUB_ROLES.includes(user.role)) {
    return <AccessDeniedScreen user={user} onSignOut={() => setUser(null)} />;
  }

  return children({ user, onSignOut: () => setUser(null) });
}

function HubLoginScreen({ email, password, error, onEmailChange, onPasswordChange, onSubmit, onUseDemo }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 24,
        background: "linear-gradient(180deg, #09131f 0%, #122033 100%)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 440,
          background: "var(--hub-panel)",
          border: "1px solid var(--hub-line)",
          borderRadius: 24,
          padding: 28,
          boxShadow: "0 18px 40px rgba(0, 0, 0, 0.28)",
        }}
      >
        <div style={{ color: "var(--hub-muted)", fontSize: 12, marginBottom: 8 }}>CommunitySafeConnect</div>
        <div style={{ fontSize: 30, fontWeight: 800, marginBottom: 8 }}>Control Hub Access</div>
        <div style={{ color: "var(--hub-muted)", marginBottom: 22 }}>
          Sign in with an authorized dispatcher account to access operational controls.
        </div>

        <label style={{ display: "block", color: "var(--hub-muted)", fontSize: 13, marginBottom: 6 }}>Email</label>
        <input
          type="email"
          value={email}
          onChange={(event) => onEmailChange(event.target.value)}
          style={inputStyle}
          placeholder="admin@csc.app"
        />

        <label style={{ display: "block", color: "var(--hub-muted)", fontSize: 13, marginBottom: 6 }}>Password</label>
        <input
          type="password"
          value={password}
          onChange={(event) => onPasswordChange(event.target.value)}
          style={inputStyle}
          placeholder="Enter your password"
        />

        {error ? <div style={{ color: "#ff9d9d", fontSize: 13, marginBottom: 14 }}>{error}</div> : null}

        <button
          onClick={onSubmit}
          style={{
            width: "100%",
            border: 0,
            borderRadius: 14,
            padding: "13px 14px",
            background: "var(--hub-blue)",
            color: "#09131f",
            fontWeight: 800,
            cursor: "pointer",
            marginBottom: 18,
          }}
        >
          Sign In To Hub
        </button>

        <div style={{ borderTop: "1px solid var(--hub-line)", paddingTop: 16 }}>
          <div style={{ color: "var(--hub-muted)", fontSize: 12, marginBottom: 10 }}>Authorized demo accounts</div>
          <div style={{ display: "grid", gap: 8 }}>
            {allowedAccounts.map((account) => (
              <button
                key={account.id}
                onClick={() => onUseDemo(account)}
                style={{
                  border: "1px solid var(--hub-line)",
                  borderRadius: 14,
                  padding: "10px 12px",
                  background: "rgba(255, 255, 255, 0.02)",
                  color: "var(--hub-text)",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <div style={{ fontWeight: 700 }}>{account.fullName}</div>
                <div style={{ color: "var(--hub-muted)", fontSize: 12 }}>{account.role} • {account.email}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AccessDeniedScreen({ user, onSignOut }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 24,
        background: "linear-gradient(180deg, #09131f 0%, #122033 100%)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 460,
          background: "var(--hub-panel)",
          border: "1px solid var(--hub-line)",
          borderRadius: 24,
          padding: 28,
        }}
      >
        <div style={{ fontSize: 28, marginBottom: 10 }}>Restricted Access</div>
        <div style={{ color: "var(--hub-muted)", lineHeight: 1.6, marginBottom: 16 }}>
          {user.fullName} is signed in, but the {user.role} role is not authorized for the dispatcher control hub.
        </div>
        <button
          onClick={onSignOut}
          style={{
            border: 0,
            borderRadius: 14,
            padding: "12px 16px",
            background: "var(--hub-blue)",
            color: "#09131f",
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  background: "rgba(255, 255, 255, 0.02)",
  color: "var(--hub-text)",
  border: "1px solid var(--hub-line)",
  borderRadius: 14,
  padding: "12px 14px",
  marginBottom: 14,
  boxSizing: "border-box",
  fontFamily: "inherit",
};