import Foundation

protocol RemoteDataService {
    func fetchUserProfile(userID: UUID, token: String) async throws -> UserProfile
    func fetchDealerSettings(dealerID: UUID, token: String) async throws -> DealerSettings
    func updateDealerSettings(dealerID: UUID, settings: DealerSettings, token: String) async throws

    func fetchDashboardMetrics(user: UserProfile, missedLeadMinutes: Int, token: String) async throws -> DashboardMetrics
    func fetchConversations(dealerID: UUID, token: String) async throws -> [Conversation]
    func fetchMessages(conversationID: UUID, dealerID: UUID, token: String) async throws -> [Message]
    func sendMessage(payload: SendMessagePayload, token: String) async throws
    func handoff(payload: HandoffPayload, token: String) async throws

    func fetchLeads(dealerID: UUID, filter: LeadFilter, token: String) async throws -> [Lead]
    func updateLeadStatus(leadID: UUID, dealerID: UUID, status: LeadStatus, token: String) async throws
    func assignLead(leadID: UUID, dealerID: UUID, userID: UUID, token: String) async throws
    func fetchFollowups(leadID: UUID, dealerID: UUID, token: String) async throws -> [FollowupItem]

    func fetchBookings(dealerID: UUID, token: String) async throws -> [Booking]
    func createBooking(_ request: NewBookingRequest, token: String) async throws
    func updateBookingStatus(bookingID: UUID, dealerID: UUID, status: BookingStatus, token: String) async throws

    func fetchTeamMembers(dealerID: UUID, token: String) async throws -> [TeamMember]
    func inviteUser(_ request: InviteUserRequest, token: String) async throws
    func disableUser(userID: UUID, dealerID: UUID, token: String) async throws

    func fetchAnalytics(dealerID: UUID, token: String) async throws -> AnalyticsSnapshot
    func registerDeviceToken(_ deviceToken: String, token: String) async
}

struct LeadFilter: Hashable {
    var status: LeadStatus?
    var source: LeadSource?
    var assignedUserID: UUID?
}

struct FollowupItem: Codable, Identifiable, Hashable {
    let id: UUID
    let dealerID: UUID
    let leadID: UUID
    let type: String
    let sentVia: String
    let sentAt: Date?
    let responded: Bool
    let responseAt: Date?
    let createdAt: Date
}
