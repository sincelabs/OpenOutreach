/**
 * The one door: a single operator password, checked against `DASHBOARD_PASSWORD`.
 *
 * This is the dashboard's only required environment variable — every SiteConfig
 * field it edits lives in the database instead, exactly as the CLI wizard leaves
 * it. Web Crypto (`crypto.subtle`) throughout, deliberately: it runs the same way
 * in the Edge runtime (`middleware.ts`, which cannot load Node's `crypto` module
 * or `better-sqlite3`) and in the Node runtime (the login and settings server
 * actions), so there is one implementation instead of two that could drift.
 */

export const COOKIE_NAME = "openoutreach_dashboard_session";

const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

function requirePassword(): string {
  const password = process.env.DASHBOARD_PASSWORD;
  if (!password) {
    throw new Error(
      "DASHBOARD_PASSWORD is not set. The dashboard has nothing to check a login " +
        "against — set it once in the environment; every other field lives in the " +
        "database and is edited on the dashboard itself.",
    );
  }
  return password;
}

async function sha256(text: string): Promise<Uint8Array> {
  return new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text)));
}

async function hmacKey(secret: string): Promise<CryptoKey> {
  const digest = await sha256(secret);
  return crypto.subtle.importKey(
    "raw",
    digest as BufferSource,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

function toBase64Url(bytes: ArrayBuffer | Uint8Array): string {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let binary = "";
  for (const byte of arr) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string): Uint8Array {
  const padded = value
    .replace(/-/g, "+")
    .replace(/_/g, "/")
    .padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(padded);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

/** Same length either way, compared byte-for-byte — a wrong guess costs no more than a right one. */
export async function checkPassword(candidate: string): Promise<boolean> {
  const expected = requirePassword();
  const [a, b] = await Promise.all([sha256(candidate), sha256(expected)]);
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

/** `<expiry>.<hmac-of-expiry>` — no server-side session store, nothing else to lose. */
export async function createSessionToken(): Promise<string> {
  const payload = String(Date.now() + SESSION_TTL_MS);
  const key = await hmacKey(requirePassword());
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return `${toBase64Url(new TextEncoder().encode(payload))}.${toBase64Url(signature)}`;
}

export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const [payloadPart, signaturePart] = token.split(".");
  if (!payloadPart || !signaturePart) return false;
  try {
    const key = await hmacKey(requirePassword());
    const payloadBytes = fromBase64Url(payloadPart);
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      fromBase64Url(signaturePart) as BufferSource,
      payloadBytes as BufferSource,
    );
    if (!valid) return false;
    const expires = Number(new TextDecoder().decode(payloadBytes));
    return Number.isFinite(expires) && Date.now() < expires;
  } catch {
    // A password rotated since the cookie was issued signs differently now —
    // treat that the same as no session, rather than a crash.
    return false;
  }
}
