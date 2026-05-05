import { useMemo, useState } from "react";

const hubRoles = ["apc_admin", "apc_security_reviewer", "csc_supervisor"];
const webhookStorageKey = "csc-command-center-webhooks-v1";
const auditStorageKey = "csc-audit-log-v1";
const MAX_AUDIT_ENTRIES = 200;

function loadAuditLog() {
  try {
    const raw = window.localStorage.getItem(auditStorageKey);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function persistAuditLog(entries) {
  window.localStorage.setItem(auditStorageKey, JSON.stringify(entries));
}

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

async function signPayload(secret, payloadText) {
  if (typeof window === "undefined" || !window.crypto?.subtle) {
    throw new Error("Web Crypto is unavailable");
  }

  const encoder = new TextEncoder();
  const key = await window.crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await window.crypto.subtle.sign("HMAC", key, encoder.encode(payloadText));
  const bytes = new Uint8Array(signature);
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export default function ControlHub({ role, onRoleChange, onShowModal }) {
  const canAccess = hubRoles.includes(role);
  const [extensions, setExtensions] = useState(loadExtensions);
  const [auditLog, setAuditLog] = useState(loadAuditLog);

  const addAuditEntry = (action, detail) => {
    const entry = {
      id: `aud-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
      time: new Date().toISOString(),
      actor: role,
      action,
      detail,
    };
    setAuditLog((prev) => {
      const next = [entry, ...prev].slice(0, MAX_AUDIT_ENTRIES);
      persistAuditLog(next);
      return next;
    });
  };
  const [isSending, setIsSending] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEndpoint, setNewEndpoint] = useState("");
  const [newSecret, setNewSecret] = useState("");

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
        secret: newSecret.trim(),
        enabled: true,
        lastResult: "Not tested",
        lastEvent: "-",
      },
      ...extensions,
    ];
    saveExtensions(next);
    addAuditEntry("webhook.added", `Added extension: ${newName.trim()}`);
    setNewName("");
    setNewEndpoint("");
    setNewSecret("");
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
          const eventId = `evt-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
          const body = {
            eventId,
            eventType,
            timestamp,
            source: "CSC-Command-Center",
            payload: {
              role,
              priority: "high",
              message: "Event dispatched from CSC Command Center Hub",
            },
          };
          const bodyText = JSON.stringify(body);

          const headers = {
            "Content-Type": "application/json",
            "x-csc-source": "command-center-hub",
            "x-csc-event-id": eventId,
            "x-csc-timestamp": timestamp,
            "x-csc-signature-alg": "hmac-sha256",
          };

          if (item.secret) {
            const payloadToSign = `${timestamp}.${bodyText}`;
            const signature = await signPayload(item.secret, payloadToSign);
            headers["x-csc-signature"] = signature;
          }

          const response = await fetch(item.endpoint, {
            method: "POST",
            headers,
            body: bodyText,
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
    addAuditEntry(
      `webhook.dispatch`,
      `Event "${eventType}" → ${successCount}/${results.length} succeeded`
    );
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
          <input
            type="password"
            value={newSecret}
            onChange={(event) => setNewSecret(event.target.value)}
            placeholder="Signing secret (optional but recommended)"
            style={{ border: "1px solid var(--line)", borderRadius: 10, padding: 10, fontSize: 14 }}
          />
          <button
            onClick={addExtension}
            style={{ border: 0, borderRadius: 10, padding: 10, background: "var(--navy)", color: "#fff", fontWeight: 700, cursor: "pointer" }}
          >
            Add Webhook Extension
          </button>
        </div>
        <div style={{ color: "var(--muted)", fontSize: 12, marginBottom: 12 }}>
          Signature format: HMAC-SHA256 over "timestamp.body" sent in header x-csc-signature.
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
                  <div style={{ color: "var(--muted)", fontSize: 12 }}>
                    Signing: {item.secret ? "Enabled" : "Disabled"}
                  </div>
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
      <div style={{ background: "#fff", borderRadius: 18, padding: 16, boxShadow: "var(--shadow)", marginTop: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <h2 style={{ margin: 0, color: "var(--navy)", fontSize: 18 }}>Audit Trail</h2>
          {auditLog.length > 0 && (
            <button
              onClick={() => {
                setAuditLog([]);
                persistAuditLog([]);
              }}
              style={{ border: "1px solid var(--line)", borderRadius: 8, padding: "4px 10px", background: "#fff", color: "var(--muted)", fontSize: 12, cursor: "pointer" }}
            >
              Clear
            </button>
          )}
        </div>
        {auditLog.length === 0 ? (
          <div style={{ color: "var(--muted)", fontSize: 13, padding: "12px 0" }}>No audit entries yet. Actions will appear here.</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--line)" }}>
                  {["Time", "Actor", "Action", "Detail"].map((col) => (
                    <th key={col} style={{ textAlign: "left", padding: "6px 8px", color: "var(--muted)", fontWeight: 600 }}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {auditLog.map((entry) => (
                  <tr key={entry.id} style={{ borderBottom: "1px solid var(--line)" }}>
                    <td style={{ padding: "7px 8px", whiteSpace: "nowrap", color: "var(--muted)" }}>
                      {new Date(entry.time).toLocaleString()}
                    </td>
                    <td style={{ padding: "7px 8px", color: "var(--navy)", fontWeight: 600, whiteSpace: "nowrap" }}>{entry.actor}</td>
                    <td style={{ padding: "7px 8px", color: "var(--navy-2)", whiteSpace: "nowrap" }}>{entry.action}</td>
                    <td style={{ padding: "7px 8px", color: "var(--text)" }}>{entry.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
