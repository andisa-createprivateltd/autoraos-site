# Mobile Backend Contract (iOS)

This contract defines backend endpoints used by the iOS app (`/ios/CreatePrivateDealerOS`).

## Auth

All endpoints require:

- `Authorization: Bearer <supabase_access_token>`

Token is validated server-side with Supabase Auth, then dealer scope is resolved from `public.users`.

## Endpoints

### POST `/api/send-message`

Dealer roles: `dealer_admin`, `dealer_sales`

Request:

```json
{
  "conversation_id": "uuid",
  "lead_id": "uuid",
  "content": "text"
}
```

Behavior:

- Verifies conversation + lead belong to authenticated dealer.
- Sends WhatsApp server-side via Meta Cloud API when server env is configured.
- Persists outbound message in `messages`.
- Updates `conversations.last_message_at`.

Response:

```json
{
  "success": true,
  "mode": "sent"
}
```

or (when Meta credentials are not configured):

```json
{
  "success": true,
  "mode": "mock"
}
```

### POST `/api/handoff`

Dealer roles: `dealer_admin`, `dealer_sales`

Request:

```json
{
  "conversation_id": "uuid",
  "lead_id": "uuid",
  "reason": "string"
}
```

Behavior:

- Verifies dealer scope.
- Persists handoff in `ai_events` (`event_type = handoff`).
- Optionally posts handoff payload to `HANDOFF_WEBHOOK_URL`.

Response:

```json
{ "success": true }
```

### POST `/api/invite-user`

Dealer roles: `dealer_admin`

Request:

```json
{
  "email": "person@example.com",
  "name": "Person",
  "role": "dealer_sales"
}
```

Behavior:

- Invites user via Supabase Auth Admin API.
- Upserts profile in `public.users` scoped to dealer.

Response:

```json
{
  "success": true,
  "userId": "uuid"
}
```

### POST `/api/device-token`

Dealer roles: `dealer_admin`, `dealer_sales`, `dealer_marketing`

Request:

```json
{
  "device_token": "apns-token",
  "platform": "ios"
}
```

Response:

```json
{
  "success": true,
  "registered": true
}
```

## Required Environment Variables

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `META_CLOUD_API_TOKEN` (optional for real WhatsApp send)
- `META_WHATSAPP_PHONE_NUMBER_ID` (optional for real WhatsApp send)
- `HANDOFF_WEBHOOK_URL` (optional)
