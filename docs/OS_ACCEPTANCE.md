# AUTORA OS Acceptance Checklist

## Auth + Role Guards
- [x] `/os/*` redirects unauthenticated users to `/os/login`
- [x] unauthorized roles are blocked from protected admin screens
- [x] shared session helpers exist:
  - `getSessionUser()`
  - `getUserRole()`
  - `getAllowedStores()`
  - `requireRole()`
- [x] alias route names resolve to canonical OS screens
- [ ] direct tenant-isolation API test with user JWTs against live Supabase RLS

## Canonical Metrics
- [x] canonical metrics endpoint exists: `/api/os/metrics`
- [x] canonical queue endpoint exists: `/api/os/queue`
- [x] canonical execution endpoint exists: `/api/os/execution`
- [x] canonical audit endpoint exists: `/api/os/audit`
- [x] canonical export endpoint exists: `/api/os/reports/exports`
- [x] Revenue at Risk is always formatted as ZAR
- [x] non-live metrics return `not_configured` instead of fake live values
- [x] Recover Now default remains inside the 48-hour actionable window

## SLA / Audit Determinism
- [x] SLA enforcer cron path exists and refreshes command metrics
- [x] breach and recovery logic are covered by DB tests
- [x] queue and execution actions write audit events
- [x] audit log page is labelled `Immutable operational log`
- [ ] append-only audit trigger verified in live environment after migration

## Queue / Execution UX
- [x] queue has server-side pagination
- [x] queue shows risk score and SLA countdown
- [x] queue has manager bulk actions
- [x] execution page prioritizes confirm / complete / reschedule / no-show
- [x] booking value column hides when not configured

## Reports / Settings
- [x] reports page uses canonical forecast values
- [x] reports page includes methodology
- [x] reports page shows insufficient-history state
- [x] settings page includes:
  - Users & Roles
  - Stores & Business Hours
  - WhatsApp Integration Status
  - SLA Policies
  - Billing

## Validation Commands
- [x] `PATH="$PWD/.local/node/bin:$PATH" npm run lint`
- [x] `PATH="$PWD/.local/node/bin:$PATH" npm run build`
- [ ] `PATH="$PWD/.local/node/bin:$PATH" npm test` against live Supabase credentials

## Notes
- Playwright e2e coverage is not added in this pass because the repository does not currently include Playwright and dependency installation was not performed in this session.
- Live RLS proof still requires authenticated non-service-role test users in the target Supabase project.
