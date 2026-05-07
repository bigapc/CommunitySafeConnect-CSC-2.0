import { useState } from "react";
import SectionHeader from "../components/ui/SectionHeader";

const emergencyContacts = [
  { id: "ec-1", name: "911 Emergency", phone: "911", type: "Emergency Services", priority: "critical" },
  { id: "ec-2", name: "Poison Control", phone: "(555) 123-4567", type: "Medical", priority: "high" },
  { id: "ec-3", name: "Mental Health Crisis", phone: "(555) 987-6543", type: "Mental Health", priority: "high" },
  { id: "ec-4", name: "Local Police Non-Emergency", phone: "(555) 234-5678", type: "Law Enforcement", priority: "normal" },
  { id: "ec-5", name: "Fire Department", phone: "(555) 345-6789", type: "Emergency Services", priority: "high" },
];

export default function EmergencyContacts({ onShowModal }) {
  const [favorites, setFavorites] = useState(["ec-1"]);
  const [recentCalls, setRecentCalls] = useState([
    { id: "rc-1", contact: "911 Emergency", date: "Today 2:15 PM", duration: "5 min" },
    { id: "rc-2", contact: "Local Police Non-Emergency", date: "Yesterday 10:30 AM", duration: "3 min" },
  ]);

  const handleToggleFavorite = (id) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]));
  };

  const handleCall = (contact) => {
    onShowModal(
      `Call ${contact.name}?`,
      <div>
        <p style={{ color: "var(--muted)", marginBottom: 12 }}>
          Ready to call {contact.name}?
        </p>
        <p style={{ color: "var(--navy)", fontWeight: 600, fontSize: 18, marginBottom: 12 }}>
          📞 {contact.phone}
        </p>
        <div style={{ background: "var(--bg-soft)", borderRadius: 12, padding: 12 }}>
          <p style={{ fontSize: 12, color: "var(--muted)", margin: 0 }}>
            ℹ️ Type: {contact.type}
          </p>
        </div>
      </div>,
      [
        { label: "Cancel", primary: false },
        {
          label: "Call Now",
          primary: true,
          onClick: () => {
            window.location.href = `tel:${contact.phone}`;
            setRecentCalls((prev) => [
              {
                id: `rc-${Date.now()}`,
                contact: contact.name,
                date: new Date().toLocaleString(),
                duration: "just now",
              },
              ...prev,
            ]);
          },
        },
      ]
    );
  };

  const handleViewAnalytics = () => {
    onShowModal(
      "Emergency Contact Analytics",
      <div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
          <div style={{ background: "var(--bg-soft)", borderRadius: 12, padding: 12 }}>
            <div style={{ color: "var(--muted)", fontSize: 12 }}>Total Contacts</div>
            <div style={{ fontWeight: 800, fontSize: 24, color: "var(--navy)" }}>5</div>
          </div>
          <div style={{ background: "var(--bg-soft)", borderRadius: 12, padding: 12 }}>
            <div style={{ color: "var(--muted)", fontSize: 12 }}>Favorite</div>
            <div style={{ fontWeight: 800, fontSize: 24, color: "var(--accent)" }}>{favorites.length}</div>
          </div>
          <div style={{ background: "var(--bg-soft)", borderRadius: 12, padding: 12 }}>
            <div style={{ color: "var(--muted)", fontSize: 12 }}>Recent Calls</div>
            <div style={{ fontWeight: 800, fontSize: 24, color: "var(--blue)" }}>{recentCalls.length}</div>
          </div>
          <div style={{ background: "var(--bg-soft)", borderRadius: 12, padding: 12 }}>
            <div style={{ color: "var(--muted)", fontSize: 12 }}>Average Response</div>
            <div style={{ fontWeight: 800, fontSize: 24, color: "var(--green)" }}>4.2m</div>
          </div>
        </div>
        <div>
          <p style={{ fontWeight: 600, color: "var(--navy)", marginBottom: 8 }}>Contact Categories</p>
          <div style={{ display: "grid", gap: 6 }}>
            {["Emergency Services", "Medical", "Mental Health", "Law Enforcement"].map((cat) => (
              <div key={cat} style={{ background: "var(--bg-soft)", borderRadius: 8, padding: 10, display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--navy)", fontWeight: 600 }}>{cat}</span>
                <span style={{ color: "var(--muted)", fontWeight: 600 }}>
                  {emergencyContacts.filter((c) => c.type === cat).length}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>,
      [{ label: "Close", primary: true }]
    );
  };

  const favoriteContacts = emergencyContacts.filter((c) => favorites.includes(c.id));
  const otherContacts = emergencyContacts.filter((c) => !favorites.includes(c.id));

  return (
    <div>
      <SectionHeader title="Emergency Contacts & Analytics" action="Analytics" onAction={handleViewAnalytics} />

      {favoriteContacts.length > 0 && (
        <>
          <div style={{ background: "linear-gradient(135deg, var(--accent), #d67a86)", borderRadius: 20, padding: 16, marginBottom: 16, color: "#fff" }}>
            <div style={{ fontWeight: 700, marginBottom: 12 }}>⭐ Quick Access</div>
            <div style={{ display: "grid", gap: 8 }}>
              {favoriteContacts.map((contact) => (
                <button
                  key={contact.id}
                  onClick={() => handleCall(contact)}
                  style={{
                    border: 0,
                    background: "rgba(255, 255, 255, 0.2)",
                    color: "#fff",
                    borderRadius: 12,
                    padding: "12px 14px",
                    fontWeight: 700,
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  📞 {contact.name}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      <SectionHeader title="All Emergency Contacts" />
      {otherContacts.map((contact) => (
        <div key={contact.id} style={{ background: "#fff", borderRadius: 18, padding: 16, boxShadow: "var(--shadow)", marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 12 }}>
            <div>
              <div style={{ fontWeight: 700, color: "var(--navy)" }}>{contact.name}</div>
              <div style={{ color: "var(--muted)", fontSize: 13, marginTop: 4 }}>{contact.type}</div>
            </div>
            <button
              onClick={() => handleToggleFavorite(contact.id)}
              style={{
                background: "none",
                border: 0,
                fontSize: 20,
                cursor: "pointer",
              }}
            >
              {favorites.includes(contact.id) ? "⭐" : "☆"}
            </button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <button
              onClick={() => handleCall(contact)}
              style={{
                border: 0,
                borderRadius: 12,
                padding: "10px 12px",
                background: contact.priority === "critical" ? "var(--accent)" : "var(--navy)",
                color: "#fff",
                fontWeight: 600,
                cursor: "pointer",
                fontSize: 13,
              }}
            >
              📞 Call
            </button>
            <button
              style={{
                border: "1px solid var(--line)",
                borderRadius: 12,
                padding: "10px 12px",
                background: "#fff",
                color: "var(--navy)",
                fontWeight: 600,
                cursor: "pointer",
                fontSize: 13,
              }}
            >
              {contact.phone}
            </button>
          </div>
        </div>
      ))}

      {recentCalls.length > 0 && (
        <>
          <SectionHeader title="Recent Calls" />
          {recentCalls.map((call) => (
            <div key={call.id} style={{ background: "#fff", borderRadius: 18, padding: 16, boxShadow: "var(--shadow)", marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 700, color: "var(--navy)" }}>{call.contact}</div>
                  <div style={{ color: "var(--muted)", fontSize: 13, marginTop: 4 }}>{call.date}</div>
                </div>
                <div style={{ color: "var(--muted)", fontWeight: 600, fontSize: 13 }}>
                  ⏱️ {call.duration}
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
