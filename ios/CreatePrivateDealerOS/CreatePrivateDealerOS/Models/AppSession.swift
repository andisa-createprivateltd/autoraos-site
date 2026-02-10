import Foundation

struct AppSession: Hashable {
    let accessToken: String
    let refreshToken: String
    let expiresAt: Date
    let userProfile: UserProfile
}
