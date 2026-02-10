import { createHmac, timingSafeEqual } from "crypto";
import { canAccessScreen, ROLE_SCREEN_ACCESS, type DealerRole } from "@/lib/os-access";

export type DealerSession = {
  email: string;
  name: string;
  role: DealerRole;
  iat: number;
  exp: number;
};

type DealerCredential = {
  email: string;
  password: string;
  role: DealerRole;
  name: string;
};

export const SESSION_COOKIE_NAME = "dealer_os_session";
const SESSION_HOURS = 12;
const DEFAULT_OS_PATH = "/os/dashboard";

function getSessionSecret() {
  const secret = process.env.SESSION_SECRET;
  if (secret && secret.length >= 32) return secret;
  throw new Error("SESSION_SECRET must be set to a 32+ character value.");
}

function getDealerCredentials(): DealerCredential[] {
  function resolveCredential(params: {
    role: DealerRole;
    name: string;
    emailEnv: string;
    passwordEnv: string;
  }) {
    const email = process.env[params.emailEnv];
    const password = process.env[params.passwordEnv];

    if (!email || !password) return null;
    return {
      email: email.toLowerCase(),
      password,
      role: params.role,
      name: params.name
    } satisfies DealerCredential;
  }

  const credentials = [
    resolveCredential({
      role: "platform_owner",
      name: "Platform Owner",
      emailEnv: "PLATFORM_OWNER_EMAIL",
      passwordEnv: "PLATFORM_OWNER_PASSWORD"
    }),
    resolveCredential({
      role: "platform_support",
      name: "Platform Support",
      emailEnv: "PLATFORM_SUPPORT_EMAIL",
      passwordEnv: "PLATFORM_SUPPORT_PASSWORD"
    }),
    resolveCredential({
      role: "dealer_admin",
      name: "Dealer Admin",
      emailEnv: "DEALER_ADMIN_EMAIL",
      passwordEnv: "DEALER_ADMIN_PASSWORD"
    }),
    resolveCredential({
      role: "dealer_sales",
      name: "Dealer Sales",
      emailEnv: "DEALER_SALES_EMAIL",
      passwordEnv: "DEALER_SALES_PASSWORD"
    }),
    resolveCredential({
      role: "dealer_marketing",
      name: "Dealer Marketing",
      emailEnv: "DEALER_MARKETING_EMAIL",
      passwordEnv: "DEALER_MARKETING_PASSWORD"
    })
  ].filter((item): item is DealerCredential => item !== null);

  return credentials;
}

function encodePayload(payload: DealerSession) {
  return Buffer.from(JSON.stringify(payload)).toString("base64url");
}

function decodePayload(raw: string) {
  try {
    const decoded = Buffer.from(raw, "base64url").toString("utf8");
    return JSON.parse(decoded) as DealerSession;
  } catch {
    return null;
  }
}

function sign(encodedPayload: string) {
  return createHmac("sha256", getSessionSecret()).update(encodedPayload).digest("base64url");
}

function timingSafeEqualString(a: string, b: string) {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);

  if (aBuf.length !== bBuf.length) return false;
  return timingSafeEqual(aBuf, bBuf);
}

export function createSessionToken(session: Omit<DealerSession, "iat" | "exp">) {
  const now = Math.floor(Date.now() / 1000);
  const payload: DealerSession = {
    ...session,
    iat: now,
    exp: now + SESSION_HOURS * 60 * 60
  };

  const encoded = encodePayload(payload);
  const signature = sign(encoded);
  return `${encoded}.${signature}`;
}

export function verifySessionToken(token?: string | null) {
  if (!token) return null;

  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [encodedPayload, signature] = parts;
  let expectedSignature: string;
  try {
    expectedSignature = sign(encodedPayload);
  } catch {
    return null;
  }

  if (!timingSafeEqualString(signature, expectedSignature)) {
    return null;
  }

  const payload = decodePayload(encodedPayload);
  if (!payload) return null;

  const now = Math.floor(Date.now() / 1000);
  if (payload.exp <= now) return null;

  if (!["platform_owner", "platform_support", "dealer_admin", "dealer_sales", "dealer_marketing"].includes(payload.role)) {
    return null;
  }
  return payload;
}

export function authenticateDealer(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const credentials = getDealerCredentials();
  const credential = credentials.find((item) => item.email === normalizedEmail);

  if (!credential) return null;
  if (credential.password !== password) return null;

  return {
    email: credential.email,
    name: credential.name,
    role: credential.role
  };
}

export function isDealerAuthConfigured() {
  const hasStrongSessionSecret = Boolean(process.env.SESSION_SECRET && process.env.SESSION_SECRET.length >= 32);
  return hasStrongSessionSecret && getDealerCredentials().length > 0;
}

function normalizeNextPath(input?: string) {
  if (!input) return DEFAULT_OS_PATH;
  if (!input.startsWith("/os/")) return DEFAULT_OS_PATH;
  if (input === "/os/login" || input.startsWith("/os/login?")) return DEFAULT_OS_PATH;
  return input;
}

function getScreenFromPath(path: string) {
  const normalized = path.split("?")[0];
  const segments = normalized.split("/").filter(Boolean);
  if (segments[0] !== "os") return null;
  return segments[1] || "dashboard";
}

export function resolvePostLoginPath(role: DealerRole, requestedPath?: string) {
  const normalized = normalizeNextPath(requestedPath);
  const screen = getScreenFromPath(normalized);
  if (!screen) return DEFAULT_OS_PATH;
  if (!canAccessScreen(role, screen)) return DEFAULT_OS_PATH;
  return normalized;
}

export function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_HOURS * 60 * 60
  };
}

export { canAccessScreen, ROLE_SCREEN_ACCESS };
export type { DealerRole };
