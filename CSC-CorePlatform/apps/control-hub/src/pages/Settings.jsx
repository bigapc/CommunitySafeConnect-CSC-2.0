export default function Settings() {
  const items = [
    "Admin Profile",
    "Role Access",
    "Security Policies",
    "Notification Controls",
    "Contact Senior Security",
  ];

  return (
    <div>
      <h2>Settings</h2>
      {items.map((item) => (
        <div key={item} style={{ background: "var(--hub-panel)", borderRadius: 18, padding: 16, boxShadow: "var(--hub-shadow)", marginBottom: 10 }}>
          {item}
        </div>
      ))}
    </div>
  );
}
