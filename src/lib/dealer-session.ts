import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE_NAME, verifySessionToken, type DealerRole } from "@/lib/dealer-auth";

export function getCurrentSession() {
  const store = cookies();
  const token = store.get(SESSION_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

export function requireDealerSession(options?: {
  roles?: DealerRole[];
  redirectTo?: string;
}) {
  const session = getCurrentSession();

  if (!session) {
    const target = options?.redirectTo || "/os/login";
    redirect(target);
  }

  if (options?.roles?.length && !options.roles.includes(session.role)) {
    redirect("/os/dashboard?denied=1");
  }

  return session;
}
