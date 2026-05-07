import { useMemo, useState } from "react";
import IncidentRow from "../components/incidents/IncidentRow";
import IncidentTimeline from "../components/incidents/IncidentTimeline";
import { queueIntegrationEvent } from "../../../../shared/utils/integrationBridge";

export default function IncidentConsole({ incidents = [], responders = [], updateIncident, addIncidentEvent, showModal, user }) {
  const [filter, setFilter] = useState("all");
  const [selectedIncidentId, setSelectedIncidentId] = useState(incidents[0]?.id || null);

  const filteredIncidents = useMemo(() => {
    return filter === "all" ? incidents : incidents.filter((incident) => incident.status === filter);
  }, [incidents, filter]);

  const selectedIncident = incidents.find((incident) => incident.id === selectedIncidentId) || filteredIncidents[0];

  const handleAction = (action, incident, payload) => {
    setSelectedIncidentId(incident.id);

    if (action === "acknowledge") {
      updateIncident(incident.id, { status: "acknowledged" });
      addIncidentEvent(incident.id, "Incident acknowledged by dispatcher.");
      queueIntegrationEvent({
        sourceApp: "control-hub",
        entityType: "incidents",
        action: "incident.acknowledged",
        entityId: incident.id,
        payload: { status: "acknowledged" },
        sourceUser: user,
      });
      return;
    }

    if (action === "resolve") {
      updateIncident(incident.id, { status: "resolved" });
      addIncidentEvent(incident.id, "Incident marked as resolved.");
      queueIntegrationEvent({
        sourceApp: "control-hub",
        entityType: "incidents",
        action: "incident.resolved",
        entityId: incident.id,
        payload: { status: "resolved" },
        sourceUser: user,
      });
      return;
    }

    if (action === "escalate") {
      showModal(
        "Escalate Incident",
        <p style={{ color: "var(--hub-muted)" }}>Escalate {incident.id} to senior command review?</p>,
        [
          { label: "Cancel", primary: false },
          {
            label: "Escalate",
            primary: true,
            onClick: () => {
              updateIncident(incident.id, { priority: "critical", status: "acknowledged" });
              addIncidentEvent(incident.id, "Incident escalated to senior security command.");
              queueIntegrationEvent({
                sourceApp: "control-hub",
                entityType: "incidents",
                action: "incident.escalated",
                entityId: incident.id,
                payload: { priority: "critical", status: "acknowledged" },
                sourceUser: user,
              });
            },
          },
        ]
      );
      return;
    }

    if (action === "assign") {
      updateIncident(incident.id, { assignedTo: payload, status: "acknowledged" });
      addIncidentEvent(incident.id, `Assigned to responder: ${payload}.`);
      queueIntegrationEvent({
        sourceApp: "control-hub",
        entityType: "incidents",
        action: "incident.assigned",
        entityId: incident.id,
        payload: { assignedTo: payload, status: "acknowledged" },
        sourceUser: user,
      });
    }
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.3fr .7fr", gap: 16 }}>
      <div>
        <h2>Live Incident Console</h2>
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          {["all", "active", "acknowledged", "resolved", "archived"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              style={{
                border: filter === status ? 0 : "1px solid var(--hub-line)",
                borderRadius: 10,
                padding: "8px 10px",
                background: filter === status ? "var(--hub-blue)" : "transparent",
                color: filter === status ? "#07131f" : "var(--hub-text)",
                fontWeight: 700,
                cursor: "pointer",
                textTransform: "capitalize",
              }}
            >
              {status}
            </button>
          ))}
        </div>
        {filteredIncidents.map((incident) => (
          <div key={incident.id} onClick={() => setSelectedIncidentId(incident.id)}>
            <IncidentRow incident={incident} responders={responders} onAction={handleAction} />
          </div>
        ))}
      </div>
      <IncidentTimeline incident={selectedIncident} />
    </div>
  );
}
