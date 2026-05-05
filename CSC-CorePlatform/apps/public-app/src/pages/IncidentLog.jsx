import SectionHeader from "../components/ui/SectionHeader";
import IncidentCard from "../components/incident/IncidentCard";
import { mockIncidents } from "../data/mockIncidents";

export default function IncidentLog() {
  const handleExport = () => {
    const csv = [
      ["Incident Type", "Status", "Location", "Date", "Notes"],
      ...mockIncidents.map((i) => [i.type, i.status, i.location, i.date, i.notes]),
    ]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "incident-log.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div>
      <SectionHeader title="Incident Log" action="Export" onAction={handleExport} />
      {mockIncidents.map((incident) => <IncidentCard key={incident.id} incident={incident} />)}
    </div>
  );
}
