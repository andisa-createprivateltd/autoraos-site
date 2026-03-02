# AUTORA OS Codex Plan

## Objective
Rebuild AUTORA OS into a deterministic, production-ready revenue risk system with database-backed KPI calculations, strict tenant isolation, auditable SLA enforcement, and server-only metrics delivery.

## Repo scan summary
- Frontend dashboard surfaces live in `/Users/vuyomabilisa/Documents/New project/src/app/os/(protected)` and currently read from `/Users/vuyomabilisa/Documents/New project/src/lib/os-data.ts`.
- Server endpoints exist under `/Users/vuyomabilisa/Documents/New project/src/app/api/os`, but current reporting is still placeholder-driven.
- Supabase migrations exist in `/Users/vuyomabilisa/Documents/New project/supabase/migrations`, with baseline AUTORA schema in `004_*` and RLS in `005_*`.
- Current SLA and network logic in `/Users/vuyomabilisa/Documents/New project/src/lib/os-data.ts` still contains sample generation and non-canonical math.
- No Supabase Edge Functions are currently present for the SLA enforcer.

## Execution slices
1. Canonical data layer
   - Add migration for missing operational columns, append-only audit/sla tables, deterministic SQL functions, KPI views, marketing redaction views, indexes, and triggers.
2. SLA enforcement
   - Add DB functions/triggers for inbound/outbound message handling.
   - Add Supabase Edge Function for 60s enforcer loop with audit writes and heartbeat tracking.
3. Security hardening
   - Extend RLS helper functions and policies for new AUTORA tables/views.
   - Enforce append-only audit rules and marketing-role redaction access.
4. Server metrics API
   - Replace placeholder report/dashboard logic with DB-backed queries only.
   - Add health endpoints for DB and SLA heartbeat.
5. Frontend refactor
   - Make `/os/dashboard` and supporting pages consume canonical server endpoints.
   - Remove visible sample/demo artifacts from dashboard, reports, and audit surfaces.
6. Seed + tests + docs
   - Add deterministic seed script for one group, two dealerships, scoped users, leads/messages/bookings/SLA events.
   - Add unit and integration tests for SLA and RLS-sensitive flows.
   - Publish release notes in `/Users/vuyomabilisa/Documents/New project/docs/release-readiness.md`.

## Commit slices
- `feat(db): canonical revenue risk metrics and sla tables`
- `feat(sla): deterministic enforcer and audit logging`
- `feat(api): db-backed dashboard and health endpoints`
- `feat(ui): canonical revenue risk dashboard wiring`
- `test: add sla reconciliation and rls coverage`
- `docs: release readiness and migration runbook`
