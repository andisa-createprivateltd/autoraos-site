# Booking System Troubleshooting Guide

## Overview

This guide helps diagnose and fix booking system issues after the error handling improvements.

## Quick Diagnosis

### 1. Check if Booking System is Working

Test the booking API:

```bash
curl -X POST https://autoraos.com/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "dealershipName": "Test Dealership",
    "brand": "Chery",
    "contactPerson": "Test User",
    "phone": "+27123456789",
    "email": "test@example.com",
    "province": "Gauteng",
    "city": "Johannesburg",
    "preferredDateTime": "2026-12-25T10:00:00.000Z",
    "source": "website",
    "notes": "",
    "honeypot": ""
  }'
```

### 2. Interpret Error Responses

#### Error: "Booking system is not configured"
```json
{
  "message": "Booking system is not configured. Please contact support."
}
```
**Status Code:** 503

**Cause:** Missing Supabase configuration

**Fix:**
```bash
# Set in production environment
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

#### Error: "Database error: Could not check slot availability"
**Cause:** Database connection issue or missing `bookings` table

**Fix:**
1. Verify Supabase credentials are correct
2. Check if `bookings` table exists in Supabase
3. Run database migrations: `supabase/schema.sql`

#### Error: "Database error: Could not create booking"
**Cause:** Database insertion failed

**Fix:**
1. Check database schema matches expected structure
2. Verify `dealers`, `leads`, `conversations`, `messages` tables exist
3. Check database logs in Supabase dashboard

#### Error: "That slot has already been booked"
**Status Code:** 409

**Cause:** Another booking exists for the same time

**Fix:** User should choose a different time slot

#### Error: "Choose a future slot at least 10 minutes from now"
**Cause:** Selected time is in the past or too soon

**Fix:** User should select a future time slot

#### Error: "Selected time is outside configured booking availability"
**Cause:** Time slot is outside business hours

**Fix:** 
1. Check `availability_windows` table
2. Update availability settings
3. Or user should select a different time

## Server-Side Logs

### What to Look For

#### Success Pattern:
```
Email not configured. Skipping email notifications. Set SENDGRID_API_KEY and ADMIN_EMAIL to enable.
```
or
```
Booking emails sent successfully for booking [uuid]
```

#### Email Failure (Non-Critical):
```
Email notification failed (booking still created): [error details]
```
**Action:** Booking succeeded, but emails weren't sent. Check email configuration.

#### Database Failure (Critical):
```
Error checking existing bookings: [error details]
```
or
```
Error creating booking: [error details]
```
or
```
Booking submission failed: [error details]
Error details: [specific message]
```
**Action:** Booking failed. Check database configuration and logs.

## Configuration Checklist

### Required Configuration

- [ ] `SUPABASE_URL` - Your Supabase project URL
- [ ] `SUPABASE_SERVICE_ROLE_KEY` - Service role key (not anon key!)
- [ ] Database tables exist (run `supabase/schema.sql`)
- [ ] `availability_windows` table populated with business hours

### Optional Configuration (for emails)

- [ ] `SENDGRID_API_KEY` - SendGrid API key
- [ ] `ADMIN_EMAIL` - Set to `andisa@createprivateltd.com`
- [ ] SendGrid sender verification completed

## Common Issues and Solutions

### Issue 1: Bookings fail silently

**Symptoms:** No error message, no booking created

**Diagnosis:**
```bash
# Check server logs
tail -f /var/log/application.log | grep "Booking"
```

**Common Causes:**
1. Rate limiting triggered (too many requests)
2. Invalid JSON in request
3. Validation errors (missing required fields)

### Issue 2: Bookings created but no emails

**Symptoms:** Booking appears in database, but no email received

**Diagnosis:**
```bash
# Check for warning in logs
grep "Email not configured" /var/log/application.log
```

**Solution:**
```bash
# Set email configuration
SENDGRID_API_KEY=your_key
ADMIN_EMAIL=andisa@createprivateltd.com
```

### Issue 3: Customer gets error but booking exists

**Symptoms:** User sees error, but booking is in database

**Cause:** Email sending failed after booking was created

**Solution:** This is the expected behavior now! The booking succeeded even though email failed. Check email configuration to fix email delivery.

### Issue 4: No available time slots

**Symptoms:** Booking form shows no available slots or "Loading available slots..."

**Diagnosis:**
1. Check `/api/bookings/slots` endpoint
2. Verify `availability_windows` table has active records

**Solution:**
```sql
-- Check availability windows
SELECT * FROM availability_windows WHERE active = true;

-- Add default availability if missing
INSERT INTO availability_windows (weekday, start_time, end_time, active)
VALUES 
  (1, '08:00', '17:00', true),  -- Monday
  (2, '08:00', '17:00', true),  -- Tuesday
  (3, '08:00', '17:00', true),  -- Wednesday
  (4, '08:00', '17:00', true),  -- Thursday
  (5, '08:00', '17:00', true);  -- Friday
```

## Testing Email Delivery

### Test SendGrid Configuration

```bash
# Check if SendGrid API key is valid
curl -X GET https://api.sendgrid.com/v3/user/profile \
  -H "Authorization: Bearer YOUR_SENDGRID_API_KEY"
```

### Test Email Sending

```bash
# Trigger a test booking to check email
curl -X POST https://autoraos.com/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "dealershipName": "Test Dealership",
    "brand": "Chery",
    "contactPerson": "Test User",
    "phone": "+27123456789",
    "email": "your-test-email@example.com",
    "province": "Gauteng",
    "city": "Johannesburg",
    "preferredDateTime": "2026-12-25T10:00:00.000Z",
    "source": "website"
  }'
```

Check:
1. Does `your-test-email@example.com` receive confirmation?
2. Does `andisa@createprivateltd.com` receive admin notification?

## Database Schema Verification

### Required Tables

```sql
-- Check if all required tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'dealers',
  'leads',
  'conversations',
  'messages',
  'bookings',
  'availability_windows',
  'subscriptions'
);
```

Expected result: All 7 tables should be present.

### Check Recent Bookings

```sql
-- View recent bookings
SELECT 
  b.id,
  b.scheduled_for,
  b.status,
  d.name as dealership_name,
  l.name as contact_name,
  l.phone
FROM bookings b
JOIN dealers d ON b.dealer_id = d.id
JOIN leads l ON b.lead_id = l.id
ORDER BY b.created_at DESC
LIMIT 10;
```

## Environment Variables Template

```bash
# Required for booking system
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Optional for email notifications
SENDGRID_API_KEY=SG.your_sendgrid_api_key
ADMIN_EMAIL=andisa@createprivateltd.com

# Optional
BOOKING_UID_DOMAIN=autoraos.com
```

## Monitoring and Alerts

### Key Metrics to Monitor

1. **Booking Success Rate**
   - Count of successful bookings vs. failed attempts
   - Alert if success rate drops below 95%

2. **Email Delivery Rate**
   - Check SendGrid dashboard for delivery status
   - Alert if delivery fails consistently

3. **Database Response Time**
   - Monitor Supabase dashboard for slow queries
   - Alert if response time exceeds 2 seconds

4. **Error Patterns**
   - Set up log monitoring for "Booking submission failed"
   - Alert on repeated database errors

## Support Escalation

If booking issues persist after following this guide:

1. **Collect Information:**
   - Recent server logs (last 100 lines with "Booking" keyword)
   - Environment variables list (names only, not values)
   - Database schema version
   - Example failing request

2. **Check:**
   - Supabase dashboard for database errors
   - SendGrid dashboard for email issues
   - Browser console for client-side errors

3. **Contact:**
   - Technical support with collected information
   - Include booking ID if available
   - Include timestamp of failure

## Success Indicators

Your booking system is working correctly when:

✅ Booking submissions return 200 status with success message  
✅ Bookings appear in Supabase `bookings` table  
✅ Customer receives confirmation email (if email configured)  
✅ Admin receives notification at andisa@createprivateltd.com (if email configured)  
✅ Server logs show "Booking emails sent successfully" or "Email not configured" warning  
✅ No "Booking submission failed" errors in logs  

---

**Last Updated:** 2026-02-10  
**Version:** 2.0 (after error handling improvements)
