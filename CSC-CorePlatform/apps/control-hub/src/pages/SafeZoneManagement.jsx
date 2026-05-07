import { useMemo, useState } from "react";
import ZoneRow from "../components/safezones/ZoneRow";

const emptyZoneForm = {
  name: "",
  type: "Community Center",
  status: "pending",
  latitude: "",
  longitude: "",
};

export default function SafeZoneManagement({ zones = [], incidents = [], setZones, showModal }) {
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [form, setForm] = useState(emptyZoneForm);

  const handleToggleStatus = (zone) => {
    setZones((prev) =>
      prev.map((item) => (item.id === zone.id ? { ...item, status: item.status === "verified" ? "pending" : "verified" } : item))
    );
  };

  const handleCreateZone = () => {
    const latitude = Number(form.latitude);
    const longitude = Number(form.longitude);

    if (!form.name.trim() || Number.isNaN(latitude) || Number.isNaN(longitude)) {
      showModal(
        "Incomplete Safe Zone",
        <p style={{ color: "var(--hub-muted)" }}>Add a zone name and valid latitude/longitude coordinates before saving.</p>,
        [{ label: "Close", primary: true }]
      );
      return;
    }

    setZones((prev) => [
      {
        id: `z-${Date.now()}`,
        name: form.name.trim(),
        type: form.type,
        status: form.status,
        coordinates: [latitude, longitude],
      },
      ...prev,
    ]);
    setForm(emptyZoneForm);
    setShowCreateForm(false);
  };

  const handleOpenMap = (zone) => {
    if (!Array.isArray(zone.coordinates) || zone.coordinates.length !== 2) {
      return;
    }
    const [lat, lng] = zone.coordinates;
    window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, "_blank", "noopener,noreferrer");
  };

  const filteredZones = useMemo(() => {
    return zones.filter((zone) => {
      const matchesFilter = filter === "all" ? true : zone.status === filter;
      const searchTerm = query.trim().toLowerCase();
      const matchesQuery = !searchTerm
        ? true
        : `${zone.name} ${zone.type}`.toLowerCase().includes(searchTerm);
      return matchesFilter && matchesQuery;
    });
  }, [filter, query, zones]);

  const zoneMetrics = useMemo(
    () => ({
      total: zones.length,
      verified: zones.filter((zone) => zone.status === "verified").length,
      pending: zones.filter((zone) => zone.status !== "verified").length,
    }),
    [zones]
  );

  return (
    <div>
      <h2>Safe Zone Management</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12, marginBottom: 16 }}>
        <MetricCard label="Total Zones" value={zoneMetrics.total} />
        <MetricCard label="Verified" value={zoneMetrics.verified} />
        <MetricCard label="Pending Review" value={zoneMetrics.pending} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr auto", gap: 12, marginBottom: 16 }}>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search zones by name or type"
          style={{
            border: "1px solid var(--hub-line)",
            borderRadius: 12,
            padding: "10px 12px",
            background: "var(--hub-panel)",
            color: "var(--hub-text)",
            fontFamily: "inherit",
          }}
        />
        <select
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          style={{
            border: "1px solid var(--hub-line)",
            borderRadius: 12,
            padding: "10px 12px",
            background: "var(--hub-panel)",
            color: "var(--hub-text)",
            fontFamily: "inherit",
          }}
        >
          <option value="all">All statuses</option>
          <option value="verified">Verified</option>
          <option value="pending">Pending</option>
        </select>
        <button
          onClick={() => setShowCreateForm((prev) => !prev)}
          style={{
            border: 0,
            borderRadius: 12,
            padding: "10px 14px",
            background: "var(--hub-blue)",
            color: "#07131f",
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          {showCreateForm ? "Close" : "Add Zone"}
        </button>
      </div>

      {showCreateForm ? (
        <div style={{ background: "var(--hub-panel)", borderRadius: 16, padding: 16, border: "1px solid var(--hub-line)", marginBottom: 16 }}>
          <div style={{ fontWeight: 700, marginBottom: 12 }}>Create Safe Zone</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
            <Field label="Zone Name">
              <input value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} style={fieldStyle} />
            </Field>
            <Field label="Zone Type">
              <select value={form.type} onChange={(event) => setForm((prev) => ({ ...prev, type: event.target.value }))} style={fieldStyle}>
                <option>Community Center</option>
                <option>Police Station</option>
                <option>Hospital</option>
                <option>School</option>
              </select>
            </Field>
            <Field label="Latitude">
              <input value={form.latitude} onChange={(event) => setForm((prev) => ({ ...prev, latitude: event.target.value }))} style={fieldStyle} placeholder="40.7128" />
            </Field>
            <Field label="Longitude">
              <input value={form.longitude} onChange={(event) => setForm((prev) => ({ ...prev, longitude: event.target.value }))} style={fieldStyle} placeholder="-74.0060" />
            </Field>
            <Field label="Status">
              <select value={form.status} onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))} style={fieldStyle}>
                <option value="pending">Pending</option>
                <option value="verified">Verified</option>
              </select>
            </Field>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 14 }}>
            <button
              onClick={() => {
                setShowCreateForm(false);
                setForm(emptyZoneForm);
              }}
              style={{ border: "1px solid var(--hub-line)", borderRadius: 12, padding: "10px 14px", background: "transparent", color: "var(--hub-text)", fontWeight: 700, cursor: "pointer" }}
            >
              Cancel
            </button>
            <button
              onClick={handleCreateZone}
              style={{ border: 0, borderRadius: 12, padding: "10px 14px", background: "var(--hub-blue)", color: "#07131f", fontWeight: 800, cursor: "pointer" }}
            >
              Save Zone
            </button>
          </div>
        </div>
      ) : null}

      {filteredZones.map((zone) => (
        <ZoneRow
          key={zone.id}
          zone={zone}
          linkedIncidentCount={incidents.filter((incident) => incident.safeZoneName === zone.name).length}
          onOpenMap={handleOpenMap}
          onToggleStatus={(item) => {
            showModal(
              "Update Zone Status",
              <p style={{ color: "var(--hub-muted)" }}>Change status for {item.name}?</p>,
              [
                { label: "Cancel", primary: false },
                { label: "Confirm", primary: true, onClick: () => handleToggleStatus(item) },
              ]
            );
          }}
        />
      ))}
    </div>
  );
}

function MetricCard({ label, value }) {
  return (
    <div style={{ background: "var(--hub-panel)", borderRadius: 16, padding: 14, border: "1px solid var(--hub-line)" }}>
      <div style={{ color: "var(--hub-muted)", fontSize: 12 }}>{label}</div>
      <div style={{ fontWeight: 800, fontSize: 26, marginTop: 4 }}>{value}</div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label style={{ display: "grid", gap: 6, color: "var(--hub-muted)", fontSize: 13 }}>
      <span>{label}</span>
      {children}
    </label>
  );
}

const fieldStyle = {
  border: "1px solid var(--hub-line)",
  borderRadius: 12,
  padding: "10px 12px",
  background: "rgba(255, 255, 255, 0.02)",
  color: "var(--hub-text)",
  fontFamily: "inherit",
  boxSizing: "border-box",
};
