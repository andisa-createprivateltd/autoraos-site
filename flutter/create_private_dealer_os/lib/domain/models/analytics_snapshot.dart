import 'lead.dart';

class ResponseTrendPoint {
  const ResponseTrendPoint({required this.date, required this.avgSeconds});

  final DateTime date;
  final double avgSeconds;
}

class SourceBreakdown {
  const SourceBreakdown({required this.source, required this.count});

  final LeadSource source;
  final int count;
}

class AnalyticsSnapshot {
  const AnalyticsSnapshot({
    required this.responseTrend7d,
    required this.responseTrend30d,
    required this.sourceBreakdown,
    required this.bookingsCount,
    required this.afterHoursHandledPercent,
  });

  final List<ResponseTrendPoint> responseTrend7d;
  final List<ResponseTrendPoint> responseTrend30d;
  final List<SourceBreakdown> sourceBreakdown;
  final int bookingsCount;
  final double afterHoursHandledPercent;
}
