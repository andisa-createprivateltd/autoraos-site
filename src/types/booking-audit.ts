/**
 * Booking Audit Database Types
 * TypeScript types for booking audit functionality in AUTORA OS
 */

// ============================================================================
// Enums
// ============================================================================

export enum BookingStatus {
  BOOKED = 'booked',
  COMPLETED = 'completed',
  NO_SHOW = 'no_show',
  CANCELLED = 'cancelled',
}

export enum BookingType {
  TEST_DRIVE = 'test_drive',
  APPOINTMENT = 'appointment',
  CALLBACK = 'callback',
}

export enum BookingSource {
  WHATSAPP = 'whatsapp',
  WEBSITE = 'website',
  CALL = 'call',
  WALK_IN = 'walk_in',
  REFERRAL = 'referral',
  EMAIL = 'email',
  OTHER = 'other',
}

export enum LeadQuality {
  HOT = 'hot',
  WARM = 'warm',
  COLD = 'cold',
}

export enum AuditAction {
  CREATED = 'created',
  UPDATED = 'updated',
  STATUS_CHANGED = 'status_changed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
  COMMENTED = 'commented',
}

export enum PeriodType {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
}

// ============================================================================
// Main Types
// ============================================================================

export interface BookingAudit {
  id: string;
  dealerId: string;
  userId?: string;
  
  // Contact Information
  dealershipName: string;
  brand: string;
  contactPerson: string;
  contactPhone: string;
  contactEmail?: string;
  city: string;
  
  // Booking Details
  preferredDateTime: Date;
  bookingType: BookingType;
  vehicleInterest?: string;
  source: BookingSource;
  assignedTo?: string;
  
  // Status & Notes
  status: BookingStatus;
  notes?: string;
  
  // Timestamps
  createdAt: Date;
  completedAt?: Date;
  cancelledAt?: Date;
  cancellationReason?: string;
  updatedAt: Date;
  createdBy?: string;
  
  // Follow-up
  followupRequired: boolean;
  followupDate?: Date;
}

export interface BookingAuditLog {
  id: string;
  bookingId: string;
  
  // Change Details
  action: AuditAction;
  fieldChanged?: string;
  oldValue?: string;
  newValue?: string;
  
  // User Information
  changedBy: string;
  changedByName: string;
  changedAt: Date;
  
  // Metadata
  ipAddress?: string;
  userAgent?: string;
  notes?: string;
}

export interface BookingConversions {
  id: string;
  dealerId: string;
  
  periodDate: Date;
  periodType: PeriodType;
  
  // Aggregated Counts
  bookingsCreated: number;
  bookingsCompleted: number;
  bookingsNoShow: number;
  bookingsCancelled: number;
  
  // Calculated Rates
  completionRate: number;
  noShowRate: number;
  
  // Timing
  avgDaysToCompletion?: number;
  
  // Metadata
  calculatedAt: Date;
  updatedAt: Date;
}

export interface BookingQualityAudit {
  id: string;
  bookingId: string;
  
  // Quality Metrics
  bookingQualityScore?: number;
  leadQuality?: LeadQuality;
  responseTimeMinutes?: number;
  rescheduledCount: number;
  
  // Feedback
  dealerFeedback?: string;
  auditorNotes?: string;
  
  // Audit Info
  auditedBy?: string;
  auditedAt: Date;
  
  createdAt: Date;
}

// ============================================================================
// Request/Response Types
// ============================================================================

export interface CreateBookingAuditRequest {
  dealerId: string;
  dealershipName: string;
  brand: string;
  contactPerson: string;
  contactPhone: string;
  contactEmail?: string;
  city: string;
  preferredDateTime: Date;
  bookingType: BookingType;
  vehicleInterest?: string;
  source: BookingSource;
  assignedTo?: string;
  notes?: string;
  followupRequired?: boolean;
  followupDate?: Date;
}

export interface UpdateBookingAuditRequest {
  status?: BookingStatus;
  assignedTo?: string;
  notes?: string;
  vehicleInterest?: string;
  followupRequired?: boolean;
  followupDate?: Date;
  completedAt?: Date;
  cancelledAt?: Date;
  cancellationReason?: string;
}

export interface BookingAuditFilters {
  dealerId?: string;
  status?: BookingStatus;
  source?: BookingSource;
  brand?: string;
  city?: string;
  assignedTo?: string;
  dateFrom?: Date;
  dateTo?: Date;
  searchQuery?: string; // Search in contactPerson, contactPhone, dealershipName
}

export interface BookingAuditPaginatedResponse {
  bookings: BookingAudit[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface BookingAuditSummary {
  totalBookings: number;
  completedBookings: number;
  noShowBookings: number;
  cancelledBookings: number;
  completionRate: number;
  noShowRate: number;
  avgDaysToCompletion: number;
  byBrand: Record<string, number>;
  bySource: Record<BookingSource, number>;
  byCity: Record<string, number>;
}

// ============================================================================
// Utility Types
// ============================================================================

export interface BookingMetrics {
  date: Date;
  booked: number;
  completed: number;
  noShow: number;
  cancelled: number;
  completionRate: number;
  noShowRate: number;
}

export interface DealerBookingStats {
  dealerId: string;
  dealershipName: string;
  totalBookings: number;
  completedBookings: number;
  noShowBookings: number;
  completionRate: number;
  noShowRate: number;
  avgDaysToCompletion: number;
  topSource: BookingSource;
  topBrand: string;
}

export interface BookingAuditExportRequest {
  dealerId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  status?: BookingStatus;
  format: 'csv' | 'json' | 'xlsx';
}

export interface BookingAuditBulkImportRequest {
  dealerId: string;
  bookings: CreateBookingAuditRequest[];
  sendNotifications?: boolean;
}

export interface BookingAuditBulkImportResponse {
  imported: number;
  failed: number;
  errors: Array<{
    row: number;
    error: string;
    booking?: CreateBookingAuditRequest;
  }>;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
}

export type BookingAuditApiResponse = ApiResponse<BookingAudit>;

export type BookingAuditListApiResponse = ApiResponse<BookingAuditPaginatedResponse>;

export type BookingConversionsApiResponse = ApiResponse<BookingConversions[]>;

export type BookingAuditSummaryApiResponse = ApiResponse<BookingAuditSummary>;

// ============================================================================
// Database Query Helpers
// ============================================================================

export interface QueryOptions {
  page?: number;
  pageSize?: number;
  sortBy?: keyof BookingAudit;
  sortOrder?: 'asc' | 'desc';
  filters?: BookingAuditFilters;
}

export interface AggregationOptions {
  groupBy?: 'brand' | 'source' | 'city' | 'status' | 'assignedTo';
  dateRange?: {
    from: Date;
    to: Date;
  };
  period?: PeriodType;
}
