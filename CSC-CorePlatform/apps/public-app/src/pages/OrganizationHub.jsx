import { useState } from "react";
import SectionHeader from "../components/ui/SectionHeader";
import AnnouncementCard from "../components/organization/AnnouncementCard";
import TaskCard from "../components/organization/TaskCard";
import { mockOrganization } from "../data/mockOrganization";

export default function OrganizationHub({ onShowModal }) {
  const [filter, setFilter] = useState("all");

  const members = [
    { id: "m-1", name: "Sarah Johnson", role: "Director", status: "active", joinDate: "Jan 2024" },
    { id: "m-2", name: "Mike Chen", role: "Coordinator", status: "active", joinDate: "Mar 2024" },
    { id: "m-3", name: "Lisa Park", role: "Member", status: "active", joinDate: "May 2024" },
    { id: "m-4", name: "James Wilson", role: "Member", status: "inactive", joinDate: "Feb 2024" },
  ];

  const handleViewStats = () => {
    onShowModal(
      "Organization Statistics",
      <div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
          <div style={{ background: "var(--bg-soft)", borderRadius: 12, padding: 12 }}>
            <div style={{ color: "var(--muted)", fontSize: 12 }}>Total Members</div>
            <div style={{ fontWeight: 800, fontSize: 24, color: "var(--navy)" }}>4</div>
          </div>
          <div style={{ background: "var(--bg-soft)", borderRadius: 12, padding: 12 }}>
            <div style={{ color: "var(--muted)", fontSize: 12 }}>Active</div>
            <div style={{ fontWeight: 800, fontSize: 24, color: "var(--green)" }}>3</div>
          </div>
          <div style={{ background: "var(--bg-soft)", borderRadius: 12, padding: 12 }}>
            <div style={{ color: "var(--muted)", fontSize: 12 }}>Incidents This Month</div>
            <div style={{ fontWeight: 800, fontSize: 24, color: "var(--navy)" }}>7</div>
          </div>
          <div style={{ background: "var(--bg-soft)", borderRadius: 12, padding: 12 }}>
            <div style={{ color: "var(--muted)", fontSize: 12 }}>Avg Response Time</div>
            <div style={{ fontWeight: 800, fontSize: 24, color: "var(--blue)" }}>2.3m</div>
          </div>
        </div>
      </div>,
      [{ label: "Close", primary: true }]
    );
  };

  return (
    <div>
      <div style={{ background: "#fff", borderRadius: 24, padding: 20, boxShadow: "var(--shadow)", marginBottom: 20 }}>
        <div style={{ color: "var(--muted)", fontSize: 13 }}>My Organization</div>
        <div style={{ fontWeight: 800, fontSize: 24, color: "var(--navy)", marginTop: 4 }}>{mockOrganization.name}</div>
        <button 
          onClick={handleViewStats}
          style={{ marginTop: 12, border: 0, borderRadius: 12, padding: "8px 12px", background: "var(--navy)", color: "#fff", fontWeight: 600, cursor: "pointer", fontSize: 13 }}
        >
          📊 View Statistics
        </button>
      </div>

      <SectionHeader title="Organization Members" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
        {["All", "Active", "Inactive"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status.toLowerCase())}
            style={{
              border: 0,
              borderRadius: 12,
              padding: "8px 12px",
              background: (filter === status.toLowerCase() || (status === "All" && filter === "all")) ? "var(--navy)" : "#fff",
              color: (filter === status.toLowerCase() || (status === "All" && filter === "all")) ? "#fff" : "var(--navy)",
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "var(--shadow)",
              fontSize: 13,
            }}
          >
            {status}
          </button>
        ))}
      </div>

      {members
        .filter((m) => filter === "all" || m.status === filter)
        .map((member) => (
          <div key={member.id} style={{ background: "#fff", borderRadius: 18, padding: 16, boxShadow: "var(--shadow)", marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
              <div>
                <div style={{ fontWeight: 700, color: "var(--navy)" }}>{member.name}</div>
                <div style={{ color: "var(--muted)", fontSize: 13, marginTop: 4 }}>{member.role}</div>
                <div style={{ color: "var(--muted)", fontSize: 12, marginTop: 4 }}>Joined {member.joinDate}</div>
              </div>
              <div style={{ background: member.status === "active" ? "var(--green)" : "var(--muted)", color: "#fff", borderRadius: 20, padding: "4px 10px", fontSize: 12, fontWeight: 600 }}>
                {member.status === "active" ? "Active" : "Inactive"}
              </div>
            </div>
          </div>
        ))}

      <SectionHeader title="Announcements" />
      {mockOrganization.announcements.map((item) => (
        <AnnouncementCard key={item.id} item={item} />
      ))}

      <SectionHeader title="Tasks" />
      {mockOrganization.tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}

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
