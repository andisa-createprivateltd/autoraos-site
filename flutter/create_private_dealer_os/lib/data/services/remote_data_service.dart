import '../../domain/models/analytics_snapshot.dart';
import '../../domain/models/booking.dart';
import '../../domain/models/conversation.dart';
import '../../domain/models/dashboard_metrics.dart';
import '../../domain/models/followup_item.dart';
import '../../domain/models/lead.dart';
import '../../domain/models/settings.dart';
import '../../domain/models/user_profile.dart';

abstract class RemoteDataService {
  Future<UserProfile> fetchUserProfile({
    required String userId,
    required String token,
  });

  Future<DealerSettings> fetchDealerSettings({
    required String dealerId,
    required String token,
  });

  Future<void> updateDealerSettings({
    required String dealerId,
    required DealerSettings settings,
    required String token,
  });

  Future<DashboardMetrics> fetchDashboardMetrics({
    required UserProfile user,
    required int missedLeadMinutes,
    required String token,
  });

  Future<List<Conversation>> fetchConversations({
    required String dealerId,
    required String token,
  });

  Future<List<Message>> fetchMessages({
    required String conversationId,
    required String dealerId,
    required String token,
  });

  Future<void> sendMessage({
    required String conversationId,
    required String leadId,
    required String content,
    required String token,
  });

  Future<void> handoff({
    required String conversationId,
    required String leadId,
    required String reason,
    required String token,
  });

  Future<List<Lead>> fetchLeads({
    required String dealerId,
    required LeadFilter filter,
    required String token,
  });

  Future<void> updateLeadStatus({
    required String leadId,
    required String dealerId,
    required LeadStatus status,
    required String token,
  });

  Future<void> assignLead({
    required String leadId,
    required String dealerId,
    required String userId,
    required String token,
  });

  Future<List<FollowupItem>> fetchFollowups({
    required String leadId,
    required String dealerId,
    required String token,
  });

  Future<List<Booking>> fetchBookings({
    required String dealerId,
    required String token,
  });

  Future<void> createBooking({
    required NewBookingRequest request,
    required String token,
  });

  Future<void> updateBookingStatus({
    required String bookingId,
    required String dealerId,
    required BookingStatus status,
    required String token,
  });

  Future<List<TeamMember>> fetchTeamMembers({
    required String dealerId,
    required String token,
  });

  Future<void> inviteUser({required InviteUserRequest request, required String token});

  Future<void> disableUser({
    required String userId,
    required String dealerId,
    required String token,
  });

  Future<AnalyticsSnapshot> fetchAnalytics({
    required String dealerId,
    required String token,
  });

  Future<void> registerDeviceToken({
    required String deviceToken,
    required String token,
  });
}
