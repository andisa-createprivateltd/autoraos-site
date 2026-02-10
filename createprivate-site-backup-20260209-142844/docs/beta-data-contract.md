# Dealer OS + WhatsApp AI Beta Data Contract

This is the exact beta schema used by `supabase/schema.sql`.

## Core Tables (Non-Negotiable)

1. `dealers`
- `id` (uuid, pk)
- `name`
- `brands` (text[])
- `country`
- `city`
- `timezone`
- `business_hours` (jsonb)
- `whatsapp_phone_number`
- `plan` (`starter` / `growth` / `scale`)
- `status` (`active` / `paused`)
- `ai_config` (jsonb)
- `created_at`

2. `users`
- `id` (uuid, pk; Supabase Auth user id)
- `dealer_id` (fk -> `dealers.id`)
- `name`
- `email`
- `role` (`dealer_admin` / `dealer_sales` / `dealer_marketing`)
- `is_active`
- `last_login_at`
- `created_at`

3. `leads`
- `id` (uuid, pk)
- `dealer_id` (fk)
- `source` (`whatsapp` / `website` / `ads` / `oem`)
- `first_contact_at`
- `name` (nullable)
- `phone`
- `vehicle_interest` (nullable)
- `budget_range` (nullable)
- `status` (`new` / `contacted` / `booked` / `visited` / `sold` / `lost`)
- `assigned_user_id` (nullable fk -> `users.id`)
- `last_activity_at`
- `created_at`

4. `conversations`
- `id` (uuid, pk)
- `dealer_id` (fk)
- `lead_id` (fk)
- `channel` (`whatsapp` / `web`)
- `is_open`
- `last_message_at`
- `created_at`

5. `messages`
- `id` (uuid, pk)
- `dealer_id` (fk)
- `conversation_id` (fk)
- `lead_id` (fk)
- `direction` (`inbound` / `outbound`)
- `sender_type` (`lead` / `ai` / `human` / `system`)
- `sender_user_id` (nullable fk -> `users.id`)
- `content`
- `message_type` (`text` / `button` / `image`)
- `provider_message_id` (nullable)
- `created_at`

6. `response_metrics`
- `id` (uuid, pk)
- `dealer_id` (fk)
- `lead_id` (fk)
- `conversation_id` (fk)
- `first_inbound_at`
- `first_response_at`
- `first_response_by` (`ai` / `human`)
- `response_seconds`

7. `bookings`
- `id` (uuid, pk)
- `dealer_id` (fk)
- `lead_id` (fk)
- `type` (`test_drive` / `call` / `appointment`)
- `requested_at`
- `scheduled_for`
- `status` (`booked` / `completed` / `no_show` / `cancelled`)
- `created_by` (`ai` / `human`)
- `created_at`

8. `ai_events`
- `id` (uuid, pk)
- `dealer_id` (fk)
- `lead_id` (fk)
- `conversation_id` (fk)
- `event_type` (`faq` / `lead_capture` / `booking` / `followup` / `handoff`)
- `success`
- `meta` (jsonb)
- `created_at`

9. `followups`
- `id` (uuid, pk)
- `dealer_id` (fk)
- `lead_id` (fk)
- `type` (`reminder` / `nudge` / `no_show`)
- `sent_via` (`template` / `freeform`)
- `sent_at`
- `responded`
- `response_at` (nullable)
- `created_at`

10. `subscriptions`
- `id` (uuid, pk)
- `dealer_id` (fk)
- `plan`
- `monthly_price` (int)
- `status` (`trial` / `active` / `overdue` / `cancelled`)
- `start_date`
- `end_date` (nullable)
- `created_at`

## Screen Mapping (Dealer OS)

- Login: `users` + auth role checks.
- Dashboard (Money View): `leads`, `response_metrics`, `bookings`.
- Conversations: `conversations`, `messages`, `leads`.
- Leads: `leads` (+ `users` for assignment labels).
- Bookings: `bookings` (+ `leads`, `dealers`).
- AI Assistant: `dealers.business_hours`, `dealers.ai_config`.
- Insights: `response_metrics`, `leads`, `bookings`, `ai_events`.
- Settings: `users`, `dealers`, `subscriptions`, availability config.

## Investor Metrics Required

The SQL view `investor_metrics_30d` computes:
- Median response time
- Average response time
- Leads per dealer per week
- Messages per dealer per month
- Bookings per dealer per month
- % first responses by AI
- % after-hours leads saved
- Usage frequency (daily/weekly/low)
