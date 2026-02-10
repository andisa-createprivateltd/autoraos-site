import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { getSupabaseClient } from "@/lib/supabase";
import { inviteUserSchema } from "@/lib/validation";
import { requireDealerAPIAuth } from "@/lib/mobile-api-auth";

async function resolveUserIdByEmail(email: string) {
  const supabase = getSupabaseClient();
  const list = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 1000
  });

  if (list.error) {
    throw list.error;
  }

  const user = list.data.users.find((item) => item.email?.toLowerCase() === email.toLowerCase());
  return user?.id || null;
}

export async function POST(request: Request) {
  const auth = await requireDealerAPIAuth(request, {
    allowedRoles: ["dealer_admin"]
  });

  if (!auth.ok) {
    return auth.response;
  }

  const rateLimit = checkRateLimit(`invite-user:${auth.context.userId}`, {
    windowMs: 60_000,
    maxRequests: 12
  });

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { message: "Too many invites. Please retry shortly." },
      { status: 429, headers: { "Retry-After": String(Math.ceil((rateLimit.retryAfterMs ?? 0) / 1000)) } }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON payload." }, { status: 400 });
  }

  const parsed = inviteUserSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message || "Invalid invite payload." },
      { status: 400 }
    );
  }

  const input = parsed.data;
  const supabase = getSupabaseClient();

  let userId: string | null = null;

  const inviteResult = await supabase.auth.admin.inviteUserByEmail(input.email, {
    data: {
      dealer_id: auth.context.dealerId,
      role: input.role,
      name: input.name
    }
  });

  if (inviteResult.error) {
    const maybeUserId = await resolveUserIdByEmail(input.email);
    if (!maybeUserId) {
      return NextResponse.json({ message: "Invite failed." }, { status: 500 });
    }
    userId = maybeUserId;
  } else {
    userId = inviteResult.data.user?.id || null;
  }

  if (!userId) {
    return NextResponse.json({ message: "Unable to resolve invited user." }, { status: 500 });
  }

  const upsertResult = await supabase.from("users").upsert(
    {
      id: userId,
      dealer_id: auth.context.dealerId,
      name: input.name,
      email: input.email.toLowerCase(),
      role: input.role,
      is_active: true
    },
    { onConflict: "id" }
  );

  if (upsertResult.error) {
    return NextResponse.json({ message: "Failed to save user profile." }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    userId
  });
}
