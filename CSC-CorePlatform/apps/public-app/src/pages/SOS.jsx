export default function SOS({ onNavigate }) {
  const handleCommandCenter = () => {
    alert("Connecting you to the Command Center...\n\nDispatcher: We have your location and alert status. Stay calm.");
  };

  const handleEmergency = () => {
    window.location.href = "tel:911";
  };

  const handleMessageCircle = () => {
    onNavigate("circle");
  };

  return (
    <div style={{ background: "linear-gradient(150deg, #ffffff, var(--bg-soft))", borderRadius: 28, padding: 24, boxShadow: "var(--shadow)", border: "1px solid var(--line)" }}>
      <h1 style={{ marginTop: 0, color: "var(--navy)" }}>We're with you.</h1>
      <p style={{ color: "var(--muted)", lineHeight: 1.6 }}>
        Alert sent. Stay calm, keep breathing steady, and remain where you are if safe.
      </p>
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
