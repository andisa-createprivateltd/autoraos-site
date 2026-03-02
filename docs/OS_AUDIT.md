# AUTORA OS Baseline Audit

## Route Inventory

### Implemented OS routes
- `/os/dashboard`
  - File: `/Users/vuyomabilisa/Documents/New project/src/app/os/(protected)/dashboard/page.tsx`
- `/os/conversations` (current inbox implementation)
  - File: `/Users/vuyomabilisa/Documents/New project/src/app/os/(protected)/conversations/page.tsx`
- `/os/leads` (current queue implementation)
  - File: `/Users/vuyomabilisa/Documents/New project/src/app/os/(protected)/leads/page.tsx`
- `/os/bookings` (current execution implementation)
  - File: `/Users/vuyomabilisa/Documents/New project/src/app/os/(protected)/bookings/page.tsx`
- `/os/assistant` (current policy-engine implementation)
  - File: `/Users/vuyomabilisa/Documents/New project/src/app/os/(protected)/assistant/page.tsx`
- `/os/insights` (current visibility implementation)
  - File: `/Users/vuyomabilisa/Documents/New project/src/app/os/(protected)/insights/page.tsx`
- `/os/reports`
  - File: `/Users/vuyomabilisa/Documents/New project/src/app/os/(protected)/reports/page.tsx`
- `/os/audit-logs`
  - File: `/Users/vuyomabilisa/Documents/New project/src/app/os/(protected)/audit-logs/page.tsx`
- `/os/settings`
  - File: `/Users/vuyomabilisa/Documents/New project/src/app/os/(protected)/settings/page.tsx`
- `/os/login`
  - File: `/Users/vuyomabilisa/Documents/New project/src/app/os/(public)/login/page.tsx`

### Missing direct route names from the required IA
- `/os/inbox`
- `/os/queue`
- `/os/execution`
- `/os/policy-engine`
- `/os/visibility`

### Fix status
- `fixed` Add alias routes that redirect to the implemented OS surfaces

## Metric Card Components And Data Sources

### Canonical server-backed metric path
- `/Users/vuyomabilisa/Documents/New project/src/lib/autora-dashboard.ts`
  - uses `autora_dashboard_snapshot(...)`
  - uses `autora_store_command_metrics_mv`
  - uses `v_recover_now_queue(...)`
  - uses `autora_audit_logs`
- `/Users/vuyomabilisa/Documents/New project/src/app/api/os/dashboard/route.ts`
  - current dashboard API for command-center payload

### UI metric consumers
- `/Users/vuyomabilisa/Documents/New project/src/app/os/(protected)/dashboard/page.tsx`
- `/Users/vuyomabilisa/Documents/New project/src/components/os/animated-number.tsx`
- `/Users/vuyomabilisa/Documents/New project/src/components/os/kpi-tooltip.tsx`

### Non-canonical / legacy metric sources still present
- `/Users/vuyomabilisa/Documents/New project/src/lib/os-data.ts`
  - contains sample dashboards, sample network metrics, frontend-derived risk and forecast math
- `/Users/vuyomabilisa/Documents/New project/src/app/os/(protected)/reports/page.tsx`
  - was using a static hardcoded report table before the canonical forecast rewrite
- `/Users/vuyomabilisa/Documents/New project/src/app/os/(protected)/conversations/page.tsx`
  - now reads canonical inbox threads from `autora-dashboard`
- `/Users/vuyomabilisa/Documents/New project/src/app/os/(protected)/bookings/page.tsx`
  - now reads canonical execution rows from `autora-dashboard`
- `/Users/vuyomabilisa/Documents/New project/src/app/os/(protected)/insights/page.tsx`
  - now reads canonical visibility metrics from `autora-dashboard`
- `/Users/vuyomabilisa/Documents/New project/src/app/os/(protected)/network-command/page.tsx`
  - still depends on legacy `os-data` snapshot generation and needs canonicalization
- `/Users/vuyomabilisa/Documents/New project/src/app/os/(protected)/governance/page.tsx`
  - now reads canonical governance snapshot data from `autora-dashboard`

## Demo / Sample / Hardcoded Findings

### Sample state and demo artifacts
- `/Users/vuyomabilisa/Documents/New project/src/lib/os-data.ts`
  - `DEMO_STATE_FILE`
  - `DEMO_SEED_RECORDS`
  - `INITIAL_SAMPLE_THREADS`
  - `INITIAL_SAMPLE_BOOKINGS`
  - `INITIAL_SAMPLE_LEADS`
  - `getSampleDashboard()`
  - `getSampleRecoverNow()`
  - multiple `mode: "sample"` returns for legacy fallback helpers that are still used by older screens
- `/Users/vuyomabilisa/Documents/New project/src/app/os/(protected)/conversations/page.tsx`
  - sample badge removed; page now uses canonical inbox data
- `/Users/vuyomabilisa/Documents/New project/src/app/os/(protected)/insights/page.tsx`
  - sample wording removed; page now uses canonical visibility metrics
- `/Users/vuyomabilisa/Documents/New project/src/app/os/(protected)/network-command/page.tsx`
  - sample badge removed, but the underlying snapshot still comes from `os-data`
- `/Users/vuyomabilisa/Documents/New project/src/app/os/(protected)/governance/page.tsx`
  - sample badge removed; page now uses canonical governance data

### Hardcoded KPI / forecast values
- `/Users/vuyomabilisa/Documents/New project/src/app/os/(protected)/reports/page.tsx`
  - hardcoded 30 / 60 / 90 values

### Frontend/server-adapter calculated metrics still needing review
- `/Users/vuyomabilisa/Documents/New project/src/lib/autora-dashboard.ts`
  - derives `predictedRiskPct` by averaging heatmap rows in TypeScript
  - formats KPI display values in server adapter
- `/Users/vuyomabilisa/Documents/New project/src/lib/os-data.ts`
  - derives revenue at risk, risk %, SLA %, forecast values, and network rollups in TypeScript
- `/Users/vuyomabilisa/Documents/New project/src/lib/marketing-metrics.ts`
  - derives marketing stats from snapshot + local calculations

## Security / Tenant Isolation Findings

### Existing protections found
- `/Users/vuyomabilisa/Documents/New project/src/proxy.ts`
  - blocks unauthenticated `/os/*`
  - blocks unauthorized screens by role
- `/Users/vuyomabilisa/Documents/New project/src/lib/dealer-session.ts`
  - session parsing and scoped dealer filtering
- `/Users/vuyomabilisa/Documents/New project/src/lib/web-api-auth.ts`
  - API auth gate by role
- `/Users/vuyomabilisa/Documents/New project/supabase/migrations/005_autora_os_rls_policies.sql`
  - base RLS policies
- `/Users/vuyomabilisa/Documents/New project/supabase/migrations/009_autora_os_canonical_metrics_and_sla.sql`
  - helper functions:
    - `autora_ctx_role()`
    - `autora_ctx_group_id()`
    - `autora_ctx_dealership_id()`
    - `autora_is_platform()`
    - `autora_can_access_raw_pii()`
  - append-only audit-log triggers
  - marketing redaction views

### Security gaps found
- `/Users/vuyomabilisa/Documents/New project/src/lib/dealer-session.ts`
  - fixed: helper naming now exposes `getSessionUser()`, `getUserRole()`, `getAllowedStores()`, `requireRole()`
- `/Users/vuyomabilisa/Documents/New project/src/app/api/os/messages/send/route.ts`
  - fixed: now queries `autora_conversations`, `autora_leads`, and `autora_messages`
- `/Users/vuyomabilisa/Documents/New project/src/app/api/os/leads/update/route.ts`
  - fixed: now updates `autora_leads`
- `/Users/vuyomabilisa/Documents/New project/src/app/api/os/conversations/handoff/route.ts`
  - fixed: now records canonical `autora_sla_escalations` + audit log entries
- `/Users/vuyomabilisa/Documents/New project/src/app/api/os/bookings/action/route.ts`
  - fixed: demo fallback path removed; canonical booking/lead updates only

## Fix List

### Auth / isolation
- `fixed` Add explicit shared session helpers for user, role, stores, and role gating
- `fixed` Add alias route-name handling in the OS guard layer
- `pending` Add automated tenant-isolation API tests

### Deterministic metrics
- `fixed` Command center uses canonical DB-backed dashboard adapter
- `fixed` Add canonical `/api/os/metrics`
- `fixed` Add canonical `/api/os/queue`
- `fixed` Add canonical `/api/os/execution`
- `fixed` Add canonical `/api/os/audit`
- `fixed` Add canonical `/api/os/reports/exports`
- `fixed` Remove remaining static report table

### Demo/sample artifact removal
- `fixed` Command center no longer uses sample banners
- `fixed` Replace visible sample-mode UI in inbox, governance, network-command, and insights
- `fixed` Remove demo fallback returns from mutation APIs in production paths
- `fixed` Replace legacy sample-backed inbox and visibility data providers with canonical server sources
- `pending` Replace legacy sample-backed network command snapshot generation with canonical server sources

### Operator UX hardening
- `fixed` Queue uses canonical rows, pagination, risk score, countdown
- `fixed` Audit page shows immutable-log treatment and pagination
- `fixed` Policy engine shows system-controlled treatment
- `fixed` Execution page reduce button clutter and align booking status flow
- `fixed` Settings page tabs and integration-status hardening
- `fixed` Queue manager bulk actions write operational audit events

### Reporting
- `fixed` Replace hardcoded report outlook with canonical forecast + methodology + insufficient-history handling
