import '../models/app_session.dart';
import '../models/dashboard.dart';
import '../models/lead.dart';
import '../models/booking.dart';
import '../models/conversation.dart';
import '../models/settings.dart';
import '../services/auth_service.dart';
import '../services/remote_data_service.dart';

abstract class DealerOSRepository {
  Future<AppSession?> restoreSession();
  Future<AppSession> signIn(String email, String password);
  Future<void> signOut();
  Future<void> resetPassword(String email);

  Future<DealerSettings> fetchDealerSettings(AppSession session);
  Future<void> updateDealerSettings(DealerSettings settings, AppSession session);

  Future<DashboardMetrics> fetchDashboard(AppSession session);

  Future<List<Conversation>> fetchConversations(AppSession session);
  Future<List<Message>> fetchMessages(String conversationID, AppSession session);
  Future<void> sendMessage(
    String conversationID,
    String leadID,
    String content,
    AppSession session,
  );

  Future<List<Lead>> fetchLeads(LeadFilter filter, AppSession session);
  Future<void> updateLeadStatus(String leadID, LeadStatus status, AppSession session);
  Future<void> assignLead(String leadID, String userID, AppSession session);
  Future<List<FollowupItem>> fetchFollowups(String leadID, AppSession session);

  Future<List<Booking>> fetchBookings(AppSession session);
  Future<void> createBooking(NewBookingRequest request, AppSession session);
  Future<void> updateBookingStatus(String bookingID, BookingStatus status, AppSession session);

  Future<List<TeamMember>> fetchTeamMembers(AppSession session);
  Future<void> inviteUser(InviteUserRequest request, AppSession session);
  Future<void> disableUser(String userID, AppSession session);

  Future<AnalyticsSnapshot> fetchAnalytics(AppSession session);
  Future<void> registerDeviceToken(String token, AppSession session);
}

class LiveDealerOSRepository implements DealerOSRepository {
  final AuthService _authService;
  final RemoteDataService _remoteDataService;

  LiveDealerOSRepository(
    this._authService,
    this._remoteDataService,
  );

  @override
  Future<AppSession?> restoreSession() async {
    final payload = await _authService.restoreSession();
    if (payload == null) {
      return null;
    }

    try {
      final profile = await _remoteDataService.fetchUserProfile(
        payload.userID,
        payload.accessToken,
      );
      return AppSession(
        accessToken: payload.accessToken,
        refreshToken: payload.refreshToken,
        expiresAt: payload.expiresAt,
        userProfile: profile,
      );
    } catch (e) {
      await _authService.signOut();
      return null;
    }
  }

  @override
  Future<AppSession> signIn(String email, String password) async {
    final payload = await _authService.signIn(email, password);
    final profile = await _remoteDataService.fetchUserProfile(
      payload.userID,
      payload.accessToken,
    );
    return AppSession(
      accessToken: payload.accessToken,
      refreshToken: payload.refreshToken,
      expiresAt: payload.expiresAt,
      userProfile: profile,
    );
  }

  @override
  Future<void> signOut() async {
    await _authService.signOut();
  }

  @override
  Future<void> resetPassword(String email) async {
    await _authService.resetPassword(email);
  }

  @override
  Future<DealerSettings> fetchDealerSettings(AppSession session) async {
    return _remoteDataService.fetchDealerSettings(
      session.userProfile.dealerID,
      session.accessToken,
    );
  }

  @override
  Future<void> updateDealerSettings(DealerSettings settings, AppSession session) async {
    // TODO: Implement
  }

  @override
  Future<DashboardMetrics> fetchDashboard(AppSession session) async {
    return _remoteDataService.fetchDashboard(session.accessToken);
  }

  @override
  Future<List<Conversation>> fetchConversations(AppSession session) async {
    return _remoteDataService.fetchConversations(session.accessToken);
  }

  @override
  Future<List<Message>> fetchMessages(String conversationID, AppSession session) async {
    return _remoteDataService.fetchMessages(conversationID, session.accessToken);
  }

  @override
  Future<void> sendMessage(
    String conversationID,
    String leadID,
    String content,
    AppSession session,
  ) async {
    await _remoteDataService.sendMessage(
      conversationID,
      leadID,
      content,
      session.accessToken,
    );
  }

  @override
  Future<List<Lead>> fetchLeads(LeadFilter filter, AppSession session) async {
    return _remoteDataService.fetchLeads(
      filter.status?.name,
      session.accessToken,
    );
  }

  @override
  Future<void> updateLeadStatus(String leadID, LeadStatus status, AppSession session) async {
    // TODO: Implement
  }

  @override
  Future<void> assignLead(String leadID, String userID, AppSession session) async {
    // TODO: Implement
  }

  @override
  Future<List<FollowupItem>> fetchFollowups(String leadID, AppSession session) async {
    // TODO: Implement
    return [];
  }

  @override
  Future<List<Booking>> fetchBookings(AppSession session) async {
    return _remoteDataService.fetchBookings(session.accessToken);
  }

  @override
  Future<void> createBooking(NewBookingRequest request, AppSession session) async {
    await _remoteDataService.createBooking(request, session.accessToken);
  }

  @override
  Future<void> updateBookingStatus(String bookingID, BookingStatus status, AppSession session) async {
    // TODO: Implement
  }

  @override
  Future<List<TeamMember>> fetchTeamMembers(AppSession session) async {
    // TODO: Implement
    return [];
  }

  @override
  Future<void> inviteUser(InviteUserRequest request, AppSession session) async {
    // TODO: Implement
  }

  @override
  Future<void> disableUser(String userID, AppSession session) async {
    // TODO: Implement
  }

  @override
  Future<AnalyticsSnapshot> fetchAnalytics(AppSession session) async {
    // TODO: Implement
    return AnalyticsSnapshot(
      timestamp: DateTime.now(),
      metrics: {},
    );
  }

  @override
  Future<void> registerDeviceToken(String token, AppSession session) async {
    await _remoteDataService.registerDeviceToken(
      token,
      session.userProfile.id,
      session.accessToken,
    );
  }
}
