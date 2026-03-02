import { createClient } from "jsr:@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.");
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});

Deno.serve(async () => {
  const started = performance.now();

  const { data, error } = await supabase.rpc("autora_run_sla_enforcer");

  if (error) {
    console.error("sla_enforcer_failed", error);
    return new Response(
      JSON.stringify({
        ok: false,
        error: error.message
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }

  const { data: refreshData, error: refreshError } = await supabase.rpc("autora_refresh_store_command_metrics");
  if (refreshError) {
    console.error("command_metrics_refresh_failed", refreshError);
  }

  const durationMs = Math.round(performance.now() - started);
  const row = Array.isArray(data) ? data[0] : data;

  return new Response(
    JSON.stringify({
      ok: true,
      duration_ms: durationMs,
      result: row || null,
      command_metrics_refreshed_at: refreshError ? null : refreshData || null,
      command_metrics_refresh_error: refreshError?.message || null
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" }
    }
  );
});
