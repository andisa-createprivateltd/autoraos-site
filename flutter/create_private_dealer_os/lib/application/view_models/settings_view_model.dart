import 'package:flutter/foundation.dart';

import '../../domain/models/app_session.dart';
import '../../domain/models/dealer_role.dart';
import '../../domain/models/settings.dart';
import '../../domain/repositories/dealer_os_repository.dart';

class SettingsViewModel extends ChangeNotifier {
  SettingsViewModel({required DealerOsRepository repository})
      : _repository = repository;

  final DealerOsRepository _repository;

  Map<String, BusinessHoursDay> _businessHours = <String, BusinessHoursDay>{};
  String _faqText = '';
  bool _marketingCanViewMessages = false;
  bool _allowAdminFullPhone = false;
  List<TeamMember> _teamMembers = <TeamMember>[];

  String _inviteName = '';
  String _inviteEmail = '';
  DealerRole _inviteRole = DealerRole.dealerSales;

  bool _isLoading = false;
  bool _isSaving = false;
  String? _errorMessage;

  Map<String, BusinessHoursDay> get businessHours => _businessHours;
  String get faqText => _faqText;
  bool get marketingCanViewMessages => _marketingCanViewMessages;
  bool get allowAdminFullPhone => _allowAdminFullPhone;
  List<TeamMember> get teamMembers => _teamMembers;
  String get inviteName => _inviteName;
  String get inviteEmail => _inviteEmail;
  DealerRole get inviteRole => _inviteRole;
  bool get isLoading => _isLoading;
  bool get isSaving => _isSaving;
  String? get errorMessage => _errorMessage;

  set faqText(String value) {
    _faqText = value;
    notifyListeners();
  }

  set marketingCanViewMessages(bool value) {
    _marketingCanViewMessages = value;
    notifyListeners();
  }

  set allowAdminFullPhone(bool value) {
    _allowAdminFullPhone = value;
    notifyListeners();
  }

  set inviteName(String value) {
    _inviteName = value;
    notifyListeners();
  }

  set inviteEmail(String value) {
    _inviteEmail = value;
    notifyListeners();
  }

  set inviteRole(DealerRole value) {
    _inviteRole = value;
    notifyListeners();
  }

  void updateBusinessHour({required String day, required BusinessHoursDay value}) {
    _businessHours = Map<String, BusinessHoursDay>.from(_businessHours)..[day] = value;
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
      final List<dynamic> values = await Future.wait<dynamic>(<Future<dynamic>>[
        _repository.fetchDealerSettings(session: session),
        _repository.fetchTeamMembers(session: session),
      ]);

      final DealerSettings settings = values[0] as DealerSettings;
      _businessHours = settings.businessHours;
      _marketingCanViewMessages = settings.marketingCanViewMessages;
      _allowAdminFullPhone = settings.allowAdminFullPhone;
      _faqText = settings.faqs.join('\n');
      _teamMembers = values[1] as List<TeamMember>;
    } catch (error) {
      _errorMessage = error.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<DealerSettings?> saveSettings({required AppSession session}) async {
    if (_isSaving) {
      return null;
    }

    _isSaving = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final DealerSettings settings = DealerSettings(
        businessHours: _businessHours,
        faqs: _faqText
            .split('\n')
            .map((String line) => line.trim())
            .where((String line) => line.isNotEmpty)
            .toList(),
        marketingCanViewMessages: _marketingCanViewMessages,
        allowAdminFullPhone: _allowAdminFullPhone,
      );

      await _repository.updateDealerSettings(settings: settings, session: session);
      return settings;
    } catch (error) {
      _errorMessage = error.toString();
      return null;
    } finally {
      _isSaving = false;
      notifyListeners();
    }
  }

  Future<void> invite({required AppSession session}) async {
    if (_isSaving) {
      return;
    }

    final String email = _inviteEmail.trim();
    final String name = _inviteName.trim();

    if (email.isEmpty || name.isEmpty) {
      _errorMessage = 'Name and email are required.';
      notifyListeners();
      return;
    }

    _isSaving = true;
    _errorMessage = null;
    notifyListeners();

    try {
      await _repository.inviteUser(
        request: InviteUserRequest(email: email, name: name, role: _inviteRole),
        session: session,
      );

      _inviteName = '';
      _inviteEmail = '';
      _teamMembers = await _repository.fetchTeamMembers(session: session);
    } catch (error) {
      _errorMessage = error.toString();
    } finally {
      _isSaving = false;
      notifyListeners();
    }
  }

  Future<void> disableUser({
    required String userId,
    required AppSession session,
  }) async {
    try {
      await _repository.disableUser(userId: userId, session: session);
      _teamMembers = await _repository.fetchTeamMembers(session: session);
    } catch (error) {
      _errorMessage = error.toString();
    }
    notifyListeners();
  }
}
