# UI/UX APP DEV

## Project
CreatePrivate Dealer OS (BETA) iOS app + backend integration.

## Implemented
- SwiftUI iOS app scaffold with MVVM, DI, async/await
- Supabase Auth login/reset + profile role/dealer fetch
- Dashboard, Conversations, Leads, Bookings, Settings, Analytics
- Role-based access and phone masking controls
- Offline SQLite cache (50 conversations + 50 messages/conversation)
- APNs registration + deep-link handling
- Mock mode for demo

## iOS Project Path
- /Users/vuyomabilisa/Documents/New project/ios/CreatePrivateDealerOS/CreatePrivateDealerOS.xcodeproj

## Backend Routes Added
- /Users/vuyomabilisa/Documents/New project/src/app/api/send-message/route.ts
- /Users/vuyomabilisa/Documents/New project/src/app/api/handoff/route.ts
- /Users/vuyomabilisa/Documents/New project/src/app/api/invite-user/route.ts
- /Users/vuyomabilisa/Documents/New project/src/app/api/device-token/route.ts

## Security / RLS
- /Users/vuyomabilisa/Documents/New project/supabase/mobile_rls.sql

## Docs
- /Users/vuyomabilisa/Documents/New project/ios/CreatePrivateDealerOS/README.md
- /Users/vuyomabilisa/Documents/New project/ios/CreatePrivateDealerOS/docs/demo-walkthrough.md
- /Users/vuyomabilisa/Documents/New project/docs/mobile-backend-contract.md
