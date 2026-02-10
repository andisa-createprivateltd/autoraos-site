import 'package:flutter/foundation.dart';

import '../../domain/models/app_session.dart';
import '../../domain/models/dashboard_metrics.dart';
import '../../domain/models/lead.dart';
import '../../domain/repositories/dealer_os_repository.dart';

class DashboardViewModel extends ChangeNotifier {
  DashboardViewModel({required DealerOsRepository repository})
      : _repository = repository,
        _metrics = const DashboardMetrics(
          newLeadsToday: 0,
          avgResponseSeconds7d: 0,
          bookingsThisWeek: 0,
          missedLeads: 0,
          assignedLeads: <Lead>[],
        );

  final DealerOsRepository _repository;
  DashboardMetrics _metrics;
  bool _isLoading = false;
  String? _errorMessage;

  DashboardMetrics get metrics => _metrics;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  Future<void> load({required AppSession session}) async {
    if (_isLoading) {
      return;
    }

    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      _metrics = await _repository.fetchDashboard(session: session);
    } catch (error) {
      _errorMessage = error.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}
