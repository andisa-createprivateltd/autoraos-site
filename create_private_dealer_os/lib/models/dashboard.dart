import 'package:freezed_annotation/freezed_annotation.dart';

part 'dashboard.freezed.dart';
part 'dashboard.g.dart';

@freezed
class DashboardMetrics with _$DashboardMetrics {
  const factory DashboardMetrics({
    required int totalLeads,
    required int activeLeads,
    required int completedBookings,
    required int pendingBookings,
    required int unreadMessages,
    required double conversionRate,
    required double averageResponseTime,
    required List<DailyMetric> dailyMetrics,
  }) = _DashboardMetrics;

  factory DashboardMetrics.fromJson(Map<String, dynamic> json) =>
      _$DashboardMetricsFromJson(json);
}

@freezed
class DailyMetric with _$DailyMetric {
  const factory DailyMetric({
    required DateTime date,
    required int leadsGenerated,
    required int bookingsCreated,
    required int messagesCount,
  }) = _DailyMetric;

  factory DailyMetric.fromJson(Map<String, dynamic> json) =>
      _$DailyMetricFromJson(json);
}

@freezed
class AnalyticsSnapshot with _$AnalyticsSnapshot {
  const factory AnalyticsSnapshot({
    required DateTime timestamp,
    required Map<String, dynamic> metrics,
  }) = _AnalyticsSnapshot;

  factory AnalyticsSnapshot.fromJson(Map<String, dynamic> json) =>
      _$AnalyticsSnapshotFromJson(json);
}
