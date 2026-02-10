# Booking System - Email-Only Mode

## Overview

The AUTORA booking system now supports **two modes**:

1. **Full Database Mode** - Complete booking tracking with Supabase
2. **Email-Only Mode** - Fallback mode without database (NEW)

This ensures bookings always work, even during initial deployment before the database is configured.

## Email-Only Mode

### When It Activates

Email-only mode automatically activates when:
- `SUPABASE_URL` is not set, OR
- `SUPABASE_SERVICE_ROLE_KEY` is not set

### What It Does

1. **Accepts the booking** from the user
2. **Sends detailed email to admin** (andisa@createprivateltd.com) with:
   - All booking details
   - Customer contact information
   - Preferred date/time
   - Warning that manual follow-up is needed
   - WhatsApp link for quick follow-up
3. **Sends confirmation to customer** with:
   - Thank you message
   - Assurance that team will contact them
   - Professional but pending-confirmation tone
4. **Returns success to user** with:
   - Booking confirmation
   - WhatsApp link for self-service follow-up
   - Unique booking ID for reference

### Email Format

**To Admin:**
```
Subject: [EMAIL-ONLY MODE] NEW BOOKING: Chery Midrand

[ALERT] BOOKING RECEIVED (Database not available - Email-only mode)

Timestamp: 2026-02-10T14:30:00.000Z
Dealership: Chery Midrand
Brand: Chery
Contact: John Doe
Phone: +27 123 456 789
Email: john@example.com
Location: Midrand, Gauteng
Preferred time: Wednesday, 15 February 2026 at 10:00
Source: website
Notes: None

[ACTION REQUIRED] This booking was not saved to database.
Please follow up with the customer directly.

WhatsApp link: https://wa.me/...

To enable full booking functionality with database storage,
configure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.
```

**To Customer:**
```
Subject: Booking Request Received - AUTORA

Hi John Doe,

Thank you for your booking request for Chery Midrand.
We have received your request for Wednesday, 15 February 2026 at 10:00.

Our team will contact you shortly to confirm your appointment.
If you need immediate assistance, please contact us via WhatsApp.

AUTORA (CreatePrivateLtd)
```

### Required Configuration

**Minimum requirements for email-only mode:**
```bash
SENDGRID_API_KEY=your_sendgrid_api_key
ADMIN_EMAIL=andisa@createprivateltd.com
```

Without these, bookings will fail completely.

### Booking ID Format

Email-only bookings use a special ID format:
```
email-{timestamp}-{random}
```

Example: `email-1707574800000-k2n9p4x`

This format:
- Starts with `email-` to identify fallback bookings
- Includes timestamp for chronological sorting
- Includes random component to prevent collisions
- Is unique and traceable

### Limitations

Email-only mode **does not**:
- ❌ Store booking in database
- ❌ Create lead records
- ❌ Track in admin dashboard
- ❌ Create conversation threads
- ❌ Generate analytics
- ❌ Enable automated follow-ups

Email-only mode **does**:
- ✅ Accept user bookings
- ✅ Notify admin via email
- ✅ Confirm to customer
- ✅ Return success to user
- ✅ Provide WhatsApp links
- ✅ Include all booking details

### Manual Follow-Up Process

When you receive an email-only booking:

1. **Check your email** for `[EMAIL-ONLY MODE]` subject
2. **Note the booking details** (copy to spreadsheet/calendar)
3. **Contact the customer** via:
   - Phone call (number provided)
   - Email reply
   - WhatsApp (link provided)
4. **Confirm the appointment** manually
5. **Add to your calendar** if not using calendar system

### Upgrading to Full Mode

To enable full database mode:

1. **Set up Supabase:**
   - Create Supabase project at https://supabase.com
   - Get project URL and service role key
   
2. **Set environment variables:**
   ```bash
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

3. **Run database migrations:**
   ```bash
   # Apply schema
   psql -f supabase/schema.sql

   # Seed data (optional)
   psql -f supabase/seed.sql
   ```

4. **Restart application**

5. **Verify:** Next booking will use full database mode

### Monitoring

**How to tell which mode is active:**

Check server logs:
```
"Booking submitted but database not configured - using email-only mode"
→ Email-only mode

"Booking emails sent successfully for booking [uuid]"
→ Full database mode
```

### Troubleshooting

**Booking still fails in email-only mode:**

1. **Check email configuration:**
   ```bash
   # Both must be set
   echo $SENDGRID_API_KEY
   echo $ADMIN_EMAIL
   ```

2. **Verify SendGrid:**
   - API key is valid
   - Sender email verified
   - Account not suspended

3. **Check logs:**
   ```bash
   # Look for email errors
   tail -f logs/*.log | grep "Email-only booking failed"
   ```

**Want to disable email-only mode:**

Email-only mode cannot be disabled - it's a safety fallback.
If you want bookings to fail without database, you must:
1. Set up Supabase (recommended)
2. Or modify the code (not recommended)

### Best Practices

**For Production Deployment:**

1. ✅ **Start with email-only mode** - Deploy with just email config
2. ✅ **Test booking flow** - Ensure emails arrive
3. ✅ **Set up database** - When ready for full mode
4. ✅ **Keep email working** - Always have email backup

**For Development:**

1. ✅ **Use email-only mode** - Quick local testing
2. ✅ **Test with real email** - Ensure notifications work
3. ✅ **Add database later** - When needed

### Comparison

| Feature | Email-Only Mode | Full Database Mode |
|---------|----------------|-------------------|
| **Accepts bookings** | ✅ Yes | ✅ Yes |
| **Emails sent** | ✅ Yes | ✅ Yes |
| **Database storage** | ❌ No | ✅ Yes |
| **Admin dashboard** | ❌ No | ✅ Yes |
| **Lead tracking** | ❌ No | ✅ Yes |
| **Analytics** | ❌ No | ✅ Yes |
| **Auto follow-ups** | ❌ No | ✅ Yes |
| **Setup complexity** | 🟢 Low | 🟡 Medium |
| **Manual work** | 🔴 High | 🟢 Low |

### When to Use Each Mode

**Use Email-Only Mode:**
- Initial deployment/testing
- Quick MVP launch
- Email-based workflow preferred
- Database setup delayed
- Temporary solution during database migration

**Use Full Database Mode:**
- Production with high volume
- Need lead tracking
- Want analytics dashboard
- Multiple team members
- Automated workflows needed

---

**Recommendation:** Start with email-only mode for quick deployment, then upgrade to full database mode when ready.
