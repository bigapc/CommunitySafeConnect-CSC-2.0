export const integrationOutboxKey = "csc-integration-outbox-v1";
export const webhookRegistryKey = "csc-integration-webhooks-v1";

export const defaultWebhookRegistry = {
  organizations: "",
  members: "",
  incidents: "",
  broadcasts: "",
  responders: "",
};

export const defaultWebhookAuthRegistry = {
  organizations: "",
  members: "",
  incidents: "",
  broadcasts: "",
  responders: "",
};

export const webhookAuthRegistryKey = "csc-integration-webhook-auth-v1";

function readJson(storageKey, fallbackValue) {
  if (typeof window === "undefined") {
    return fallbackValue;
  }

  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) {
      return fallbackValue;
    }
    const parsed = JSON.parse(raw);
    return parsed ?? fallbackValue;
  } catch {
    return fallbackValue;
  }
}

export function readIntegrationOutbox() {
  const value = readJson(integrationOutboxKey, []);
  return Array.isArray(value) ? value : [];
}

export function readWebhookRegistry() {
  const value = readJson(webhookRegistryKey, defaultWebhookRegistry);
  return { ...defaultWebhookRegistry, ...(value || {}) };
}

export function readWebhookAuthRegistry() {
  const value = readJson(webhookAuthRegistryKey, defaultWebhookAuthRegistry);
  return { ...defaultWebhookAuthRegistry, ...(value || {}) };
}

export function saveWebhookRegistry(nextRegistry = {}) {
  if (typeof window === "undefined") {
    return { ...defaultWebhookRegistry };
  }

  const merged = { ...defaultWebhookRegistry, ...(nextRegistry || {}) };
  window.localStorage.setItem(webhookRegistryKey, JSON.stringify(merged));
  window.dispatchEvent(new CustomEvent("csc:webhook-registry-updated", { detail: merged }));
  return merged;
}

export function saveWebhookAuthRegistry(nextRegistry = {}) {
  if (typeof window === "undefined") {
    return { ...defaultWebhookAuthRegistry };
  }

  const merged = { ...defaultWebhookAuthRegistry, ...(nextRegistry || {}) };
  window.localStorage.setItem(webhookAuthRegistryKey, JSON.stringify(merged));
  window.dispatchEvent(new CustomEvent("csc:webhook-auth-registry-updated", { detail: merged }));
  return merged;
}

function writeOutbox(events) {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(integrationOutboxKey, JSON.stringify(events));
  window.dispatchEvent(new CustomEvent("csc:integration-outbox-updated", { detail: events[0] || null }));
}

export function queueIntegrationEvent({ sourceApp, entityType, action, entityId, payload = {}, sourceUser }) {
  const webhooks = readWebhookRegistry();
  const event = {
    id: `evt-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    sourceApp,
    entityType,
    action,
    entityId,
    payload,
    sourceUser: sourceUser
      ? {
          id: sourceUser.id,
          fullName: sourceUser.fullName,
          role: sourceUser.role,
        }
      : null,
    delivery: "pending",
    webhookTarget: webhooks[entityType] || "",
    attempts: 0,
    lastAttemptAt: null,
    deliveredAt: null,
    lastError: "",
    createdAt: new Date().toISOString(),
  };

  if (typeof window !== "undefined") {
    const nextEvents = [event, ...readIntegrationOutbox()].slice(0, 100);
    writeOutbox(nextEvents);
  }

  return event;
}

export function updateOutboxEvent(eventId, mutator) {
  if (typeof window === "undefined") {
    return null;
  }

  const current = readIntegrationOutbox();
  const next = current.map((item) => {
    if (item.id !== eventId) {
      return item;
    }
    return mutator(item);
  });
  writeOutbox(next);
  return next.find((item) => item.id === eventId) || null;
}

export async function deliverPendingIntegrationEvents({ maxBatch = 20 } = {}) {
  if (typeof window === "undefined") {
    return {
      attempted: 0,
      delivered: 0,
      failed: 0,
      skipped: 0,
    };
  }

  const authRegistry = readWebhookAuthRegistry();
  const allEvents = readIntegrationOutbox();
  const candidates = allEvents
    .filter((event) => event.delivery !== "delivered")
    .filter((event) => (event.attempts || 0) < 5)
    .slice(0, maxBatch);

  let attempted = 0;
  let delivered = 0;
  let failed = 0;
  let skipped = 0;

  for (const event of candidates) {
    if (!event.webhookTarget) {
      skipped += 1;
      continue;
    }

    attempted += 1;
    const authToken = authRegistry[event.entityType] || "";

    try {
      const response = await fetch(event.webhookTarget, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        body: JSON.stringify({
          eventId: event.id,
          sourceApp: event.sourceApp,
          entityType: event.entityType,
          action: event.action,
          entityId: event.entityId,
          payload: event.payload,
          sourceUser: event.sourceUser,
          createdAt: event.createdAt,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      delivered += 1;
      updateOutboxEvent(event.id, (current) => ({
        ...current,
        delivery: "delivered",
        attempts: (current.attempts || 0) + 1,
        lastAttemptAt: new Date().toISOString(),
        deliveredAt: new Date().toISOString(),
        lastError: "",
      }));
    } catch (error) {
      failed += 1;
      updateOutboxEvent(event.id, (current) => ({
        ...current,
        delivery: "failed",
        attempts: (current.attempts || 0) + 1,
        lastAttemptAt: new Date().toISOString(),
        lastError: error?.message || "Delivery failed",
      }));
    }
  }

  return {
    attempted,
    delivered,
    failed,
    skipped,
  };
}