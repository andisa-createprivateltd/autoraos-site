import "server-only";

import { hasSupabase } from "@/lib/env";
import { getSupabaseClient } from "@/lib/supabase";
import type { DealerRole } from "@/lib/dealer-auth";

export async function recordAutoraAuditLog(params: {
  role: DealerRole;
  email: string;
  action: string;
  entityType: string;
  entityId?: string | null;
  dealershipId?: string | null;
  groupId?: string | null;
  metadata?: Record<string, unknown>;
}) {
  if (!hasSupabase()) return;

  const supabase = getSupabaseClient();
  const actorType =
    params.role === "platform_support"
      ? "platform_support"
      : params.role === "platform_owner"
        ? "platform_owner"
        : "user";

  const { error } = await supabase.from("autora_audit_logs").insert({
    group_id: params.groupId,
    dealership_id: params.dealershipId,
    actor_role: params.role,
    actor_type: actorType,
    action: params.action,
    entity_type: params.entityType,
    entity_id: params.entityId || null,
    metadata: {
      actor_email: params.email,
      ...params.metadata
    }
  });

  if (error) {
    throw error;
  }
}
