export default function SOS({ onNavigate, onShowModal, incidents = [] }) {
  const activeIncident = incidents.find((incident) => incident.status === "active");

  const handleCommandCenter = () => {
    onShowModal(
      "Connecting to Command Center",
      <div>
        <div style={{ fontSize: 16, color: "var(--navy)", fontWeight: 600, marginBottom: 12 }}>
          📍 Location verified
        </div>
        <p style={{ color: "var(--muted)", marginBottom: 14 }}>
          A dispatcher has been assigned to your case. They can see your real-time location and alert status.
        </p>
        <p style={{ color: "var(--text)" }}>
          <strong>Dispatcher (Sarah K.):</strong> "We have your location and alert status. Stay calm and stay where you are if it's safe."
        </p>
      </div>,
      [{ label: "Got it", primary: true }]
    );
  };

  const handleEmergency = () => {
    onShowModal(
      "Call Emergency Services",
      <div>
        <p style={{ color: "var(--muted)", marginBottom: 14 }}>
          Tap the button below to call 911. This will exit the app and dial emergency services.
        </p>
        <p style={{ color: "var(--navy)", fontWeight: 600, fontSize: 18 }}>
          📞 (555) 911-HELP
        </p>
      </div>,
      [
        { label: "Cancel", primary: false },
        {
          label: "Call 911",
          primary: true,
          onClick: () => {
            window.location.href = "tel:911";
          },
        },
      ]
    );
  };

  const handleMessageCircle = () => {
    onShowModal(
      "Message Safety Circle",
      <div>
        <p style={{ color: "var(--muted)", marginBottom: 14 }}>
          Choose who to message about your emergency:
        </p>
        <div style={{ display: "grid", gap: 10 }}>
          {["Sarah Johnson (Sister)", "Mike Chen (Neighbor)", "Dr. Lisa Parks (Doctor)"].map((person) => (
            <button
              key={person}
              onClick={() => {
                onNavigate("circle");
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
              {person}
            </button>
          ))}
        </div>
      </div>,
      [{ label: "Close", primary: true }]
    );
  };

  return (
    <div style={{ background: "linear-gradient(150deg, #ffffff, var(--bg-soft))", borderRadius: 28, padding: 24, boxShadow: "var(--shadow)", border: "1px solid var(--line)" }}>
      <h1 style={{ marginTop: 0, color: "var(--navy)" }}>We're with you.</h1>
      <p style={{ color: "var(--muted)", lineHeight: 1.6 }}>
        Alert sent. Stay calm, keep breathing steady, and remain where you are if safe.
      </p>
      {activeIncident ? (
        <div style={{ marginTop: 12, border: "1px solid var(--line)", borderRadius: 14, padding: 12, background: "#fff" }}>
          <div style={{ color: "var(--navy)", fontWeight: 700, fontSize: 13 }}>Active Incident: {activeIncident.id}</div>
          <div style={{ color: "var(--muted)", fontSize: 13, marginTop: 4 }}>{activeIncident.notes}</div>
        </div>
      ) : null}
      <div style={{ display: "grid", gap: 12, marginTop: 20 }}>
        <button onClick={handleCommandCenter} style={{ border: 0, borderRadius: 18, padding: 16, background: "var(--navy)", color: "#fff", fontWeight: 700, cursor: "pointer" }}>
          Contact Command Center
        </button>
        <button onClick={handleEmergency} style={{ border: 0, borderRadius: 18, padding: 16, background: "var(--accent)", color: "#fff", fontWeight: 700, cursor: "pointer" }}>Call Emergency Services</button>
        <button onClick={handleMessageCircle} style={{ border: "1px solid var(--line)", borderRadius: 18, padding: 16, background: "#fff", color: "var(--navy)", fontWeight: 700, cursor: "pointer" }}>Message Safety Circle</button>
      </div>
      <div style={{ marginTop: 14, color: "var(--muted)", fontSize: 13 }}>
        Incident records are preserved. To change or close an emergency record, contact the Command Center/Hub.
      </div>
    </div>
  );
}
