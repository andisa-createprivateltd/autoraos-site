import 'package:collection/collection.dart';
import 'package:uuid/uuid.dart';

import '../../domain/models/analytics_snapshot.dart';
import '../../domain/models/app_session.dart';
import '../../domain/models/booking.dart';
import '../../domain/models/conversation.dart';
import '../../domain/models/dashboard_metrics.dart';
import '../../domain/models/followup_item.dart';
import '../../domain/models/lead.dart';
import '../../domain/models/settings.dart';
import '../../domain/repositories/dealer_os_repository.dart';
import 'mock_seed_data.dart';

class MockDealerOsRepository implements DealerOsRepository {
  MockDealerOsRepository()
      : _leads = MockSeedData.leads(),
        _settings = MockSeedData.settings() {
    _conversations = MockSeedData.conversations(_leads);
    _messages = MockSeedData.messages(_conversations, _leads);
    _bookings = MockSeedData.bookings(_leads);
    _team = MockSeedData.team();
  }

  final Uuid _uuid = const Uuid();

  final List<Lead> _leads;
  late final List<Conversation> _conversations;
  late final Map<String, List<Message>> _messages;
  late final List<Booking> _bookings;
  late final List<TeamMember> _team;
  DealerSettings _settings;

  @override
  Future<AppSession?> restoreSession() async {
    return null;
  }

  @override
  Future<AppSession> signIn({required String email, required String password}) async {
    return AppSession(
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      expiresAt: DateTime.now().toUtc().add(const Duration(hours: 1)),
      userId: MockSeedData.adminId,
      userProfile: MockSeedData.userProfile,
    );
  }

  @override
  Future<void> signOut() async {}

  @override
  Future<void> resetPassword({required String email}) async {}

  @override
  Future<DealerSettings> fetchDealerSettings({required AppSession session}) async {
    return _settings;
  }

  @override
  Future<void> updateDealerSettings({
    required DealerSettings settings,
    required AppSession session,
  }) async {
    _settings = settings;
  }

  @override
  Future<DashboardMetrics> fetchDashboard({required AppSession session}) async {
    return DashboardMetrics(
      newLeadsToday: 4,
      avgResponseSeconds7d: 142,
      bookingsThisWeek: 6,
      missedLeads: 1,
      assignedLeads: _leads.where((Lead lead) => lead.assignedUserId == session.userId).toList(),
    );
  }

  @override
  Future<List<Conversation>> fetchConversations({required AppSession session}) async {
    return _conversations;
  }

  @override
  Future<List<Message>> fetchMessages({
    required String conversationId,
    required AppSession session,
  }) async {
    return _messages[conversationId] ?? <Message>[];
  }

  @override
  Future<void> sendMessage({
    required String conversationId,
    required String leadId,
    required String content,
    required AppSession session,
  }) async {
    _messages.putIfAbsent(conversationId, () => <Message>[]).add(
          Message(
            id: _uuid.v4(),
            dealerId: session.userProfile.dealerId,
            conversationId: conversationId,
            leadId: leadId,
            direction: MessageDirection.outbound,
            senderType: MessageSenderType.human,
            senderUserId: session.userId,
            content: content,
            messageType: MessageType.text,
            providerMessageId: null,
            createdAt: DateTime.now().toUtc(),
          ),
        );
  }

  @override
  Future<void> handoff({
    required String conversationId,
    required String leadId,
    required String reason,
    required AppSession session,
  }) async {}

  @override
  Future<List<Lead>> fetchLeads({
    required LeadFilter filter,
    required AppSession session,
  }) async {
    return _leads.where((Lead lead) {
      if (filter.status != null && lead.status != filter.status) {
        return false;
      }
      if (filter.source != null && lead.source != filter.source) {
        return false;
      }
      if (filter.assignedUserId != null &&
          filter.assignedUserId!.isNotEmpty &&
          lead.assignedUserId != filter.assignedUserId) {
        return false;
      }
      return true;
    }).toList();
  }

  @override
  Future<void> updateLeadStatus({
    required String leadId,
    required LeadStatus status,
    required AppSession session,
  }) async {
    final int index = _leads.indexWhere((Lead lead) => lead.id == leadId);
    if (index >= 0) {
      _leads[index] = _leads[index].copyWith(status: status);
    }
  }

  @override
  Future<void> assignLead({
    required String leadId,
    required String userId,
    required AppSession session,
  }) async {
    final int index = _leads.indexWhere((Lead lead) => lead.id == leadId);
    if (index >= 0) {
      _leads[index] = _leads[index].copyWith(assignedUserId: userId);
    }
  }

  @override
  Future<List<FollowupItem>> fetchFollowups({
    required String leadId,
    required AppSession session,
  }) async {
    return <FollowupItem>[
      FollowupItem(
        id: _uuid.v4(),
        dealerId: session.userProfile.dealerId,
        leadId: leadId,
        type: 'reminder',
        sentVia: 'template',
        sentAt: DateTime.now().toUtc().subtract(const Duration(hours: 2)),
        responded: true,
        responseAt: DateTime.now().toUtc().subtract(const Duration(hours: 1)),
        createdAt: DateTime.now().toUtc().subtract(const Duration(hours: 2)),
      ),
    ];
  }

  @override
  Future<List<Booking>> fetchBookings({required AppSession session}) async {
    return _bookings;
  }

  @override
  Future<void> createBooking({
    required NewBookingRequest request,
    required AppSession session,
  }) async {
    final Lead? lead = _leads.where((Lead item) => item.id == request.leadId).firstOrNull;
    _bookings.add(
      Booking(
        id: _uuid.v4(),
        dealerId: request.dealerId,
        leadId: request.leadId,
        type: request.type,
        requestedAt: request.requestedAt,
        scheduledFor: request.scheduledFor,
        status: request.status,
        createdBy: request.createdBy,
        createdAt: DateTime.now().toUtc(),
        lead: lead,
      ),
    );
  }

  @override
  Future<void> updateBookingStatus({
    required String bookingId,
    required BookingStatus status,
    required AppSession session,
  }) async {
    final int index = _bookings.indexWhere((Booking booking) => booking.id == bookingId);
    if (index >= 0) {
      _bookings[index] = _bookings[index].copyWith(status: status);
    }
  }

  @override
  Future<List<TeamMember>> fetchTeamMembers({required AppSession session}) async {
    return _team;
  }

  @override
  Future<void> inviteUser({
    required InviteUserRequest request,
    required AppSession session,
  }) async {
    _team.add(
      TeamMember(
        id: _uuid.v4(),
        dealerId: session.userProfile.dealerId,
        name: request.name,
        email: request.email,
        role: request.role,
        isActive: true,
        createdAt: DateTime.now().toUtc(),
      ),
    );
  }

  @override
  Future<void> disableUser({required String userId, required AppSession session}) async {
    final int index = _team.indexWhere((TeamMember member) => member.id == userId);
    if (index >= 0) {
      _team[index] = _team[index].copyWith(isActive: false);
    }
  }

  @override
  Future<AnalyticsSnapshot> fetchAnalytics({required AppSession session}) async {
    final DateTime now = DateTime.now().toUtc();

    final List<ResponseTrendPoint> points7 = List<ResponseTrendPoint>.generate(
      7,
      (int index) => ResponseTrendPoint(
        date: now.subtract(Duration(days: 6 - index)),
        avgSeconds: 120 + (index * 8),
      ),
    );

    final List<ResponseTrendPoint> points30 = List<ResponseTrendPoint>.generate(
      10,
      (int index) => ResponseTrendPoint(
        date: now.subtract(Duration(days: 27 - (index * 3))),
        avgSeconds: 130 + (index * 6),
      ),
    );

    return AnalyticsSnapshot(
      responseTrend7d: points7,
      responseTrend30d: points30,
      sourceBreakdown: <SourceBreakdown>[
        SourceBreakdown(
          source: LeadSource.whatsapp,
          count: _leads.where((Lead lead) => lead.source == LeadSource.whatsapp).length,
        ),
        SourceBreakdown(
          source: LeadSource.website,
          count: _leads.where((Lead lead) => lead.source == LeadSource.website).length,
        ),
        SourceBreakdown(
          source: LeadSource.ads,
          count: _leads.where((Lead lead) => lead.source == LeadSource.ads).length,
        ),
        SourceBreakdown(
          source: LeadSource.oem,
          count: _leads.where((Lead lead) => lead.source == LeadSource.oem).length,
        ),
      ],
      bookingsCount: _bookings.length,
      afterHoursHandledPercent: 67,
    );
  }

  @override
  Future<void> registerDeviceToken({
    required String deviceToken,
    required AppSession session,
  }) async {}
}
