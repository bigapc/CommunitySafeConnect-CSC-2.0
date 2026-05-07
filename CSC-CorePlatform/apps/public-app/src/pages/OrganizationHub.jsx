import { useEffect, useMemo, useState } from "react";
import SectionHeader from "../components/ui/SectionHeader";
import AnnouncementCard from "../components/organization/AnnouncementCard";
import TaskCard from "../components/organization/TaskCard";
import { mockOrganization } from "../data/mockOrganization";
import { defaultWebhookRegistry, queueIntegrationEvent, readIntegrationOutbox, readWebhookRegistry } from "../../../../shared/utils/integrationBridge";

const organizationStorageKey = "csc-public-organization-hub-v1";
const hubStateStorageKey = "csc-control-hub-state-v1";

const defaultMembers = [
  { id: "m-1", name: "Sarah Johnson", role: "Director", status: "active", joinDate: "Jan 2024", email: "sarah@northside.org" },
  { id: "m-2", name: "Mike Chen", role: "Coordinator", status: "active", joinDate: "Mar 2024", email: "mike@northside.org" },
  { id: "m-3", name: "Lisa Park", role: "Member", status: "active", joinDate: "May 2024", email: "lisa@northside.org" },
  { id: "m-4", name: "James Wilson", role: "Member", status: "inactive", joinDate: "Feb 2024", email: "james@northside.org" },
];

function readStoredOrganizationState() {
  if (typeof window === "undefined") {
    return {
      profile: mockOrganization,
      members: defaultMembers,
      announcements: mockOrganization.announcements,
      tasks: mockOrganization.tasks,
      debriefs: mockOrganization.debriefs,
    };
  }

  try {
    const raw = window.localStorage.getItem(organizationStorageKey);
    if (!raw) {
      return {
        profile: mockOrganization,
        members: defaultMembers,
        announcements: mockOrganization.announcements,
        tasks: mockOrganization.tasks,
        debriefs: mockOrganization.debriefs,
      };
    }

    const parsed = JSON.parse(raw);
    return {
      profile: { ...mockOrganization, ...(parsed.profile || {}) },
      members: Array.isArray(parsed.members) ? parsed.members : defaultMembers,
      announcements: Array.isArray(parsed.announcements) ? parsed.announcements : mockOrganization.announcements,
      tasks: Array.isArray(parsed.tasks) ? parsed.tasks : mockOrganization.tasks,
      debriefs: Array.isArray(parsed.debriefs) ? parsed.debriefs : mockOrganization.debriefs,
    };
  } catch {
    return {
      profile: mockOrganization,
      members: defaultMembers,
      announcements: mockOrganization.announcements,
      tasks: mockOrganization.tasks,
      debriefs: mockOrganization.debriefs,
    };
  }
}

function readHubOrganizationPatch(orgId) {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(hubStateStorageKey);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw);
    const organizations = Array.isArray(parsed.organizations) ? parsed.organizations : [];
    return organizations.find((organization) => organization.id === orgId) || null;
  } catch {
    return null;
  }
}

export default function OrganizationHub({ onShowModal, user }) {
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const initialState = readStoredOrganizationState();
  const [profile, setProfile] = useState(initialState.profile);
  const [members, setMembers] = useState(initialState.members);
  const [announcements, setAnnouncements] = useState(initialState.announcements);
  const [tasks, setTasks] = useState(initialState.tasks);
  const [debriefs, setDebriefs] = useState(initialState.debriefs);
  const [outboxCount, setOutboxCount] = useState(readIntegrationOutbox().length);
  const [webhooks] = useState(readWebhookRegistry());

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(
      organizationStorageKey,
      JSON.stringify({ profile, members, announcements, tasks, debriefs })
    );
  }, [announcements, debriefs, members, profile, tasks]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const syncFromHub = () => {
      const patch = readHubOrganizationPatch(profile.id);
      if (!patch) {
        return;
      }
      setProfile((prev) => ({
        ...prev,
        type: patch.type || prev.type,
        status: patch.status || prev.status,
        coordinator: patch.coordinator || prev.coordinator,
      }));
    };

    const refreshOutbox = () => setOutboxCount(readIntegrationOutbox().length);
    const onStorage = (event) => {
      if (event.key === hubStateStorageKey) {
        syncFromHub();
      }
      if (event.key === "csc-integration-outbox-v1") {
        refreshOutbox();
      }
    };
    const onOutboxEvent = () => refreshOutbox();

    syncFromHub();
    window.addEventListener("storage", onStorage);
    window.addEventListener("csc:integration-outbox-updated", onOutboxEvent);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("csc:integration-outbox-updated", onOutboxEvent);
    };
  }, [profile.id]);

  const filteredMembers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return members
      .filter((member) => filter === "all" || member.status === filter)
      .filter((member) => {
        if (!normalizedQuery) {
          return true;
        }
        return `${member.name} ${member.role} ${member.email || ""}`.toLowerCase().includes(normalizedQuery);
      });
  }, [filter, members, query]);

  const organizationStats = useMemo(
    () => ({
      totalMembers: members.length,
      activeMembers: members.filter((member) => member.status === "active").length,
      incidentsThisMonth: announcements.length + tasks.length,
      openTasks: tasks.filter((task) => task.status !== "Completed").length,
    }),
    [announcements.length, members, tasks]
  );

  const emitEvent = (action, entityType, entityId, payload) => {
    queueIntegrationEvent({
      sourceApp: "public-app",
      entityType,
      action,
      entityId,
      payload,
      sourceUser: user,
    });
    setOutboxCount(readIntegrationOutbox().length);
  };

  const openMemberInvite = () => {
    onShowModal(
      "Invite Organization Member",
      <MemberInviteForm
        onSubmit={(formData) => {
          const nextMember = {
            id: `member-${Date.now()}`,
            name: formData.name,
            role: formData.role,
            email: formData.email,
            status: "invited",
            joinDate: "Pending",
          };
          setMembers((prev) => [nextMember, ...prev]);
          emitEvent("organization.member.invited", "members", nextMember.id, { organizationId: profile.id, ...nextMember });
          onShowModal("Invite Queued", <p style={{ color: "var(--muted)" }}>{nextMember.name} has been added to the organization roster and queued for backend delivery.</p>, [{ label: "Done", primary: true }]);
        }}
      />
    );
  };

  const openAnnouncementComposer = () => {
    onShowModal(
      "Post Announcement",
      <AnnouncementComposer
        onSubmit={(formData) => {
          const nextAnnouncement = {
            id: `announcement-${Date.now()}`,
            title: formData.title,
            message: formData.message,
            date: new Date().toLocaleDateString(),
          };
          setAnnouncements((prev) => [nextAnnouncement, ...prev]);
          emitEvent("organization.announcement.created", "organizations", profile.id, nextAnnouncement);
          onShowModal("Announcement Published", <p style={{ color: "var(--muted)" }}>{nextAnnouncement.title} is now visible in your organization hub and queued for webhook delivery.</p>, [{ label: "Done", primary: true }]);
        }}
      />
    );
  };

  const openTaskComposer = () => {
    onShowModal(
      "Create Task",
      <TaskComposer
        onSubmit={(formData) => {
          const nextTask = {
            id: `task-${Date.now()}`,
            title: formData.title,
            status: "Pending",
            owner: formData.owner,
          };
          setTasks((prev) => [nextTask, ...prev]);
          emitEvent("organization.task.created", "organizations", profile.id, nextTask);
          onShowModal("Task Created", <p style={{ color: "var(--muted)" }}>{nextTask.title} is ready for team assignment and backend sync.</p>, [{ label: "Done", primary: true }]);
        }}
      />
    );
  };

  const openDebriefComposer = () => {
    onShowModal(
      "Create Debrief",
      <DebriefComposer
        onSubmit={(formData) => {
          const nextDebrief = {
            id: `debrief-${Date.now()}`,
            title: formData.title,
            summary: formData.summary,
          };
          setDebriefs((prev) => [nextDebrief, ...prev]);
          emitEvent("organization.debrief.created", "organizations", profile.id, nextDebrief);
          onShowModal("Debrief Added", <p style={{ color: "var(--muted)" }}>{nextDebrief.title} is stored locally and queued for future backend sync.</p>, [{ label: "Done", primary: true }]);
        }}
      />
    );
  };

  const handleViewStats = () => {
    onShowModal(
      "Organization Statistics",
      <div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
          <div style={{ background: "var(--bg-soft)", borderRadius: 12, padding: 12 }}>
            <div style={{ color: "var(--muted)", fontSize: 12 }}>Total Members</div>
            <div style={{ fontWeight: 800, fontSize: 24, color: "var(--navy)" }}>{organizationStats.totalMembers}</div>
          </div>
          <div style={{ background: "var(--bg-soft)", borderRadius: 12, padding: 12 }}>
            <div style={{ color: "var(--muted)", fontSize: 12 }}>Active</div>
            <div style={{ fontWeight: 800, fontSize: 24, color: "var(--green)" }}>{organizationStats.activeMembers}</div>
          </div>
          <div style={{ background: "var(--bg-soft)", borderRadius: 12, padding: 12 }}>
            <div style={{ color: "var(--muted)", fontSize: 12 }}>Incidents This Month</div>
            <div style={{ fontWeight: 800, fontSize: 24, color: "var(--navy)" }}>{organizationStats.incidentsThisMonth}</div>
          </div>
          <div style={{ background: "var(--bg-soft)", borderRadius: 12, padding: 12 }}>
            <div style={{ color: "var(--muted)", fontSize: 12 }}>Open Tasks</div>
            <div style={{ fontWeight: 800, fontSize: 24, color: "var(--blue)" }}>{organizationStats.openTasks}</div>
          </div>
        </div>
      </div>,
      [{ label: "Close", primary: true }]
    );
  };

  return (
    <div>
      <div style={{ background: "#fff", borderRadius: 24, padding: 20, boxShadow: "var(--shadow)", marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "start" }}>
          <div>
            <div style={{ color: "var(--muted)", fontSize: 13 }}>My Organization</div>
            <div style={{ fontWeight: 800, fontSize: 24, color: "var(--navy)", marginTop: 4 }}>{profile.name}</div>
            <div style={{ color: "var(--muted)", fontSize: 13, marginTop: 6 }}>{profile.type} • Coordinator: {profile.coordinator}</div>
            <div style={{ marginTop: 8, display: "inline-flex", borderRadius: 999, padding: "5px 10px", background: profile.status === "active" ? "rgba(31, 143, 89, 0.12)" : "rgba(162, 106, 0, 0.12)", color: profile.status === "active" ? "var(--green)" : "#a26a00", fontWeight: 700, fontSize: 12 }}>
              {profile.status === "active" ? "Active" : profile.status}
            </div>
          </div>
          <div style={{ minWidth: 180, background: "var(--bg-soft)", borderRadius: 16, padding: 14 }}>
            <div style={{ color: "var(--muted)", fontSize: 12, marginBottom: 6 }}>Integration Ready</div>
            <div style={{ fontWeight: 800, color: "var(--navy)", fontSize: 24 }}>{outboxCount}</div>
            <div style={{ color: "var(--muted)", fontSize: 12 }}>pending outbound events</div>
            <div style={{ color: "var(--muted)", fontSize: 12, marginTop: 8 }}>
              Webhooks: {Object.values({ ...defaultWebhookRegistry, ...webhooks }).filter(Boolean).length}/{Object.keys(defaultWebhookRegistry).length} configured
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 14 }}>
          <button
            onClick={openMemberInvite}
            style={{ border: 0, borderRadius: 12, padding: "8px 12px", background: "var(--navy)", color: "#fff", fontWeight: 600, cursor: "pointer", fontSize: 13 }}
          >
            + Invite Member
          </button>
          <button
            onClick={openAnnouncementComposer}
            style={{ border: "1px solid var(--line)", borderRadius: 12, padding: "8px 12px", background: "#fff", color: "var(--navy)", fontWeight: 600, cursor: "pointer", fontSize: 13 }}
          >
            + Announcement
          </button>
          <button
            onClick={openTaskComposer}
            style={{ border: "1px solid var(--line)", borderRadius: 12, padding: "8px 12px", background: "#fff", color: "var(--navy)", fontWeight: 600, cursor: "pointer", fontSize: 13 }}
          >
            + Task
          </button>
          <button
            onClick={openDebriefComposer}
            style={{ border: "1px solid var(--line)", borderRadius: 12, padding: "8px 12px", background: "#fff", color: "var(--navy)", fontWeight: 600, cursor: "pointer", fontSize: 13 }}
          >
            + Debrief
          </button>
        </div>
        <button
          onClick={handleViewStats}
          style={{ marginTop: 12, border: 0, borderRadius: 12, padding: "8px 12px", background: "var(--navy)", color: "#fff", fontWeight: 600, cursor: "pointer", fontSize: 13 }}
        >
          📊 View Statistics
        </button>
      </div>

      <SectionHeader title="Organization Members" />
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 8, marginBottom: 12 }}>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search members by name, role, or email"
          style={{ border: "1px solid var(--line)", borderRadius: 12, padding: 10, fontFamily: "inherit" }}
        />
        <div style={{ background: "var(--bg-soft)", borderRadius: 12, padding: "10px 12px", color: "var(--muted)", fontSize: 13 }}>
          Webhook target: {webhooks.members || "not configured yet"}
        </div>
      </div>
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

      {filteredMembers.map((member) => (
          <div key={member.id} style={{ background: "#fff", borderRadius: 18, padding: 16, boxShadow: "var(--shadow)", marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
              <div>
                <div style={{ fontWeight: 700, color: "var(--navy)" }}>{member.name}</div>
                <div style={{ color: "var(--muted)", fontSize: 13, marginTop: 4 }}>{member.role}</div>
                {member.email ? <div style={{ color: "var(--muted)", fontSize: 12, marginTop: 4 }}>{member.email}</div> : null}
                <div style={{ color: "var(--muted)", fontSize: 12, marginTop: 4 }}>Joined {member.joinDate}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ background: member.status === "active" ? "var(--green)" : member.status === "invited" ? "var(--accent)" : "var(--muted)", color: "#fff", borderRadius: 20, padding: "4px 10px", fontSize: 12, fontWeight: 600 }}>
                  {member.status === "active" ? "Active" : member.status === "invited" ? "Invited" : "Inactive"}
                </div>
                <button
                  onClick={() => {
                    const nextStatus = member.status === "active" ? "inactive" : "active";
                    setMembers((prev) => prev.map((item) => (item.id === member.id ? { ...item, status: nextStatus } : item)));
                    emitEvent("organization.member.status_updated", "members", member.id, { organizationId: profile.id, status: nextStatus });
                  }}
                  style={{ marginTop: 8, border: "1px solid var(--line)", borderRadius: 10, padding: "6px 10px", background: "#fff", color: "var(--navy)", fontWeight: 600, cursor: "pointer", fontSize: 12 }}
                >
                  {member.status === "active" ? "Deactivate" : "Activate"}
                </button>
              </div>
            </div>
          </div>
        ))}

      <SectionHeader title="Announcements" />
      {announcements.map((item) => (
        <AnnouncementCard
          key={item.id}
          item={item}
          onOpen={() =>
            onShowModal(item.title, <div><p style={{ color: "var(--muted)" }}>{item.message}</p><p style={{ color: "var(--navy)", fontWeight: 700, marginBottom: 0 }}>Posted {item.date}</p></div>, [{ label: "Close", primary: true }])
          }
        />
      ))}

      <SectionHeader title="Tasks" />
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onOpen={() =>
            onShowModal(
              task.title,
              <div>
                <p style={{ color: "var(--muted)", marginBottom: 8 }}>Owner: {task.owner || "Unassigned"}</p>
                <p style={{ color: "var(--muted)", marginBottom: 8 }}>Status: {task.status}</p>
              </div>,
              [
                { label: "Close", primary: false },
                {
                  label: task.status === "Completed" ? "Reopen" : "Mark Complete",
                  primary: true,
                  onClick: () => {
                    const nextStatus = task.status === "Completed" ? "Pending" : "Completed";
                    setTasks((prev) => prev.map((item) => (item.id === task.id ? { ...item, status: nextStatus } : item)));
                    emitEvent("organization.task.status_updated", "organizations", profile.id, { taskId: task.id, status: nextStatus });
                  },
                },
              ]
            )
          }
        />
      ))}

      <SectionHeader title="Debriefs" />
      {debriefs.map((debrief) => (
        <div key={debrief.id} style={{ background: "#fff", borderRadius: 18, padding: 16, boxShadow: "var(--shadow)", marginBottom: 10 }}>
          <div style={{ fontWeight: 700 }}>{debrief.title}</div>
          <div style={{ color: "var(--muted)", fontSize: 14, marginTop: 6 }}>{debrief.summary}</div>
        </div>
      ))}
    </div>
  );
}

function MemberInviteForm({ onSubmit }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Member");

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Member name" style={inputStyle} />
      <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="member@example.com" style={inputStyle} />
      <select value={role} onChange={(event) => setRole(event.target.value)} style={inputStyle}>
        <option>Director</option>
        <option>Coordinator</option>
        <option>Member</option>
      </select>
      <button onClick={() => onSubmit({ name: name.trim(), email: email.trim(), role })} style={primaryButtonStyle}>Send Invite</button>
    </div>
  );
}

function AnnouncementComposer({ onSubmit }) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Announcement title" style={inputStyle} />
      <textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Announcement message" style={{ ...inputStyle, minHeight: 100, resize: "vertical" }} />
      <button onClick={() => onSubmit({ title: title.trim(), message: message.trim() })} style={primaryButtonStyle}>Publish Announcement</button>
    </div>
  );
}

function TaskComposer({ onSubmit }) {
  const [title, setTitle] = useState("");
  const [owner, setOwner] = useState("");

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Task title" style={inputStyle} />
      <input value={owner} onChange={(event) => setOwner(event.target.value)} placeholder="Owner or team" style={inputStyle} />
      <button onClick={() => onSubmit({ title: title.trim(), owner: owner.trim() })} style={primaryButtonStyle}>Create Task</button>
    </div>
  );
}

function DebriefComposer({ onSubmit }) {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Debrief title" style={inputStyle} />
      <textarea value={summary} onChange={(event) => setSummary(event.target.value)} placeholder="Debrief summary" style={{ ...inputStyle, minHeight: 100, resize: "vertical" }} />
      <button onClick={() => onSubmit({ title: title.trim(), summary: summary.trim() })} style={primaryButtonStyle}>Save Debrief</button>
    </div>
  );
}

const inputStyle = {
  border: "1px solid var(--line)",
  borderRadius: 12,
  padding: 10,
  fontFamily: "inherit",
  boxSizing: "border-box",
};

const primaryButtonStyle = {
  border: 0,
  borderRadius: 12,
  padding: "10px 12px",
  background: "var(--navy)",
  color: "#fff",
  fontWeight: 700,
  cursor: "pointer",
};
