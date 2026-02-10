import 'dart:convert';

import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class StoredSession {
  const StoredSession({
    required this.accessToken,
    required this.refreshToken,
    required this.userId,
    required this.expiresAt,
  });

  final String accessToken;
  final String refreshToken;
  final String userId;
  final DateTime expiresAt;

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'access_token': accessToken,
      'refresh_token': refreshToken,
      'user_id': userId,
      'expires_at': expiresAt.toIso8601String(),
    };
  }

  factory StoredSession.fromJson(Map<String, dynamic> json) {
    return StoredSession(
      accessToken: json['access_token'] as String,
      refreshToken: json['refresh_token'] as String,
      userId: json['user_id'] as String,
      expiresAt: DateTime.parse(json['expires_at'] as String).toUtc(),
    );
  }
}

abstract class SessionStore {
  Future<void> save(StoredSession session);
  Future<StoredSession?> load();
  Future<void> clear();
}

class SecureSessionStore implements SessionStore {
  SecureSessionStore({FlutterSecureStorage? storage})
      : _storage = storage ?? const FlutterSecureStorage();

  static const String _sessionKey = 'dealer_os_session';
  final FlutterSecureStorage _storage;

  @override
  Future<void> save(StoredSession session) async {
    await _storage.write(key: _sessionKey, value: jsonEncode(session.toJson()));
  }

  @override
  Future<StoredSession?> load() async {
    final String? raw = await _storage.read(key: _sessionKey);
    if (raw == null || raw.isEmpty) {
      return null;
    }

    final Map<String, dynamic> json =
        jsonDecode(raw) as Map<String, dynamic>;
    return StoredSession.fromJson(json);
  }

  @override
  Future<void> clear() async {
    await _storage.delete(key: _sessionKey);
  }
}
