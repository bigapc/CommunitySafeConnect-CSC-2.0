export default function OrganizationCard({ org }) {
  return (
    <div style={{ background: "var(--hub-panel)", borderRadius: 18, padding: 16, boxShadow: "var(--hub-shadow)", marginBottom: 10 }}>
      <div style={{ fontWeight: 700 }}>{org.name}</div>
      <div style={{ color: "var(--hub-muted)", fontSize: 14 }}>{org.type}</div>
      <div style={{ marginTop: 8 }}>{org.status}</div>
    </div>
  );
}
