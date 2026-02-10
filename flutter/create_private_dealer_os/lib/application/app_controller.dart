import 'package:flutter/foundation.dart';

import '../core/routing/app_tab.dart';
import '../domain/models/app_session.dart';
import '../domain/models/dealer_role.dart';
import '../domain/models/settings.dart';
import '../domain/repositories/dealer_os_repository.dart';

class AppController extends ChangeNotifier {
  AppController({
    required DealerOsRepository repository,
    required bool allowAdminPhoneUnmask,
    required bool marketingCanViewMessagesDefault,
  })  : _repository = repository,
        _allowAdminPhoneUnmask = allowAdminPhoneUnmask,
        _dealerSettings = DealerSettings.defaults(
          marketingViewDefault: marketingCanViewMessagesDefault,
        );

  final DealerOsRepository _repository;
  final bool _allowAdminPhoneUnmask;

  AppSession? _session;
  DealerSettings _dealerSettings;
  AppTab _selectedTab = AppTab.dashboard;
  String? _selectedConversationId;
  String? _selectedBookingId;
  String? _preselectedBookingLeadId;

  bool _isBootstrapping = false;
  bool _isSigningIn = false;
  String? _errorMessage;

  AppSession? get session => _session;
  DealerSettings get dealerSettings => _dealerSettings;
  AppTab get selectedTab => _selectedTab;
  String? get selectedConversationId => _selectedConversationId;
  String? get selectedBookingId => _selectedBookingId;
  String? get preselectedBookingLeadId => _preselectedBookingLeadId;
  bool get isBootstrapping => _isBootstrapping;
  bool get isSigningIn => _isSigningIn;
  String? get errorMessage => _errorMessage;

  DealerRole? get role => _session?.userProfile.role;

  List<AppTab> get availableTabs {
    return role?.tabs ?? <AppTab>[];
  }

  bool get canViewMessageContent {
    final DealerRole? roleValue = role;
    if (roleValue == null) {
      return false;
    }

    return roleValue.canViewMessageContent(
      marketingFeatureFlag: _dealerSettings.marketingCanViewMessages,
    );
  }

  bool get canUnmaskPhone {
    final DealerRole? roleValue = role;
    if (roleValue == null) {
      return false;
    }

    return _allowAdminPhoneUnmask &&
        roleValue == DealerRole.dealerAdmin &&
        _dealerSettings.allowAdminFullPhone;
  }

  set selectedTab(AppTab tab) {
    _selectedTab = tab;
    notifyListeners();
  }

  Future<void> bootstrap() async {
    if (_isBootstrapping) {
      return;
    }

    _isBootstrapping = true;
    notifyListeners();

    try {
      final AppSession? restored = await _repository.restoreSession();
      if (restored != null) {
        _session = restored;
        await loadSettingsIfNeeded();
      }
    } catch (error) {
      _errorMessage = error.toString();
    } finally {
      _isBootstrapping = false;
      notifyListeners();
    }
  }

  Future<void> signIn({required String email, required String password}) async {
    if (_isSigningIn) {
      return;
    }

    _isSigningIn = true;
    _errorMessage = null;
    notifyListeners();

    try {
      _session = await _repository.signIn(email: email, password: password);
      await loadSettingsIfNeeded();
    } catch (error) {
      _errorMessage = error.toString();
    } finally {
      _isSigningIn = false;
      notifyListeners();
    }
  }

  Future<void> signOut() async {
    await _repository.signOut();
    _session = null;
    _selectedConversationId = null;
    _selectedBookingId = null;
    _preselectedBookingLeadId = null;
    _selectedTab = AppTab.dashboard;
    notifyListeners();
  }

  Future<void> resetPassword({required String email}) async {
    try {
      await _repository.resetPassword(email: email);
      _errorMessage = 'Password reset email sent.';
    } catch (error) {
      _errorMessage = error.toString();
    }
    notifyListeners();
  }

  Future<void> loadSettingsIfNeeded() async {
    final AppSession? current = _session;
    if (current == null) {
      return;
    }

    try {
      _dealerSettings = await _repository.fetchDealerSettings(session: current);
      notifyListeners();
    } catch (_) {
      // Keep defaults to avoid blocking core workflows.
    }
  }

  Future<void> updateSettings(DealerSettings settings) async {
    final AppSession? current = _session;
    if (current == null) {
      return;
    }

    try {
      await _repository.updateDealerSettings(settings: settings, session: current);
      _dealerSettings = settings;
    } catch (error) {
      _errorMessage = error.toString();
    }

    notifyListeners();
  }

  void handleDeepLink(DeepLinkTarget target) {
    switch (target.type) {
      case DeepLinkTargetType.conversation:
        if (!availableTabs.contains(AppTab.conversations)) {
          return;
        }
        _selectedTab = AppTab.conversations;
        _selectedConversationId = target.id;
        break;
      case DeepLinkTargetType.booking:
        if (!availableTabs.contains(AppTab.bookings)) {
          return;
        }
        _selectedTab = AppTab.bookings;
        _selectedBookingId = target.id;
        break;
    }

    notifyListeners();
  }

  void consumeSelectedConversation() {
    _selectedConversationId = null;
    notifyListeners();
  }

  void consumeSelectedBooking() {
    _selectedBookingId = null;
    notifyListeners();
  }

  void setPreselectedBookingLead(String? leadId) {
    _preselectedBookingLeadId = leadId;
    notifyListeners();
  }

  void clearError() {
    _errorMessage = null;
    notifyListeners();
  }
}
