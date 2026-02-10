# Google Drive Backup Setup Guide

## Overview

The AUTORA booking system now automatically saves booking data to Excel spreadsheets and uploads them to Google Drive as a backup mechanism.

## What Gets Backed Up

For each booking, the system:
1. ✅ Sends email notification (primary, required)
2. ✅ Saves to database (optional, if configured)
3. ✅ **NEW**: Creates Excel spreadsheet with booking details
4. ✅ **NEW**: Uploads Excel file to Google Drive

## Excel File Format

Each booking creates an Excel file containing:
- Booking ID and timestamp
- Dealership information (name, brand, city, province)
- Contact information (person, phone, email)
- Appointment details (preferred date/time, source)
- Notes

**Filename format:** `booking-{id}-{date}-{time}.xlsx`  
**Example:** `booking-1707574800000-k2n9p4x-2026-02-10-10-30-00.xlsx`

## Google Drive Setup

### Prerequisites

1. A Google account
2. Access to Google Cloud Console
3. ~10 minutes to complete setup

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **Create Project**
3. Enter project name: "AUTORA Booking Backup"
4. Click **Create**

### Step 2: Enable Google Drive API

1. In your project, go to **APIs & Services** → **Library**
2. Search for "Google Drive API"
3. Click on it and click **Enable**

### Step 3: Create Service Account

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **Service Account**
3. Enter service account details:
   - Name: "AUTORA Booking Uploader"
   - Description: "Service account for uploading booking Excel files"
4. Click **Create and Continue**
5. Skip role assignment (click **Continue**)
6. Click **Done**

### Step 4: Generate Service Account Key

1. Click on the service account you just created
2. Go to **Keys** tab
3. Click **Add Key** → **Create new key**
4. Select **JSON** format
5. Click **Create**
6. **Save the downloaded JSON file securely** (this is your credential)

### Step 5: Share Google Drive Folder

1. Create a folder in your Google Drive called "AUTORA Bookings"
2. Right-click the folder → **Share**
3. Add the service account email (from the JSON file: `client_email`)
   - Example: `autora-booking-uploader@project-id.iam.gserviceaccount.com`
4. Grant **Editor** permission
5. Click **Share**
6. Copy the **folder ID** from the URL:
   - URL: `https://drive.google.com/drive/folders/ABC123XYZ`
   - Folder ID: `ABC123XYZ`

### Step 6: Configure Environment Variables

1. Open the JSON key file
2. **Convert it to a single-line string** (remove newlines)
3. Add to your `.env` file:

```bash
# Google Drive Backup Configuration
GOOGLE_DRIVE_CREDENTIALS='{"type":"service_account","project_id":"your-project","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"autora@project.iam.gserviceaccount.com","client_id":"...","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"..."}'

# Optional: Specify a specific folder (otherwise uses "root")
GOOGLE_DRIVE_FOLDER_ID=ABC123XYZ
```

**IMPORTANT**: 
- Keep the entire JSON in single quotes
- Preserve the `\n` characters in the private key
- Never commit this file to version control

### Step 7: Test the Configuration

Restart your application and submit a test booking. Check:
1. ✅ Email sent
2. ✅ Database record created (if configured)
3. ✅ Excel file created (check logs)
4. ✅ File uploaded to Google Drive (check the folder)

## Folder Structure

The system automatically organizes files by date:

```
AUTORA Bookings/
├── 2026/
│   ├── 01/
│   │   ├── booking-123-2026-01-15-10-30-00.xlsx
│   │   └── booking-456-2026-01-16-14-00-00.xlsx
│   ├── 02/
│   │   ├── booking-789-2026-02-10-09-00-00.xlsx
│   │   └── booking-012-2026-02-10-15-30-00.xlsx
```

This makes it easy to:
- Find bookings by date
- Archive old bookings
- Generate monthly reports

## Configuration Options

### Minimum Configuration (Disabled)

If you don't set `GOOGLE_DRIVE_CREDENTIALS`, the system:
- ✅ Still creates Excel files
- ℹ️ Logs that Drive is not configured
- ✅ Booking proceeds successfully

### Full Configuration (Enabled)

With credentials set, the system:
- ✅ Creates Excel files
- ✅ Uploads to Google Drive
- ✅ Provides Drive file URL in response

## Security Best Practices

### 1. Protect Your Credentials

```bash
# NEVER commit credentials to Git
echo ".env" >> .gitignore
echo "*.json" >> .gitignore
```

### 2. Use Environment Variables

In production (Vercel, AWS, etc.):
1. Add credentials as environment variable
2. Do NOT include in codebase
3. Rotate keys periodically

### 3. Limit Service Account Permissions

- Only grant access to the specific folder
- Use "Editor" not "Owner" permission
- Create separate account for each application

### 4. Monitor Usage

- Check Google Cloud Console for API usage
- Set up billing alerts
- Review Drive folder regularly

## Troubleshooting

### Issue: "Google Drive credentials not configured"

**Solution:**
- Verify `GOOGLE_DRIVE_CREDENTIALS` is set
- Check that the JSON is valid (use a JSON validator)
- Ensure the entire JSON is in single quotes

### Issue: "Invalid Google Drive credentials format"

**Solution:**
- The JSON might have syntax errors
- Re-download the key file from Google Cloud
- Make sure you're using the service account key, not OAuth credentials

### Issue: "Permission denied" or "File not found"

**Solution:**
- Verify the service account email is shared with the folder
- Check the folder ID is correct
- Ensure "Editor" permission is granted

### Issue: "Quota exceeded"

**Solution:**
- Check Google Cloud Console for API quotas
- You may need to request quota increase
- Default quota: 1,000 requests per 100 seconds (sufficient for most use cases)

### Issue: "Files not appearing in Drive"

**Solution:**
- Check the logs for upload errors
- Verify the folder ID is correct
- Try listing files with the service account email
- Check that the folder isn't in the trash

## API Response Metadata

When a booking is successful, the response includes:

```json
{
  "success": true,
  "bookingId": "booking-123...",
  "metadata": {
    "emailSent": true,
    "savedToDatabase": true,
    "excelCreated": true,
    "uploadedToDrive": true,
    "driveFileUrl": "https://drive.google.com/file/d/ABC123/view"
  }
}
```

You can use `driveFileUrl` to:
- Provide direct link to admin
- Include in email notifications
- Build a dashboard of backed-up bookings

## Cost Considerations

### Google Drive API

- **Free tier**: 1 billion requests per day
- **Cost**: Negligible for booking system use
- **Storage**: 15 GB free per Google account

### Estimated Usage

- ~1 booking = 1-3 API requests
- ~100 bookings/day = 300 requests/day
- Well within free tier limits

### Storage

- Each Excel file: ~10-20 KB
- 1,000 bookings = ~15 MB
- Can store millions of bookings in free tier

## Maintenance

### Regular Tasks

**Weekly:**
- Check Drive folder for new bookings
- Verify uploads are working

**Monthly:**
- Review folder organization
- Archive old files if needed

**Quarterly:**
- Rotate service account keys
- Review API usage in Cloud Console

### Backup Strategy

The Excel + Drive combination provides:
- ✅ **Redundancy**: Email, Database, Drive
- ✅ **Portability**: Excel files are universal
- ✅ **Accessibility**: Access from anywhere
- ✅ **Compliance**: Audit trail for bookings

## Support

If you encounter issues:

1. Check the application logs for specific error messages
2. Verify all setup steps were completed
3. Test with a single booking first
4. Refer to [Google Drive API Documentation](https://developers.google.com/drive/api/v3/about-sdk)

## Advanced: Programmatic Access

You can also access the backed-up files programmatically:

```typescript
import { google } from 'googleapis';

// List all booking files
const drive = google.drive({ version: 'v3', auth });
const response = await drive.files.list({
  q: "name contains 'booking-' and mimeType='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'",
  fields: 'files(id, name, createdTime, webViewLink)',
  orderBy: 'createdTime desc'
});
```

This enables:
- Building a backup file browser
- Generating reports from Excel files
- Automated archival processes
- Integration with other systems

---

**Status**: Google Drive backup is now an optional enhancement to the booking system. It works alongside email and database storage to provide comprehensive backup coverage.
