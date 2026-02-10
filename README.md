# AUTORA Website

Production-ready Next.js website for **AUTORA** (a subsidiary of **CreatePrivateLtd**), positioned as the WhatsApp + lead infrastructure platform for automotive dealerships.

This repository now also includes:

- Native iOS app under `/ios/CreatePrivateDealerOS`
- Flutter mobile app under `/flutter/create_private_dealer_os`

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Supabase (bookings, contacts, availability, dealership seed)
- Google Places API (live dealership lookup)
- SendGrid (booking/customer/admin email notifications + ICS invite)
- Native iOS app: Swift + SwiftUI (in `/ios/CreatePrivateDealerOS`)
- Flutter app: Dart + Flutter (in `/flutter/create_private_dealer_os`)

## Implemented Pages

- `/` Home
- `/dealer-os`
- `/services`
- `/pricing`
- `/book`
- `/dealerships-near-me`
- `/founder-narrative`
- `/case-studies`
- `/about`
- `/contact`

## AUTORA OS App (Authenticated)

- Login: `/os/login`
- Protected routes:
  - `/os/dashboard`
  - `/os/conversations`
  - `/os/leads`
  - `/os/bookings`
  - `/os/assistant` (platform_owner / platform_support / dealer_admin)
  - `/os/insights`
  - `/os/settings` (platform_owner / platform_support / dealer_admin)
- Roles:
  - `platform_owner`: all dealers + billing/logs/API-key access
  - `platform_support`: setup + operational screens, no billing/logs/API-key access
  - `dealer_admin`: dealership settings + operations
  - `dealer_sales`: inbox/leads/bookings/insights
  - `dealer_marketing`: metrics-only access

## Positioning Source Of Truth

- AUTORA OS V1 information architecture is represented in `/dealer-os`.
- SaaS pricing strategy is implemented in `/pricing`:
  - Starter: `R8,500 / month`
  - Growth: `R15,000 / month` (Most Popular)
  - Scale: `R45,000 / month`
  - Add-on: Paid Demand Generation (custom pricing; mandatory for most)
- Founder/investor/acquirer narrative is represented in `/founder-narrative`.
- Canonical planning document is stored at `docs/dealer-os-source-of-truth.md`.
- Beta data contract is stored at `docs/beta-data-contract.md`.
- Live access control policy is stored at `docs/access-control-live.md`.
- iOS/mobile backend contract is stored at `docs/mobile-backend-contract.md`.

## Key Features

- Responsive, mobile-first UI with clean premium visual style
- Working validated forms (booking + contact)
- Honeypot + API rate limiting for basic spam prevention
- Native booking flow (15-minute slots)
  - Uses `availability_windows` to define admin availability
  - Prevents double-booking with unique `scheduled_for`
- Booking confirmation flow
  - Customer confirmation email
  - Admin notification email
  - Calendar invite (`.ics`) attachment
  - Optional WhatsApp confirmation button after booking
- "Dealerships Near Me"
  - Browser geolocation support
  - City/suburb geocoding to coordinates (South Africa) when GPS is unavailable
  - Live Google Places lookup (Chery, Haval, Omoda, Jaecoo, BYD, GWM)
  - Search radius control (10km to 80km)
  - Brand filtering
  - Saved last-known location support + city/suburb manual search fallback
  - Map view and one-click personalized booking CTA
- Floating WhatsApp chat button
- AUTORA OS role-based authentication with signed cookie sessions
- Beta data contract implementation with 10 core tables:
  - `dealers`
  - `users`
  - `leads`
  - `conversations`
  - `messages`
  - `response_metrics`
  - `bookings`
  - `ai_events`
  - `followups`
  - `subscriptions`
- Investor/OEM metric view:
  - `investor_metrics_30d` (avg response time, messages/month, leads, bookings, AI-handled %, after-hours saved %, usage frequency)
- GA4 placeholder integration via `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- SEO basics (`metadata`, `robots`, `sitemap`)

## Live Security Posture

- Server routes use `SUPABASE_SERVICE_ROLE_KEY` for privileged operations.
- Mobile app uses Supabase Auth JWT + `SUPABASE_ANON_KEY` with strict dealer-scoped RLS (`supabase/mobile_rls.sql`).
- Role matrix enforces least privilege across platform and dealership users.
- Platform secrets, API keys, and logs are never exposed to dealer/client roles.
- Form endpoints include validation, honeypot spam checks, and request rate limiting.

## Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Required placeholders:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_ANON_KEY` (required for iOS app auth/data access)
- `SENDGRID_API_KEY`
- `GOOGLE_MAPS_KEY` (or use `MAPBOX_TOKEN` if you switch maps implementation)
- `ADMIN_EMAIL`
- `SESSION_SECRET`
- `META_CLOUD_API_TOKEN` (optional; required for live WhatsApp send)
- `META_WHATSAPP_PHONE_NUMBER_ID` (optional; required for live WhatsApp send)
- `HANDOFF_WEBHOOK_URL` (optional)
- `PLATFORM_OWNER_EMAIL`
- `PLATFORM_OWNER_PASSWORD`
- `PLATFORM_SUPPORT_EMAIL`
- `PLATFORM_SUPPORT_PASSWORD`
- `DEALER_ADMIN_EMAIL`
- `DEALER_ADMIN_PASSWORD`
- `DEALER_SALES_EMAIL`
- `DEALER_SALES_PASSWORD`
- `DEALER_MARKETING_EMAIL`
- `DEALER_MARKETING_PASSWORD`

If a role is not needed, leave its email/password unset and that role will not be able to authenticate.

Public values:

- `NEXT_PUBLIC_SITE_URL` (set to `https://autoraos.com` in production)
- `NEXT_PUBLIC_WHATSAPP_NUMBER`
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`

Optional server value:

- `BOOKING_UID_DOMAIN` (default `autoraos.com`)

## Supabase Setup

1. Create a Supabase project.
2. Use a clean schema (or run a full DB reset) so field names match this beta contract exactly.
3. In SQL Editor, run:
   - `supabase/schema.sql`
   - `supabase/mobile_rls.sql` (required for iOS dealer-authenticated access)
   - `supabase/seed.sql`
4. Confirm at least these tables exist:
   - `dealers`
   - `users`
   - `leads`
   - `conversations`
   - `messages`
   - `response_metrics`
   - `bookings`
   - `ai_events`
   - `followups`
   - `subscriptions`
   - `availability_windows`
   - `dealerships_seed`

`supabase/seed.sql` loads **60 sample Chinese dealership entries** and bootstraps matching `dealers` + `subscriptions` records.

## Local Development

If your machine has no global `node`/`npm`, use the project-local runtime:

```bash
source scripts/use-local-node.sh
```

Then run:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## iOS App

- Xcode project: `/ios/CreatePrivateDealerOS/CreatePrivateDealerOS.xcodeproj`
- Setup guide: `/ios/CreatePrivateDealerOS/README.md`
- Demo script: `/ios/CreatePrivateDealerOS/docs/demo-walkthrough.md`

Backend API routes used by iOS:

- `POST /api/send-message`
- `POST /api/handoff`
- `POST /api/invite-user`
- `POST /api/device-token`

## Flutter App

- Flutter project: `/flutter/create_private_dealer_os`
- Setup guide: `/flutter/create_private_dealer_os/README.md`
- Demo script: `/flutter/create_private_dealer_os/docs/demo-walkthrough.md`

## Deployment (Vercel)

1. Push repository to GitHub.
2. Import project into [Vercel](https://vercel.com).
3. Set environment variables in Vercel Project Settings (including `NEXT_PUBLIC_SITE_URL=https://autoraos.com`).
4. Add domain `autoraos.com` under Vercel Project Settings -> Domains.
5. Point DNS at your domain host:
   - `A` record for `@` -> `76.76.21.21`
   - `CNAME` for `www` -> `cname.vercel-dns.com`
6. Deploy and wait for SSL issuance.

Recommended post-deploy checks:

1. Submit a booking and verify DB row + emails + WhatsApp button.
2. Submit contact form and verify DB row + admin email.
3. Test geolocation and manual city fallback on `/dealerships-near-me`.
4. Confirm pricing CTAs route to `/book`.

## Notes

- The logo asset currently lives at `/public/createprivate-logo.svg`.
- If you want to replace it with your exact original logo file, keep the same filename or update `src/components/site-header.tsx`.
