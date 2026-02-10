import 'package:supabase_flutter/supabase_flutter.dart';
import '../models/app_session.dart';
import '../utils/secure_storage.dart';
import '../config/demo_config.dart';

class AuthService {
  final SupabaseClient _client;
  final SecureStorage _storage;
  final bool _useDemoMode;

  AuthService(this._client, this._storage, {bool useDemoMode = true})
      : _useDemoMode = useDemoMode;

  Future<AuthSessionPayload?> restoreSession() async {
    try {
      final stored = await _storage.loadSession();
      if (stored == null) {
        return null;
      }

      // Try to restore the session
      if (_useDemoMode) {
        return stored;
      }

      try {
        final session = await _client.auth.refreshSession(stored.refreshToken);
        if (session.session != null) {
          return stored;
        }
        await _storage.clear();
        return null;
      } catch (e) {
        await _storage.clear();
        return null;
      }
    } catch (e) {
      return null;
    }
  }

  Future<AuthSessionPayload> signIn(String email, String password) async {
    // Try demo mode first
    if (_useDemoMode && demoCredentials.containsKey(email)) {
      final cred = demoCredentials[email];
      if (cred!['password'] == password) {
        final session = cred['session'] as AppSession;
        final payload = AuthSessionPayload(
          accessToken: session.accessToken,
          refreshToken: session.refreshToken,
          expiresAt: session.expiresAt,
          userID: session.userProfile.id,
        );
        await _storage.saveSession(payload);
        return payload;
      }
    }

    // Fall back to Supabase
    try {
      final response = await _client.auth.signInWithPassword(
        email: email,
        password: password,
      );

      final session = response.session;
      if (session == null) {
        throw Exception('No session returned from auth');
      }

      final expiresAt = session.expiresAt;
      if (expiresAt == null) {
        throw Exception('No expiration time in session');
      }

      final payload = AuthSessionPayload(
        accessToken: session.accessToken,
        refreshToken: session.refreshToken ?? '',
        expiresAt: DateTime.fromMillisecondsSinceEpoch(
          expiresAt * 1000,
        ),
        userID: session.user.id,
      );

      await _storage.saveSession(payload);
      return payload;
    } on AuthException catch (e) {
      throw Exception('Auth error: ${e.message}');
    }
  }

  Future<void> signOut() async {
    if (!_useDemoMode) {
      try {
        await _client.auth.signOut();
      } catch (e) {
        // Continue to clear local storage even if server signout fails
      }
    }
    await _storage.clear();
  }

  Future<void> resetPassword(String email) async {
    if (_useDemoMode) {
      // Demo mode doesn't support password reset
      return;
    }

    try {
      await _client.auth.resetPasswordForEmail(email);
    } on AuthException catch (e) {
      throw Exception('Password reset error: ${e.message}');
    }
  }

  Future<String?> currentAccessToken() async {
    if (_useDemoMode) {
      final stored = await _storage.loadSession();
      return stored?.accessToken;
    }

    try {
      final session = _client.auth.currentSession;
      if (session != null && session.expiresAt != null) {
        // Check if token is still valid
        final expiresAt = session.expiresAt!;
        if (expiresAt > DateTime.now().millisecondsSinceEpoch ~/ 1000) {
          return session.accessToken;
        }
      }
    } catch (e) {
      // Ignore
    }

    final stored = await _storage.loadSession();
    return stored?.accessToken;
  }
}

