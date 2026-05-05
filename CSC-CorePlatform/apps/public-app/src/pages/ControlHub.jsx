import { useMemo, useState } from "react";

const hubRoles = ["apc_admin", "apc_security_reviewer", "csc_supervisor"];
const webhookStorageKey = "csc-command-center-webhooks-v1";

const quickTiles = [
  { label: "Active Alerts", value: "4", tone: "#d9545d" },
  { label: "Open Incidents", value: "7", tone: "#18355d" },
  { label: "Verified Responders", value: "18", tone: "#58b88a" },
  { label: "Safe Zones", value: "12", tone: "#18355d" },
];

const pendingItems = [
  "Northside Corridor SOS escalation",
  "Campus perimeter alert follow-up",
  "Responder verification queue: 2 pending",
];

const defaultExtensions = [
  {
    id: "wh-1",
    name: "APC Ops Backend",
    endpoint: "https://example.com/apc/events",
    enabled: true,
    lastResult: "Not tested",
    lastEvent: "-",
  },
  {
    id: "wh-2",
    name: "Responder Dispatch Backend",
    endpoint: "https://example.com/dispatch/events",
    enabled: true,
    lastResult: "Not tested",
    lastEvent: "-",
  },
  {
    id: "wh-3",
    name: "Facility Security Backend",
    endpoint: "https://example.com/security/events",
    enabled: false,
    lastResult: "Not tested",
    lastEvent: "-",
  },
];

function loadExtensions() {
  if (typeof window === "undefined") {
    return defaultExtensions;
  }

  try {
    const raw = window.localStorage.getItem(webhookStorageKey);
    if (!raw) {
      return defaultExtensions;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length ? parsed : defaultExtensions;
  } catch {
    return defaultExtensions;
  }
}

function persistExtensions(items) {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(webhookStorageKey, JSON.stringify(items));
}

function isLikelyHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export default function ControlHub({ role, onRoleChange, onShowModal }) {
  const canAccess = hubRoles.includes(role);
  const [extensions, setExtensions] = useState(loadExtensions);
  const [isSending, setIsSending] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEndpoint, setNewEndpoint] = useState("");

  const enabledCount = useMemo(
    () => extensions.filter((item) => item.enabled).length,
    [extensions]
  );

  const saveExtensions = (next) => {
    setExtensions(next);
    persistExtensions(next);
  };

  const updateExtension = (id, updater) => {
    const next = extensions.map((item) => (item.id === id ? updater(item) : item));
    saveExtensions(next);
  };

  const addExtension = () => {
    if (!newName.trim() || !newEndpoint.trim()) {
      onShowModal?.(
        "Webhook Extension",
        <div style={{ color: "var(--muted)" }}>Enter both extension name and endpoint URL.</div>,
        [{ label: "Close", primary: true }]
      );
      return;
    }

    if (!isLikelyHttpUrl(newEndpoint.trim())) {
      onShowModal?.(
        "Invalid Endpoint",
        <div style={{ color: "var(--muted)" }}>Endpoint must start with http:// or https://.</div>,
        [{ label: "Close", primary: true }]
      );
      return;
    }

    const next = [
      {
        id: `wh-${Date.now()}`,
        name: newName.trim(),
        endpoint: newEndpoint.trim(),
        enabled: true,
        lastResult: "Not tested",
        lastEvent: "-",
      },
      ...extensions,
    ];
    saveExtensions(next);
    setNewName("");
    setNewEndpoint("");
  };

  const sendEvent = async (eventType) => {
    const enabled = extensions.filter((item) => item.enabled);

    if (!enabled.length) {
      onShowModal?.(
        "No Active Extensions",
        <div style={{ color: "var(--muted)" }}>Enable at least one webhook extension before sending events.</div>,
        [{ label: "Close", primary: true }]
      );
      return;
    }

    setIsSending(true);
    const timestamp = new Date().toISOString();

    const results = await Promise.all(
      enabled.map(async (item) => {
        if (!isLikelyHttpUrl(item.endpoint)) {
          return {
            id: item.id,
            ok: false,
            message: "Invalid URL",
          };
        }

        try {
          const response = await fetch(item.endpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-csc-source": "command-center-hub",
            },
            body: JSON.stringify({
              eventType,
              timestamp,
              source: "CSC-Command-Center",
              payload: {
                role,
                priority: "high",
                message: "Event dispatched from CSC Command Center Hub",
              },
            }),
          });

          return {
            id: item.id,
            ok: response.ok,
            message: response.ok ? `Delivered (${response.status})` : `Failed (${response.status})`,
          };
        } catch {
          return {
            id: item.id,
            ok: false,
            message: "Network or CORS error",
          };
        }
      })
    );

    const next = extensions.map((item) => {
      const result = results.find((entry) => entry.id === item.id);
      if (!result) {
        return item;
      }
      return {
        ...item,
        lastResult: result.message,
        lastEvent: eventType,
      };
    });

    saveExtensions(next);
    setIsSending(false);

    const successCount = results.filter((entry) => entry.ok).length;
    onShowModal?.(
      "Webhook Dispatch Complete",
      <div style={{ color: "var(--muted)" }}>
        {successCount} of {results.length} extension endpoints accepted event {eventType}.
      </div>,
      [{ label: "Close", primary: true }]
    );
  };

  if (!canAccess) {
    return (
      <div style={{ background: "#fff", borderRadius: 24, padding: 22, boxShadow: "var(--shadow)" }}>
        <h1 style={{ marginTop: 0, color: "var(--navy)" }}>Access Restricted</h1>
        <p style={{ color: "var(--muted)", lineHeight: 1.6 }}>
          The CSC Control Hub route is limited to three roles: apc_admin, apc_security_reviewer, and csc_supervisor.
        </p>
        <p style={{ color: "var(--muted)", fontSize: 13 }}>Current role: {role}</p>
        <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
          <button
            onClick={() => onRoleChange("apc_admin")}
            style={{ border: 0, borderRadius: 14, padding: "12px 14px", background: "var(--navy)", color: "#fff", fontWeight: 700, cursor: "pointer" }}
          >
            Switch to Admin (Demo)
          </button>
          <button
            onClick={() => onRoleChange("csc_supervisor")}
            style={{ border: "1px solid var(--line)", borderRadius: 14, padding: "12px 14px", background: "#fff", color: "var(--navy)", fontWeight: 700, cursor: "pointer" }}
          >
            Switch to CSC-Supervisor (Demo)
          </button>
          <button
            onClick={() => onRoleChange("apc_security_reviewer")}
            style={{ border: "1px solid var(--line)", borderRadius: 14, padding: "12px 14px", background: "#fff", color: "var(--navy)", fontWeight: 700, cursor: "pointer" }}
          >
            Switch to Security Reviewer (Demo)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ background: "#fff", borderRadius: 24, padding: 20, boxShadow: "var(--shadow)", marginBottom: 14 }}>
        <div style={{ color: "var(--muted)", fontSize: 12 }}>Admin Route</div>
        <h1 style={{ margin: "6px 0 2px", color: "var(--navy)" }}>CSC Control Hub</h1>
        <div style={{ color: "var(--muted)", fontSize: 14 }}>Internal operations view on the same app route.</div>
        <div style={{ marginTop: 8, color: "var(--navy-2)", fontSize: 13 }}>
          Access active for at least 3 roles: apc_admin, apc_security_reviewer, csc_supervisor.
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
        {quickTiles.map((tile) => (
          <div key={tile.label} style={{ background: "#fff", borderRadius: 18, padding: 16, boxShadow: "var(--shadow)" }}>
            <div style={{ color: "var(--muted)", fontSize: 13 }}>{tile.label}</div>
            <div style={{ color: tile.tone, fontWeight: 800, fontSize: 24, marginTop: 4 }}>{tile.value}</div>
          </div>
        ))}
      </div>

      <div style={{ background: "#fff", borderRadius: 18, padding: 16, boxShadow: "var(--shadow)" }}>
        <h2 style={{ marginTop: 0, color: "var(--navy)", fontSize: 18 }}>Priority Queue</h2>
        {pendingItems.map((item) => (
          <div key={item} style={{ padding: "10px 0", borderBottom: "1px solid var(--line)", color: "var(--text)" }}>
            {item}
          </div>
        ))}
      </div>

      <div style={{ background: "#fff", borderRadius: 18, padding: 16, boxShadow: "var(--shadow)", marginTop: 14 }}>
        <h2 style={{ marginTop: 0, color: "var(--navy)", fontSize: 18 }}>Webhook Extensions</h2>
        <div style={{ color: "var(--muted)", fontSize: 13, marginBottom: 12 }}>
          Connect your other company backend through webhook endpoints. Active extensions: {enabledCount}
        </div>

        <div style={{ display: "grid", gap: 8, marginBottom: 12 }}>
          <input
            value={newName}
            onChange={(event) => setNewName(event.target.value)}
            placeholder="Extension name (example: Logistics API)"
            style={{ border: "1px solid var(--line)", borderRadius: 10, padding: 10, fontSize: 14 }}
          />
          <input
            value={newEndpoint}
            onChange={(event) => setNewEndpoint(event.target.value)}
            placeholder="Endpoint URL (https://...)"
            style={{ border: "1px solid var(--line)", borderRadius: 10, padding: 10, fontSize: 14 }}
          />
          <button
            onClick={addExtension}
            style={{ border: 0, borderRadius: 10, padding: 10, background: "var(--navy)", color: "#fff", fontWeight: 700, cursor: "pointer" }}
          >
            Add Webhook Extension
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
          <button
            onClick={() => sendEvent("incident.created")}
            disabled={isSending}
            style={{ border: 0, borderRadius: 10, padding: 10, background: "var(--accent)", color: "#fff", fontWeight: 700, cursor: "pointer", opacity: isSending ? 0.6 : 1 }}
          >
            Send Incident Created
          </button>
          <button
            onClick={() => sendEvent("incident.escalated")}
            disabled={isSending}
            style={{ border: 0, borderRadius: 10, padding: 10, background: "var(--navy-2)", color: "#fff", fontWeight: 700, cursor: "pointer", opacity: isSending ? 0.6 : 1 }}
          >
            Send Incident Escalated
          </button>
          <button
            onClick={() => sendEvent("responder.assigned")}
            disabled={isSending}
            style={{ border: 0, borderRadius: 10, padding: 10, background: "var(--green)", color: "#fff", fontWeight: 700, cursor: "pointer", opacity: isSending ? 0.6 : 1 }}
          >
            Send Responder Assigned
          </button>
        </div>

        <div style={{ display: "grid", gap: 10 }}>
          {extensions.map((item) => (
            <div key={item.id} style={{ border: "1px solid var(--line)", borderRadius: 12, padding: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                <div>
                  <div style={{ color: "var(--navy)", fontWeight: 700 }}>{item.name}</div>
                  <div style={{ color: "var(--muted)", fontSize: 12, wordBreak: "break-all" }}>{item.endpoint}</div>
                </div>
                <label style={{ color: "var(--muted)", fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}>
                  <input
                    type="checkbox"
                    checked={item.enabled}
                    onChange={(event) =>
                      updateExtension(item.id, (current) => ({
                        ...current,
                        enabled: event.target.checked,
                      }))
                    }
                  />
                  Enabled
                </label>
              </div>
              <div style={{ marginTop: 8, fontSize: 12, color: "var(--muted)" }}>
                Last event: {item.lastEvent} | Last result: {item.lastResult}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
