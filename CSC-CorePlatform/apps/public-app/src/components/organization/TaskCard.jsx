export default function TaskCard({ task }) {
  return (
    <div style={{ background: "#fff", borderRadius: 18, padding: 16, boxShadow: "var(--shadow)", marginBottom: 10, display: "flex", justifyContent: "space-between", gap: 12 }}>
      <div>{task.title}</div>
      <strong style={{ color: task.status === "Completed" ? "var(--green)" : "var(--navy)" }}>{task.status}</strong>
    </div>
  );
}
