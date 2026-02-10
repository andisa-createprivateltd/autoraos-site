# Booking System Configuration

## Overview

The AUTORA booking system allows dealerships to schedule 15-minute audit sessions. All booking notifications are sent to the admin email address for processing.

## Email Configuration

**Critical**: All booking data must be sent to `andisa@createprivateltd.com`

### Required Environment Variables

```bash
ADMIN_EMAIL=andisa@createprivateltd.com
SENDGRID_API_KEY=your_sendgrid_api_key_here
```

### How It Works

1. **Customer submits booking** via `/book` page or dealership-specific booking form
2. **Validation & Storage**: 
   - Form data validated against `bookingSchema`
   - Booking stored in Supabase `bookings` table
   - Lead record created in `leads` table
3. **Email Notifications Sent**:
   - **Customer Email**: Confirmation with calendar invite (.ics attachment)
   - **Admin Email**: All booking details sent to `ADMIN_EMAIL`

### Admin Email Contents

The admin notification email includes:
- Booking ID
- Dealership name and brand
- Contact person name
- Phone number
- Email address
- Location (city and province)
- Preferred date/time
- WhatsApp follow-up link

## API Endpoints

### POST `/api/bookings`

Creates a new booking and sends notification emails.

**Request Body:**
```json
{
  "dealershipName": "Chery Midrand",
  "brand": "Chery",
  "contactPerson": "John Doe",
  "phone": "+27 123456789",
  "email": "john@example.com",
  "province": "Gauteng",
  "city": "Midrand",
  "preferredDateTime": "2024-03-15T10:00:00.000Z",
  "notes": "Optional notes",
  "source": "website"
}
```

**Success Response:**
```json
{
  "success": true,
  "bookingId": "uuid",
  "message": "Booking confirmed.",
  "booking": {
    "dealershipName": "Chery Midrand",
    "brand": "Chery",
    "contactPerson": "John Doe",
    "preferredDateTime": "2024-03-15T10:00:00.000Z"
  },
  "whatsappConfirmationUrl": "https://wa.me/..."
}
```

### GET `/api/bookings/slots`

Returns available booking slots for the next 7 days.

## Troubleshooting

### Booking emails not being received

1. Check `ADMIN_EMAIL` is set to `andisa@createprivateltd.com`
2. Verify `SENDGRID_API_KEY` is valid and configured
3. Check SendGrid dashboard for delivery status
4. Ensure SendGrid sender is verified

### Testing the booking flow

```bash
# Test booking API endpoint
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "dealershipName": "Test Dealership",
    "brand": "Chery",
    "contactPerson": "Test User",
    "phone": "+27123456789",
    "email": "test@example.com",
    "province": "Gauteng",
    "city": "Johannesburg",
    "preferredDateTime": "2024-12-25T10:00:00.000Z",
    "source": "website"
  }'
```

## Files

- `/src/lib/email.ts` - Email sending logic
- `/src/app/api/bookings/route.ts` - Booking API endpoint
- `/src/components/forms/booking-form.tsx` - Booking form component
- `/src/lib/validation.ts` - Form validation schemas

## Support

For booking system issues, contact technical support or check the server logs for detailed error messages.
