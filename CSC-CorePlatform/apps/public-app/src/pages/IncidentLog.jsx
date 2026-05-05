import SectionHeader from "../components/ui/SectionHeader";
import IncidentCard from "../components/incident/IncidentCard";
import { mockIncidents } from "../data/mockIncidents";

export default function IncidentLog() {
  return (
    <div>
      <SectionHeader title="Incident Log" action="Export" />
      {mockIncidents.map((incident) => <IncidentCard key={incident.id} incident={incident} />)}
    </div>
  );
}
