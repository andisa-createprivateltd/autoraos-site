// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'user_profile.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$UserProfileImpl _$$UserProfileImplFromJson(Map<String, dynamic> json) =>
    _$UserProfileImpl(
      id: json['id'] as String,
      email: json['email'] as String,
      name: json['name'] as String,
      dealerID: json['dealerID'] as String,
      role: $enumDecode(_$DealerRoleEnumMap, json['role']),
      phoneNumber: json['phoneNumber'] as String?,
      avatarUrl: json['avatarUrl'] as String?,
    );

Map<String, dynamic> _$$UserProfileImplToJson(_$UserProfileImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'email': instance.email,
      'name': instance.name,
      'dealerID': instance.dealerID,
      'role': _$DealerRoleEnumMap[instance.role]!,
      'phoneNumber': instance.phoneNumber,
      'avatarUrl': instance.avatarUrl,
    };

const _$DealerRoleEnumMap = {
  DealerRole.dealerAdmin: 'dealerAdmin',
  DealerRole.salesRep: 'salesRep',
  DealerRole.marketingRep: 'marketingRep',
};
