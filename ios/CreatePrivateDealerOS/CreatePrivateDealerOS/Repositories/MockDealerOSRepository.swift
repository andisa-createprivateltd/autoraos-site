import Foundation

final class MockDealerOSRepository: DealerOSRepository {
    private var leads = MockSeedData.leads
    private var conversations = MockSeedData.conversations
    private var messages = MockSeedData.messagesByConversation
    private var bookings = MockSeedData.bookings
    private var team = MockSeedData.team
    private var settings = DealerSettings(
        businessHours: [
            "mon": .init(open: "08:00", close: "17:00"),
            "tue": .init(open: "08:00", close: "17:00"),
            "wed": .init(open: "08:00", close: "17:00"),
            "thu": .init(open: "08:00", close: "17:00"),
            "fri": .init(open: "08:00", close: "17:00")
        ],
        faqs: [
            "Do you offer test drives?",
            "Can I apply for finance online?"
        ],
        marketingCanViewMessages: false,
        allowAdminFullPhone: true
    )

    func restoreSession() async -> AppSession? {
        nil
    }

    func signIn(email: String, password: String) async throws -> AppSession {
        AppSession(
            accessToken: "mock-access-token",
            refreshToken: "mock-refresh-token",
            expiresAt: Date().addingTimeInterval(3600),
            userProfile: MockSeedData.userProfile
        )
    }

    func signOut() async {}

    func resetPassword(email: String) async throws {}

    func fetchDealerSettings(session: AppSession) async throws -> DealerSettings {
        settings
    }

    func updateDealerSettings(_ settings: DealerSettings, session: AppSession) async throws {
        self.settings = settings
    }

    func fetchDashboard(session: AppSession) async throws -> DashboardMetrics {
        DashboardMetrics(
            newLeadsToday: 4,
            avgResponseSeconds7d: 142,
            bookingsThisWeek: 6,
            missedLeads: 1,
            assignedLeads: leads.filter { $0.assignedUserID == session.userProfile.id }
        )
    }

    func fetchConversations(session: AppSession) async throws -> [Conversation] {
        conversations
    }

    func fetchMessages(conversationID: UUID, session: AppSession) async throws -> [Message] {
        messages[conversationID] ?? []
    }

    func sendMessage(conversationID: UUID, leadID: UUID, content: String, session: AppSession) async throws {
        let newMessage = Message(
            id: UUID(),
            dealerID: session.userProfile.dealerID,
            conversationID: conversationID,
            leadID: leadID,
            direction: .outbound,
            senderType: .human,
            senderUserID: session.userProfile.id,
            content: content,
            messageType: .text,
            providerMessageID: nil,
            createdAt: Date()
        )
        messages[conversationID, default: []].append(newMessage)
    }

    func handoff(conversationID: UUID, leadID: UUID, reason: String, session: AppSession) async throws {}

    func fetchLeads(filter: LeadFilter, session: AppSession) async throws -> [Lead] {
        leads.filter { lead in
            if let status = filter.status, lead.status != status { return false }
            if let source = filter.source, lead.source != source { return false }
            if let assignedUserID = filter.assignedUserID, lead.assignedUserID != assignedUserID { return false }
            return true
        }
    }

    func updateLeadStatus(leadID: UUID, status: LeadStatus, session: AppSession) async throws {
        if let index = leads.firstIndex(where: { $0.id == leadID }) {
            leads[index].status = status
        }
    }

    func assignLead(leadID: UUID, userID: UUID, session: AppSession) async throws {
        if let index = leads.firstIndex(where: { $0.id == leadID }) {
            leads[index].assignedUserID = userID
        }
    }

    func fetchFollowups(leadID: UUID, session: AppSession) async throws -> [FollowupItem] {
        [
            FollowupItem(
                id: UUID(),
                dealerID: session.userProfile.dealerID,
                leadID: leadID,
                type: "reminder",
                sentVia: "template",
                sentAt: Date().addingTimeInterval(-8_000),
                responded: true,
                responseAt: Date().addingTimeInterval(-7_000),
                createdAt: Date().addingTimeInterval(-8_000)
            )
        ]
    }

    func fetchBookings(session: AppSession) async throws -> [Booking] {
        bookings
    }

    func createBooking(_ request: NewBookingRequest, session: AppSession) async throws {
        bookings.append(
            Booking(
                id: UUID(),
                dealerID: request.dealerID,
                leadID: request.leadID,
                type: request.type,
                requestedAt: request.requestedAt,
                scheduledFor: request.scheduledFor,
                status: request.status,
                createdBy: request.createdBy,
                createdAt: Date(),
                lead: leads.first(where: { $0.id == request.leadID })
            )
        )
    }

    func updateBookingStatus(bookingID: UUID, status: BookingStatus, session: AppSession) async throws {
        if let index = bookings.firstIndex(where: { $0.id == bookingID }) {
            bookings[index].status = status
        }
    }

    func fetchTeamMembers(session: AppSession) async throws -> [TeamMember] {
        team
    }

    func inviteUser(_ request: InviteUserRequest, session: AppSession) async throws {
        team.append(
            TeamMember(
                id: UUID(),
                dealerID: session.userProfile.dealerID,
                name: request.name,
                email: request.email,
                role: request.role,
                isActive: true,
                createdAt: Date()
            )
        )
    }

    func disableUser(_ userID: UUID, session: AppSession) async throws {
        if let index = team.firstIndex(where: { $0.id == userID }) {
            team[index].isActive = false
        }
    }

    func fetchAnalytics(session: AppSession) async throws -> AnalyticsSnapshot {
        let calendar = Calendar.utc
        let points7 = (0 ..< 7).map { offset -> ResponseTrendPoint in
            let date = calendar.date(byAdding: .day, value: -offset, to: Date()) ?? Date()
            return ResponseTrendPoint(date: date, avgSeconds: Double(120 + (offset * 15)))
        }.reversed()

        let points30 = stride(from: 0, to: 30, by: 3).map { offset -> ResponseTrendPoint in
            let date = calendar.date(byAdding: .day, value: -offset, to: Date()) ?? Date()
            return ResponseTrendPoint(date: date, avgSeconds: Double(130 + offset))
        }.reversed()

        return AnalyticsSnapshot(
            responseTrend7d: Array(points7),
            responseTrend30d: Array(points30),
            sourceBreakdown: [
                SourceBreakdown(source: .whatsapp, count: 14),
                SourceBreakdown(source: .website, count: 8),
                SourceBreakdown(source: .ads, count: 5),
                SourceBreakdown(source: .oem, count: 3)
            ],
            bookingsCount: bookings.count,
            afterHoursHandledPercent: 67
        )
    }

    func registerDeviceToken(_ token: String, session: AppSession) async {}
}
