import Foundation

struct BusinessHoursDay: Codable, Hashable {
    var open: String
    var close: String
}

struct DealerSettings: Hashable {
    var businessHours: [String: BusinessHoursDay]
    var faqs: [String]
    var marketingCanViewMessages: Bool
    var allowAdminFullPhone: Bool
}

struct TeamMember: Codable, Identifiable, Hashable {
    let id: UUID
    let dealerID: UUID
    var name: String
    let email: String
    var role: DealerRole
    var isActive: Bool
    let createdAt: Date
}

struct InviteUserRequest: Encodable {
    let email: String
    let name: String
    let role: DealerRole
}
