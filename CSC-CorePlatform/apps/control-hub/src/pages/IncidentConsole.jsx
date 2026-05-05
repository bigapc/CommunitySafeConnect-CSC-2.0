import IncidentRow from "../components/incidents/IncidentRow";
import IncidentTimeline from "../components/incidents/IncidentTimeline";
import { mockHubIncidents } from "../data/mockIncidents";

export default function IncidentConsole() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.3fr .7fr", gap: 16 }}>
      <div>
        <h2>Live Incident Console</h2>
        {mockHubIncidents.map((incident) => <IncidentRow key={incident.id} incident={incident} />)}
      </div>
      <IncidentTimeline />
    </div>
  );
}
