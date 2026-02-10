import 'dart:async';

import 'package:collection/collection.dart';

import '../../core/config/app_config.dart';
import '../../core/errors/app_exception.dart';
import '../../core/utils/date_utils.dart';
import '../../domain/models/analytics_snapshot.dart';
import '../../domain/models/booking.dart';
import '../../domain/models/conversation.dart';
import '../../domain/models/dashboard_metrics.dart';
import '../../domain/models/dealer_role.dart';
import '../../domain/models/followup_item.dart';
import '../../domain/models/lead.dart';
import '../../domain/models/settings.dart';
import '../../domain/models/user_profile.dart';
import 'http_client.dart';
import 'remote_data_service.dart';

class SupabaseRemoteDataService implements RemoteDataService {
  SupabaseRemoteDataService({required AppConfig config, required HttpClient client})
      : _config = config,
        _client = client;

  final AppConfig _config;
  final HttpClient _client;

  @override
  Future<UserProfile> fetchUserProfile({
    required String userId,
    required String token,
  }) async {
    final List<UserProfile> rows = await _fetchRows<UserProfile>(
      table: 'users',
      token: token,
      query: <String, List<String>>{
        'select': <String>['id,dealer_id,name,email,role,is_active,last_login_at'],
        'id': <String>['eq.$userId'],
        'limit': <String>['1'],
      },
      parser: UserProfile.fromJson,
    );

    if (rows.isEmpty) {
      throw AppException.unauthorized();
    }

    return rows.first;
  }

  @override
  Future<DealerSettings> fetchDealerSettings({
    required String dealerId,
    required String token,
  }) async {
    final List<Map<String, dynamic>> rows = await _fetchRows<Map<String, dynamic>>(
      table: 'dealers',
      token: token,
      query: <String, List<String>>{
        'select': <String>['business_hours,ai_config'],
        'id': <String>['eq.$dealerId'],
        'limit': <String>['1'],
      },
      parser: (Map<String, dynamic> row) => row,
    );

    if (rows.isEmpty) {
      return DealerSettings.defaults(
        marketingViewDefault: _config.marketingCanViewMessagesDefault,
      );
    }

    final Map<String, dynamic> row = rows.first;
    final Map<String, dynamic>? aiConfig =
        row['ai_config'] as Map<String, dynamic>?;

    return DealerSettings(
      businessHours: _parseBusinessHours(
        row['business_hours'] as Map<String, dynamic>?,
      ),
      faqs: ((aiConfig?['faqs'] as List<dynamic>?) ?? <dynamic>[])
          .map((dynamic item) => item.toString())
          .toList(),
      marketingCanViewMessages:
          (aiConfig?['marketing_view_messages'] as bool?) ??
              _config.marketingCanViewMessagesDefault,
      allowAdminFullPhone:
          (aiConfig?['allow_admin_full_phone'] as bool?) ?? false,
    );
  }

  @override
  Future<void> updateDealerSettings({
    required String dealerId,
    required DealerSettings settings,
    required String token,
  }) async {
    final List<Map<String, dynamic>> existing =
        await _fetchRows<Map<String, dynamic>>(
      table: 'dealers',
      token: token,
      query: <String, List<String>>{
        'select': <String>['ai_config'],
        'id': <String>['eq.$dealerId'],
        'limit': <String>['1'],
      },
      parser: (Map<String, dynamic> row) => row,
    );

    final Map<String, dynamic> aiConfig =
        ((existing.firstOrNull?['ai_config'] as Map<String, dynamic>?) ??
                <String, dynamic>{})
            .map((String key, dynamic value) => MapEntry<String, dynamic>(key, value));

    aiConfig['faqs'] = settings.faqs;
    aiConfig['marketing_view_messages'] = settings.marketingCanViewMessages;
    aiConfig['allow_admin_full_phone'] = settings.allowAdminFullPhone;

    final Map<String, dynamic> payload = <String, dynamic>{
      'business_hours': settings.businessHours
          .map((String k, BusinessHoursDay v) => MapEntry<String, dynamic>(k, v.toJson())),
      'ai_config': aiConfig,
    };

    await _client.patchEmpty(
      uri: _postgrestUri(
        table: 'dealers',
        query: <String, List<String>>{'id': <String>['eq.$dealerId']},
      ),
      headers: _postgrestHeaders(token: token, prefer: 'return=minimal'),
      body: payload,
    );
  }

  @override
  Future<DashboardMetrics> fetchDashboardMetrics({
    required UserProfile user,
    required int missedLeadMinutes,
    required String token,
  }) async {
    final DateTime now = DateTime.now().toUtc();
    final DateTime todayStart = now.startOfUtcDay();
    final DateTime weekStart = now.startOfUtcWeek();
    final DateTime weekEnd = weekStart.add(const Duration(days: 7));
    final DateTime sevenDaysAgo = now.subtract(const Duration(days: 7));

    final Future<List<Lead>> leadsTodayFuture = _fetchRows<Lead>(
      table: 'leads',
      token: token,
      query: <String, List<String>>{
        'select': <String>[_leadSelect],
        'dealer_id': <String>['eq.${user.dealerId}'],
        'first_contact_at': <String>['gte.${todayStart.toServerIso()}'],
      },
      parser: Lead.fromJson,
    );

    final Future<List<ResponseMetricRow>> responseFuture =
        _fetchRows<ResponseMetricRow>(
      table: 'response_metrics',
      token: token,
      query: <String, List<String>>{
        'select': <String>['response_seconds,first_inbound_at,first_response_at'],
        'dealer_id': <String>['eq.${user.dealerId}'],
        'first_inbound_at': <String>['gte.${sevenDaysAgo.toServerIso()}'],
      },
      parser: ResponseMetricRow.fromJson,
    );

    final Future<List<Booking>> bookingsFuture = _fetchRows<Booking>(
      table: 'bookings',
      token: token,
      query: <String, List<String>>{
        'select': <String>[_bookingSelect],
        'dealer_id': <String>['eq.${user.dealerId}'],
        'scheduled_for': <String>[
          'gte.${weekStart.toServerIso()}',
          'lt.${weekEnd.toServerIso()}',
        ],
      },
      parser: Booking.fromJson,
    );

    Future<List<Lead>> assignedFuture = Future<List<Lead>>.value(<Lead>[]);
    if (user.role == DealerRole.dealerSales) {
      assignedFuture = _fetchRows<Lead>(
        table: 'leads',
        token: token,
        query: <String, List<String>>{
          'select': <String>[_leadSelect],
          'dealer_id': <String>['eq.${user.dealerId}'],
          'assigned_user_id': <String>['eq.${user.id}'],
          'status': <String>['not.in.(sold,lost)'],
          'order': <String>['last_activity_at.desc'],
          'limit': <String>['20'],
        },
        parser: Lead.fromJson,
      );
    }

    final List<dynamic> values = await Future.wait<dynamic>(<Future<dynamic>>[
      leadsTodayFuture,
      responseFuture,
      bookingsFuture,
      assignedFuture,
    ]);

    final List<Lead> leadsToday = values[0] as List<Lead>;
    final List<ResponseMetricRow> responseRows = values[1] as List<ResponseMetricRow>;
    final List<Booking> bookings = values[2] as List<Booking>;
    final List<Lead> assignedLeads = values[3] as List<Lead>;

    final int threshold = missedLeadMinutes * 60;
    final int missed =
        responseRows.where((ResponseMetricRow row) => row.responseSeconds > threshold).length;

    final double average = responseRows.isEmpty
        ? 0
        : responseRows.map((ResponseMetricRow row) => row.responseSeconds).reduce((int a, int b) => a + b) /
            responseRows.length;

    return DashboardMetrics(
      newLeadsToday: leadsToday.length,
      avgResponseSeconds7d: average,
      bookingsThisWeek: bookings.length,
      missedLeads: missed,
      assignedLeads: assignedLeads,
    );
  }

  @override
  Future<List<Conversation>> fetchConversations({
    required String dealerId,
    required String token,
  }) async {
    final List<Conversation> conversations = await _fetchRows<Conversation>(
      table: 'conversations',
      token: token,
      query: <String, List<String>>{
        'select': <String>['id,dealer_id,lead_id,channel,is_open,last_message_at,created_at'],
        'dealer_id': <String>['eq.$dealerId'],
        'order': <String>['last_message_at.desc'],
        'limit': <String>['50'],
      },
      parser: Conversation.fromJson,
    );

    if (conversations.isEmpty) {
      return <Conversation>[];
    }

    final List<String> leadIds =
        conversations.map((Conversation c) => c.leadId).toSet().toList();
    final List<String> conversationIds =
        conversations.map((Conversation c) => c.id).toList();

    final Future<List<Lead>> leadsFuture = _fetchRows<Lead>(
      table: 'leads',
      token: token,
      query: <String, List<String>>{
        'select': <String>[_leadSelect],
        'id': <String>[_inFilter(leadIds)],
      },
      parser: Lead.fromJson,
    );

    final Future<List<Message>> lastMessagesFuture = _fetchRows<Message>(
      table: 'messages',
      token: token,
      query: <String, List<String>>{
        'select': <String>[ _messageSelect],
        'conversation_id': <String>[_inFilter(conversationIds)],
        'order': <String>['created_at.desc'],
        'limit': <String>['500'],
      },
      parser: Message.fromJson,
    );

    final List<dynamic> data = await Future.wait<dynamic>(
      <Future<dynamic>>[leadsFuture, lastMessagesFuture],
    );

    final Map<String, Lead> leadById = {
      for (final Lead lead in data[0] as List<Lead>) lead.id: lead,
    };

    final Map<String, Message> latestByConversation = <String, Message>{};
    for (final Message message in data[1] as List<Message>) {
      latestByConversation.putIfAbsent(message.conversationId, () => message);
    }

    return conversations.map((Conversation conversation) {
      return conversation.copyWith(
        lead: leadById[conversation.leadId],
        lastMessagePreview: latestByConversation[conversation.id]?.content,
      );
    }).toList();
  }

  @override
  Future<List<Message>> fetchMessages({
    required String conversationId,
    required String dealerId,
    required String token,
  }) async {
    return _fetchRows<Message>(
      table: 'messages',
      token: token,
      query: <String, List<String>>{
        'select': <String>[_messageSelect],
        'dealer_id': <String>['eq.$dealerId'],
        'conversation_id': <String>['eq.$conversationId'],
        'order': <String>['created_at.asc'],
        'limit': <String>['200'],
      },
      parser: Message.fromJson,
    );
  }

  @override
  Future<void> sendMessage({
    required String conversationId,
    required String leadId,
    required String content,
    required String token,
  }) async {
    await _client.postEmpty(
      uri: _backendUri('api/send-message'),
      headers: _backendHeaders(token: token),
      body: <String, dynamic>{
        'conversationId': conversationId,
        'leadId': leadId,
        'content': content,
      },
    );
  }

  @override
  Future<void> handoff({
    required String conversationId,
    required String leadId,
    required String reason,
    required String token,
  }) async {
    await _client.postEmpty(
      uri: _backendUri('api/handoff'),
      headers: _backendHeaders(token: token),
      body: <String, dynamic>{
        'conversationId': conversationId,
        'leadId': leadId,
        'reason': reason,
      },
    );
  }

  @override
  Future<List<Lead>> fetchLeads({
    required String dealerId,
    required LeadFilter filter,
    required String token,
  }) async {
    final Map<String, List<String>> query = <String, List<String>>{
      'select': <String>[_leadSelect],
      'dealer_id': <String>['eq.$dealerId'],
      'order': <String>['last_activity_at.desc'],
    };

    if (filter.status != null) {
      query['status'] = <String>['eq.${filter.status!.value}'];
    }

    if (filter.source != null) {
      query['source'] = <String>['eq.${filter.source!.value}'];
    }

    if (filter.assignedUserId != null && filter.assignedUserId!.isNotEmpty) {
      query['assigned_user_id'] = <String>['eq.${filter.assignedUserId}'];
    }

    return _fetchRows<Lead>(
      table: 'leads',
      token: token,
      query: query,
      parser: Lead.fromJson,
    );
  }

  @override
  Future<void> updateLeadStatus({
    required String leadId,
    required String dealerId,
    required LeadStatus status,
    required String token,
  }) async {
    await _client.patchEmpty(
      uri: _postgrestUri(
        table: 'leads',
        query: <String, List<String>>{
          'id': <String>['eq.$leadId'],
          'dealer_id': <String>['eq.$dealerId'],
        },
      ),
      headers: _postgrestHeaders(token: token, prefer: 'return=minimal'),
      body: <String, dynamic>{'status': status.value},
    );
  }

  @override
  Future<void> assignLead({
    required String leadId,
    required String dealerId,
    required String userId,
    required String token,
  }) async {
    await _client.patchEmpty(
      uri: _postgrestUri(
        table: 'leads',
        query: <String, List<String>>{
          'id': <String>['eq.$leadId'],
          'dealer_id': <String>['eq.$dealerId'],
        },
      ),
      headers: _postgrestHeaders(token: token, prefer: 'return=minimal'),
      body: <String, dynamic>{'assigned_user_id': userId},
    );
  }

  @override
  Future<List<FollowupItem>> fetchFollowups({
    required String leadId,
    required String dealerId,
    required String token,
  }) async {
    return _fetchRows<FollowupItem>(
      table: 'followups',
      token: token,
      query: <String, List<String>>{
        'select': <String>[
          'id,dealer_id,lead_id,type,sent_via,sent_at,responded,response_at,created_at',
        ],
        'dealer_id': <String>['eq.$dealerId'],
        'lead_id': <String>['eq.$leadId'],
        'order': <String>['created_at.desc'],
      },
      parser: FollowupItem.fromJson,
    );
  }

  @override
  Future<List<Booking>> fetchBookings({
    required String dealerId,
    required String token,
  }) async {
    final List<Booking> bookings = await _fetchRows<Booking>(
      table: 'bookings',
      token: token,
      query: <String, List<String>>{
        'select': <String>[_bookingSelect],
        'dealer_id': <String>['eq.$dealerId'],
        'order': <String>['scheduled_for.asc'],
        'limit': <String>['200'],
      },
      parser: Booking.fromJson,
    );

    final List<String> leadIds =
        bookings.map((Booking booking) => booking.leadId).toSet().toList();

    if (leadIds.isEmpty) {
      return bookings;
    }

    final List<Lead> leads = await _fetchRows<Lead>(
      table: 'leads',
      token: token,
      query: <String, List<String>>{
        'select': <String>[_leadSelect],
        'id': <String>[_inFilter(leadIds)],
      },
      parser: Lead.fromJson,
    );

    final Map<String, Lead> leadById = <String, Lead>{
      for (final Lead lead in leads) lead.id: lead,
    };

    return bookings
        .map((Booking booking) => booking.copyWith(lead: leadById[booking.leadId]))
        .toList();
  }

  @override
  Future<void> createBooking({
    required NewBookingRequest request,
    required String token,
  }) async {
    await _client.postEmpty(
      uri: _postgrestUri(table: 'bookings'),
      headers: _postgrestHeaders(token: token, prefer: 'return=minimal'),
      body: <Map<String, dynamic>>[request.toJson()],
    );
  }

  @override
  Future<void> updateBookingStatus({
    required String bookingId,
    required String dealerId,
    required BookingStatus status,
    required String token,
  }) async {
    await _client.patchEmpty(
      uri: _postgrestUri(
        table: 'bookings',
        query: <String, List<String>>{
          'id': <String>['eq.$bookingId'],
          'dealer_id': <String>['eq.$dealerId'],
        },
      ),
      headers: _postgrestHeaders(token: token, prefer: 'return=minimal'),
      body: <String, dynamic>{'status': status.value},
    );
  }

  @override
  Future<List<TeamMember>> fetchTeamMembers({
    required String dealerId,
    required String token,
  }) async {
    return _fetchRows<TeamMember>(
      table: 'users',
      token: token,
      query: <String, List<String>>{
        'select': <String>['id,dealer_id,name,email,role,is_active,created_at'],
        'dealer_id': <String>['eq.$dealerId'],
        'order': <String>['created_at.desc'],
      },
      parser: TeamMember.fromJson,
    );
  }

  @override
  Future<void> inviteUser({
    required InviteUserRequest request,
    required String token,
  }) async {
    await _client.postEmpty(
      uri: _backendUri('api/invite-user'),
      headers: _backendHeaders(token: token),
      body: request.toJson(),
    );
  }

  @override
  Future<void> disableUser({
    required String userId,
    required String dealerId,
    required String token,
  }) async {
    await _client.patchEmpty(
      uri: _postgrestUri(
        table: 'users',
        query: <String, List<String>>{
          'id': <String>['eq.$userId'],
          'dealer_id': <String>['eq.$dealerId'],
        },
      ),
      headers: _postgrestHeaders(token: token, prefer: 'return=minimal'),
      body: <String, dynamic>{'is_active': false},
    );
  }

  @override
  Future<AnalyticsSnapshot> fetchAnalytics({
    required String dealerId,
    required String token,
  }) async {
    final DateTime now = DateTime.now().toUtc();
    final DateTime thirtyDaysAgo = now.subtract(const Duration(days: 30));
    final DateTime sevenDaysAgo = now.subtract(const Duration(days: 7));

    final Future<List<ResponseMetricRow>> responsesFuture =
        _fetchRows<ResponseMetricRow>(
      table: 'response_metrics',
      token: token,
      query: <String, List<String>>{
        'select': <String>['response_seconds,first_inbound_at,first_response_at'],
        'dealer_id': <String>['eq.$dealerId'],
        'first_inbound_at': <String>['gte.${thirtyDaysAgo.toServerIso()}'],
      },
      parser: ResponseMetricRow.fromJson,
    );

    final Future<List<Lead>> leadsFuture = _fetchRows<Lead>(
      table: 'leads',
      token: token,
      query: <String, List<String>>{
        'select': <String>[_leadSelect],
        'dealer_id': <String>['eq.$dealerId'],
        'created_at': <String>['gte.${thirtyDaysAgo.toServerIso()}'],
      },
      parser: Lead.fromJson,
    );

    final Future<List<Booking>> bookingsFuture = _fetchRows<Booking>(
      table: 'bookings',
      token: token,
      query: <String, List<String>>{
        'select': <String>[_bookingSelect],
        'dealer_id': <String>['eq.$dealerId'],
        'created_at': <String>['gte.${thirtyDaysAgo.toServerIso()}'],
      },
      parser: Booking.fromJson,
    );

    final Future<List<Map<String, dynamic>>> investorFuture =
        _fetchRows<Map<String, dynamic>>(
      table: 'investor_metrics_30d',
      token: token,
      query: <String, List<String>>{
        'select': <String>['dealer_id,pct_after_hours_leads_saved'],
        'dealer_id': <String>['eq.$dealerId'],
        'limit': <String>['1'],
      },
      parser: (Map<String, dynamic> row) => row,
    );

    final List<dynamic> values = await Future.wait<dynamic>(<Future<dynamic>>[
      responsesFuture,
      leadsFuture,
      bookingsFuture,
      investorFuture,
    ]);

    final List<ResponseMetricRow> responses = values[0] as List<ResponseMetricRow>;
    final List<Lead> leads = values[1] as List<Lead>;
    final List<Booking> bookings = values[2] as List<Booking>;
    final List<Map<String, dynamic>> investor = values[3] as List<Map<String, dynamic>>;

    final List<ResponseTrendPoint> trend7d = _groupResponseMetrics(
      responses.where((ResponseMetricRow row) => row.firstInboundAt.isAfter(sevenDaysAgo)).toList(),
    );

    final List<ResponseTrendPoint> trend30d = _groupResponseMetrics(responses);

    final List<SourceBreakdown> sourceBreakdown = LeadSource.values
        .map((LeadSource source) => SourceBreakdown(
              source: source,
              count: leads.where((Lead lead) => lead.source == source).length,
            ))
        .toList();

    final double afterHours =
        ((investor.firstOrNull?['pct_after_hours_leads_saved'] as num?) ?? 0).toDouble();

    return AnalyticsSnapshot(
      responseTrend7d: trend7d,
      responseTrend30d: trend30d,
      sourceBreakdown: sourceBreakdown,
      bookingsCount: bookings.length,
      afterHoursHandledPercent: afterHours,
    );
  }

  @override
  Future<void> registerDeviceToken({
    required String deviceToken,
    required String token,
  }) async {
    try {
      await _client.postEmpty(
        uri: _backendUri('api/device-token'),
        headers: _backendHeaders(token: token),
        body: <String, dynamic>{'deviceToken': deviceToken, 'platform': 'ios'},
      );
    } catch (_) {
      // Keep push registration non-blocking.
    }
  }

  Future<List<T>> _fetchRows<T>({
    required String table,
    required String token,
    required Map<String, List<String>> query,
    required T Function(Map<String, dynamic> row) parser,
  }) async {
    final dynamic data = await _client.getJson(
      uri: _postgrestUri(table: table, query: query),
      headers: _postgrestHeaders(token: token),
    );

    if (data == null) {
      return <T>[];
    }

    final List<dynamic> list = data as List<dynamic>;
    return list
        .map((dynamic row) => parser(row as Map<String, dynamic>))
        .toList();
  }

  Uri _postgrestUri({
    required String table,
    Map<String, List<String>> query = const <String, List<String>>{},
  }) {
    final String base = '${_config.supabaseUrl}/rest/v1/$table';
    if (query.isEmpty) {
      return Uri.parse(base);
    }

    final List<String> pairs = <String>[];
    query.forEach((String key, List<String> values) {
      for (final String value in values) {
        pairs.add(
          '${Uri.encodeQueryComponent(key)}=${Uri.encodeQueryComponent(value)}',
        );
      }
    });

    return Uri.parse('$base?${pairs.join('&')}');
  }

  Uri _backendUri(String path) {
    final String normalizedPath = path.startsWith('/') ? path.substring(1) : path;
    return Uri.parse('${_config.backendBaseUrl}/$normalizedPath');
  }

  Map<String, String> _postgrestHeaders({
    required String token,
    String? prefer,
  }) {
    return <String, String>{
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'apikey': _config.supabaseAnonKey,
      'Authorization': 'Bearer $token',
      if (prefer != null) 'Prefer': prefer,
    };
  }

  Map<String, String> _backendHeaders({required String token}) {
    return <String, String>{
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer $token',
    };
  }

  Map<String, BusinessHoursDay> _parseBusinessHours(Map<String, dynamic>? raw) {
    if (raw == null || raw.isEmpty) {
      return DealerSettings.defaults(
        marketingViewDefault: _config.marketingCanViewMessagesDefault,
      ).businessHours;
    }

    return raw.map((String key, dynamic value) {
      final Map<String, dynamic> json =
          (value as Map<String, dynamic>?) ?? <String, dynamic>{};
      return MapEntry<String, BusinessHoursDay>(key, BusinessHoursDay.fromJson(json));
    });
  }

  String _inFilter(List<String> ids) {
    final String joined = ids.join(',');
    return 'in.($joined)';
  }

  List<ResponseTrendPoint> _groupResponseMetrics(List<ResponseMetricRow> rows) {
    if (rows.isEmpty) {
      return <ResponseTrendPoint>[];
    }

    final Map<DateTime, List<ResponseMetricRow>> grouped =
        <DateTime, List<ResponseMetricRow>>{};

    for (final ResponseMetricRow row in rows) {
      final DateTime day = row.firstInboundAt.startOfUtcDay();
      grouped.putIfAbsent(day, () => <ResponseMetricRow>[]).add(row);
    }

    final List<ResponseTrendPoint> points = grouped.entries.map((MapEntry<DateTime, List<ResponseMetricRow>> entry) {
      final double average = entry.value
              .map((ResponseMetricRow row) => row.responseSeconds)
              .reduce((int a, int b) => a + b) /
          entry.value.length;
      return ResponseTrendPoint(date: entry.key, avgSeconds: average);
    }).toList();

    points.sort((ResponseTrendPoint a, ResponseTrendPoint b) => a.date.compareTo(b.date));
    return points;
  }
}

class ResponseMetricRow {
  const ResponseMetricRow({
    required this.responseSeconds,
    required this.firstInboundAt,
    required this.firstResponseAt,
  });

  final int responseSeconds;
  final DateTime firstInboundAt;
  final DateTime firstResponseAt;

  factory ResponseMetricRow.fromJson(Map<String, dynamic> json) {
    final DateTime firstInboundAt =
        DateTime.parse(json['first_inbound_at'] as String).toUtc();
    final String? firstResponseRaw = json['first_response_at'] as String?;

    return ResponseMetricRow(
      responseSeconds: (json['response_seconds'] as num?)?.toInt() ?? 0,
      firstInboundAt: firstInboundAt,
      firstResponseAt: firstResponseRaw == null
          ? firstInboundAt
          : DateTime.parse(firstResponseRaw).toUtc(),
    );
  }
}

const String _leadSelect =
    'id,dealer_id,source,first_contact_at,name,phone,vehicle_interest,budget_range,status,assigned_user_id,last_activity_at,created_at';

const String _bookingSelect =
    'id,dealer_id,lead_id,type,requested_at,scheduled_for,status,created_by,created_at';

const String _messageSelect =
    'id,dealer_id,conversation_id,lead_id,direction,sender_type,sender_user_id,content,message_type,provider_message_id,created_at';
