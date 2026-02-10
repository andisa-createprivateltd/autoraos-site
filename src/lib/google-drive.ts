/**
 * Google Drive Upload Utility
 * 
 * Uploads Excel files to Google Drive for backup storage
 * Requires Google Service Account credentials
 */

import { google } from 'googleapis';
import { Readable } from 'stream';

// Environment configuration
const GOOGLE_DRIVE_CONFIG = {
  // Service account credentials (JSON key file content as string)
  credentials: process.env.GOOGLE_DRIVE_CREDENTIALS,
  // Parent folder ID in Google Drive where files will be uploaded
  folderId: process.env.GOOGLE_DRIVE_FOLDER_ID || 'root',
  // Whether Google Drive is enabled
  enabled: Boolean(process.env.GOOGLE_DRIVE_CREDENTIALS)
};

/**
 * Check if Google Drive is configured and enabled
 */
export function isGoogleDriveEnabled(): boolean {
  return GOOGLE_DRIVE_CONFIG.enabled && Boolean(GOOGLE_DRIVE_CONFIG.credentials);
}

/**
 * Create Google Drive client with service account authentication
 */
function createDriveClient() {
  if (!GOOGLE_DRIVE_CONFIG.credentials) {
    throw new Error('Google Drive credentials not configured');
  }

  let credentials;
  try {
    credentials = JSON.parse(GOOGLE_DRIVE_CONFIG.credentials);
  } catch {
    throw new Error('Invalid Google Drive credentials format');
  }

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/drive.file']
  });

  return google.drive({ version: 'v3', auth });
}

/**
 * Upload a file buffer to Google Drive
 */
export async function uploadToGoogleDrive(
  fileName: string,
  fileBuffer: Buffer,
  mimeType: string = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
): Promise<{ fileId: string; fileUrl: string }> {
  if (!isGoogleDriveEnabled()) {
    throw new Error('Google Drive is not configured');
  }

  try {
    const drive = createDriveClient();

    // Convert buffer to stream
    const fileStream = Readable.from(fileBuffer);

    // Create file metadata
    const fileMetadata = {
      name: fileName,
      parents: [GOOGLE_DRIVE_CONFIG.folderId]
    };

    // Upload file
    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: {
        mimeType: mimeType,
        body: fileStream
      },
      fields: 'id, webViewLink'
    });

    const fileId = response.data.id!;
    const fileUrl = response.data.webViewLink || `https://drive.google.com/file/d/${fileId}/view`;

    console.log(`✓ Uploaded to Google Drive: ${fileName} (ID: ${fileId})`);

    return { fileId, fileUrl };
  } catch (error) {
    console.error('✗ Google Drive upload failed:', error);
    throw new Error(
      `Google Drive upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Upload Excel booking file to Google Drive
 * Wrapper function specifically for booking Excel files
 */
export async function uploadBookingExcelToDrive(
  fileName: string,
  excelBuffer: Buffer
): Promise<{ fileId: string; fileUrl: string }> {
  return uploadToGoogleDrive(
    fileName,
    excelBuffer,
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  );
}

/**
 * Create or find a folder in Google Drive
 * Used to organize bookings by date or category
 */
export async function findOrCreateFolder(
  folderName: string,
  parentFolderId?: string
): Promise<string> {
  if (!isGoogleDriveEnabled()) {
    throw new Error('Google Drive is not configured');
  }

  try {
    const drive = createDriveClient();
    const parent = parentFolderId || GOOGLE_DRIVE_CONFIG.folderId;

    // Search for existing folder
    const searchResponse = await drive.files.list({
      q: `name='${folderName}' and '${parent}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
      fields: 'files(id, name)',
      spaces: 'drive'
    });

    // Return existing folder if found
    if (searchResponse.data.files && searchResponse.data.files.length > 0) {
      return searchResponse.data.files[0].id!;
    }

    // Create new folder
    const createResponse = await drive.files.create({
      requestBody: {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
        parents: [parent]
      },
      fields: 'id'
    });

    console.log(`✓ Created Google Drive folder: ${folderName}`);
    return createResponse.data.id!;
  } catch (error) {
    console.error('✗ Google Drive folder creation failed:', error);
    throw new Error(
      `Folder creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Get organized folder path for booking (by date)
 * Creates folder structure: Bookings/YYYY/MM/
 */
export async function getBookingFolderPath(date: Date = new Date()): Promise<string> {
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');

  try {
    // Find or create "Bookings" folder
    const bookingsFolder = await findOrCreateFolder('Bookings');
    
    // Find or create year folder
    const yearFolder = await findOrCreateFolder(year, bookingsFolder);
    
    // Find or create month folder
    const monthFolder = await findOrCreateFolder(month, yearFolder);
    
    return monthFolder;
  } catch (error) {
    console.error('✗ Error creating folder structure:', error);
    // Fallback to root folder
    return GOOGLE_DRIVE_CONFIG.folderId;
  }
}
