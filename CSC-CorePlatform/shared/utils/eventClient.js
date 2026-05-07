import { readIntegrationOutbox, updateOutboxEvent } from "./integrationBridge";
import { buildSignedEventEnvelope } from "./webhookSigning";

export const masterControlConfigKey = "apc-master-control-config-v1";

export const defaultMasterControlConfig = {
  apiBaseUrl: "",
  apiKey: "",
  signingSecret: "",
  appId: "CommunitySafeConnect-CSC-2.0",
};

export function readMasterControlConfig() {
  if (typeof window === "undefined") {
    return { ...defaultMasterControlConfig };
  }

  try {
    const raw = window.localStorage.getItem(masterControlConfigKey);
    if (!raw) {
      return { ...defaultMasterControlConfig };
    }
    const parsed = JSON.parse(raw);
    return { ...defaultMasterControlConfig, ...(parsed || {}) };
  } catch {
    return { ...defaultMasterControlConfig };
  }
}

export function saveMasterControlConfig(nextConfig = {}) {
  if (typeof window === "undefined") {
    return { ...defaultMasterControlConfig };
  }

  const merged = { ...defaultMasterControlConfig, ...(nextConfig || {}) };
  window.localStorage.setItem(masterControlConfigKey, JSON.stringify(merged));
  window.dispatchEvent(new CustomEvent("csc:master-control-config-updated", { detail: merged }));
  return merged;
}

function normalizeApiBaseUrl(apiBaseUrl) {
  return (apiBaseUrl || "").replace(/\/+$/, "");
}

export async function postEventToMasterControl(event, config = {}) {
  const mergedConfig = { ...defaultMasterControlConfig, ...(config || {}) };
  const apiBaseUrl = normalizeApiBaseUrl(mergedConfig.apiBaseUrl);
  if (!apiBaseUrl) {
    throw new Error("Missing Master Control API base URL.");
  }

  const envelope = await buildSignedEventEnvelope(event, mergedConfig.signingSecret);
  const endpoint = `${apiBaseUrl}/api/events/ingest`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(mergedConfig.apiKey ? { "x-apc-api-key": mergedConfig.apiKey } : {}),
      "x-apc-app-id": mergedConfig.appId,
      "x-apc-signature": envelope.signature || "",
      "x-apc-signature-alg": envelope.algorithm,
      "x-apc-signature-timestamp": envelope.timestamp,
      "x-apc-signature-nonce": envelope.nonce,
    },
    body: JSON.stringify({
      sourceApp: mergedConfig.appId,
      event,
      signature: {
        timestamp: envelope.timestamp,
        nonce: envelope.nonce,
        signature: envelope.signature,
        algorithm: envelope.algorithm,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Master Control API responded with HTTP ${response.status}`);
  }

  return true;
}

export async function syncOutboxToMasterControl({ config, maxBatch = 25 } = {}) {
  const mergedConfig = { ...readMasterControlConfig(), ...(config || {}) };
  const candidates = readIntegrationOutbox()
    .filter((event) => event.delivery !== "delivered")
    .filter((event) => (event.attempts || 0) < 7)
    .slice(0, maxBatch);

  let attempted = 0;
  let delivered = 0;
  let failed = 0;

  for (const event of candidates) {
    attempted += 1;
    try {
      await postEventToMasterControl(event, mergedConfig);
      delivered += 1;
      updateOutboxEvent(event.id, (current) => ({
        ...current,
        delivery: "delivered",
        attempts: (current.attempts || 0) + 1,
        deliveredAt: new Date().toISOString(),
        lastAttemptAt: new Date().toISOString(),
        lastError: "",
      }));
    } catch (error) {
      failed += 1;
      updateOutboxEvent(event.id, (current) => ({
        ...current,
        delivery: "failed",
        attempts: (current.attempts || 0) + 1,
        lastAttemptAt: new Date().toISOString(),
        lastError: error?.message || "Master Control sync failed",
      }));
    }
  }

  return {
    attempted,
    delivered,
    failed,
  };
}