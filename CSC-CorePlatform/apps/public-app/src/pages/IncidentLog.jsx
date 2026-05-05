import SectionHeader from "../components/ui/SectionHeader";
import IncidentCard from "../components/incident/IncidentCard";

export default function IncidentLog({ onShowModal, incidents = [] }) {
  const handleExport = () => {
    onShowModal(
      "Export Incident Log",
      <div>
        <p style={{ color: "var(--muted)", marginBottom: 12 }}>
          Ready to export {incidents.length} incident records as CSV?
        </p>
        <p style={{ fontSize: 13, color: "var(--navy)", fontWeight: 600 }}>
          📊 incident-log.csv
        </p>
      </div>,
      [
        { label: "Cancel", primary: false },
        {
          label: "Download",
          primary: true,
          onClick: () => {
            const csv = [
              ["Incident Type", "Status", "Location", "Date", "Notes"],
              ...incidents.map((i) => [i.type, i.status, i.location, i.createdAt || "", i.notes]),
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
          },
        },
      ]
    );
  };

  return (
    <div>
      <SectionHeader title="Incident Log" action="Export" onAction={handleExport} />
      {incidents.map((incident) => (
        <IncidentCard key={incident.id} incident={incident} onShowModal={onShowModal} />
      ))}
    </div>
  );
}
