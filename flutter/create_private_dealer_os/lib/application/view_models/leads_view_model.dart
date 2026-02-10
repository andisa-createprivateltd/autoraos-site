import 'package:flutter/foundation.dart';

import '../../domain/models/app_session.dart';
import '../../domain/models/lead.dart';
import '../../domain/repositories/dealer_os_repository.dart';

class LeadsViewModel extends ChangeNotifier {
  LeadsViewModel({required DealerOsRepository repository}) : _repository = repository;

  final DealerOsRepository _repository;

  List<Lead> _leads = <Lead>[];
  LeadStatus? _statusFilter;
  LeadSource? _sourceFilter;
  String? _assignedUserFilter;
  bool _isLoading = false;
  String? _errorMessage;

  List<Lead> get leads => _leads;
  LeadStatus? get statusFilter => _statusFilter;
  LeadSource? get sourceFilter => _sourceFilter;
  String? get assignedUserFilter => _assignedUserFilter;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  set statusFilter(LeadStatus? value) {
    _statusFilter = value;
    notifyListeners();
  }

  set sourceFilter(LeadSource? value) {
    _sourceFilter = value;
    notifyListeners();
  }

  set assignedUserFilter(String? value) {
    _assignedUserFilter = value;
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
      _leads = await _repository.fetchLeads(
        filter: LeadFilter(
          status: _statusFilter,
          source: _sourceFilter,
          assignedUserId: _assignedUserFilter,
        ),
        session: session,
      );
    } catch (error) {
      _errorMessage = error.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> updateStatus({
    required String leadId,
    required LeadStatus status,
    required AppSession session,
  }) async {
    try {
      await _repository.updateLeadStatus(
        leadId: leadId,
        status: status,
        session: session,
      );

      final int index = _leads.indexWhere((Lead lead) => lead.id == leadId);
      if (index >= 0) {
        _leads[index] = _leads[index].copyWith(status: status);
      }
      notifyListeners();
    } catch (error) {
      _errorMessage = error.toString();
      notifyListeners();
    }
  }
}
