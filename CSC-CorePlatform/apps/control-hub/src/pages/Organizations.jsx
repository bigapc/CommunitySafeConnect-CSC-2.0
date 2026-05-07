import { useMemo, useState } from "react";
import OrganizationCard from "../components/organizations/OrganizationCard";

export default function Organizations({ organizations = [], setOrganizations, showModal }) {
  const [filter, setFilter] = useState("all");

  const visibleOrganizations = useMemo(() => {
    return filter === "all" ? organizations : organizations.filter((org) => org.status === filter);
  }, [organizations, filter]);

  const handleToggleStatus = (org) => {
    setOrganizations((prev) =>
      prev.map((item) => (item.id === org.id ? { ...item, status: item.status === "active" ? "suspended" : "active" } : item))
    );
  };

  return (
    <div>
      <h2>Organizations</h2>
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
          onToggleStatus={handleToggleStatus}
          onOpen={() =>
            showModal(
              org.name,
              <div>
                <p style={{ color: "var(--hub-muted)", margin: 0 }}>Type: {org.type}</p>
                <p style={{ color: "var(--hub-muted)", margin: "6px 0 0" }}>Coordinator: {org.coordinator || "N/A"}</p>
                <p style={{ color: "var(--hub-muted)", margin: "6px 0 0" }}>Status: {org.status}</p>
              </div>,
              [{ label: "Close", primary: true }]
            )
          }
        />
      ))}
    </div>
  );
}
