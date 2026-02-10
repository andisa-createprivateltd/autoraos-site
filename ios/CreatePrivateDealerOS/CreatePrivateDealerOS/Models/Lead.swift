import Foundation

enum LeadStatus: String, Codable, CaseIterable, Identifiable {
    case new
    case contacted
    case booked
    case visited
    case sold
    case lost

    var id: String { rawValue }

    var label: String {
        rawValue.capitalized
    }
}

enum LeadSource: String, Codable, CaseIterable, Identifiable {
    case whatsapp
    case website
    case ads
    case oem

    var id: String { rawValue }
}

struct Lead: Codable, Identifiable, Hashable {
    let id: UUID
    let dealerID: UUID
    let source: LeadSource
    let firstContactAt: Date
    let name: String?
    let phone: String
    let vehicleInterest: String?
    let budgetRange: String?
    var status: LeadStatus
    var assignedUserID: UUID?
    let lastActivityAt: Date
    let createdAt: Date

    var displayName: String {
        if let name, !name.isEmpty {
            return name
        }
        return "Unknown Lead"
    }
}
