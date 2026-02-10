import 'package:freezed_annotation/freezed_annotation.dart';

part 'user_profile.freezed.dart';
part 'user_profile.g.dart';

enum DealerRole {
  dealerAdmin,
  salesRep,
  marketingRep;

  bool get canViewMessageContent {
    return this == DealerRole.dealerAdmin || this == DealerRole.salesRep;
  }
}

@freezed
class UserProfile with _$UserProfile {
  const factory UserProfile({
    required String id,
    required String email,
    required String name,
    required String dealerID,
    required DealerRole role,
    String? phoneNumber,
    String? avatarUrl,
  }) = _UserProfile;

  factory UserProfile.fromJson(Map<String, dynamic> json) =>
      _$UserProfileFromJson(json);
}
