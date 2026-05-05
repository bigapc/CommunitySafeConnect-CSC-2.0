export default function ContactCard({ contact }) {
  return (
    <div style={{ background: "#fff", borderRadius: 18, padding: 16, boxShadow: "var(--shadow)", marginBottom: 10 }}>
      <div style={{ fontWeight: 700 }}>{contact.name}</div>
      <div style={{ color: "var(--muted)", fontSize: 14 }}>{contact.relationship}</div>
      <div style={{ color: "var(--muted)", fontSize: 13, marginTop: 6 }}>{contact.phone}</div>
    </div>
  );
}
