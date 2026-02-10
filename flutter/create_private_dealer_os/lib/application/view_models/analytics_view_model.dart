import 'package:flutter/foundation.dart';

import '../../domain/models/analytics_snapshot.dart';
import '../../domain/models/app_session.dart';
import '../../domain/repositories/dealer_os_repository.dart';

class AnalyticsViewModel extends ChangeNotifier {
  AnalyticsViewModel({required DealerOsRepository repository})
      : _repository = repository,
        _snapshot = const AnalyticsSnapshot(
          responseTrend7d: <ResponseTrendPoint>[],
          responseTrend30d: <ResponseTrendPoint>[],
          sourceBreakdown: <SourceBreakdown>[],
          bookingsCount: 0,
          afterHoursHandledPercent: 0,
        );

  final DealerOsRepository _repository;

  AnalyticsSnapshot _snapshot;
  int _selectedRangeDays = 7;
  bool _isLoading = false;
  String? _errorMessage;

  AnalyticsSnapshot get snapshot => _snapshot;
  int get selectedRangeDays => _selectedRangeDays;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  set selectedRangeDays(int value) {
    _selectedRangeDays = value;
    notifyListeners();
  }

  Future<void> load({required AppSession session}) async {
    if (_isLoading) {
      return;
    }

    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      _snapshot = await _repository.fetchAnalytics(session: session);
    } catch (error) {
      _errorMessage = error.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}
