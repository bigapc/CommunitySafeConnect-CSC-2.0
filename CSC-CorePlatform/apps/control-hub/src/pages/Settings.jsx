export default function Settings({ settings, setSettings, resetHubData, showModal }) {
  const toggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div>
      <h2>Settings</h2>
      <div style={{ background: "var(--hub-panel)", borderRadius: 18, padding: 16, boxShadow: "var(--hub-shadow)", marginBottom: 10, border: "1px solid var(--hub-line)" }}>
        <div style={{ fontWeight: 700, marginBottom: 10 }}>Dispatch Automation</div>
        <label style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, color: "var(--hub-muted)" }}>
          Auto-dispatch acknowledged incidents
          <input type="checkbox" checked={settings.autoDispatch} onChange={() => toggle("autoDispatch")} />
        </label>
        <label style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, color: "var(--hub-muted)" }}>
          Escalate critical incidents automatically
          <input type="checkbox" checked={settings.criticalEscalation} onChange={() => toggle("criticalEscalation")} />
        </label>
        <label style={{ display: "flex", justifyContent: "space-between", color: "var(--hub-muted)" }}>
          SMS bridge for external responders
          <input type="checkbox" checked={settings.smsBridge} onChange={() => toggle("smsBridge")} />
        </label>
      </div>

      <div style={{ background: "var(--hub-panel)", borderRadius: 18, padding: 16, boxShadow: "var(--hub-shadow)", marginBottom: 10, border: "1px solid var(--hub-line)" }}>
        <div style={{ fontWeight: 700, marginBottom: 10 }}>Contact Senior Security</div>
        <a href="mailto:security@armstrongpack.example" style={{ color: "var(--hub-blue)", display: "block", marginBottom: 8 }}>
          security@armstrongpack.example
        </a>
        <a href="tel:+15550103030" style={{ color: "var(--hub-blue)", display: "block" }}>
          +1 (555) 010-3030
        </a>
      </div>

      <button
        onClick={() =>
          showModal(
            "Reset Hub Data",
            <p style={{ color: "var(--hub-muted)" }}>Reset incidents, zones, responders, broadcasts, and settings to defaults?</p>,
            [
              { label: "Cancel", primary: false },
              { label: "Reset", primary: true, onClick: resetHubData },
            ]
          )
        }
        style={{ border: "1px solid var(--hub-line)", borderRadius: 12, padding: "10px 12px", background: "transparent", color: "var(--hub-text)", cursor: "pointer" }}
      >
        Reset Operational Data
      </button>
    </div>
  );
}
