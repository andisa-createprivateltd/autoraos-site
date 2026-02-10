import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/app_session.dart';
import '../repositories/dealer_os_repository.dart';
import 'service_providers.dart';

// App session state provider
final appSessionProvider = StateNotifierProvider<AppSessionNotifier, AppSession?>((ref) {
  final repository = ref.watch(dealerOSRepositoryProvider);
  return AppSessionNotifier(repository);
});

class AppSessionNotifier extends StateNotifier<AppSession?> {
  final DealerOSRepository _repository;

  AppSessionNotifier(this._repository) : super(null);

  Future<void> bootstrap() async {
    state = await _repository.restoreSession();
  }

  Future<bool> signIn(String email, String password) async {
    try {
      state = await _repository.signIn(email, password);
      return true;
    } catch (e) {
      return false;
    }
  }

  Future<void> signOut() async {
    await _repository.signOut();
    state = null;
  }

  Future<bool> resetPassword(String email) async {
    try {
      await _repository.resetPassword(email);
      return true;
    } catch (e) {
      return false;
    }
  }
}

// Check if user is authenticated
final isAuthenticatedProvider = Provider<bool>((ref) {
  final session = ref.watch(appSessionProvider);
  return session != null;
});
