export default function AnnouncementCard({ item }) {
  return (
    <div style={{ background: "#fff", borderRadius: 18, padding: 16, boxShadow: "var(--shadow)", marginBottom: 10 }}>
      <div style={{ fontWeight: 700 }}>{item.title}</div>
      <div style={{ color: "var(--muted)", fontSize: 14, marginTop: 6 }}>{item.message}</div>
      <div style={{ color: "var(--muted)", fontSize: 12, marginTop: 8 }}>{item.date}</div>
    </div>
  );
}
