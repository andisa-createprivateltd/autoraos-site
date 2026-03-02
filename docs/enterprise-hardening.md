# AUTORA OS Enterprise Hardening

## Scope
- Rebuilt the protected command center into an enterprise risk layout:
  - Executive Risk Summary strip
  - Store risk heatmap
  - Recover Now queue
  - Forecast Impact with methodology modal and SLA simulation input
- Removed protected-screen reliance on sample or legacy queue/dashboard math.
- Tightened operator navigation to the required operations/governance/admin hierarchy.
- Added visible governance trust markers:
  - `Immutable log` on audit
  - `System controlled` on policy engine
  - last-updated context on command center metrics

## Data Layer
- Added `/Users/vuyomabilisa/Documents/New project/supabase/migrations/010_autora_os_enterprise_hardening.sql`
- New canonical SQL objects:
  - `v_kpi_sla_compliance(...)`
  - `v_kpi_hot_unbooked(...)`
  - `v_kpi_breaches_7d(...)`
  - `v_store_risk_heatmap(...)`
  - `v_recover_now_queue(...)` with actionable-only queue semantics
  - `v_exec_forecast_30_60_90(...)` with SLA improvement simulation inputs
  - `autora_store_command_metrics_mv` materialized view
  - `autora_refresh_store_command_metrics()`
  - enhanced `autora_dashboard_snapshot(...)`

## UI Changes
- `/Users/vuyomabilisa/Documents/New project/src/app/os/(protected)/dashboard/page.tsx`
  - Removed policy-summary, upcoming-bookings, and embedded audit-feed sections from the command center.
  - Added canonical KPI strip with tooltip definitions/formulas/timeframe/last-updated.
  - Added store-level heatmap with severity color bands:
    - Green: SLA >= 95%
    - Amber: SLA 85-94%
    - Red: SLA < 85%
  - Added Recover Now with SLA countdown timers.
  - Added Forecast Impact section with methodology modal and simulation selector.
- `/Users/vuyomabilisa/Documents/New project/src/app/os/(protected)/leads/page.tsx`
  - Switched to canonical queue rows from Supabase.
  - Added risk score column, SLA countdown, and pagination.
- `/Users/vuyomabilisa/Documents/New project/src/app/os/(protected)/audit-logs/page.tsx`
  - Added immutable-log treatment and pagination.
- `/Users/vuyomabilisa/Documents/New project/src/components/os/os-shell-nav.tsx`
  - Reordered and grouped navigation into Operations / Governance / Admin.
- `/Users/vuyomabilisa/Documents/New project/src/components/os/assistant-settings-form.tsx`
  - Added explicit `System controlled` surfaces for platform-enforced controls.

## Security / Governance Notes
- Command center metrics are server-side and sourced from canonical Supabase functions/views.
- Marketing-role protected views remain redacted at the database layer; the queue is restricted to operational roles.
- Audit log protections remain append-only in SQL.
- `autora_sla_policies` received explicit enterprise RLS policy coverage in the new migration.

## SLA / Materialized View Refresh
- `/Users/vuyomabilisa/Documents/New project/supabase/functions/sla-enforcer/index.ts`
  - After each enforcer run, refreshes the store command metrics materialized view.
  - Returns refresh timestamp/error metadata for observability.

## Validation
- `PATH="$PWD/.local/node/bin:$PATH" npm run lint`
- `PATH="$PWD/.local/node/bin:$PATH" npm run build`

## Deployment Steps
1. Apply `/Users/vuyomabilisa/Documents/New project/supabase/migrations/010_autora_os_enterprise_hardening.sql`
2. Deploy `/Users/vuyomabilisa/Documents/New project/supabase/functions/sla-enforcer/index.ts`
3. Schedule the SLA enforcer to run every 60 seconds
4. Redeploy the Next.js app

## Known Limitations
- The new SQL migration was not executed against a live Supabase instance in this session, so runtime verification of the new SQL objects still needs to happen in the target database.
- Legacy routes such as `/os/insights` and `/os/network-command` still exist in the codebase, but they are removed from the main operator navigation and access matrix for this hardened path.
