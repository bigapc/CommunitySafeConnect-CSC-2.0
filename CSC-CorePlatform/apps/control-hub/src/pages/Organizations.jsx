import { useEffect, useMemo, useState } from "react";
import OrganizationCard from "../components/organizations/OrganizationCard";
import { defaultWebhookRegistry, queueIntegrationEvent, readIntegrationOutbox, readWebhookRegistry } from "../../../../shared/utils/integrationBridge";

const emptyOrganizationForm = {
  name: "",
  type: "School",
  coordinator: "",
};

export default function Organizations({ organizations = [], setOrganizations, showModal, user }) {
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [outbox, setOutbox] = useState(readIntegrationOutbox());
  const [webhooks] = useState(readWebhookRegistry());

  const visibleOrganizations = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return organizations
      .filter((org) => (filter === "all" ? true : org.status === filter))
      .filter((org) => {
        if (!normalizedQuery) {
          return true;
        }
        return `${org.name} ${org.type} ${org.coordinator || ""}`.toLowerCase().includes(normalizedQuery);
      });
  }, [organizations, filter, query]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const refreshOutbox = () => setOutbox(readIntegrationOutbox());
    const onStorage = (event) => {
      if (event.key === "csc-integration-outbox-v1") {
        refreshOutbox();
      }
    };
    const onOutboxEvent = () => refreshOutbox();

    window.addEventListener("storage", onStorage);
    window.addEventListener("csc:integration-outbox-updated", onOutboxEvent);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("csc:integration-outbox-updated", onOutboxEvent);
    };
  }, []);

  const emitEvent = (action, entityId, payload) => {
    queueIntegrationEvent({
      sourceApp: "control-hub",
      entityType: "organizations",
      action,
      entityId,
      payload,
      sourceUser: user,
    });
    setOutbox(readIntegrationOutbox());
  };

  const handleToggleStatus = (org) => {
    setOrganizations((prev) =>
      prev.map((item) => (item.id === org.id ? { ...item, status: item.status === "active" ? "suspended" : "active" } : item))
    );
    emitEvent("organization.status_updated", org.id, { status: org.status === "active" ? "suspended" : "active", name: org.name });
  };

  const openCreateOrganization = () => {
    showModal(
      "Create Organization",
      <OrganizationForm
        onSubmit={(formData) => {
          const nextOrganization = {
            id: `org-${Date.now()}`,
            name: formData.name,
            type: formData.type,
            coordinator: formData.coordinator,
            status: "active",
          };
          setOrganizations((prev) => [nextOrganization, ...prev]);
          emitEvent("organization.created", nextOrganization.id, nextOrganization);
          showModal("Organization Created", <p style={{ color: "var(--hub-muted)" }}>{nextOrganization.name} is active and queued for backend/webhook delivery.</p>, [{ label: "Done", primary: true }]);
        }}
      />
    );
  };

  return (
    <div>
      <h2>Organizations</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: 10, marginBottom: 12 }}>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search organizations"
          style={{ border: "1px solid var(--hub-line)", borderRadius: 12, padding: "10px 12px", background: "transparent", color: "var(--hub-text)", fontFamily: "inherit" }}
        />
        <div style={{ border: "1px solid var(--hub-line)", borderRadius: 12, padding: "10px 12px", color: "var(--hub-muted)", fontSize: 13 }}>
          Outbox: {outbox.length} pending
        </div>
        <button
          onClick={openCreateOrganization}
          style={{ border: 0, borderRadius: 12, padding: "10px 12px", background: "var(--hub-blue)", color: "#07131f", fontWeight: 800, cursor: "pointer" }}
        >
          + Create
        </button>
      </div>
      <div style={{ color: "var(--hub-muted)", fontSize: 12, marginBottom: 12 }}>
        Webhooks configured: {Object.values({ ...defaultWebhookRegistry, ...webhooks }).filter(Boolean).length}/{Object.keys(defaultWebhookRegistry).length}
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        {["all", "active", "suspended"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            style={{
              border: filter === status ? 0 : "1px solid var(--hub-line)",
              borderRadius: 10,
              padding: "8px 10px",
              background: filter === status ? "var(--hub-blue)" : "transparent",
              color: filter === status ? "#07131f" : "var(--hub-text)",
              cursor: "pointer",
              textTransform: "capitalize",
              fontWeight: 700,
            }}
          >
            {status}
          </button>
        ))}
      </div>
      {visibleOrganizations.map((org) => (
        <OrganizationCard
          key={org.id}
          org={org}
          integrationCount={outbox.filter((event) => event.entityId === org.id || event.payload?.organizationId === org.id).length}
          onToggleStatus={handleToggleStatus}
          onOpen={() =>
            showModal(
              org.name,
              <div>
                <p style={{ color: "var(--hub-muted)", margin: 0 }}>Type: {org.type}</p>
                <p style={{ color: "var(--hub-muted)", margin: "6px 0 0" }}>Coordinator: {org.coordinator || "N/A"}</p>
                <p style={{ color: "var(--hub-muted)", margin: "6px 0 0" }}>Status: {org.status}</p>
                <p style={{ color: "var(--hub-muted)", margin: "6px 0 0" }}>Queued integrations: {outbox.filter((event) => event.entityId === org.id || event.payload?.organizationId === org.id).length}</p>
              </div>,
              [{ label: "Close", primary: true }]
            )
          }
        />
      ))}
    </div>
  );
}

function OrganizationForm({ onSubmit }) {
  const [form, setForm] = useState(emptyOrganizationForm);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <input value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} placeholder="Organization name" style={fieldStyle} />
      <select value={form.type} onChange={(event) => setForm((prev) => ({ ...prev, type: event.target.value }))} style={fieldStyle}>
        <option>School</option>
        <option>Housing</option>
        <option>Church</option>
        <option>Community</option>
        <option>Business</option>
      </select>
      <input value={form.coordinator} onChange={(event) => setForm((prev) => ({ ...prev, coordinator: event.target.value }))} placeholder="Coordinator name" style={fieldStyle} />
      <button onClick={() => onSubmit({ name: form.name.trim(), type: form.type, coordinator: form.coordinator.trim() })} style={{ border: 0, borderRadius: 12, padding: "10px 12px", background: "var(--hub-blue)", color: "#07131f", fontWeight: 800, cursor: "pointer" }}>
        Save Organization
      </button>
    </div>
  );
}

const fieldStyle = {
  border: "1px solid var(--hub-line)",
  borderRadius: 12,
  padding: "10px 12px",
  background: "transparent",
  color: "var(--hub-text)",
  fontFamily: "inherit",
  boxSizing: "border-box",
};
