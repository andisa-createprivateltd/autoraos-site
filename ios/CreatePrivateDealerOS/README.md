# CreatePrivate Dealer OS (iOS)

Production-focused SwiftUI iOS app (`iOS 16+`) for dealership operations. The app uses Supabase Auth, dealer-scoped Supabase Postgres data, and backend API routes for WhatsApp send/handoff/invite flows.

## Included

- SwiftUI + MVVM + dependency injection architecture
- Supabase Auth integration (email/password + password reset)
- Dealer-scoped screens:
  - Login
  - Dashboard (Money View)
  - Conversations list/detail
  - Leads list/detail
  - Bookings list/create/update
  - Settings (admin only)
  - Analytics (Swift Charts)
- Role controls:
  - `dealer_admin`
  - `dealer_sales`
  - `dealer_marketing` (message content controlled by feature flag)
- Offline tolerance:
  - SQLite cache for last 50 conversations and last 50 messages per conversation per dealer
- Push plumbing:
  - APNs direct registration
  - Push deep links to conversations/bookings

## Project Location

- Xcode project: `ios/CreatePrivateDealerOS/CreatePrivateDealerOS.xcodeproj`
- App source: `ios/CreatePrivateDealerOS/CreatePrivateDealerOS`

## 1) Environment Setup

Set values in:

- `ios/CreatePrivateDealerOS/CreatePrivateDealerOS/Config/Debug.xcconfig`
- `ios/CreatePrivateDealerOS/CreatePrivateDealerOS/Config/Release.xcconfig`

Required keys:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `BACKEND_BASE_URL`

Optional:

- `ENABLE_MOCK_MODE` (`1` to run fully local demo mode)
- `ALLOW_ADMIN_PHONE_UNMASK`
- `MARKETING_CAN_VIEW_MESSAGES_DEFAULT`
- `MISSED_LEAD_MINUTES`

## 2) Run (Simulator / Device)

1. Open `ios/CreatePrivateDealerOS/CreatePrivateDealerOS.xcodeproj` in Xcode.
2. Select `CreatePrivateDealerOS` scheme.
3. Choose simulator/device.
4. Build and run.

## 3) Push Notifications (APNs Direct)

1. In Apple Developer portal, enable Push Notifications for your app ID.
2. Add push entitlement/capability in Xcode target settings.
3. Configure APNs key/certificate in your push delivery backend.
4. Ensure your backend sends payload fields for deep link routing:
   - `type`: `conversation` or `booking`
   - `id`: UUID string

The iOS app registers APNs token and posts it to `POST /api/device-token`.

## 4) Backend Requirements

Implemented routes in this repo:

- `POST /api/send-message`
- `POST /api/handoff`
- `POST /api/invite-user`
- `POST /api/device-token`

Important:

- Meta credentials stay server-side (`META_CLOUD_API_TOKEN`, `META_WHATSAPP_PHONE_NUMBER_ID`)
- iOS app never stores Meta API tokens

## 5) Supabase RLS for Mobile

Apply:

- `supabase/schema.sql`
- `supabase/mobile_rls.sql`

`mobile_rls.sql` adds authenticated dealer-scoped policies and role-based access, including optional marketing message-content restriction from `dealers.ai_config.marketing_view_messages`.

## 6) Demo Accounts

See:

- `ios/CreatePrivateDealerOS/docs/demo-walkthrough.md`

For mock mode (`ENABLE_MOCK_MODE = 1`), any email/password works.
