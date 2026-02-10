import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'dart:convert';
import '../models/app_session.dart';

class SecureStorage {
  static const _sessionKey = 'app_session';
  final FlutterSecureStorage _storage;

  SecureStorage(this._storage);

  Future<AuthSessionPayload?> loadSession() async {
    try {
      final json = await _storage.read(key: _sessionKey);
      if (json == null) return null;
      return AuthSessionPayload.fromJson(jsonDecode(json));
    } catch (e) {
      return null;
    }
  }

  Future<void> saveSession(AuthSessionPayload session) async {
    try {
      await _storage.write(
        key: _sessionKey,
        value: jsonEncode(session.toJson()),
      );
    } catch (e) {
      // Handle error
    }
  }

  Future<void> clear() async {
    try {
      await _storage.delete(key: _sessionKey);
    } catch (e) {
      // Handle error
    }
  }
}
