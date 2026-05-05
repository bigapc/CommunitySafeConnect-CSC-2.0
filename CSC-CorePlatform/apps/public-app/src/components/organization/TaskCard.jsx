export default function TaskCard({ task }) {
  const handleClick = () => {
    const action = task.status === "Completed" ? "View" : "Start working on";
    alert(`${action} task: ${task.title}\n\nStatus: ${task.status}\n\nClick here to open task details.`);
  };

  const statusColor = task.status === "Completed" ? "var(--green)" : task.status === "In Progress" ? "var(--accent)" : "var(--navy)";

  return (
    <div onClick={handleClick} style={{ background: "#fff", borderRadius: 18, padding: 16, boxShadow: "var(--shadow)", marginBottom: 10, display: "flex", justifyContent: "space-between", gap: 12, cursor: "pointer", transition: "all 0.3s ease", border: "1px solid var(--line)" }} onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 12px 32px rgba(31, 58, 90, 0.15)"} onMouseLeave={(e) => e.currentTarget.style.boxShadow = "var(--shadow)"} >
      <div style={{ fontWeight: 600, color: "var(--navy)" }}>{task.title}</div>
      <strong style={{ color: statusColor, fontSize: 12, whiteSpace: "nowrap" }}>{task.status}</strong>
    </div>
  );
}
