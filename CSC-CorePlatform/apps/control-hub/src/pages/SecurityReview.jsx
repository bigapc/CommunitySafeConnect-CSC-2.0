import AccessPanel from "../components/security/AccessPanel";

export default function SecurityReview({ incidents = [], responders = [], showModal }) {
  const handleExportAudit = () => {
    const lines = [
      `Audit Export Generated: ${new Date().toISOString()}`,
      `Incidents tracked: ${incidents.length}`,
      `Verified responders: ${responders.filter((responder) => responder.status === "verified").length}`,
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `hub-audit-${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div>
      <h2>Security Review</h2>
      <AccessPanel
        onRequestReview={() =>
          showModal(
            "Security Review Requested",
            <p style={{ color: "var(--hub-muted)" }}>Request submitted to Armstrong Pack Company senior security coordinators.</p>,
            [{ label: "Close", primary: true }]
          )
        }
        onExportAudit={handleExportAudit}
      />
    </div>
  );
}
