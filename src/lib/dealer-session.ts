import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE_NAME, verifySessionToken, type DealerRole, type DealerSession } from "@/lib/dealer-auth";

export async function getCurrentSession() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

export async function getSessionUser() {
  return getCurrentSession();
}

type DealerOption = {
  id: string;
  label: string;
};

export function getSessionDealerScope(session: DealerSession): string[] | undefined {
  if (!Array.isArray(session.dealerScope)) return undefined;
  const deduped = Array.from(
    new Set(
      session.dealerScope
        .map((dealerId) => dealerId.trim())
        .filter(Boolean)
    )
  );
  return deduped.length ? deduped : undefined;
}

export function getAllowedStores(session: DealerSession): string[] {
  return getSessionDealerScope(session) || [];
}

export function getUserRole(session: DealerSession): DealerRole {
  return session.role;
}

export function getSessionDefaultDealerId(session: DealerSession): string | undefined {
  const scope = getSessionDealerScope(session);
  if (!scope?.length) return undefined;
  if (session.defaultDealerId && scope.includes(session.defaultDealerId)) {
    return session.defaultDealerId;
  }
  return scope[0];
}

export function sanitizeDealerIdForSession(session: DealerSession, requestedDealerId?: string) {
  const scope = getSessionDealerScope(session);
  if (!scope?.length) return requestedDealerId;

  if (!requestedDealerId) {
    return scope.length === 1 ? scope[0] : undefined;
  }

  if (requestedDealerId && scope.includes(requestedDealerId)) {
    return requestedDealerId;
  }

  return getSessionDefaultDealerId(session);
}

export function getEffectiveDealerIdsForSession(session: DealerSession, requestedDealerId?: string) {
  const scope = getSessionDealerScope(session);
  if (!scope?.length) {
    return requestedDealerId ? [requestedDealerId] : undefined;
  }

  if (requestedDealerId && scope.includes(requestedDealerId)) {
    return [requestedDealerId];
  }

  return scope;
}

export function filterDealerOptionsForSession(session: DealerSession, options: DealerOption[]) {
  const scope = getSessionDealerScope(session);
  if (!scope?.length) return options;
  const allowed = new Set(scope);
  return options.filter((option) => allowed.has(option.id));
}

export async function requireDealerSession(options?: {
  roles?: DealerRole[];
  redirectTo?: string;
}) {
  const session = await getCurrentSession();

  if (!session) {
    const target = options?.redirectTo || "/os/login";
    redirect(target);
  }

  if (options?.roles?.length && !options.roles.includes(session.role)) {
    redirect("/os/dashboard?denied=1");
  }

  return session;
}

export async function requireRole(roles: DealerRole[], options?: { redirectTo?: string }) {
  return requireDealerSession({
    roles,
    redirectTo: options?.redirectTo
  });
}
