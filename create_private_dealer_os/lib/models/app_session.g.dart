// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'app_session.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$AppSessionImpl _$$AppSessionImplFromJson(Map<String, dynamic> json) =>
    _$AppSessionImpl(
      accessToken: json['accessToken'] as String,
      refreshToken: json['refreshToken'] as String,
      expiresAt: DateTime.parse(json['expiresAt'] as String),
      userProfile: UserProfile.fromJson(
        json['userProfile'] as Map<String, dynamic>,
      ),
    );

Map<String, dynamic> _$$AppSessionImplToJson(_$AppSessionImpl instance) =>
    <String, dynamic>{
      'accessToken': instance.accessToken,
      'refreshToken': instance.refreshToken,
      'expiresAt': instance.expiresAt.toIso8601String(),
      'userProfile': instance.userProfile,
    };

_$AuthSessionPayloadImpl _$$AuthSessionPayloadImplFromJson(
  Map<String, dynamic> json,
) => _$AuthSessionPayloadImpl(
  accessToken: json['accessToken'] as String,
  refreshToken: json['refreshToken'] as String,
  expiresAt: DateTime.parse(json['expiresAt'] as String),
  userID: json['userID'] as String,
);

Map<String, dynamic> _$$AuthSessionPayloadImplToJson(
  _$AuthSessionPayloadImpl instance,
) => <String, dynamic>{
  'accessToken': instance.accessToken,
  'refreshToken': instance.refreshToken,
  'expiresAt': instance.expiresAt.toIso8601String(),
  'userID': instance.userID,
};
