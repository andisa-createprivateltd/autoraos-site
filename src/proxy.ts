import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { canAccessScreen, type DealerRole } from "@/lib/os-access";

const SESSION_COOKIE_NAME = "dealer_os_session";

type TokenPayload = {
  role?: DealerRole;
  exp?: number;
};

function decodeBase64Url(input: string) {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const padLength = (4 - (normalized.length % 4)) % 4;
  const padded = normalized + "=".repeat(padLength);
  return atob(padded);
}

function toBase64Url(bytes: Uint8Array) {
  let binary = "";
  for (const value of bytes) {
    binary += String.fromCharCode(value);
  }

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function getSessionSecret() {
  const secret = process.env.SESSION_SECRET;
  if (secret && secret.length >= 32) return secret;
  return "";
}

async function signPayload(payloadPart: string) {
  const secret = getSessionSecret();
  if (!secret) return null;

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payloadPart));
  return toBase64Url(new Uint8Array(signature));
}

async function parseTokenPayload(token?: string) {
  if (!token) return null;

  const [payloadPart, signaturePart] = token.split(".");
  if (!payloadPart || !signaturePart) return null;

  try {
    const expectedSignature = await signPayload(payloadPart);
    if (!expectedSignature || expectedSignature !== signaturePart) return null;

    const decoded = decodeBase64Url(payloadPart);
    const payload = JSON.parse(decoded) as TokenPayload;

    if (payload.exp && payload.exp <= Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

function getScreenFromPath(pathname: string) {
  const normalized = pathname.split("?")[0];
  const segments = normalized.split("/").filter(Boolean);
  if (segments[0] !== "os") return null;
  const screen = segments[1] || "dashboard";
  if (screen === "inbox") return "conversations";
  if (screen === "queue") return "leads";
  if (screen === "execution") return "bookings";
  if (screen === "policy-engine") return "assistant";
  if (screen === "visibility") return "insights";
  return screen;
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  if (!pathname.startsWith("/os")) return NextResponse.next();

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const payload = await parseTokenPayload(token);
  const role = payload?.role;
  const hasToken = Boolean(token);
  const isLoginRoute = pathname === "/os/login";

  if (!hasToken && !isLoginRoute) {
    const loginUrl = new URL("/os/login", request.url);
    loginUrl.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  // Only enforce role restrictions when token payload can be verified in edge runtime.
  // Server-side route guards still validate signed sessions authoritatively.
  if (role) {
    const screen = getScreenFromPath(pathname);
    if (screen && screen !== "login" && !canAccessScreen(role, screen)) {
      return NextResponse.redirect(new URL("/os/dashboard?denied=1", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/os/:path*"]
};
