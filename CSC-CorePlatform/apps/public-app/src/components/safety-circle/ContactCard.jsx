export default function ContactCard({ contact, onNavigate, onShowModal }) {
  const handleCall = () => {
    onShowModal(
      "Call Contact",
      <div>
        <p style={{ color: "var(--muted)", marginBottom: 14 }}>
          Ready to call {contact.name}?
        </p>
        <p style={{ fontSize: 16, fontWeight: 600, color: "var(--navy)" }}>
          {contact.phone}
        </p>
      </div>,
      [
        { label: "Cancel", primary: false },
        {
          label: "Call",
          primary: true,
          onClick: () => {
            window.location.href = `tel:${contact.phone}`;
          },
        },
      ]
    );
  };

  const handleMessage = (type) => {
    onShowModal(
      `Message ${contact.name}`,
      <div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", color: "var(--navy)", fontWeight: 600, marginBottom: 6 }}>
            Message
          </label>
          <textarea
            placeholder="Type your message..."
            defaultValue="I'm requesting assistance."
            style={{
              width: "100%",
              border: "1px solid var(--line)",
              borderRadius: 10,
              padding: 10,
              fontFamily: "inherit",
              fontSize: 14,
              minHeight: 80,
              boxSizing: "border-box",
            }}
          />
        </div>
      </div>,
      [
        { label: "Cancel", primary: false },
        { label: "Send", primary: true },
      ]
    );
  };

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 18,
        padding: 16,
        boxShadow: "var(--shadow)",
        marginBottom: 10,
        cursor: "pointer",
        transition: "all 0.3s ease",
        border: "1px solid var(--line)",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 12px 32px rgba(31, 58, 90, 0.15)")}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "var(--shadow)")}
    >
      <div style={{ fontWeight: 700, marginBottom: 8, color: "var(--navy)" }}>{contact.name}</div>
      <div style={{ color: "var(--muted)", fontSize: 14 }}>{contact.relationship}</div>
      <div style={{ color: "var(--muted)", fontSize: 13, marginTop: 6, marginBottom: 10 }}>{contact.phone}</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <button
          onClick={handleCall}
          style={{
            border: 0,
            borderRadius: 12,
            padding: 8,
            background: "var(--green)",
            color: "#fff",
            fontWeight: 600,
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          Call
        </button>
        <button
          onClick={() => handleMessage("text")}
          style={{
            border: 0,
            borderRadius: 12,
            padding: 8,
            background: "var(--navy-2)",
            color: "#fff",
            fontWeight: 600,
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          Message
        </button>
      </div>
    </div>
  );
}
