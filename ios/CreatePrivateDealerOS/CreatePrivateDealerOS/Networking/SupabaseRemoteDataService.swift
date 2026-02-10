import Foundation

final class SupabaseRemoteDataService: RemoteDataService {
    private let config: AppConfig
    private let client: HTTPClient
    private let postgrestBuilder: PostgRESTRequestBuilder
    private let backendBuilder: BackendRequestBuilder
    private let decoder = JSONCoding.decoder()

    init(config: AppConfig, client: HTTPClient) {
        self.config = config
        self.client = client
        self.postgrestBuilder = PostgRESTRequestBuilder(config: config)
        self.backendBuilder = BackendRequestBuilder(config: config)
    }

    func fetchUserProfile(userID: UUID, token: String) async throws -> UserProfile {
        let request = try postgrestBuilder.makeRequest(
            table: "users",
            token: token,
            queryItems: [
                URLQueryItem(name: "select", value: "id,dealer_id,name,email,role,is_active,last_login_at"),
                URLQueryItem(name: "id", value: "eq.\(userID.uuidString.lowercased())"),
                URLQueryItem(name: "limit", value: "1")
            ]
        )

        let data = try await client.perform(request)
        let rows = try decoder.decode([UserProfile].self, from: data)
        guard let profile = rows.first else {
            throw AppError.unauthorized
        }
        return profile
    }

    func fetchDealerSettings(dealerID: UUID, token: String) async throws -> DealerSettings {
        let request = try postgrestBuilder.makeRequest(
            table: "dealers",
            token: token,
            queryItems: [
                URLQueryItem(name: "select", value: "business_hours,ai_config"),
                URLQueryItem(name: "id", value: "eq.\(dealerID.uuidString.lowercased())"),
                URLQueryItem(name: "limit", value: "1")
            ]
        )

        let data = try await client.perform(request)
        let rows = try decoder.decode([DealerSettingsRow].self, from: data)
        let row = rows.first

        return DealerSettings(
            businessHours: row?.businessHours ?? DealerSettingsRow.defaultBusinessHours,
            faqs: row?.aiConfig?.faqs ?? [],
            marketingCanViewMessages: row?.aiConfig?.marketingViewMessages ?? config.marketingCanViewMessagesByDefault,
            allowAdminFullPhone: row?.aiConfig?.allowAdminFullPhone ?? false
        )
    }

    func updateDealerSettings(dealerID: UUID, settings: DealerSettings, token: String) async throws {
        let existingRequest = try postgrestBuilder.makeRequest(
            table: "dealers",
            token: token,
            queryItems: [
                URLQueryItem(name: "select", value: "ai_config"),
                URLQueryItem(name: "id", value: "eq.\(dealerID.uuidString.lowercased())"),
                URLQueryItem(name: "limit", value: "1")
            ]
        )
        let existingData = try await client.perform(existingRequest)
        let existingRows = try JSONSerialization.jsonObject(with: existingData) as? [[String: Any]]
        var aiConfig = (existingRows?.first?["ai_config"] as? [String: Any]) ?? [:]
        aiConfig["faqs"] = settings.faqs
        aiConfig["marketing_view_messages"] = settings.marketingCanViewMessages
        aiConfig["allow_admin_full_phone"] = settings.allowAdminFullPhone

        let businessHours = settings.businessHours.reduce(into: [String: [String: String]]()) { partialResult, entry in
            partialResult[entry.key] = ["open": entry.value.open, "close": entry.value.close]
        }

        let bodyObject: [String: Any] = [
            "business_hours": businessHours,
            "ai_config": aiConfig
        ]
        let body = try JSONSerialization.data(withJSONObject: bodyObject)

        let request = try postgrestBuilder.makeRequest(
            table: "dealers",
            method: "PATCH",
            token: token,
            queryItems: [URLQueryItem(name: "id", value: "eq.\(dealerID.uuidString.lowercased())")],
            body: body,
            prefer: "return=minimal"
        )

        _ = try await client.perform(request)
    }

    func fetchDashboardMetrics(user: UserProfile, missedLeadMinutes: Int, token: String) async throws -> DashboardMetrics {
        let now = Date()
        let utcCalendar = Calendar.utc
        let todayStart = utcCalendar.startOfDay(for: now)
        let weekStart = utcCalendar.startOfWeek(for: now)
        let weekEnd = utcCalendar.date(byAdding: .day, value: 7, to: weekStart) ?? now
        let sevenDaysAgo = utcCalendar.date(byAdding: .day, value: -7, to: now) ?? now

        async let leadsToday: [Lead] = fetchRows(
            table: "leads",
            token: token,
            queryItems: [
                URLQueryItem(name: "select", value: "id,dealer_id,source,first_contact_at,name,phone,vehicle_interest,budget_range,status,assigned_user_id,last_activity_at,created_at"),
                URLQueryItem(name: "dealer_id", value: "eq.\(user.dealerID.uuidString.lowercased())"),
                URLQueryItem(name: "first_contact_at", value: "gte.\(todayStart.serverISO8601())")
            ]
        )

        async let responses: [ResponseMetricRow] = fetchRows(
            table: "response_metrics",
            token: token,
            queryItems: [
                URLQueryItem(name: "select", value: "response_seconds,first_inbound_at,first_response_at"),
                URLQueryItem(name: "dealer_id", value: "eq.\(user.dealerID.uuidString.lowercased())"),
                URLQueryItem(name: "first_inbound_at", value: "gte.\(sevenDaysAgo.serverISO8601())")
            ]
        )

        async let bookings: [Booking] = fetchRows(
            table: "bookings",
            token: token,
            queryItems: [
                URLQueryItem(name: "select", value: "id,dealer_id,lead_id,type,requested_at,scheduled_for,status,created_by,created_at"),
                URLQueryItem(name: "dealer_id", value: "eq.\(user.dealerID.uuidString.lowercased())"),
                URLQueryItem(name: "scheduled_for", value: "gte.\(weekStart.serverISO8601())"),
                URLQueryItem(name: "scheduled_for", value: "lt.\(weekEnd.serverISO8601())")
            ]
        )

        let assignedLeads: [Lead]
        if user.role == .dealerSales {
            assignedLeads = try await fetchRows(
                table: "leads",
                token: token,
                queryItems: [
                    URLQueryItem(name: "select", value: "id,dealer_id,source,first_contact_at,name,phone,vehicle_interest,budget_range,status,assigned_user_id,last_activity_at,created_at"),
                    URLQueryItem(name: "dealer_id", value: "eq.\(user.dealerID.uuidString.lowercased())"),
                    URLQueryItem(name: "assigned_user_id", value: "eq.\(user.id.uuidString.lowercased())"),
                    URLQueryItem(name: "status", value: "not.in.(sold,lost)"),
                    URLQueryItem(name: "order", value: "last_activity_at.desc"),
                    URLQueryItem(name: "limit", value: "20")
                ]
            )
        } else {
            assignedLeads = []
        }

        let responseRows = try await responses
        let leadsTodayRows = try await leadsToday
        let bookingRows = try await bookings
        let missedThreshold = missedLeadMinutes * 60
        let missed = responseRows.filter { $0.responseSeconds > missedThreshold }.count
        let averageResponse = responseRows.isEmpty ? 0 : Double(responseRows.map(\.responseSeconds).reduce(0, +)) / Double(responseRows.count)

        return DashboardMetrics(
            newLeadsToday: leadsTodayRows.count,
            avgResponseSeconds7d: averageResponse,
            bookingsThisWeek: bookingRows.count,
            missedLeads: missed,
            assignedLeads: assignedLeads
        )
    }

    func fetchConversations(dealerID: UUID, token: String) async throws -> [Conversation] {
        let baseConversations: [Conversation] = try await fetchRows(
            table: "conversations",
            token: token,
            queryItems: [
                URLQueryItem(name: "select", value: "id,dealer_id,lead_id,channel,is_open,last_message_at,created_at"),
                URLQueryItem(name: "dealer_id", value: "eq.\(dealerID.uuidString.lowercased())"),
                URLQueryItem(name: "order", value: "last_message_at.desc"),
                URLQueryItem(name: "limit", value: "50")
            ]
        )

        guard !baseConversations.isEmpty else {
            return []
        }

        let leadIDs = Array(Set(baseConversations.map(\.leadID)))
        let conversationIDs = baseConversations.map(\.id)

        async let leads: [Lead] = fetchRows(
            table: "leads",
            token: token,
            queryItems: [
                URLQueryItem(name: "select", value: "id,dealer_id,source,first_contact_at,name,phone,vehicle_interest,budget_range,status,assigned_user_id,last_activity_at,created_at"),
                URLQueryItem(name: "id", value: inFilter(leadIDs))
            ]
        )

        async let lastMessages: [Message] = fetchRows(
            table: "messages",
            token: token,
            queryItems: [
                URLQueryItem(name: "select", value: "id,dealer_id,conversation_id,lead_id,direction,sender_type,sender_user_id,content,message_type,provider_message_id,created_at"),
                URLQueryItem(name: "conversation_id", value: inFilter(conversationIDs)),
                URLQueryItem(name: "order", value: "created_at.desc"),
                URLQueryItem(name: "limit", value: "500")
            ]
        )

        let leadRows = try await leads
        let leadMap = Dictionary(uniqueKeysWithValues: leadRows.map { ($0.id, $0) })
        var lastMessageMap: [UUID: Message] = [:]
        for message in try await lastMessages where lastMessageMap[message.conversationID] == nil {
            lastMessageMap[message.conversationID] = message
        }

        return baseConversations.map { row in
            var result = row
            result.lead = leadMap[row.leadID]
            result.lastMessagePreview = lastMessageMap[row.id]?.content
            return result
        }
    }

    func fetchMessages(conversationID: UUID, dealerID: UUID, token: String) async throws -> [Message] {
        try await fetchRows(
            table: "messages",
            token: token,
            queryItems: [
                URLQueryItem(name: "select", value: "id,dealer_id,conversation_id,lead_id,direction,sender_type,sender_user_id,content,message_type,provider_message_id,created_at"),
                URLQueryItem(name: "dealer_id", value: "eq.\(dealerID.uuidString.lowercased())"),
                URLQueryItem(name: "conversation_id", value: "eq.\(conversationID.uuidString.lowercased())"),
                URLQueryItem(name: "order", value: "created_at.asc"),
                URLQueryItem(name: "limit", value: "200")
            ]
        )
    }

    func sendMessage(payload: SendMessagePayload, token: String) async throws {
        let request = try backendBuilder.makePOST(path: "api/send-message", token: token, payload: payload)
        _ = try await client.perform(request)
    }

    func handoff(payload: HandoffPayload, token: String) async throws {
        let request = try backendBuilder.makePOST(path: "api/handoff", token: token, payload: payload)
        _ = try await client.perform(request)
    }

    func fetchLeads(dealerID: UUID, filter: LeadFilter, token: String) async throws -> [Lead] {
        var queryItems: [URLQueryItem] = [
            URLQueryItem(name: "select", value: "id,dealer_id,source,first_contact_at,name,phone,vehicle_interest,budget_range,status,assigned_user_id,last_activity_at,created_at"),
            URLQueryItem(name: "dealer_id", value: "eq.\(dealerID.uuidString.lowercased())"),
            URLQueryItem(name: "order", value: "last_activity_at.desc")
        ]

        if let status = filter.status {
            queryItems.append(URLQueryItem(name: "status", value: "eq.\(status.rawValue)"))
        }
        if let source = filter.source {
            queryItems.append(URLQueryItem(name: "source", value: "eq.\(source.rawValue)"))
        }
        if let assigned = filter.assignedUserID {
            queryItems.append(URLQueryItem(name: "assigned_user_id", value: "eq.\(assigned.uuidString.lowercased())"))
        }

        return try await fetchRows(table: "leads", token: token, queryItems: queryItems)
    }

    func updateLeadStatus(leadID: UUID, dealerID: UUID, status: LeadStatus, token: String) async throws {
        let payload = ["status": status.rawValue]
        let body = try JSONSerialization.data(withJSONObject: payload)

        let request = try postgrestBuilder.makeRequest(
            table: "leads",
            method: "PATCH",
            token: token,
            queryItems: [
                URLQueryItem(name: "id", value: "eq.\(leadID.uuidString.lowercased())"),
                URLQueryItem(name: "dealer_id", value: "eq.\(dealerID.uuidString.lowercased())")
            ],
            body: body,
            prefer: "return=minimal"
        )

        _ = try await client.perform(request)
    }

    func assignLead(leadID: UUID, dealerID: UUID, userID: UUID, token: String) async throws {
        let payload = ["assigned_user_id": userID.uuidString.lowercased()]
        let body = try JSONSerialization.data(withJSONObject: payload)

        let request = try postgrestBuilder.makeRequest(
            table: "leads",
            method: "PATCH",
            token: token,
            queryItems: [
                URLQueryItem(name: "id", value: "eq.\(leadID.uuidString.lowercased())"),
                URLQueryItem(name: "dealer_id", value: "eq.\(dealerID.uuidString.lowercased())")
            ],
            body: body,
            prefer: "return=minimal"
        )

        _ = try await client.perform(request)
    }

    func fetchFollowups(leadID: UUID, dealerID: UUID, token: String) async throws -> [FollowupItem] {
        try await fetchRows(
            table: "followups",
            token: token,
            queryItems: [
                URLQueryItem(name: "select", value: "id,dealer_id,lead_id,type,sent_via,sent_at,responded,response_at,created_at"),
                URLQueryItem(name: "dealer_id", value: "eq.\(dealerID.uuidString.lowercased())"),
                URLQueryItem(name: "lead_id", value: "eq.\(leadID.uuidString.lowercased())"),
                URLQueryItem(name: "order", value: "created_at.desc")
            ]
        )
    }

    func fetchBookings(dealerID: UUID, token: String) async throws -> [Booking] {
        let baseBookings: [Booking] = try await fetchRows(
            table: "bookings",
            token: token,
            queryItems: [
                URLQueryItem(name: "select", value: "id,dealer_id,lead_id,type,requested_at,scheduled_for,status,created_by,created_at"),
                URLQueryItem(name: "dealer_id", value: "eq.\(dealerID.uuidString.lowercased())"),
                URLQueryItem(name: "order", value: "scheduled_for.asc"),
                URLQueryItem(name: "limit", value: "200")
            ]
        )

        let leadIDs = Array(Set(baseBookings.map(\.leadID)))
        guard !leadIDs.isEmpty else {
            return baseBookings
        }

        let leads: [Lead] = try await fetchRows(
            table: "leads",
            token: token,
            queryItems: [
                URLQueryItem(name: "select", value: "id,dealer_id,source,first_contact_at,name,phone,vehicle_interest,budget_range,status,assigned_user_id,last_activity_at,created_at"),
                URLQueryItem(name: "id", value: inFilter(leadIDs))
            ]
        )

        let leadMap = Dictionary(uniqueKeysWithValues: leads.map { ($0.id, $0) })
        return baseBookings.map { booking in
            var row = booking
            row.lead = leadMap[booking.leadID]
            return row
        }
    }

    func createBooking(_ requestPayload: NewBookingRequest, token: String) async throws {
        let body = try JSONCoding.encoder().encode([requestPayload])

        let request = try postgrestBuilder.makeRequest(
            table: "bookings",
            method: "POST",
            token: token,
            body: body,
            prefer: "return=minimal"
        )

        _ = try await client.perform(request)
    }

    func updateBookingStatus(bookingID: UUID, dealerID: UUID, status: BookingStatus, token: String) async throws {
        let payload = ["status": status.rawValue]
        let body = try JSONSerialization.data(withJSONObject: payload)

        let request = try postgrestBuilder.makeRequest(
            table: "bookings",
            method: "PATCH",
            token: token,
            queryItems: [
                URLQueryItem(name: "id", value: "eq.\(bookingID.uuidString.lowercased())"),
                URLQueryItem(name: "dealer_id", value: "eq.\(dealerID.uuidString.lowercased())")
            ],
            body: body,
            prefer: "return=minimal"
        )

        _ = try await client.perform(request)
    }

    func fetchTeamMembers(dealerID: UUID, token: String) async throws -> [TeamMember] {
        try await fetchRows(
            table: "users",
            token: token,
            queryItems: [
                URLQueryItem(name: "select", value: "id,dealer_id,name,email,role,is_active,created_at"),
                URLQueryItem(name: "dealer_id", value: "eq.\(dealerID.uuidString.lowercased())"),
                URLQueryItem(name: "order", value: "created_at.desc")
            ]
        )
    }

    func inviteUser(_ requestPayload: InviteUserRequest, token: String) async throws {
        let request = try backendBuilder.makePOST(path: "api/invite-user", token: token, payload: requestPayload)
        _ = try await client.perform(request)
    }

    func disableUser(userID: UUID, dealerID: UUID, token: String) async throws {
        let payload = ["is_active": false]
        let body = try JSONSerialization.data(withJSONObject: payload)

        let request = try postgrestBuilder.makeRequest(
            table: "users",
            method: "PATCH",
            token: token,
            queryItems: [
                URLQueryItem(name: "id", value: "eq.\(userID.uuidString.lowercased())"),
                URLQueryItem(name: "dealer_id", value: "eq.\(dealerID.uuidString.lowercased())")
            ],
            body: body,
            prefer: "return=minimal"
        )

        _ = try await client.perform(request)
    }

    func fetchAnalytics(dealerID: UUID, token: String) async throws -> AnalyticsSnapshot {
        let now = Date()
        let thirtyDaysAgo = Calendar.utc.date(byAdding: .day, value: -30, to: now) ?? now
        let sevenDaysAgo = Calendar.utc.date(byAdding: .day, value: -7, to: now) ?? now

        async let responseMetrics: [ResponseMetricRow] = fetchRows(
            table: "response_metrics",
            token: token,
            queryItems: [
                URLQueryItem(name: "select", value: "response_seconds,first_inbound_at,first_response_at"),
                URLQueryItem(name: "dealer_id", value: "eq.\(dealerID.uuidString.lowercased())"),
                URLQueryItem(name: "first_inbound_at", value: "gte.\(thirtyDaysAgo.serverISO8601())")
            ]
        )

        async let leads: [Lead] = fetchRows(
            table: "leads",
            token: token,
            queryItems: [
                URLQueryItem(name: "select", value: "id,dealer_id,source,first_contact_at,name,phone,vehicle_interest,budget_range,status,assigned_user_id,last_activity_at,created_at"),
                URLQueryItem(name: "dealer_id", value: "eq.\(dealerID.uuidString.lowercased())"),
                URLQueryItem(name: "created_at", value: "gte.\(thirtyDaysAgo.serverISO8601())")
            ]
        )

        async let bookings: [Booking] = fetchRows(
            table: "bookings",
            token: token,
            queryItems: [
                URLQueryItem(name: "select", value: "id,dealer_id,lead_id,type,requested_at,scheduled_for,status,created_by,created_at"),
                URLQueryItem(name: "dealer_id", value: "eq.\(dealerID.uuidString.lowercased())"),
                URLQueryItem(name: "created_at", value: "gte.\(thirtyDaysAgo.serverISO8601())")
            ]
        )

        async let investor: [InvestorMetricsRow] = fetchRows(
            table: "investor_metrics_30d",
            token: token,
            queryItems: [
                URLQueryItem(name: "select", value: "dealer_id,pct_after_hours_leads_saved"),
                URLQueryItem(name: "dealer_id", value: "eq.\(dealerID.uuidString.lowercased())"),
                URLQueryItem(name: "limit", value: "1")
            ]
        )

        let metricRows = try await responseMetrics
        let grouped7 = metricRows
            .filter { $0.firstInboundAt >= sevenDaysAgo }
            .groupedByDay(using: \.firstInboundAt)
            .map { date, rows in ResponseTrendPoint(date: date, avgSeconds: rows.averageResponseSeconds) }
            .sorted { $0.date < $1.date }

        let grouped30 = metricRows
            .groupedByDay(using: \.firstInboundAt)
            .map { date, rows in ResponseTrendPoint(date: date, avgSeconds: rows.averageResponseSeconds) }
            .sorted { $0.date < $1.date }

        let leadRows = try await leads
        let bookingRows = try await bookings
        let investorRows = try await investor
        let sourceBreakdown = LeadSource.allCases.map { source in
            SourceBreakdown(source: source, count: leadRows.filter { $0.source == source }.count)
        }

        return AnalyticsSnapshot(
            responseTrend7d: grouped7,
            responseTrend30d: grouped30,
            sourceBreakdown: sourceBreakdown,
            bookingsCount: bookingRows.count,
            afterHoursHandledPercent: investorRows.first?.pctAfterHoursLeadsSaved ?? 0
        )
    }

    func registerDeviceToken(_ deviceToken: String, token: String) async {
        let payload = DeviceTokenPayload(deviceToken: deviceToken, platform: "ios")
        do {
            let request = try backendBuilder.makePOST(path: "api/device-token", token: token, payload: payload)
            _ = try await client.perform(request)
        } catch {
            // Intentionally swallowed for beta to avoid blocking user sessions.
        }
    }

    private func fetchRows<T: Decodable>(
        table: String,
        token: String,
        queryItems: [URLQueryItem]
    ) async throws -> [T] {
        let request = try postgrestBuilder.makeRequest(table: table, token: token, queryItems: queryItems)
        let data = try await client.perform(request)
        return try decoder.decode([T].self, from: data)
    }

    private func inFilter(_ ids: [UUID]) -> String {
        let joined = ids.map { $0.uuidString.lowercased() }.joined(separator: ",")
        return "in.(\(joined))"
    }
}

private struct DealerSettingsRow: Decodable {
    struct AIConfig: Decodable {
        let faqs: [String]?
        let marketingViewMessages: Bool?
        let allowAdminFullPhone: Bool?

        enum CodingKeys: String, CodingKey {
            case faqs
            case marketingViewMessages = "marketing_view_messages"
            case allowAdminFullPhone = "allow_admin_full_phone"
        }
    }

    let businessHours: [String: BusinessHoursDay]
    let aiConfig: AIConfig?

    static let defaultBusinessHours: [String: BusinessHoursDay] = [
        "mon": .init(open: "08:00", close: "17:00"),
        "tue": .init(open: "08:00", close: "17:00"),
        "wed": .init(open: "08:00", close: "17:00"),
        "thu": .init(open: "08:00", close: "17:00"),
        "fri": .init(open: "08:00", close: "17:00")
    ]
}

private struct ResponseMetricRow: Decodable {
    let responseSeconds: Int
    let firstInboundAt: Date
    let firstResponseAt: Date
}

private struct InvestorMetricsRow: Decodable {
    let dealerID: UUID
    let pctAfterHoursLeadsSaved: Double
}

private extension Array where Element == ResponseMetricRow {
    var averageResponseSeconds: Double {
        guard !isEmpty else { return 0 }
        let total = reduce(0) { $0 + $1.responseSeconds }
        return Double(total) / Double(count)
    }

    func groupedByDay(using keyPath: KeyPath<ResponseMetricRow, Date>) -> [Date: [ResponseMetricRow]] {
        let calendar = Calendar.utc
        return reduce(into: [Date: [ResponseMetricRow]]()) { partialResult, row in
            let day = calendar.startOfDay(for: row[keyPath: keyPath])
            partialResult[day, default: []].append(row)
        }
    }
}
