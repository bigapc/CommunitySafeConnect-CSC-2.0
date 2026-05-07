import { useEffect, useState } from "react";
import {
  defaultWebhookAuthRegistry,
  defaultWebhookRegistry,
  deliverPendingIntegrationEvents,
  readIntegrationOutbox,
  readWebhookAuthRegistry,
  readWebhookRegistry,
  saveWebhookAuthRegistry,
  saveWebhookRegistry,
} from "../../../../shared/utils/integrationBridge";

export default function Settings({ settings, setSettings, resetHubData, showModal }) {
  const [webhooks, setWebhooks] = useState(readWebhookRegistry());
  const [webhookAuth, setWebhookAuth] = useState(readWebhookAuthRegistry());
  const [outbox, setOutbox] = useState(readIntegrationOutbox());

  const toggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const refresh = () => {
      setOutbox(readIntegrationOutbox());
      setWebhooks(readWebhookRegistry());
      setWebhookAuth(readWebhookAuthRegistry());
    };

    const onStorage = (event) => {
      if (event.key === "csc-integration-outbox-v1" || event.key === "csc-integration-webhooks-v1" || event.key === "csc-integration-webhook-auth-v1") {
        refresh();
      }
    };

    const onOutboxUpdate = () => refresh();
    const onWebhookUpdate = () => refresh();
    const onWebhookAuthUpdate = () => refresh();
    window.addEventListener("storage", onStorage);
    window.addEventListener("csc:integration-outbox-updated", onOutboxUpdate);
    window.addEventListener("csc:webhook-registry-updated", onWebhookUpdate);
    window.addEventListener("csc:webhook-auth-registry-updated", onWebhookAuthUpdate);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("csc:integration-outbox-updated", onOutboxUpdate);
      window.removeEventListener("csc:webhook-registry-updated", onWebhookUpdate);
      window.removeEventListener("csc:webhook-auth-registry-updated", onWebhookAuthUpdate);
    };
  }, []);

  const configuredWebhookCount = Object.values(webhooks).filter(Boolean).length;
  const pendingOutboxCount = outbox.filter((event) => event.delivery !== "delivered").length;
  const failedOutboxCount = outbox.filter((event) => event.delivery === "failed").length;

  const openWebhookSettings = () => {
    const draftWebhooks = { ...defaultWebhookRegistry, ...webhooks };
    const draftAuth = { ...defaultWebhookAuthRegistry, ...webhookAuth };

    showModal(
      "Integration Webhooks",
      <div>
        <p style={{ color: "var(--hub-muted)", marginTop: 0 }}>
          Configure destination webhooks for each event channel. Leave any field blank to keep events queued locally.
        </p>
        {Object.keys(defaultWebhookRegistry).map((channel) => (
          <div key={channel} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: "1px solid var(--hub-line)" }}>
            <div style={{ textTransform: "capitalize", fontSize: 12, color: "var(--hub-muted)", marginBottom: 4 }}>{channel}</div>
            <input
              defaultValue={draftWebhooks[channel]}
              placeholder={`https://api.example.com/webhooks/${channel}`}
              onChange={(event) => {
                draftWebhooks[channel] = event.target.value.trim();
              }}
              style={fieldStyle}
            />
            <input
              defaultValue={draftAuth[channel]}
              placeholder="Bearer token (optional)"
              onChange={(event) => {
                draftAuth[channel] = event.target.value.trim();
              }}
              style={{ ...fieldStyle, marginTop: 6 }}
            />
          </div>
        ))}
      </div>,
      [
        { label: "Cancel", primary: false },
        {
          label: "Save",
          primary: true,
          onClick: () => {
            saveWebhookRegistry(draftWebhooks);
            saveWebhookAuthRegistry(draftAuth);
          },
        },
      ]
    );
  };

  const openOutboxConsole = () => {
    const latest = readIntegrationOutbox();
    showModal(
      "Integration Outbox",
      <div>
        <p style={{ color: "var(--hub-muted)", marginTop: 0, marginBottom: 12 }}>
          Pending events are held here until delivery succeeds. You can retry manually after setting webhook endpoints.
        </p>
        {latest.slice(0, 15).map((event) => (
          <div key={event.id} style={{ border: "1px solid var(--hub-line)", borderRadius: 12, padding: 10, marginBottom: 8 }}>
            <div style={{ fontWeight: 700 }}>{event.action}</div>
            <div style={{ color: "var(--hub-muted)", fontSize: 12 }}>
              {event.entityType} • {event.sourceApp} • attempts {event.attempts || 0}
            </div>
            <div style={{ color: event.delivery === "delivered" ? "var(--hub-green)" : event.delivery === "failed" ? "#ff9d9d" : "var(--hub-blue)", fontSize: 12, textTransform: "capitalize", marginTop: 4 }}>
              {event.delivery}{event.lastError ? `: ${event.lastError}` : ""}
            </div>
          </div>
        ))}
      </div>,
      [
        { label: "Close", primary: false },
        {
          label: "Retry Pending",
          primary: true,
          onClick: async () => {
            const result = await deliverPendingIntegrationEvents({ maxBatch: 25 });
            showModal(
              "Delivery Summary",
              <p style={{ color: "var(--hub-muted)" }}>
                Attempted {result.attempted}, delivered {result.delivered}, failed {result.failed}, skipped {result.skipped}.
              </p>,
              [{ label: "Done", primary: true }]
            );
          },
        },
      ]
    );
  };

  return (
    <div>
      <h2>Settings</h2>
      <div style={{ background: "var(--hub-panel)", borderRadius: 18, padding: 16, boxShadow: "var(--hub-shadow)", marginBottom: 10, border: "1px solid var(--hub-line)" }}>
        <div style={{ fontWeight: 700, marginBottom: 10 }}>Dispatch Automation</div>
        <label style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, color: "var(--hub-muted)" }}>
          Auto-dispatch acknowledged incidents
          <input type="checkbox" checked={settings.autoDispatch} onChange={() => toggle("autoDispatch")} />
        </label>
        <label style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, color: "var(--hub-muted)" }}>
          Escalate critical incidents automatically
          <input type="checkbox" checked={settings.criticalEscalation} onChange={() => toggle("criticalEscalation")} />
        </label>
        <label style={{ display: "flex", justifyContent: "space-between", color: "var(--hub-muted)" }}>
          SMS bridge for external responders
          <input type="checkbox" checked={settings.smsBridge} onChange={() => toggle("smsBridge")} />
        </label>
      </div>

      <div style={{ background: "var(--hub-panel)", borderRadius: 18, padding: 16, boxShadow: "var(--hub-shadow)", marginBottom: 10, border: "1px solid var(--hub-line)" }}>
        <div style={{ fontWeight: 700, marginBottom: 10 }}>Contact Senior Security</div>
        <a href="mailto:security@armstrongpack.example" style={{ color: "var(--hub-blue)", display: "block", marginBottom: 8 }}>
          security@armstrongpack.example
        </a>
        <a href="tel:+15550103030" style={{ color: "var(--hub-blue)", display: "block" }}>
          +1 (555) 010-3030
        </a>
      </div>

      <div style={{ background: "var(--hub-panel)", borderRadius: 18, padding: 16, boxShadow: "var(--hub-shadow)", marginBottom: 10, border: "1px solid var(--hub-line)" }}>
        <div style={{ fontWeight: 700, marginBottom: 8 }}>Integration Control Center</div>
        <div style={{ color: "var(--hub-muted)", fontSize: 13, marginBottom: 10 }}>
          {configuredWebhookCount} webhook channels configured • {pendingOutboxCount} pending events • {failedOutboxCount} failed events
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button
            onClick={openWebhookSettings}
            style={{ border: 0, borderRadius: 12, padding: "10px 12px", background: "var(--hub-blue)", color: "#07131f", fontWeight: 700, cursor: "pointer" }}
          >
            Webhook Settings
          </button>
          <button
            onClick={openOutboxConsole}
            style={{ border: "1px solid var(--hub-line)", borderRadius: 12, padding: "10px 12px", background: "transparent", color: "var(--hub-text)", fontWeight: 700, cursor: "pointer" }}
          >
            Outbox & Retry
          </button>
        </div>
      </div>

      <button
        onClick={() =>
          showModal(
            "Reset Hub Data",
            <p style={{ color: "var(--hub-muted)" }}>Reset incidents, zones, responders, broadcasts, and settings to defaults?</p>,
            [
              { label: "Cancel", primary: false },
              { label: "Reset", primary: true, onClick: resetHubData },
            ]
          )
        }
        style={{ border: "1px solid var(--hub-line)", borderRadius: 12, padding: "10px 12px", background: "transparent", color: "var(--hub-text)", cursor: "pointer" }}
      >
        Reset Operational Data
      </button>
    </div>
  );
}

const fieldStyle = {
  width: "100%",
  border: "1px solid var(--hub-line)",
  borderRadius: 10,
  background: "var(--hub-panel-2)",
  color: "var(--hub-text)",
  padding: "9px 10px",
  boxSizing: "border-box",
  fontFamily: "inherit",
};
