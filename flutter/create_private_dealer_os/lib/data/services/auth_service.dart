import 'package:supabase_flutter/supabase_flutter.dart';

import '../../core/errors/app_exception.dart';
import 'session_store.dart';

class AuthSessionPayload {
  const AuthSessionPayload({
    required this.accessToken,
    required this.refreshToken,
    required this.expiresAt,
    required this.userId,
  });

  final String accessToken;
  final String refreshToken;
  final DateTime expiresAt;
  final String userId;
}

abstract class AuthService {
  Future<AuthSessionPayload?> restoreSession();
  Future<AuthSessionPayload> signIn({
    required String email,
    required String password,
  });
  Future<void> signOut();
  Future<void> resetPassword({required String email});
}

class SupabaseAuthService implements AuthService {
  SupabaseAuthService({required SessionStore sessionStore})
      : _sessionStore = sessionStore;

  final SessionStore _sessionStore;

  SupabaseClient get _client => Supabase.instance.client;

  @override
  Future<AuthSessionPayload?> restoreSession() async {
    final Session? current = _client.auth.currentSession;
    if (current != null) {
      final AuthSessionPayload payload = _payloadFromSession(current);
      await _sessionStore.save(
        StoredSession(
          accessToken: payload.accessToken,
          refreshToken: payload.refreshToken,
          userId: payload.userId,
          expiresAt: payload.expiresAt,
        ),
      );
      return payload;
    }

    final StoredSession? stored = await _sessionStore.load();
    if (stored == null) {
      return null;
    }

    return AuthSessionPayload(
      accessToken: stored.accessToken,
      refreshToken: stored.refreshToken,
      expiresAt: stored.expiresAt,
      userId: stored.userId,
    );
  }

  @override
  Future<AuthSessionPayload> signIn({
    required String email,
    required String password,
  }) async {
    final AuthResponse response = await _client.auth.signInWithPassword(
      email: email,
      password: password,
    );

    final Session? session = response.session;
    final User? user = response.user;

    if (session == null || user == null) {
      throw AppException('Sign in failed. Invalid auth response.');
    }

    final AuthSessionPayload payload = _payloadFromSession(session);
    await _sessionStore.save(
      StoredSession(
        accessToken: payload.accessToken,
        refreshToken: payload.refreshToken,
        userId: payload.userId,
        expiresAt: payload.expiresAt,
      ),
    );

    return payload;
  }

  @override
  Future<void> signOut() async {
    await _client.auth.signOut();
    await _sessionStore.clear();
  }

  @override
  Future<void> resetPassword({required String email}) async {
    await _client.auth.resetPasswordForEmail(email);
  }

  AuthSessionPayload _payloadFromSession(Session session) {
    final int expiresAtEpoch = session.expiresAt ?? 0;
    final DateTime expiresAt =
        DateTime.fromMillisecondsSinceEpoch(expiresAtEpoch * 1000, isUtc: true);

    return AuthSessionPayload(
      accessToken: session.accessToken,
      refreshToken: session.refreshToken ?? '',
      expiresAt: expiresAt,
      userId: session.user.id,
    );
  }
}
