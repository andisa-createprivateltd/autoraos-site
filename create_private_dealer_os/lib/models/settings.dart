import 'package:freezed_annotation/freezed_annotation.dart';

part 'settings.freezed.dart';
part 'settings.g.dart';

@freezed
class DealerSettings with _$DealerSettings {
  const factory DealerSettings({
    required Map<String, BusinessHours> businessHours,
    required List<FAQ> faqs,
    required bool marketingCanViewMessages,
    required bool allowAdminFullPhone,
  }) = _DealerSettings;

  factory DealerSettings.fromJson(Map<String, dynamic> json) =>
      _$DealerSettingsFromJson(json);
}

@freezed
class BusinessHours with _$BusinessHours {
  const factory BusinessHours({
    required String open,
    required String close,
  }) = _BusinessHours;

  factory BusinessHours.fromJson(Map<String, dynamic> json) =>
      _$BusinessHoursFromJson(json);
}

@freezed
class FAQ with _$FAQ {
  const factory FAQ({
    required String id,
    required String question,
    required String answer,
  }) = _FAQ;

  factory FAQ.fromJson(Map<String, dynamic> json) => _$FAQFromJson(json);
}

@freezed
class TeamMember with _$TeamMember {
  const factory TeamMember({
    required String id,
    required String name,
    required String email,
    required String role,
    bool? isActive,
  }) = _TeamMember;

  factory TeamMember.fromJson(Map<String, dynamic> json) =>
      _$TeamMemberFromJson(json);
}

@freezed
class InviteUserRequest with _$InviteUserRequest {
  const factory InviteUserRequest({
    required String email,
    required String role,
  }) = _InviteUserRequest;

  factory InviteUserRequest.fromJson(Map<String, dynamic> json) =>
      _$InviteUserRequestFromJson(json);
}
