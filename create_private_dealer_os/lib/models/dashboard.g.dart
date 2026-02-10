// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'dashboard.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$DashboardMetricsImpl _$$DashboardMetricsImplFromJson(
  Map<String, dynamic> json,
) => _$DashboardMetricsImpl(
  totalLeads: (json['totalLeads'] as num).toInt(),
  activeLeads: (json['activeLeads'] as num).toInt(),
  completedBookings: (json['completedBookings'] as num).toInt(),
  pendingBookings: (json['pendingBookings'] as num).toInt(),
  unreadMessages: (json['unreadMessages'] as num).toInt(),
  conversionRate: (json['conversionRate'] as num).toDouble(),
  averageResponseTime: (json['averageResponseTime'] as num).toDouble(),
  dailyMetrics: (json['dailyMetrics'] as List<dynamic>)
      .map((e) => DailyMetric.fromJson(e as Map<String, dynamic>))
      .toList(),
);

Map<String, dynamic> _$$DashboardMetricsImplToJson(
  _$DashboardMetricsImpl instance,
) => <String, dynamic>{
  'totalLeads': instance.totalLeads,
  'activeLeads': instance.activeLeads,
  'completedBookings': instance.completedBookings,
  'pendingBookings': instance.pendingBookings,
  'unreadMessages': instance.unreadMessages,
  'conversionRate': instance.conversionRate,
  'averageResponseTime': instance.averageResponseTime,
  'dailyMetrics': instance.dailyMetrics,
};

_$DailyMetricImpl _$$DailyMetricImplFromJson(Map<String, dynamic> json) =>
    _$DailyMetricImpl(
      date: DateTime.parse(json['date'] as String),
      leadsGenerated: (json['leadsGenerated'] as num).toInt(),
      bookingsCreated: (json['bookingsCreated'] as num).toInt(),
      messagesCount: (json['messagesCount'] as num).toInt(),
    );

Map<String, dynamic> _$$DailyMetricImplToJson(_$DailyMetricImpl instance) =>
    <String, dynamic>{
      'date': instance.date.toIso8601String(),
      'leadsGenerated': instance.leadsGenerated,
      'bookingsCreated': instance.bookingsCreated,
      'messagesCount': instance.messagesCount,
    };

_$AnalyticsSnapshotImpl _$$AnalyticsSnapshotImplFromJson(
  Map<String, dynamic> json,
) => _$AnalyticsSnapshotImpl(
  timestamp: DateTime.parse(json['timestamp'] as String),
  metrics: json['metrics'] as Map<String, dynamic>,
);

Map<String, dynamic> _$$AnalyticsSnapshotImplToJson(
  _$AnalyticsSnapshotImpl instance,
) => <String, dynamic>{
  'timestamp': instance.timestamp.toIso8601String(),
  'metrics': instance.metrics,
};
