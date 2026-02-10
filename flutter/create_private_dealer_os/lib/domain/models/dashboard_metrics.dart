import 'lead.dart';

class DashboardMetrics {
  const DashboardMetrics({
    required this.newLeadsToday,
    required this.avgResponseSeconds7d,
    required this.bookingsThisWeek,
    required this.missedLeads,
    required this.assignedLeads,
  });

  final int newLeadsToday;
  final double avgResponseSeconds7d;
  final int bookingsThisWeek;
  final int missedLeads;
  final List<Lead> assignedLeads;
}
