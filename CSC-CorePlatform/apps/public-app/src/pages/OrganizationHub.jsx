import SectionHeader from "../components/ui/SectionHeader";
import AnnouncementCard from "../components/organization/AnnouncementCard";
import TaskCard from "../components/organization/TaskCard";
import { mockOrganization } from "../data/mockOrganization";

export default function OrganizationHub() {
  return (
    <div>
      <div style={{ background: "#fff", borderRadius: 24, padding: 20, boxShadow: "var(--shadow)", marginBottom: 20 }}>
        <div style={{ color: "var(--muted)", fontSize: 13 }}>My Organization</div>
        <div style={{ fontWeight: 800, fontSize: 24, color: "var(--navy)", marginTop: 4 }}>{mockOrganization.name}</div>
      </div>

      <SectionHeader title="Announcements" />
      {mockOrganization.announcements.map((item) => <AnnouncementCard key={item.id} item={item} />)}

      <SectionHeader title="Tasks" />
      {mockOrganization.tasks.map((task) => <TaskCard key={task.id} task={task} />)}

      <SectionHeader title="Debriefs" />
      {mockOrganization.debriefs.map((debrief) => (
        <div key={debrief.id} style={{ background: "#fff", borderRadius: 18, padding: 16, boxShadow: "var(--shadow)", marginBottom: 10 }}>
          <div style={{ fontWeight: 700 }}>{debrief.title}</div>
          <div style={{ color: "var(--muted)", fontSize: 14, marginTop: 6 }}>{debrief.summary}</div>
        </div>
      ))}
    </div>
  );
}
