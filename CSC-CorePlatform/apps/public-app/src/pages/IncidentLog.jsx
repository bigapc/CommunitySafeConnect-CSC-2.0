import { useState } from "react";
import SectionHeader from "../components/ui/SectionHeader";
import IncidentCard from "../components/incident/IncidentCard";

export default function IncidentLog({ onShowModal, incidents = [] }) {
  const [sortBy, setSortBy] = useState("recent");
  const [filterStatus, setFilterStatus] = useState("all");

  const statusColors = {
    active: "var(--accent)",
    acknowledged: "var(--blue)",
    resolved: "var(--green)",
    submitted: "var(--navy)",
  };

  const sortedIncidents = [...incidents].sort((a, b) => {
    if (sortBy === "recent") return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    if (sortBy === "oldest") return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
    return 0;
  });

  const filtered = filterStatus === "all" ? sortedIncidents : sortedIncidents.filter((i) => i.status === filterStatus);

  const handleIncidentDetail = (incident) => {
    const timeline = [
      { time: new Date(incident.createdAt).toLocaleTimeString(), event: `Incident created (${incident.type})`, icon: "📍" },
      { time: new Date(new Date(incident.createdAt).getTime() + 60000).toLocaleTimeString(), event: "Processed by Command Center", icon: "✓" },
      { time: new Date(new Date(incident.createdAt).getTime() + 120000).toLocaleTimeString(), event: "Responder assigned", icon: "👤" },
    ];

    onShowModal(
      `Incident ${incident.id}`,
      <div>
        <div style={{ marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid var(--line)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <p style={{ color: "var(--muted)", fontSize: 12, marginBottom: 4 }}>Type</p>
              <p style={{ fontWeight: 700, color: "var(--navy)" }}>{incident.type}</p>
            </div>
            <div>
              <p style={{ color: "var(--muted)", fontSize: 12, marginBottom: 4 }}>Status</p>
              <p style={{ fontWeight: 700, color: statusColors[incident.status] }}>{incident.status}</p>
            </div>
          </div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <p style={{ color: "var(--muted)", fontSize: 12, marginBottom: 4 }}>Location</p>
          <p style={{ fontWeight: 700, color: "var(--navy)" }}>{incident.location}</p>
        </div>
        <div style={{ marginBottom: 16 }}>
          <p style={{ color: "var(--muted)", fontSize: 12, marginBottom: 8 }}>Timeline</p>
          {timeline.map((entry, i) => (
            <div key={i} style={{ display: "flex", gap: 12, marginBottom: 12 }}>
              <div style={{ fontSize: 18, minWidth: 24, textAlign: "center" }}>{entry.icon}</div>
              <div>
                <div style={{ fontWeight: 600, color: "var(--navy)" }}>{entry.time}</div>
                <div style={{ color: "var(--muted)", fontSize: 13 }}>{entry.event}</div>
              </div>
            </div>
          ))}
        </div>
      </div>,
      [{ label: "Close", primary: true }]
    );
  };

  const handleExport = () => {
    onShowModal(
      "Export Incident Log",
      <div>
        <p style={{ color: "var(--muted)", marginBottom: 12 }}>
          Ready to export {incidents.length} incident records?
        </p>
        <p style={{ fontSize: 13, color: "var(--navy)", fontWeight: 600, marginBottom: 12 }}>
          📊 incident-log.csv
        </p>
        <div style={{ background: "var(--bg-soft)", borderRadius: 12, padding: 12, marginBottom: 12 }}>
          <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6 }}>Includes:</p>
          <ul style={{ fontSize: 12, color: "var(--muted)", paddingLeft: 18, margin: 0 }}>
            <li>Incident type, status, location, date</li>
            <li>Response time metrics</li>
            <li>Notes and details</li>
          </ul>
        </div>
      </div>,
      [
        { label: "Cancel", primary: false },
        {
          label: "Download CSV",
          primary: true,
          onClick: () => {
            const csv = [
              ["Incident ID", "Type", "Status", "Location", "Date", "Notes"],
              ...incidents.map((i) => [i.id, i.type, i.status, i.location, i.createdAt || "", i.notes]),
            ]
              .map((row) => row.map((cell) => `"${cell}"`).join(","))
              .join("\n");
            const blob = new Blob([csv], { type: "text/csv" });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `incident-log-${new Date().toISOString().split("T")[0]}.csv`;
            a.click();
            window.URL.revokeObjectURL(url);
          },
        },
      ]
    );
  };

  const stats = {
    total: incidents.length,
    active: incidents.filter((i) => i.status === "active").length,
    resolved: incidents.filter((i) => i.status === "resolved").length,
  };

  return (
    <div>
      <SectionHeader title="Incident Log" action="Export" onAction={handleExport} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
        <div style={{ background: "var(--accent)", color: "#fff", borderRadius: 18, padding: 14, textAlign: "center" }}>
          <div style={{ fontSize: 12, opacity: 0.9 }}>Total</div>
          <div style={{ fontWeight: 800, fontSize: 24 }}>{stats.total}</div>
        </div>
        <div style={{ background: "var(--navy)", color: "#fff", borderRadius: 18, padding: 14, textAlign: "center" }}>
          <div style={{ fontSize: 12, opacity: 0.9 }}>Active</div>
          <div style={{ fontWeight: 800, fontSize: 24 }}>{stats.active}</div>
        </div>
        <div style={{ background: "var(--green)", color: "#fff", borderRadius: 18, padding: 14, textAlign: "center" }}>
          <div style={{ fontSize: 12, opacity: 0.9 }}>Resolved</div>
          <div style={{ fontWeight: 800, fontSize: 24 }}>{stats.resolved}</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16, overflowX: "auto" }}>
        {["all", "active", "acknowledged", "resolved"].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            style={{
              border: 0,
              borderRadius: 20,
              padding: "8px 14px",
              background: filterStatus === status ? "var(--navy)" : "#fff",
              color: filterStatus === status ? "#fff" : "var(--navy)",
              fontWeight: 600,
              cursor: "pointer",
              whiteSpace: "nowrap",
              boxShadow: "var(--shadow)",
              fontSize: 13,
            }}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {["recent", "oldest"].map((sort) => (
          <button
            key={sort}
            onClick={() => setSortBy(sort)}
            style={{
              border: sortBy === sort ? "2px solid var(--navy)" : "1px solid var(--line)",
              borderRadius: 12,
              padding: "8px 12px",
              background: "#fff",
              color: "var(--navy)",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: 13,
            }}
          >
            {sort === "recent" ? "⏰ Most Recent" : "📅 Oldest First"}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: 40, color: "var(--muted)" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
          <p>No incidents found</p>
        </div>
      ) : (
        filtered.map((incident) => (
          <div key={incident.id} onClick={() => handleIncidentDetail(incident)} style={{ cursor: "pointer" }}>
            <IncidentCard incident={incident} onShowModal={onShowModal} />
          </div>
        ))
      )}
    </div>
  );
}
