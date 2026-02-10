import { NextResponse } from "next/server";
import { z } from "zod";
import {
  authenticateDealer,
  cookieOptions,
  createSessionToken,
  isDealerAuthConfigured,
  resolvePostLoginPath,
  SESSION_COOKIE_NAME
} from "@/lib/dealer-auth";
import { checkRateLimit } from "@/lib/rate-limit";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  next: z.string().optional()
});

export async function POST(request: Request) {
  if (!isDealerAuthConfigured()) {
    return NextResponse.json({ message: "Authentication is not configured." }, { status: 503 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const userAgent = request.headers.get("user-agent") || "unknown";
  const clientKey = `${ip}:${userAgent.slice(0, 60)}`;
  const limit = checkRateLimit(`os-login:${clientKey}`);

  if (!limit.allowed) {
    return NextResponse.json({ message: "Too many login attempts. Please wait a moment." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request payload." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Enter a valid email and password." }, { status: 400 });
  }

  const user = authenticateDealer(parsed.data.email, parsed.data.password);
  if (!user) {
    return NextResponse.json({ message: "Invalid credentials." }, { status: 401 });
  }

  const token = createSessionToken(user);
  const response = NextResponse.json({
    success: true,
    redirectTo: resolvePostLoginPath(user.role, parsed.data.next),
    role: user.role,
    name: user.name
  });

  response.cookies.set(SESSION_COOKIE_NAME, token, cookieOptions());
  return response;
}
