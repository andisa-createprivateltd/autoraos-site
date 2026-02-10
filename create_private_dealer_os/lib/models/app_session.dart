import 'package:freezed_annotation/freezed_annotation.dart';
import 'user_profile.dart';

part 'app_session.freezed.dart';
part 'app_session.g.dart';

@freezed
class AppSession with _$AppSession {
  const factory AppSession({
    required String accessToken,
    required String refreshToken,
    required DateTime expiresAt,
    required UserProfile userProfile,
  }) = _AppSession;

  factory AppSession.fromJson(Map<String, dynamic> json) =>
      _$AppSessionFromJson(json);
}

@freezed
class AuthSessionPayload with _$AuthSessionPayload {
  const factory AuthSessionPayload({
    required String accessToken,
    required String refreshToken,
    required DateTime expiresAt,
    required String userID,
  }) = _AuthSessionPayload;

  factory AuthSessionPayload.fromJson(Map<String, dynamic> json) =>
      _$AuthSessionPayloadFromJson(json);
}
