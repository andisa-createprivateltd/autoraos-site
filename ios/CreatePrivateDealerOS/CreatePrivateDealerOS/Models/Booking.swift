import Foundation

enum BookingType: String, Codable, CaseIterable, Identifiable {
    case testDrive = "test_drive"
    case call
    case appointment

    var id: String { rawValue }

    var label: String {
        rawValue.replacingOccurrences(of: "_", with: " ").capitalized
    }
}

enum BookingStatus: String, Codable, CaseIterable, Identifiable {
    case booked
    case completed
    case noShow = "no_show"
    case cancelled

    var id: String { rawValue }

    var label: String {
        rawValue.replacingOccurrences(of: "_", with: " ").capitalized
    }
}

struct Booking: Codable, Identifiable, Hashable {
    let id: UUID
    let dealerID: UUID
    let leadID: UUID
    let type: BookingType
    let requestedAt: Date
    let scheduledFor: Date
    var status: BookingStatus
    let createdBy: String
    let createdAt: Date

    var lead: Lead?
}

struct NewBookingRequest: Encodable {
    let dealerID: UUID
    let leadID: UUID
    let type: BookingType
    let requestedAt: Date
    let scheduledFor: Date
    let status: BookingStatus
    let createdBy: String
}
