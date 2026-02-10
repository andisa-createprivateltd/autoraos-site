import Foundation

struct UserProfile: Codable, Identifiable, Hashable {
    let id: UUID
    let dealerID: UUID
    let name: String
    let email: String
    let role: DealerRole
    let isActive: Bool
    let lastLoginAt: Date?
}
