export default function ContactCard({ contact, onNavigate }) {
  const handleCall = () => {
    window.location.href = `tel:${contact.phone}`;
  };

  const handleMessage = () => {
    alert(`Sending message to ${contact.name}...\n\nMessage: I'm requesting assistance.`);
  };

  return (
    <div style={{ background: "#fff", borderRadius: 18, padding: 16, boxShadow: "var(--shadow)", marginBottom: 10, cursor: "pointer", transition: "all 0.3s ease", border: "1px solid var(--line)" }} onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 12px 32px rgba(31, 58, 90, 0.15)"} onMouseLeave={(e) => e.currentTarget.style.boxShadow = "var(--shadow)"} >
      <div style={{ fontWeight: 700, marginBottom: 8 }}>{contact.name}</div>
      <div style={{ color: "var(--muted)", fontSize: 14 }}>{contact.relationship}</div>
      <div style={{ color: "var(--muted)", fontSize: 13, marginTop: 6, marginBottom: 10 }}>{contact.phone}</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <button onClick={handleCall} style={{ border: 0, borderRadius: 12, padding: 8, background: "var(--green)", color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
          Call
        </button>
        <button onClick={handleMessage} style={{ border: 0, borderRadius: 12, padding: 8, background: "var(--navy-2)", color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
          Message
        </button>
      </div>
    </div>
  );
}
