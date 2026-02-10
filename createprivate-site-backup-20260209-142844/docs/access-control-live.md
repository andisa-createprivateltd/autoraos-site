# Live Access Control Policy (CreatePrivateLtd)

## Platform Roles

- `platform_owner`
  - Scope: all dealers, billing, logs, settings, API-key governance.
- `platform_support`
  - Scope: dealer setup and operational support.
  - Restriction: no billing, no API-key management, no log-governance controls.

## Dealer Roles (Per Dealer)

- `dealer_admin`
  - Scope: users, business hours, FAQs, booking availability, reports.
- `dealer_sales`
  - Scope: inbox, lead status updates, bookings, handoff notes.
- `dealer_marketing`
  - Scope: metrics-only visibility.
  - Restriction: no conversation/message-content operations.

## Security Rules

- Secrets and platform keys are server-side only.
- `SUPABASE_SERVICE_ROLE_KEY` is required in production.
- Supabase RLS policies are service-role scoped (no anonymous broad access).
- Public API routes are validated and rate-limited.
- Error responses do not leak internal stack/details.

## Meta Cloud API Governance

- Primary control should remain with CreatePrivate platform owners.
- If a dealership owns WABA, use partner access with least privilege.
- Never give clients/freelancers access to platform keys, phone IDs, logs, or all-dealer views.
