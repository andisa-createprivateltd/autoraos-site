/**
 * Excel Export Utility
 * 
 * Exports booking data to Excel spreadsheet format (.xlsx)
 * Used as a backup mechanism alongside email and database storage
 */

import * as XLSX from 'xlsx';
import type { BookingData } from './booking-handler';

/**
 * Export a single booking to Excel format
 * Returns the file buffer that can be saved or uploaded
 */
export function exportBookingToExcel(
  bookingId: string,
  bookingData: BookingData,
  timestamp: Date = new Date()
): Buffer {
  // Create workbook
  const workbook = XLSX.utils.book_new();
  
  // Prepare booking data in rows format
  const data = [
    ['AUTORA Booking Details'],
    [''],
    ['Booking ID', bookingId],
    ['Timestamp', timestamp.toISOString()],
    [''],
    ['Dealership Information'],
    ['Dealership Name', bookingData.dealershipName],
    ['Brand', bookingData.brand],
    ['City', bookingData.city],
    ['Province', bookingData.province],
    [''],
    ['Contact Information'],
    ['Contact Person', bookingData.contactPerson],
    ['Phone', bookingData.phone],
    ['Email', bookingData.email],
    [''],
    ['Appointment Details'],
    ['Preferred Date/Time', bookingData.preferredDateTime],
    ['Source', bookingData.source || 'website'],
    [''],
    ['Notes'],
    [bookingData.notes || 'No additional notes']
  ];

  // Create worksheet from data
  const worksheet = XLSX.utils.aoa_to_sheet(data);
  
  // Set column widths for better readability
  worksheet['!cols'] = [
    { wch: 25 }, // Column A (labels)
    { wch: 50 }  // Column B (values)
  ];

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Booking Details');
  
  // Generate Excel file buffer
  const excelBuffer = XLSX.write(workbook, {
    type: 'buffer',
    bookType: 'xlsx'
  });
  
  return excelBuffer;
}

/**
 * Export multiple bookings to a master Excel file
 * Used for batch exports or reports
 */
export function exportBookingsToMasterExcel(
  bookings: Array<{ bookingId: string; data: BookingData; timestamp: Date }>
): Buffer {
  // Create workbook
  const workbook = XLSX.utils.book_new();
  
  // Prepare header row
  const headers = [
    'Booking ID',
    'Timestamp',
    'Dealership Name',
    'Brand',
    'Contact Person',
    'Phone',
    'Email',
    'City',
    'Province',
    'Preferred Date/Time',
    'Source',
    'Notes'
  ];
  
  // Prepare data rows
  const rows = bookings.map(booking => [
    booking.bookingId,
    booking.timestamp.toISOString(),
    booking.data.dealershipName,
    booking.data.brand,
    booking.data.contactPerson,
    booking.data.phone,
    booking.data.email,
    booking.data.city,
    booking.data.province,
    booking.data.preferredDateTime,
    booking.data.source || 'website',
    booking.data.notes || ''
  ]);
  
  // Combine headers and rows
  const data = [headers, ...rows];
  
  // Create worksheet
  const worksheet = XLSX.utils.aoa_to_sheet(data);
  
  // Set column widths
  worksheet['!cols'] = [
    { wch: 30 }, // Booking ID
    { wch: 20 }, // Timestamp
    { wch: 25 }, // Dealership Name
    { wch: 15 }, // Brand
    { wch: 20 }, // Contact Person
    { wch: 15 }, // Phone
    { wch: 25 }, // Email
    { wch: 15 }, // City
    { wch: 15 }, // Province
    { wch: 20 }, // Preferred Date/Time
    { wch: 15 }, // Source
    { wch: 30 }  // Notes
  ];
  
  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'All Bookings');
  
  // Generate Excel file buffer
  const excelBuffer = XLSX.write(workbook, {
    type: 'buffer',
    bookType: 'xlsx'
  });
  
  return excelBuffer;
}

/**
 * Generate filename for booking Excel file
 */
export function generateExcelFilename(bookingId: string, timestamp: Date = new Date()): string {
  const dateStr = timestamp.toISOString().split('T')[0]; // YYYY-MM-DD
  const timeStr = timestamp.toISOString().split('T')[1].split('.')[0].replace(/:/g, '-'); // HH-MM-SS
  return `booking-${bookingId}-${dateStr}-${timeStr}.xlsx`;
}
