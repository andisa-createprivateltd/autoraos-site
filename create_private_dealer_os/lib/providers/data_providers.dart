import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/dashboard.dart';
import '../models/lead.dart';
import '../models/booking.dart';
import '../models/conversation.dart';
import '../models/settings.dart';
import 'app_providers.dart';
import 'service_providers.dart';

// Dashboard provider
final dashboardProvider = FutureProvider<DashboardMetrics>((ref) async {
  final session = ref.watch(appSessionProvider);
  if (session == null) throw Exception('Not authenticated');

  final repository = ref.watch(dealerOSRepositoryProvider);
  return repository.fetchDashboard(session);
});

// Leads provider
final leadsProvider = FutureProvider<List<Lead>>((ref) async {
  final session = ref.watch(appSessionProvider);
  if (session == null) throw Exception('Not authenticated');

  final repository = ref.watch(dealerOSRepositoryProvider);
  return repository.fetchLeads(const LeadFilter(), session);
});

// Bookings provider
final bookingsProvider = FutureProvider<List<Booking>>((ref) async {
  final session = ref.watch(appSessionProvider);
  if (session == null) throw Exception('Not authenticated');

  final repository = ref.watch(dealerOSRepositoryProvider);
  return repository.fetchBookings(session);
});

// Conversations provider
final conversationsProvider = FutureProvider<List<Conversation>>((ref) async {
  final session = ref.watch(appSessionProvider);
  if (session == null) throw Exception('Not authenticated');

  final repository = ref.watch(dealerOSRepositoryProvider);
  return repository.fetchConversations(session);
});

// Messages provider (takes conversation ID as parameter)
final messagesProvider = FutureProvider.family<List<Message>, String>((ref, conversationId) async {
  final session = ref.watch(appSessionProvider);
  if (session == null) throw Exception('Not authenticated');

  final repository = ref.watch(dealerOSRepositoryProvider);
  return repository.fetchMessages(conversationId, session);
});

// Dealer settings provider
final dealerSettingsProvider = FutureProvider<DealerSettings>((ref) async {
  final session = ref.watch(appSessionProvider);
  if (session == null) throw Exception('Not authenticated');

  final repository = ref.watch(dealerOSRepositoryProvider);
  return repository.fetchDealerSettings(session);
});
