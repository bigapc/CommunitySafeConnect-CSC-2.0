import { useState } from "react";

function CreateBroadcastForm({ onSubmit }) {
  const [title, setTitle] = useState("");
  const [audience, setAudience] = useState("All organizations");
  const [severity, setSeverity] = useState("info");

  return (
    <div>
      <div style={{ marginBottom: 10 }}>
        <label style={{ display: "block", fontSize: 12, color: "var(--hub-muted)", marginBottom: 4 }}>Title</label>
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Type broadcast title"
          style={{ width: "100%", borderRadius: 10, border: "1px solid var(--hub-line)", background: "var(--hub-panel-2)", color: "var(--hub-text)", padding: "10px 12px" }}
        />
      </div>
      <div style={{ marginBottom: 10 }}>
        <label style={{ display: "block", fontSize: 12, color: "var(--hub-muted)", marginBottom: 4 }}>Audience</label>
        <select
          value={audience}
          onChange={(event) => setAudience(event.target.value)}
          style={{ width: "100%", borderRadius: 10, border: "1px solid var(--hub-line)", background: "var(--hub-panel-2)", color: "var(--hub-text)", padding: "10px 12px" }}
        >
          <option>All organizations</option>
          <option>School leaders</option>
          <option>Responder units</option>
          <option>Residential communities</option>
        </select>
      </div>
      <div style={{ marginBottom: 14 }}>
        <label style={{ display: "block", fontSize: 12, color: "var(--hub-muted)", marginBottom: 4 }}>Severity</label>
        <select
          value={severity}
          onChange={(event) => setSeverity(event.target.value)}
          style={{ width: "100%", borderRadius: 10, border: "1px solid var(--hub-line)", background: "var(--hub-panel-2)", color: "var(--hub-text)", padding: "10px 12px" }}
        >
          <option value="info">Info</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
      </div>
      <button
        onClick={() => {
          if (!title.trim()) {
            return;
          }
          onSubmit({ title: title.trim(), audience, severity });
        }}
        style={{ border: 0, borderRadius: 10, padding: "10px 12px", background: "var(--hub-blue)", color: "#07131f", fontWeight: 700, cursor: "pointer", width: "100%" }}
      >
        Send Broadcast
      </button>
    </div>
  );
}

export default function Broadcasts({ broadcasts = [], createBroadcast, showModal }) {
  return (
    <div>
      <h2>Broadcasts</h2>
      {broadcasts.map((broadcast) => (
        <div key={broadcast.id} style={{ background: "var(--hub-panel)", borderRadius: 18, padding: 16, boxShadow: "var(--hub-shadow)", marginBottom: 10, border: "1px solid var(--hub-line)" }}>
          <div style={{ fontWeight: 700 }}>{broadcast.title}</div>
          <div style={{ color: "var(--hub-muted)", fontSize: 14, marginTop: 6 }}>{broadcast.audience}</div>
          <div style={{ color: "var(--hub-muted)", fontSize: 12, marginTop: 4 }}>
            {broadcast.severity?.toUpperCase() || "INFO"} - {broadcast.status || "sent"} - {broadcast.createdAt ? new Date(broadcast.createdAt).toLocaleString() : ""}
          </div>
        </div>
      ))}
      <button
        onClick={() =>
          showModal(
            "Create Broadcast",
            <CreateBroadcastForm
              onSubmit={(payload) => {
                createBroadcast(payload);
                showModal(
                  "Broadcast Sent",
                  <p style={{ color: "var(--hub-muted)" }}>{`Broadcast sent to ${payload.audience}.`}</p>,
                  [{ label: "Done", primary: true }]
                );
              }}
            />,
            [{ label: "Close", primary: false }]
          )
        }
        style={{ border: 0, borderRadius: 14, padding: "12px 16px", background: "var(--hub-blue)", color: "#07131f", fontWeight: 700, cursor: "pointer" }}
      >
        Create Broadcast
      </button>
    </div>
  );
}
