import '../../core/config/app_config.dart';
import '../../domain/models/analytics_snapshot.dart';
import '../../domain/models/app_session.dart';
import '../../domain/models/booking.dart';
import '../../domain/models/conversation.dart';
import '../../domain/models/dashboard_metrics.dart';
import '../../domain/models/followup_item.dart';
import '../../domain/models/lead.dart';
import '../../domain/models/settings.dart';
import '../../domain/repositories/dealer_os_repository.dart';
import '../cache/offline_cache_store.dart';
import '../services/auth_service.dart';
import '../services/remote_data_service.dart';

class LiveDealerOsRepository implements DealerOsRepository {
  LiveDealerOsRepository({
    required AuthService authService,
    required RemoteDataService remoteDataService,
    required OfflineCacheStore cacheStore,
    required AppConfig config,
  })  : _authService = authService,
        _remoteDataService = remoteDataService,
        _cacheStore = cacheStore,
        _config = config;

  final AuthService _authService;
  final RemoteDataService _remoteDataService;
  final OfflineCacheStore _cacheStore;
  final AppConfig _config;

  @override
  Future<AppSession?> restoreSession() async {
    final AuthSessionPayload? authPayload = await _authService.restoreSession();
    if (authPayload == null) {
      return null;
    }

    try {
      final profile = await _remoteDataService.fetchUserProfile(
        userId: authPayload.userId,
        token: authPayload.accessToken,
      );

      return AppSession(
        accessToken: authPayload.accessToken,
        refreshToken: authPayload.refreshToken,
        expiresAt: authPayload.expiresAt,
        userId: authPayload.userId,
        userProfile: profile,
      );
    } catch (_) {
      await _authService.signOut();
      return null;
    }
  }

  @override
  Future<AppSession> signIn({
    required String email,
    required String password,
  }) async {
    final AuthSessionPayload authPayload = await _authService.signIn(
      email: email,
      password: password,
    );

    final profile = await _remoteDataService.fetchUserProfile(
      userId: authPayload.userId,
      token: authPayload.accessToken,
    );

    return AppSession(
      accessToken: authPayload.accessToken,
      refreshToken: authPayload.refreshToken,
      expiresAt: authPayload.expiresAt,
      userId: authPayload.userId,
      userProfile: profile,
    );
  }

  @override
  Future<void> signOut() {
    return _authService.signOut();
  }

  @override
  Future<void> resetPassword({required String email}) {
    return _authService.resetPassword(email: email);
  }

  @override
  Future<DealerSettings> fetchDealerSettings({required AppSession session}) {
    return _remoteDataService.fetchDealerSettings(
      dealerId: session.userProfile.dealerId,
      token: session.accessToken,
    );
  }

  @override
  Future<void> updateDealerSettings({
    required DealerSettings settings,
    required AppSession session,
  }) {
    return _remoteDataService.updateDealerSettings(
      dealerId: session.userProfile.dealerId,
      settings: settings,
      token: session.accessToken,
    );
  }

  @override
  Future<DashboardMetrics> fetchDashboard({required AppSession session}) {
    return _remoteDataService.fetchDashboardMetrics(
      user: session.userProfile,
      missedLeadMinutes: _config.missedLeadMinutes,
      token: session.accessToken,
    );
  }

  @override
  Future<List<Conversation>> fetchConversations({required AppSession session}) async {
    try {
      final List<Conversation> rows = await _remoteDataService.fetchConversations(
        dealerId: session.userProfile.dealerId,
        token: session.accessToken,
      );

      await _cacheStore.saveConversations(
        conversations: rows,
        dealerId: session.userProfile.dealerId,
      );

      return rows;
    } catch (_) {
      return _cacheStore.loadConversations(dealerId: session.userProfile.dealerId);
    }
  }

  @override
  Future<List<Message>> fetchMessages({
    required String conversationId,
    required AppSession session,
  }) async {
    try {
      final List<Message> rows = await _remoteDataService.fetchMessages(
        conversationId: conversationId,
        dealerId: session.userProfile.dealerId,
        token: session.accessToken,
      );

      await _cacheStore.saveMessages(
        messages: rows,
        dealerId: session.userProfile.dealerId,
        conversationId: conversationId,
      );

      return rows;
    } catch (_) {
      return _cacheStore.loadMessages(
        dealerId: session.userProfile.dealerId,
        conversationId: conversationId,
      );
    }
  }

  @override
  Future<void> sendMessage({
    required String conversationId,
    required String leadId,
    required String content,
    required AppSession session,
  }) {
    return _remoteDataService.sendMessage(
      conversationId: conversationId,
      leadId: leadId,
      content: content,
      token: session.accessToken,
    );
  }

  @override
  Future<void> handoff({
    required String conversationId,
    required String leadId,
    required String reason,
    required AppSession session,
  }) {
    return _remoteDataService.handoff(
      conversationId: conversationId,
      leadId: leadId,
      reason: reason,
      token: session.accessToken,
    );
  }

  @override
  Future<List<Lead>> fetchLeads({
    required LeadFilter filter,
    required AppSession session,
  }) {
    return _remoteDataService.fetchLeads(
      dealerId: session.userProfile.dealerId,
      filter: filter,
      token: session.accessToken,
    );
  }

  @override
  Future<void> updateLeadStatus({
    required String leadId,
    required LeadStatus status,
    required AppSession session,
  }) {
    return _remoteDataService.updateLeadStatus(
      leadId: leadId,
      dealerId: session.userProfile.dealerId,
      status: status,
      token: session.accessToken,
    );
  }

  @override
  Future<void> assignLead({
    required String leadId,
    required String userId,
    required AppSession session,
  }) {
    return _remoteDataService.assignLead(
      leadId: leadId,
      dealerId: session.userProfile.dealerId,
      userId: userId,
      token: session.accessToken,
    );
  }

  @override
  Future<List<FollowupItem>> fetchFollowups({
    required String leadId,
    required AppSession session,
  }) {
    return _remoteDataService.fetchFollowups(
      leadId: leadId,
      dealerId: session.userProfile.dealerId,
      token: session.accessToken,
    );
  }

  @override
  Future<List<Booking>> fetchBookings({required AppSession session}) {
    return _remoteDataService.fetchBookings(
      dealerId: session.userProfile.dealerId,
      token: session.accessToken,
    );
  }

  @override
  Future<void> createBooking({
    required NewBookingRequest request,
    required AppSession session,
  }) {
    return _remoteDataService.createBooking(
      request: request,
      token: session.accessToken,
    );
  }

  @override
  Future<void> updateBookingStatus({
    required String bookingId,
    required BookingStatus status,
    required AppSession session,
  }) {
    return _remoteDataService.updateBookingStatus(
      bookingId: bookingId,
      dealerId: session.userProfile.dealerId,
      status: status,
      token: session.accessToken,
    );
  }

  @override
  Future<List<TeamMember>> fetchTeamMembers({required AppSession session}) {
    return _remoteDataService.fetchTeamMembers(
      dealerId: session.userProfile.dealerId,
      token: session.accessToken,
    );
  }

  @override
  Future<void> inviteUser({
    required InviteUserRequest request,
    required AppSession session,
  }) {
    return _remoteDataService.inviteUser(
      request: request,
      token: session.accessToken,
    );
  }

  @override
  Future<void> disableUser({required String userId, required AppSession session}) {
    return _remoteDataService.disableUser(
      userId: userId,
      dealerId: session.userProfile.dealerId,
      token: session.accessToken,
    );
  }

  @override
  Future<AnalyticsSnapshot> fetchAnalytics({required AppSession session}) {
    return _remoteDataService.fetchAnalytics(
      dealerId: session.userProfile.dealerId,
      token: session.accessToken,
    );
  }

  @override
  Future<void> registerDeviceToken({
    required String deviceToken,
    required AppSession session,
  }) {
    return _remoteDataService.registerDeviceToken(
      deviceToken: deviceToken,
      token: session.accessToken,
    );
  }
}
