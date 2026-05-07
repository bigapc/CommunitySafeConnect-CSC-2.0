import { useState } from "react";
import SectionHeader from "../components/ui/SectionHeader";
import ContactCard from "../components/safety-circle/ContactCard";
import AddContactForm from "../components/forms/AddContactForm";
import { mockSafetyCircle } from "../data/mockSafetyCircle";

export default function SafetyCircle({ onNavigate, onShowModal }) {
  const [contacts, setContacts] = useState(mockSafetyCircle.map((c, i) => ({ ...c, priority: i === 0 ? "high" : "normal" })));
  const [broadcastMessage, setBroadcastMessage] = useState("");

  const handleAddContact = () => {
    onShowModal(
      "Add New Contact",
      <AddContactForm
        onSubmit={(formData) => {
          const newContact = {
            id: `c-${Date.now()}`,
            ...formData,
            priority: "normal",
          };
          setContacts([...contacts, newContact]);
          onShowModal(
            "Success!",
            <div>
              <div style={{ fontSize: 32, marginBottom: 12 }}>✓</div>
              <p style={{ color: "var(--muted)" }}>
                {formData.name} has been added to your Safety Circle.
              </p>
            </div>,
            [{ label: "Done", primary: true }]
          );
        }}
        onCancel={() => {}}
      />,
      []
    );
  };

  const handleQuickCall = (contact) => {
    onShowModal(
      `Call ${contact.name}?`,
      <div>
        <p style={{ color: "var(--muted)", marginBottom: 12 }}>
          Ready to call {contact.name} at {contact.phone}?
        </p>
        <p style={{ color: "var(--navy)", fontWeight: 600, fontSize: 16 }}>
          📞 {contact.phone}
        </p>
      </div>,
      [
        { label: "Cancel", primary: false },
        {
          label: "Call Now",
          primary: true,
          onClick: () => {
            window.location.href = `tel:${contact.phone}`;
          },
        },
      ]
    );
  };

  const handleQuickMessage = (contact) => {
    onShowModal(
      `Message ${contact.name}`,
      <div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 6, fontWeight: 600, color: "var(--navy)" }}>Quick messages</label>
          <div style={{ display: "grid", gap: 8 }}>
            {["I need help", "I'm safe but checking in", "Emergency in progress", "Custom message"].map((msg) => (
              <button
                key={msg}
                onClick={() => {
                  onShowModal(
                    "Message Sent",
                    <div>
                      <div style={{ fontSize: 32, marginBottom: 12 }}>✓</div>
                      <p style={{ color: "var(--muted)" }}>
                        Your message has been sent to {contact.name}.
                      </p>
                    </div>,
                    [{ label: "Done", primary: true }]
                  );
                }}
                style={{
                  border: "1px solid var(--line)",
                  borderRadius: 10,
                  padding: 12,
                  background: "#fff",
                  color: "var(--navy)",
                  fontWeight: 600,
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                {msg}
              </button>
            ))}
          </div>
        </div>
      </div>,
      []
    );
  };

  const handleBroadcast = () => {
    onShowModal(
      "Send Alert to Safety Circle",
      <div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 6, fontWeight: 600, color: "var(--navy)" }}>Alert type</label>
          <select style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid var(--line)", fontFamily: "inherit" }}>
            <option>I need immediate help</option>
            <option>I'm in a safe place</option>
            <option>Check-in alert</option>
            <option>Custom message</option>
          </select>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 6, fontWeight: 600, color: "var(--navy)" }}>Recipients</label>
          <div style={{ display: "grid", gap: 8 }}>
            {contacts.map((c) => (
              <label key={c.id} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                <input type="checkbox" defaultChecked style={{ cursor: "pointer" }} />
                <span style={{ color: "var(--navy)", fontWeight: 600 }}>{c.name}</span>
              </label>
            ))}
          </div>
        </div>
      </div>,
      [
        { label: "Cancel", primary: false },
        {
          label: "Send Alert",
          primary: true,
          onClick: () => {
            onShowModal(
              "Alert Sent",
              <div>
                <div style={{ fontSize: 32, marginBottom: 12 }}>🔔</div>
                <p style={{ color: "var(--muted)" }}>
                  Alert sent to {contacts.length} contacts in your Safety Circle.
                </p>
              </div>,
              [{ label: "Done", primary: true }]
            );
          },
        },
      ]
    );
  };

  const handleImSafe = () => {
    onShowModal(
      "Alert Status Updated",
      <div>
        <div style={{ fontSize: 48, marginBottom: 12 }}>✓</div>
        <p style={{ fontSize: 16, fontWeight: 600, color: "var(--green)", marginBottom: 12 }}>
          You're marked as safe
        </p>
        <p style={{ color: "var(--muted)", marginBottom: 14 }}>
          Your Safety Circle has been notified that you're safe. The incident record has been updated.
        </p>
        <ul style={{ color: "var(--muted)", fontSize: 13, paddingLeft: 18 }}>
          <li>{contacts.length} contacts notified</li>
          <li>Command Center updated</li>
          <li>Incident log preserved</li>
        </ul>
      </div>,
      [{ label: "Return Home", primary: true }]
    );
  };

  return (
    <div>
      <SectionHeader title="Your trusted circle" action="Add Contact" onAction={handleAddContact} />
      
      <button 
        onClick={handleBroadcast}
        style={{
          width: "100%",
          border: 0,
          borderRadius: 18,
          padding: 14,
          background: "var(--accent)",
          color: "#fff",
          fontWeight: 700,
          marginBottom: 12,
          cursor: "pointer",
        }}
      >
        🔔 Send Alert to Circle
      </button>

      {contacts.map((contact) => (
        <div key={contact.id} style={{ background: "#fff", borderRadius: 18, padding: 16, boxShadow: "var(--shadow)", marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 12 }}>
            <div>
              <div style={{ fontWeight: 700, color: "var(--navy)" }}>{contact.name}</div>
              <div style={{ color: "var(--muted)", fontSize: 13, marginTop: 4 }}>{contact.relationship}</div>
            </div>
            {contact.priority === "high" && <span style={{ background: "var(--accent)", color: "#fff", borderRadius: 12, padding: "4px 10px", fontSize: 11, fontWeight: 700 }}>⭐ Priority</span>}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <button 
              onClick={() => handleQuickCall(contact)}
              style={{
                border: 0,
                borderRadius: 12,
                padding: "10px 12px",
                background: "var(--navy)",
                color: "#fff",
                fontWeight: 600,
                cursor: "pointer",
                fontSize: 13,
              }}
            >
              📞 Call
            </button>
            <button 
              onClick={() => handleQuickMessage(contact)}
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
              💬 Message
            </button>
          </div>
        </div>
      ))}

      <button
        onClick={handleImSafe}
        style={{
          width: "100%",
          border: 0,
          borderRadius: 18,
          padding: 16,
          background: "var(--navy)",
          color: "#fff",
          fontWeight: 700,
          marginTop: 10,
          cursor: "pointer",
        }}
      >
        I'm Safe
      </button>
    </div>
  );
}
