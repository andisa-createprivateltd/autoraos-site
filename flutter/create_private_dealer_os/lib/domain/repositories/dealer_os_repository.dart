import '../models/analytics_snapshot.dart';
import '../models/app_session.dart';
import '../models/booking.dart';
import '../models/conversation.dart';
import '../models/dashboard_metrics.dart';
import '../models/followup_item.dart';
import '../models/lead.dart';
import '../models/settings.dart';

abstract class DealerOsRepository {
  Future<AppSession?> restoreSession();
  Future<AppSession> signIn({required String email, required String password});
  Future<void> signOut();
  Future<void> resetPassword({required String email});

  Future<DealerSettings> fetchDealerSettings({required AppSession session});
  Future<void> updateDealerSettings({
    required DealerSettings settings,
    required AppSession session,
  });

  Future<DashboardMetrics> fetchDashboard({required AppSession session});

  Future<List<Conversation>> fetchConversations({required AppSession session});
  Future<List<Message>> fetchMessages({
    required String conversationId,
    required AppSession session,
  });
  Future<void> sendMessage({
    required String conversationId,
    required String leadId,
    required String content,
    required AppSession session,
  });
  Future<void> handoff({
    required String conversationId,
    required String leadId,
    required String reason,
    required AppSession session,
  });

  Future<List<Lead>> fetchLeads({
    required LeadFilter filter,
    required AppSession session,
  });
  Future<void> updateLeadStatus({
    required String leadId,
    required LeadStatus status,
    required AppSession session,
  });
  Future<void> assignLead({
    required String leadId,
    required String userId,
    required AppSession session,
  });
  Future<List<FollowupItem>> fetchFollowups({
    required String leadId,
    required AppSession session,
  });

  Future<List<Booking>> fetchBookings({required AppSession session});
  Future<void> createBooking({
    required NewBookingRequest request,
    required AppSession session,
  });
  Future<void> updateBookingStatus({
    required String bookingId,
    required BookingStatus status,
    required AppSession session,
  });

  Future<List<TeamMember>> fetchTeamMembers({required AppSession session});
  Future<void> inviteUser({
    required InviteUserRequest request,
    required AppSession session,
  });
  Future<void> disableUser({required String userId, required AppSession session});

  Future<AnalyticsSnapshot> fetchAnalytics({required AppSession session});
  Future<void> registerDeviceToken({
    required String deviceToken,
    required AppSession session,
  });
}
