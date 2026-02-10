import Foundation

protocol DealerOSRepository {
    func restoreSession() async -> AppSession?
    func signIn(email: String, password: String) async throws -> AppSession
    func signOut() async
    func resetPassword(email: String) async throws

    func fetchDealerSettings(session: AppSession) async throws -> DealerSettings
    func updateDealerSettings(_ settings: DealerSettings, session: AppSession) async throws

    func fetchDashboard(session: AppSession) async throws -> DashboardMetrics

    func fetchConversations(session: AppSession) async throws -> [Conversation]
    func fetchMessages(conversationID: UUID, session: AppSession) async throws -> [Message]
    func sendMessage(conversationID: UUID, leadID: UUID, content: String, session: AppSession) async throws
    func handoff(conversationID: UUID, leadID: UUID, reason: String, session: AppSession) async throws

    func fetchLeads(filter: LeadFilter, session: AppSession) async throws -> [Lead]
    func updateLeadStatus(leadID: UUID, status: LeadStatus, session: AppSession) async throws
    func assignLead(leadID: UUID, userID: UUID, session: AppSession) async throws
    func fetchFollowups(leadID: UUID, session: AppSession) async throws -> [FollowupItem]

    func fetchBookings(session: AppSession) async throws -> [Booking]
    func createBooking(_ request: NewBookingRequest, session: AppSession) async throws
    func updateBookingStatus(bookingID: UUID, status: BookingStatus, session: AppSession) async throws

    func fetchTeamMembers(session: AppSession) async throws -> [TeamMember]
    func inviteUser(_ request: InviteUserRequest, session: AppSession) async throws
    func disableUser(_ userID: UUID, session: AppSession) async throws

    func fetchAnalytics(session: AppSession) async throws -> AnalyticsSnapshot
    func registerDeviceToken(_ token: String, session: AppSession) async
}

final class LiveDealerOSRepository: DealerOSRepository {
    private let authService: AuthService
    private let remoteDataService: RemoteDataService
    private let cacheStore: OfflineCacheStore
    private let config: AppConfig

    init(
        authService: AuthService,
        remoteDataService: RemoteDataService,
        cacheStore: OfflineCacheStore,
        config: AppConfig
    ) {
        self.authService = authService
        self.remoteDataService = remoteDataService
        self.cacheStore = cacheStore
        self.config = config
    }

    func restoreSession() async -> AppSession? {
        guard let authPayload = await authService.restoreSession() else {
            return nil
        }

        do {
            let profile = try await remoteDataService.fetchUserProfile(userID: authPayload.userID, token: authPayload.accessToken)
            return AppSession(
                accessToken: authPayload.accessToken,
                refreshToken: authPayload.refreshToken,
                expiresAt: authPayload.expiresAt,
                userProfile: profile
            )
        } catch {
            await authService.signOut()
            return nil
        }
    }

    func signIn(email: String, password: String) async throws -> AppSession {
        let authPayload = try await authService.signIn(email: email, password: password)
        let profile = try await remoteDataService.fetchUserProfile(userID: authPayload.userID, token: authPayload.accessToken)
        return AppSession(
            accessToken: authPayload.accessToken,
            refreshToken: authPayload.refreshToken,
            expiresAt: authPayload.expiresAt,
            userProfile: profile
        )
    }

    func signOut() async {
        await authService.signOut()
    }

    func resetPassword(email: String) async throws {
        try await authService.resetPassword(email: email)
    }

    func fetchDealerSettings(session: AppSession) async throws -> DealerSettings {
        try await remoteDataService.fetchDealerSettings(
            dealerID: session.userProfile.dealerID,
            token: session.accessToken
        )
    }

    func updateDealerSettings(_ settings: DealerSettings, session: AppSession) async throws {
        try await remoteDataService.updateDealerSettings(
            dealerID: session.userProfile.dealerID,
            settings: settings,
            token: session.accessToken
        )
    }

    func fetchDashboard(session: AppSession) async throws -> DashboardMetrics {
        try await remoteDataService.fetchDashboardMetrics(
            user: session.userProfile,
            missedLeadMinutes: config.missedLeadMinutes,
            token: session.accessToken
        )
    }

    func fetchConversations(session: AppSession) async throws -> [Conversation] {
        do {
            let rows = try await remoteDataService.fetchConversations(
                dealerID: session.userProfile.dealerID,
                token: session.accessToken
            )
            cacheStore.saveConversations(rows, dealerID: session.userProfile.dealerID)
            return rows
        } catch {
            return cacheStore.loadConversations(dealerID: session.userProfile.dealerID)
        }
    }

    func fetchMessages(conversationID: UUID, session: AppSession) async throws -> [Message] {
        do {
            let rows = try await remoteDataService.fetchMessages(
                conversationID: conversationID,
                dealerID: session.userProfile.dealerID,
                token: session.accessToken
            )
            cacheStore.saveMessages(rows, dealerID: session.userProfile.dealerID, conversationID: conversationID)
            return rows
        } catch {
            return cacheStore.loadMessages(dealerID: session.userProfile.dealerID, conversationID: conversationID)
        }
    }

    func sendMessage(conversationID: UUID, leadID: UUID, content: String, session: AppSession) async throws {
        let payload = SendMessagePayload(conversationID: conversationID, leadID: leadID, content: content)
        try await remoteDataService.sendMessage(payload: payload, token: session.accessToken)
    }

    func handoff(conversationID: UUID, leadID: UUID, reason: String, session: AppSession) async throws {
        let payload = HandoffPayload(conversationID: conversationID, leadID: leadID, reason: reason)
        try await remoteDataService.handoff(payload: payload, token: session.accessToken)
    }

    func fetchLeads(filter: LeadFilter, session: AppSession) async throws -> [Lead] {
        try await remoteDataService.fetchLeads(
            dealerID: session.userProfile.dealerID,
            filter: filter,
            token: session.accessToken
        )
    }

    func updateLeadStatus(leadID: UUID, status: LeadStatus, session: AppSession) async throws {
        try await remoteDataService.updateLeadStatus(
            leadID: leadID,
            dealerID: session.userProfile.dealerID,
            status: status,
            token: session.accessToken
        )
    }

    func assignLead(leadID: UUID, userID: UUID, session: AppSession) async throws {
        try await remoteDataService.assignLead(
            leadID: leadID,
            dealerID: session.userProfile.dealerID,
            userID: userID,
            token: session.accessToken
        )
    }

    func fetchFollowups(leadID: UUID, session: AppSession) async throws -> [FollowupItem] {
        try await remoteDataService.fetchFollowups(
            leadID: leadID,
            dealerID: session.userProfile.dealerID,
            token: session.accessToken
        )
    }

    func fetchBookings(session: AppSession) async throws -> [Booking] {
        try await remoteDataService.fetchBookings(
            dealerID: session.userProfile.dealerID,
            token: session.accessToken
        )
    }

    func createBooking(_ request: NewBookingRequest, session: AppSession) async throws {
        try await remoteDataService.createBooking(request, token: session.accessToken)
    }

    func updateBookingStatus(bookingID: UUID, status: BookingStatus, session: AppSession) async throws {
        try await remoteDataService.updateBookingStatus(
            bookingID: bookingID,
            dealerID: session.userProfile.dealerID,
            status: status,
            token: session.accessToken
        )
    }

    func fetchTeamMembers(session: AppSession) async throws -> [TeamMember] {
        try await remoteDataService.fetchTeamMembers(
            dealerID: session.userProfile.dealerID,
            token: session.accessToken
        )
    }

    func inviteUser(_ request: InviteUserRequest, session: AppSession) async throws {
        try await remoteDataService.inviteUser(request, token: session.accessToken)
    }

    func disableUser(_ userID: UUID, session: AppSession) async throws {
        try await remoteDataService.disableUser(
            userID: userID,
            dealerID: session.userProfile.dealerID,
            token: session.accessToken
        )
    }

    func fetchAnalytics(session: AppSession) async throws -> AnalyticsSnapshot {
        try await remoteDataService.fetchAnalytics(
            dealerID: session.userProfile.dealerID,
            token: session.accessToken
        )
    }

    func registerDeviceToken(_ token: String, session: AppSession) async {
        await remoteDataService.registerDeviceToken(token, session: session)
    }
}
