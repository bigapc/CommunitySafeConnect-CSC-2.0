export default function SectionHeader({ title, action, onAction }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
      <h2 style={{ margin: 0, fontSize: 18, color: "var(--navy)" }}>{title}</h2>
      {action ? <button onClick={onAction} style={{ border: 0, background: "transparent", color: "var(--navy-2)", cursor: "pointer", fontSize: 14, fontWeight: 600 }}>{action}</button> : null}
    </div>
  );
}
