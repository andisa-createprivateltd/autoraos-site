import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  SESSION_COOKIE_NAME,
  verifySessionToken,
  type DealerRole
} from "@/lib/dealer-auth";

type WebSessionAuthFailure = {
  ok: false;
  response: NextResponse;
};

type WebSessionAuthSuccess = {
  ok: true;
  session: {
    email: string;
    name: string;
    role: DealerRole;
    dealerScope?: string[];
    defaultDealerId?: string;
  };
};

export async function requireWebSessionAuth(options?: {
  allowedRoles?: DealerRole[];
}): Promise<WebSessionAuthFailure | WebSessionAuthSuccess> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE_NAME)?.value;
  const session = verifySessionToken(token);

  if (!session) {
    return {
      ok: false,
      response: NextResponse.json({ message: "Authentication required." }, { status: 401 })
    };
  }

  if (options?.allowedRoles?.length && !options.allowedRoles.includes(session.role)) {
    return {
      ok: false,
      response: NextResponse.json({ message: "Forbidden." }, { status: 403 })
    };
  }

  return {
    ok: true,
    session: {
      email: session.email,
      name: session.name,
      role: session.role,
      dealerScope: session.dealerScope,
      defaultDealerId: session.defaultDealerId
    }
  };
}
