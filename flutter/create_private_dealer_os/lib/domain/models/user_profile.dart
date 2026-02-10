import 'dealer_role.dart';

class UserProfile {
  const UserProfile({
    required this.id,
    required this.dealerId,
    required this.name,
    required this.email,
    required this.role,
    required this.isActive,
    required this.lastLoginAt,
  });

  final String id;
  final String dealerId;
  final String name;
  final String email;
  final DealerRole role;
  final bool isActive;
  final DateTime? lastLoginAt;

  factory UserProfile.fromJson(Map<String, dynamic> json) {
    return UserProfile(
      id: json['id'] as String,
      dealerId: json['dealer_id'] as String,
      name: (json['name'] as String?) ?? '',
      email: (json['email'] as String?) ?? '',
      role: DealerRole.fromString((json['role'] as String?) ?? 'dealer_sales'),
      isActive: (json['is_active'] as bool?) ?? true,
      lastLoginAt: json['last_login_at'] == null
          ? null
          : DateTime.parse(json['last_login_at'] as String).toUtc(),
    );
  }
}
