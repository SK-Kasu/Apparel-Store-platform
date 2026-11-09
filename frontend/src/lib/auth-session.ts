import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";

export const SESSION_COOKIE = "radiant_admin_session";
export const SESSION_TTL_SECONDS = 60 * 60 * 8;

const DEV_SESSION_SECRET = "radiant-regalia-development-session-secret-change-me";
const TOKEN_VERSION = "v1";

export type AdminSession = {
  email: string;
  name: string;
  role: "ADMIN";
  exp: number;
};

function getSessionKey(): Buffer | null {
  const secret =
    process.env.AUTH_SECRET ??
    (process.env.NODE_ENV === "production" ? null : DEV_SESSION_SECRET);

  if (!secret || secret.length < 32) {
    return null;
  }

  return createHash("sha256").update(secret).digest();
}

function encode(value: Buffer): string {
  return value.toString("base64url");
}

function decode(value: string): Buffer {
  return Buffer.from(value, "base64url");
}

export function createSessionToken(
  session: Omit<AdminSession, "exp">
): string {
  const key = getSessionKey();

  if (!key) {
    throw new Error("AUTH_SECRET must be at least 32 characters to create a session.");
  }

  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const payload = JSON.stringify({
    ...session,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS
  });
  const ciphertext = Buffer.concat([
    cipher.update(payload, "utf8"),
    cipher.final()
  ]);
  const tag = cipher.getAuthTag();

  return [TOKEN_VERSION, encode(iv), encode(tag), encode(ciphertext)].join(".");
}

export function verifySessionToken(token?: string | null): AdminSession | null {
  if (!token) {
    return null;
  }

  const key = getSessionKey();

  if (!key) {
    return null;
  }

  const [version, iv, tag, ciphertext] = token.split(".");

  if (version !== TOKEN_VERSION || !iv || !tag || !ciphertext) {
    return null;
  }

  try {
    const decipher = createDecipheriv("aes-256-gcm", key, decode(iv));
    decipher.setAuthTag(decode(tag));
    const payload = Buffer.concat([
      decipher.update(decode(ciphertext)),
      decipher.final()
    ]).toString("utf8");
    const session = JSON.parse(payload) as AdminSession;

    if (
      session.role !== "ADMIN" ||
      typeof session.email !== "string" ||
      typeof session.name !== "string" ||
      typeof session.exp !== "number" ||
      session.exp < Math.floor(Date.now() / 1000)
    ) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}
