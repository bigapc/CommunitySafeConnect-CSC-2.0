function toHex(bytes) {
  return Array.from(bytes)
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("");
}

export function createSigningInput({ timestamp, nonce, payload }) {
  return `${timestamp}.${nonce}.${payload}`;
}

export async function createHmacSha256Signature({ secret, message }) {
  if (!secret || !message || typeof crypto === "undefined" || !crypto.subtle) {
    return "";
  }

  const encoder = new TextEncoder();
  const keyMaterial = encoder.encode(secret);
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyMaterial,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", cryptoKey, encoder.encode(message));
  return toHex(new Uint8Array(signature));
}

export async function buildSignedEventEnvelope(event, signingSecret = "") {
  const timestamp = new Date().toISOString();
  const nonce = Math.random().toString(16).slice(2, 12);
  const payload = JSON.stringify(event);
  const signingInput = createSigningInput({ timestamp, nonce, payload });
  const signature = signingSecret
    ? await createHmacSha256Signature({ secret: signingSecret, message: signingInput })
    : "";

  return {
    timestamp,
    nonce,
    payload,
    signature,
    algorithm: signature ? "hmac-sha256" : "none",
  };
}