import 'package:http/http.dart' as http;
import 'dart:convert';
import '../models/user_profile.dart';
import '../models/dashboard.dart';
import '../models/lead.dart';
import '../models/booking.dart';
import '../models/conversation.dart';
import '../models/settings.dart';

class RemoteDataService {
  final String baseUrl;
  final String supabaseKey;
  final bool useDemoMode;

  RemoteDataService({
    required this.baseUrl,
    required this.supabaseKey,
    this.useDemoMode = true,
  });

  Map<String, String> _headers(String token) => {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      };

  Future<UserProfile> fetchUserProfile(
    String userID,
    String token,
  ) async {
    if (useDemoMode) {
      // Return mock profile based on userID
      return UserProfile(
        id: userID,
        email: 'user@dealer.com',
        name: 'Demo User',
        dealerID: 'dealer_001',
        role: DealerRole.dealerAdmin,
        phoneNumber: null,
      );
    }

    final response = await http.get(
      Uri.parse('$baseUrl/rest/v1/user_profiles?id=eq.$userID'),
      headers: _headers(token),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body) as List;
      if (data.isNotEmpty) {
        return UserProfile.fromJson(data[0]);
      }
    }
    throw Exception('Failed to fetch user profile');
  }

  Future<DashboardMetrics> fetchDashboard(String token) async {
    if (useDemoMode) {
      return DashboardMetrics(
        totalLeads: 142,
        activeLeads: 38,
        completedBookings: 85,
        pendingBookings: 12,
        unreadMessages: 7,
        conversionRate: 0.68,
        averageResponseTime: 2.5,
        dailyMetrics: [
          DailyMetric(
            date: DateTime.now().subtract(Duration(days: 6)),
            leadsGenerated: 15,
            bookingsCreated: 3,
            messagesCount: 24,
          ),
          DailyMetric(
            date: DateTime.now().subtract(Duration(days: 5)),
            leadsGenerated: 18,
            bookingsCreated: 4,
            messagesCount: 31,
          ),
          DailyMetric(
            date: DateTime.now().subtract(Duration(days: 4)),
            leadsGenerated: 12,
            bookingsCreated: 2,
            messagesCount: 19,
          ),
          DailyMetric(
            date: DateTime.now().subtract(Duration(days: 3)),
            leadsGenerated: 22,
            bookingsCreated: 5,
            messagesCount: 28,
          ),
          DailyMetric(
            date: DateTime.now().subtract(Duration(days: 2)),
            leadsGenerated: 16,
            bookingsCreated: 3,
            messagesCount: 25,
          ),
          DailyMetric(
            date: DateTime.now().subtract(Duration(days: 1)),
            leadsGenerated: 19,
            bookingsCreated: 4,
            messagesCount: 22,
          ),
          DailyMetric(
            date: DateTime.now(),
            leadsGenerated: 18,
            bookingsCreated: 3,
            messagesCount: 20,
          ),
        ],
      );
    }

    final response = await http.get(
      Uri.parse('$baseUrl/rest/v1/rpc/get_dashboard_metrics'),
      headers: _headers(token),
    );

    if (response.statusCode == 200) {
      return DashboardMetrics.fromJson(jsonDecode(response.body));
    }
    throw Exception('Failed to fetch dashboard');
  }

  Future<List<Conversation>> fetchConversations(String token) async {
    if (useDemoMode) {
      return [
        Conversation(
          id: 'conv_001',
          leadID: 'lead_001',
          leadName: 'John Smith',
          createdAt: DateTime.now().subtract(Duration(days: 3)),
          lastMessageAt: DateTime.now().subtract(Duration(hours: 2)),
          lastMessage: 'Interested in the new model',
          unreadCount: 2,
        ),
        Conversation(
          id: 'conv_002',
          leadID: 'lead_002',
          leadName: 'Sarah Johnson',
          createdAt: DateTime.now().subtract(Duration(days: 5)),
          lastMessageAt: DateTime.now().subtract(Duration(hours: 5)),
          lastMessage: 'When can we schedule a test drive?',
          unreadCount: 0,
        ),
        Conversation(
          id: 'conv_003',
          leadID: 'lead_003',
          leadName: 'Mike Williams',
          createdAt: DateTime.now().subtract(Duration(days: 1)),
          lastMessageAt: DateTime.now(),
          lastMessage: 'Let me check with my wife',
          unreadCount: 5,
        ),
      ];
    }

    final response = await http.get(
      Uri.parse('$baseUrl/rest/v1/conversations'),
      headers: _headers(token),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body) as List;
      return data.map((json) => Conversation.fromJson(json)).toList();
    }
    throw Exception('Failed to fetch conversations');
  }

  Future<List<Message>> fetchMessages(
    String conversationID,
    String token,
  ) async {
    if (useDemoMode) {
      return [];
    }

    final response = await http.get(
      Uri.parse(
        '$baseUrl/rest/v1/messages?conversation_id=eq.$conversationID&order=created_at.asc',
      ),
      headers: _headers(token),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body) as List;
      return data.map((json) => Message.fromJson(json)).toList();
    }
    throw Exception('Failed to fetch messages');
  }

  Future<void> sendMessage(
    String conversationID,
    String leadID,
    String content,
    String token,
  ) async {
    if (useDemoMode) {
      return;
    }

    final body = {
      'conversation_id': conversationID,
      'lead_id': leadID,
      'content': content,
    };

    final response = await http.post(
      Uri.parse('$baseUrl/rest/v1/messages'),
      headers: _headers(token),
      body: jsonEncode(body),
    );

    if (response.statusCode != 201) {
      throw Exception('Failed to send message');
    }
  }

  Future<List<Lead>> fetchLeads(
    String? filterStatus,
    String token,
  ) async {
    if (useDemoMode) {
      return [
        Lead(
          id: 'lead_001',
          name: 'John Smith',
          email: 'john.smith@email.com',
          phone: '555-123-4567',
          status: LeadStatus.interested,
          createdAt: DateTime.now().subtract(Duration(days: 3)),
          updatedAt: DateTime.now().subtract(Duration(hours: 12)),
          assignedToID: 'user_001',
          assignedToName: 'Jane Sales Rep',
          notes: 'Interested in premium package',
        ),
        Lead(
          id: 'lead_002',
          name: 'Sarah Johnson',
          email: 'sarah.j@email.com',
          phone: '555-234-5678',
          status: LeadStatus.qualified,
          createdAt: DateTime.now().subtract(Duration(days: 5)),
          updatedAt: DateTime.now(),
          assignedToID: 'user_001',
          assignedToName: 'Jane Sales Rep',
          notes: 'Ready for test drive',
        ),
        Lead(
          id: 'lead_003',
          name: 'Mike Williams',
          email: 'mike.w@email.com',
          phone: '555-345-6789',
          status: LeadStatus.contacted,
          createdAt: DateTime.now().subtract(Duration(days: 1)),
          updatedAt: DateTime.now().subtract(Duration(hours: 6)),
          notes: 'First contact made',
        ),
      ];
    }

    var url = '$baseUrl/rest/v1/leads';
    if (filterStatus != null) {
      url += '?status=eq.$filterStatus';
    }

    final response = await http.get(
      Uri.parse(url),
      headers: _headers(token),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body) as List;
      return data.map((json) => Lead.fromJson(json)).toList();
    }
    throw Exception('Failed to fetch leads');
  }

  Future<List<Booking>> fetchBookings(String token) async {
    if (useDemoMode) {
      return [
        Booking(
          id: 'book_001',
          leadID: 'lead_001',
          leadName: 'John Smith',
          scheduledFor: DateTime.now().add(Duration(days: 2)),
          status: BookingStatus.confirmed,
          createdAt: DateTime.now(),
          notes: 'Test drive at 2 PM',
        ),
        Booking(
          id: 'book_002',
          leadID: 'lead_002',
          leadName: 'Sarah Johnson',
          scheduledFor: DateTime.now().add(Duration(days: 5)),
          status: BookingStatus.pending,
          createdAt: DateTime.now().subtract(Duration(days: 1)),
          notes: 'Waiting for confirmation',
        ),
      ];
    }

    final response = await http.get(
      Uri.parse('$baseUrl/rest/v1/bookings'),
      headers: _headers(token),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body) as List;
      return data.map((json) => Booking.fromJson(json)).toList();
    }
    throw Exception('Failed to fetch bookings');
  }

  Future<void> createBooking(
    NewBookingRequest request,
    String token,
  ) async {
    if (useDemoMode) {
      return;
    }

    final response = await http.post(
      Uri.parse('$baseUrl/rest/v1/bookings'),
      headers: _headers(token),
      body: jsonEncode(request.toJson()),
    );

    if (response.statusCode != 201) {
      throw Exception('Failed to create booking');
    }
  }

  Future<DealerSettings> fetchDealerSettings(
    String dealerID,
    String token,
  ) async {
    if (useDemoMode) {
      return DealerSettings(
        businessHours: {
          'mon': BusinessHours(open: '09:00', close: '18:00'),
          'tue': BusinessHours(open: '09:00', close: '18:00'),
          'wed': BusinessHours(open: '09:00', close: '18:00'),
          'thu': BusinessHours(open: '09:00', close: '18:00'),
          'fri': BusinessHours(open: '09:00', close: '18:00'),
          'sat': BusinessHours(open: '10:00', close: '16:00'),
        },
        faqs: [
          FAQ(
            id: 'faq_001',
            question: 'What is the warranty period?',
            answer: '3 years or 36,000 miles, whichever comes first',
          ),
          FAQ(
            id: 'faq_002',
            question: 'Do you offer financing?',
            answer: 'Yes, we offer flexible financing options through multiple lenders',
          ),
        ],
        marketingCanViewMessages: true,
        allowAdminFullPhone: true,
      );
    }

    final response = await http.get(
      Uri.parse('$baseUrl/rest/v1/dealer_settings?dealer_id=eq.$dealerID'),
      headers: _headers(token),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body) as List;
      if (data.isNotEmpty) {
        return DealerSettings.fromJson(data[0]);
      }
    }
    throw Exception('Failed to fetch settings');
  }

  Future<void> registerDeviceToken(
    String token,
    String userID,
    String accessToken,
  ) async {
    if (useDemoMode) {
      return;
    }

    final body = {
      'user_id': userID,
      'device_token': token,
    };

    await http.post(
      Uri.parse('$baseUrl/rest/v1/device_tokens'),
      headers: _headers(accessToken),
      body: jsonEncode(body),
    );
  }
}
