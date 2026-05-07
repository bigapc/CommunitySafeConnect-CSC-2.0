import { useEffect, useMemo, useState } from "react";
import {
  defaultMasterControlConfig,
  readMasterControlConfig,
  saveMasterControlConfig,
  syncOutboxToMasterControl,
} from "../../../../shared/utils/eventClient";
import { readIntegrationOutbox } from "../../../../shared/utils/integrationBridge";
import { buildSignedEventEnvelope } from "../../../../shared/utils/webhookSigning";

const appCatalog = [
  { id: "SafeConnect", label: "SafeConnect" },
  { id: "CommunitySafeConnect", label: "CommunitySafeConnect" },
  { id: "CommunitySafeConnect-CSC-2.0", label: "CommunitySafeConnect-CSC-2.0" },
];

function summarizeByKey(items, key) {
  return items.reduce((accumulator, item) => {
    const bucket = item[key] || "unknown";
    accumulator[bucket] = (accumulator[bucket] || 0) + 1;
    return accumulator;
  }, {});
}

export default function MasterControlCenter({ user }) {
  const [config, setConfig] = useState(readMasterControlConfig());
  const [outbox, setOutbox] = useState(readIntegrationOutbox());
  const [syncStatus, setSyncStatus] = useState({ running: false, message: "", at: null });
  const [signedPreview, setSignedPreview] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const refresh = () => {
      setOutbox(readIntegrationOutbox());
      setConfig(readMasterControlConfig());
    };

    const onStorage = (event) => {
      if (event.key === "csc-integration-outbox-v1" || event.key === "apc-master-control-config-v1") {
        refresh();
      }
    };

    const onOutboxUpdated = () => refresh();
    const onConfigUpdated = () => refresh();
    window.addEventListener("storage", onStorage);
    window.addEventListener("csc:integration-outbox-updated", onOutboxUpdated);
    window.addEventListener("csc:master-control-config-updated", onConfigUpdated);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("csc:integration-outbox-updated", onOutboxUpdated);
      window.removeEventListener("csc:master-control-config-updated", onConfigUpdated);
    };
  }, []);

  const pendingEvents = useMemo(
    () => outbox.filter((event) => event.delivery !== "delivered"),
    [outbox]
  );

  const bySourceApp = useMemo(() => summarizeByKey(outbox, "sourceApp"), [outbox]);
  const byEntityType = useMemo(() => summarizeByKey(outbox, "entityType"), [outbox]);

  const syncNow = async () => {
    setSyncStatus({ running: true, message: "Syncing events to APC Master Control Center...", at: null });
    try {
      const result = await syncOutboxToMasterControl({ config, maxBatch: 30 });
      setSyncStatus({
        running: false,
        message: `Attempted ${result.attempted}, delivered ${result.delivered}, failed ${result.failed}.`,
        at: new Date().toISOString(),
      });
      setOutbox(readIntegrationOutbox());
    } catch (error) {
      setSyncStatus({
        running: false,
        message: error?.message || "Master Control sync failed.",
        at: new Date().toISOString(),
      });
    }
  };

  const generateSignaturePreview = async () => {
    const sampleEvent = pendingEvents[0] || {
      id: "sample-event",
      sourceApp: "CommunitySafeConnect-CSC-2.0",
      entityType: "incidents",
      action: "incident.created",
      entityId: "sample-incident",
      payload: { severity: "high" },
    };
    const envelope = await buildSignedEventEnvelope(sampleEvent, config.signingSecret);
    setSignedPreview(envelope);
  };

  return (
    <div>
      <h2>APC Master Control Center</h2>
      <p style={{ color: "var(--hub-muted)", marginTop: 0 }}>
        Unified multi-app integration shell for SafeConnect, CommunitySafeConnect, and CommunitySafeConnect-CSC-2.0.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12, marginBottom: 14 }}>
        <MetricCard label="Outbox Events" value={outbox.length} />
        <MetricCard label="Pending Delivery" value={pendingEvents.length} />
        <MetricCard label="Active User" value={user?.fullName || "Unknown"} />
      </div>

      <div style={{ background: "var(--hub-panel)", borderRadius: 18, border: "1px solid var(--hub-line)", padding: 16, marginBottom: 12 }}>
        <div style={{ fontWeight: 700, marginBottom: 10 }}>Master API Configuration</div>
        <div style={{ display: "grid", gap: 10 }}>
          <Field
            label="APC Master API Base URL"
            value={config.apiBaseUrl}
            placeholder="https://master-control.apc.example"
            onChange={(value) => setConfig((prev) => ({ ...prev, apiBaseUrl: value }))}
          />
          <Field
            label="App ID"
            value={config.appId || defaultMasterControlConfig.appId}
            placeholder="CommunitySafeConnect-CSC-2.0"
            onChange={(value) => setConfig((prev) => ({ ...prev, appId: value }))}
          />
          <Field
            label="API Key (x-apc-api-key)"
            value={config.apiKey}
            placeholder="Optional API key"
            onChange={(value) => setConfig((prev) => ({ ...prev, apiKey: value }))}
          />
          <Field
            label="Signing Secret (HMAC)"
            value={config.signingSecret}
            placeholder="Secret for x-apc-signature"
            onChange={(value) => setConfig((prev) => ({ ...prev, signingSecret: value }))}
          />
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
          <button onClick={() => saveMasterControlConfig(config)} style={primaryButtonStyle}>Save Config</button>
          <button onClick={syncNow} style={secondaryButtonStyle} disabled={syncStatus.running}>
            {syncStatus.running ? "Syncing..." : "Sync Pending Events"}
          </button>
          <button onClick={generateSignaturePreview} style={secondaryButtonStyle}>Preview Signature Envelope</button>
        </div>
        {syncStatus.message ? (
          <div style={{ color: "var(--hub-muted)", fontSize: 12, marginTop: 10 }}>
            {syncStatus.message}
            {syncStatus.at ? ` (${new Date(syncStatus.at).toLocaleTimeString()})` : ""}
          </div>
        ) : null}
      </div>

      {signedPreview ? (
        <div style={{ background: "var(--hub-panel)", borderRadius: 18, border: "1px solid var(--hub-line)", padding: 16, marginBottom: 12 }}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Signed Payload Preview</div>
          <pre style={{ margin: 0, whiteSpace: "pre-wrap", color: "var(--hub-muted)", fontSize: 12 }}>
            {JSON.stringify(signedPreview, null, 2)}
          </pre>
        </div>
      ) : null}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12, marginBottom: 12 }}>
        {appCatalog.map((app) => (
          <div key={app.id} style={{ background: "var(--hub-panel)", border: "1px solid var(--hub-line)", borderRadius: 16, padding: 14 }}>
            <div style={{ color: "var(--hub-muted)", fontSize: 12 }}>{app.label}</div>
            <div style={{ fontWeight: 800, fontSize: 24, marginTop: 4 }}>{bySourceApp[app.id] || bySourceApp[app.id.toLowerCase()] || 0}</div>
            <div style={{ color: "var(--hub-muted)", fontSize: 12 }}>events observed in outbox</div>
          </div>
        ))}
      </div>

      <div style={{ background: "var(--hub-panel)", borderRadius: 18, border: "1px solid var(--hub-line)", padding: 16 }}>
        <div style={{ fontWeight: 700, marginBottom: 10 }}>Entity Stream Breakdown</div>
        {Object.entries(byEntityType).length ? (
          <div style={{ display: "grid", gap: 8 }}>
            {Object.entries(byEntityType).map(([entityType, count]) => (
              <div key={entityType} style={{ display: "flex", justifyContent: "space-between", border: "1px solid var(--hub-line)", borderRadius: 10, padding: "8px 10px" }}>
                <span style={{ textTransform: "capitalize" }}>{entityType}</span>
                <strong>{count}</strong>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: "var(--hub-muted)", margin: 0 }}>No integration events queued yet.</p>
        )}
      </div>
    </div>
  );
}

function MetricCard({ label, value }) {
  return (
    <div style={{ background: "var(--hub-panel)", borderRadius: 16, border: "1px solid var(--hub-line)", padding: 14 }}>
      <div style={{ color: "var(--hub-muted)", fontSize: 12 }}>{label}</div>
      <div style={{ fontWeight: 800, fontSize: 24, marginTop: 4 }}>{value}</div>
    </div>
  );
}

function Field({ label, value, placeholder, onChange }) {
  return (
    <label style={{ display: "grid", gap: 5 }}>
      <span style={{ color: "var(--hub-muted)", fontSize: 12 }}>{label}</span>
      <input
        value={value || ""}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        style={{
          border: "1px solid var(--hub-line)",
          borderRadius: 10,
          background: "var(--hub-panel-2)",
          color: "var(--hub-text)",
          padding: "9px 10px",
          boxSizing: "border-box",
          fontFamily: "inherit",
        }}
      />
    </label>
  );
}

const primaryButtonStyle = {
  border: 0,
  borderRadius: 12,
  padding: "10px 12px",
  background: "var(--hub-blue)",
  color: "#07131f",
  fontWeight: 700,
  cursor: "pointer",
};

const secondaryButtonStyle = {
  border: "1px solid var(--hub-line)",
  borderRadius: 12,
  padding: "10px 12px",
  background: "transparent",
  color: "var(--hub-text)",
  fontWeight: 700,
  cursor: "pointer",
};