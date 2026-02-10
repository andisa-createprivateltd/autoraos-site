# Demo Walkthrough Script

## Test Accounts (Live Supabase)

Create these in Supabase Auth + `public.users`:

1. Dealer Admin
- Email: `admin@dealerbeta.example`
- Role: `dealer_admin`
- Dealer: `<dealer_uuid>`

2. Dealer Sales
- Email: `sales@dealerbeta.example`
- Role: `dealer_sales`
- Dealer: `<dealer_uuid>`

3. Dealer Marketing
- Email: `marketing@dealerbeta.example`
- Role: `dealer_marketing`
- Dealer: `<dealer_uuid>`

## 8-Minute Demo Flow

1. Login as Dealer Admin.
2. Dashboard:
- Show New Leads Today, Avg Response, Bookings This Week, Missed Leads.
3. Conversations:
- Open a thread, send a message (goes through `/api/send-message`).
- Update lead status.
- Assign lead to sales user.
- Create booking from conversation.
- Trigger handoff (`/api/handoff`).
4. Leads:
- Filter by status/source.
- Open a lead detail and view recent messages + followups.
- Tap Create Booking.
5. Bookings:
- Create booking.
- Update status (booked/completed/no-show/cancelled).
6. Settings (admin):
- Edit business hours + FAQ.
- Toggle `marketing_can_view_messages`.
- Invite user (`/api/invite-user`) and disable a user.
7. Analytics:
- Show trend chart (7/30 day switch), source distribution, bookings count, after-hours handling.
8. Push Deep Link:
- Send test payload with `type=conversation` and valid `id`.
- Verify app opens inbox context.

## Mock Mode Quick Demo

Set `ENABLE_MOCK_MODE = 1` in `Debug.xcconfig`.

- Login with any credentials.
- Full UI flow works with seeded in-app demo data and no backend dependencies.
