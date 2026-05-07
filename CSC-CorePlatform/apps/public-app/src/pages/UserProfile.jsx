import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import SectionHeader from "../components/ui/SectionHeader";

const roleLabel = {
  apc_admin: "Platform Admin",
  csc_supervisor: "CSC Supervisor",
  apc_responder: "Verified Responder",
  apc_security_reviewer: "Security Reviewer",
  community_member: "Community Member",
};

const roleColor = {
  apc_admin: "#6b21a8",
  csc_supervisor: "var(--navy)",
  apc_responder: "var(--green)",
  apc_security_reviewer: "#b45309",
  community_member: "var(--muted)",
};

export default function UserProfile({ onNavigate, onShowModal }) {
  const { user, updateProfile, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [bio, setBio] = useState(user?.bio || "");

  if (!user) return null;

  const handleSave = () => {
    if (!fullName.trim()) return;
    updateProfile({ fullName: fullName.trim(), bio: bio.trim() });
    setEditing(false);
    onShowModal(
      "Profile Updated",
      <div>
        <div style={{ fontSize: 32, marginBottom: 12 }}>✓</div>
        <p style={{ color: "var(--muted)" }}>Your profile has been saved.</p>
      </div>,
      [{ label: "Done", primary: true }]
    );
  };

  const handleLogout = () => {
    onShowModal(
      "Sign Out",
      <p style={{ color: "var(--muted)" }}>Are you sure you want to sign out of CommunitySafeConnect?</p>,
      [
        { label: "Cancel", primary: false },
        {
          label: "Sign Out",
          primary: true,
          onClick: () => {
            logout();
            onNavigate("home");
          },
        },
      ]
    );
  };

  return (
    <div>
      <SectionHeader title="My Profile" />

      {/* Avatar card */}
      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          padding: "24px 20px",
          boxShadow: "var(--shadow)",
          marginBottom: 16,
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            background: "var(--navy)",
            display: "grid",
            placeItems: "center",
            color: "#fff",
            fontWeight: 800,
            fontSize: 22,
            flexShrink: 0,
          }}
        >
          {user.avatar || user.fullName?.slice(0, 2).toUpperCase()}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 800, fontSize: 18, color: "var(--navy)", marginBottom: 2 }}>{user.fullName}</div>
          <div
            style={{
              display: "inline-block",
              padding: "3px 10px",
              borderRadius: 20,
              background: `${roleColor[user.role]}22`,
              color: roleColor[user.role],
              fontWeight: 700,
              fontSize: 12,
            }}
          >
            {roleLabel[user.role] || user.role}
          </div>
          <div style={{ color: "var(--muted)", fontSize: 13, marginTop: 4 }}>{user.org}</div>
        </div>
      </div>

      {/* Edit / Display card */}
      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          padding: "20px",
          boxShadow: "var(--shadow)",
          marginBottom: 16,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <span style={{ fontWeight: 700, color: "var(--navy)", fontSize: 15 }}>Account Details</span>
          {!editing && (
            <button
              onClick={() => { setFullName(user.fullName); setBio(user.bio || ""); setEditing(true); }}
              style={{
                background: "none",
                border: "1px solid var(--line)",
                borderRadius: 8,
                padding: "6px 14px",
                cursor: "pointer",
                fontWeight: 600,
                color: "var(--navy)",
                fontSize: 13,
              }}
            >
              Edit
            </button>
          )}
        </div>

        {editing ? (
          <div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontWeight: 600, color: "var(--navy)", marginBottom: 6, fontSize: 13 }}>
                Full Name
              </label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 10,
                  border: "1px solid var(--line)",
                  fontFamily: "inherit",
                  fontSize: 14,
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontWeight: 600, color: "var(--navy)", marginBottom: 6, fontSize: 13 }}>
                Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                placeholder="Tell your community a little about yourself..."
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 10,
                  border: "1px solid var(--line)",
                  fontFamily: "inherit",
                  fontSize: 14,
                  boxSizing: "border-box",
                  resize: "vertical",
                }}
              />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setEditing(false)}
                style={{
                  flex: 1,
                  border: "1px solid var(--line)",
                  borderRadius: 10,
                  padding: "10px 0",
                  background: "#fff",
                  fontWeight: 600,
                  cursor: "pointer",
                  color: "var(--navy)",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                style={{
                  flex: 2,
                  border: 0,
                  borderRadius: 10,
                  padding: "10px 0",
                  background: "var(--navy)",
                  color: "#fff",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <InfoRow label="Email" value={user.email} />
            <InfoRow label="Organization" value={user.org} />
            {user.bio && <InfoRow label="Bio" value={user.bio} />}
          </div>
        )}
      </div>

      {/* Activity summary */}
      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          padding: "20px",
          boxShadow: "var(--shadow)",
          marginBottom: 16,
        }}
      >
        <div style={{ fontWeight: 700, color: "var(--navy)", fontSize: 15, marginBottom: 14 }}>Quick Actions</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <ActionRow icon="📋" label="My Incident Reports" onClick={() => onNavigate("incidents")} />
          <ActionRow icon="🔔" label="Notifications &amp; Alerts" onClick={() => onNavigate("home")} />
          <ActionRow icon="🏘️" label="My Safety Circle" onClick={() => onNavigate("circle")} />
          <ActionRow icon="⚙️" label="App Settings" onClick={() => onNavigate("settings")} />
        </div>
      </div>

      {/* Sign out */}
      <button
        onClick={handleLogout}
        style={{
          width: "100%",
          border: "1px solid #e53e3e",
          borderRadius: 14,
          padding: "13px 0",
          background: "#fff",
          color: "#e53e3e",
          fontWeight: 700,
          fontSize: 15,
          cursor: "pointer",
        }}
      >
        Sign Out
      </button>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div>
      <div style={{ color: "var(--muted)", fontSize: 12, fontWeight: 600, marginBottom: 2 }}>{label}</div>
      <div style={{ color: "var(--navy)", fontSize: 14, fontWeight: 500 }}>{value}</div>
    </div>
  );
}

function ActionRow({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        background: "var(--bg)",
        border: "1px solid var(--line)",
        borderRadius: 12,
        padding: "12px 14px",
        cursor: "pointer",
        textAlign: "left",
        width: "100%",
      }}
    >
      <span style={{ fontSize: 20 }}>{icon}</span>
      <span style={{ fontWeight: 600, color: "var(--navy)", fontSize: 14 }}>{label}</span>
      <span style={{ marginLeft: "auto", color: "var(--muted)" }}>›</span>
    </button>
  );
}
