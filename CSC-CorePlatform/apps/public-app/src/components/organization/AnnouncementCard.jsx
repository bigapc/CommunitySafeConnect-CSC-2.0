export default function AnnouncementCard({ item }) {
  const handleClick = () => {
    alert(`Announcement: ${item.title}\n\n${item.message}\n\nPosted: ${item.date}`);
  };

  return (
    <div onClick={handleClick} style={{ background: "#fff", borderRadius: 18, padding: 16, boxShadow: "var(--shadow)", marginBottom: 10, cursor: "pointer", transition: "all 0.3s ease", border: "1px solid var(--line)" }} onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 12px 32px rgba(31, 58, 90, 0.15)"} onMouseLeave={(e) => e.currentTarget.style.boxShadow = "var(--shadow)"} >
      <div style={{ fontWeight: 700, color: "var(--navy)" }}>{item.title}</div>
      <div style={{ color: "var(--muted)", fontSize: 14, marginTop: 6 }}>{item.message}</div>
      <div style={{ color: "var(--navy-2)", fontSize: 12, marginTop: 8, fontWeight: 500 }}>{item.date}</div>
    </div>
  );
}
