import Foundation

struct AuthSessionPayload: Codable, Hashable {
    let accessToken: String
    let refreshToken: String
    let expiresAt: Date
    let userID: UUID
}
