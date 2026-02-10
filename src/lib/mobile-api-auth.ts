import "server-only";
import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";

export type DealerUserRole = "dealer_admin" | "dealer_sales" | "dealer_marketing";

export type DealerAPIContext = {
  userId: string;
  dealerId: string;
  role: DealerUserRole;
  email: string;
  name: string;
  accessToken: string;
};

type AuthFailure = {
  ok: false;
  response: NextResponse;
};

type AuthSuccess = {
  ok: true;
  context: DealerAPIContext;
};

export async function requireDealerAPIAuth(
  request: Request,
  options: {
    allowedRoles: DealerUserRole[];
  }
): Promise<AuthFailure | AuthSuccess> {
  const authHeader = request.headers.get("authorization") || request.headers.get("Authorization") || "";

  if (!authHeader.startsWith("Bearer ")) {
    return {
      ok: false,
      response: NextResponse.json({ message: "Missing bearer token." }, { status: 401 })
    };
  }

  const accessToken = authHeader.replace("Bearer ", "").trim();
  if (!accessToken) {
    return {
      ok: false,
      response: NextResponse.json({ message: "Invalid bearer token." }, { status: 401 })
    };
  }

  const supabase = getSupabaseClient();
  const userResult = await supabase.auth.getUser(accessToken);
  if (userResult.error || !userResult.data.user) {
    return {
      ok: false,
      response: NextResponse.json({ message: "Authentication failed." }, { status: 401 })
    };
  }

  const userId = userResult.data.user.id;

  const profileResult = await supabase
    .from("users")
    .select("id,dealer_id,role,is_active,email,name")
    .eq("id", userId)
    .limit(1)
    .maybeSingle();

  if (profileResult.error || !profileResult.data) {
    return {
      ok: false,
      response: NextResponse.json({ message: "User profile not found." }, { status: 403 })
    };
  }

  const profile = profileResult.data as {
    id: string;
    dealer_id: string;
    role: DealerUserRole;
    is_active: boolean;
    email: string;
    name: string;
  };

  if (!profile.is_active) {
    return {
      ok: false,
      response: NextResponse.json({ message: "User is disabled." }, { status: 403 })
    };
  }

  if (!options.allowedRoles.includes(profile.role)) {
    return {
      ok: false,
      response: NextResponse.json({ message: "Forbidden." }, { status: 403 })
    };
  }

  return {
    ok: true,
    context: {
      userId: profile.id,
      dealerId: profile.dealer_id,
      role: profile.role,
      email: profile.email,
      name: profile.name,
      accessToken
    }
  };
}
