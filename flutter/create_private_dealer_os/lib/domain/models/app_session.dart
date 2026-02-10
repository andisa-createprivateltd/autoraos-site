import 'user_profile.dart';

class AppSession {
  const AppSession({
    required this.accessToken,
    required this.refreshToken,
    required this.expiresAt,
    required this.userId,
    required this.userProfile,
  });

  final String accessToken;
  final String refreshToken;
  final DateTime expiresAt;
  final String userId;
  final UserProfile userProfile;
}
