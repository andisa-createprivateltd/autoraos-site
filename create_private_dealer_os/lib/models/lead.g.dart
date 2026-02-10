// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'lead.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$LeadImpl _$$LeadImplFromJson(Map<String, dynamic> json) => _$LeadImpl(
  id: json['id'] as String,
  name: json['name'] as String,
  email: json['email'] as String,
  phone: json['phone'] as String,
  status: $enumDecode(_$LeadStatusEnumMap, json['status']),
  createdAt: DateTime.parse(json['createdAt'] as String),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  assignedToID: json['assignedToID'] as String?,
  assignedToName: json['assignedToName'] as String?,
  notes: json['notes'] as String?,
  dealerID: json['dealerID'] as String?,
);

Map<String, dynamic> _$$LeadImplToJson(_$LeadImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'email': instance.email,
      'phone': instance.phone,
      'status': _$LeadStatusEnumMap[instance.status]!,
      'createdAt': instance.createdAt.toIso8601String(),
      'updatedAt': instance.updatedAt.toIso8601String(),
      'assignedToID': instance.assignedToID,
      'assignedToName': instance.assignedToName,
      'notes': instance.notes,
      'dealerID': instance.dealerID,
    };

const _$LeadStatusEnumMap = {
  LeadStatus.new_: 'new_',
  LeadStatus.contacted: 'contacted',
  LeadStatus.interested: 'interested',
  LeadStatus.negotiating: 'negotiating',
  LeadStatus.qualified: 'qualified',
  LeadStatus.closed: 'closed',
  LeadStatus.lost: 'lost',
};

_$LeadFilterImpl _$$LeadFilterImplFromJson(Map<String, dynamic> json) =>
    _$LeadFilterImpl(
      status: $enumDecodeNullable(_$LeadStatusEnumMap, json['status']),
      assignedToID: json['assignedToID'] as String?,
      createdAfter: json['createdAfter'] == null
          ? null
          : DateTime.parse(json['createdAfter'] as String),
      createdBefore: json['createdBefore'] == null
          ? null
          : DateTime.parse(json['createdBefore'] as String),
    );

Map<String, dynamic> _$$LeadFilterImplToJson(_$LeadFilterImpl instance) =>
    <String, dynamic>{
      'status': _$LeadStatusEnumMap[instance.status],
      'assignedToID': instance.assignedToID,
      'createdAfter': instance.createdAfter?.toIso8601String(),
      'createdBefore': instance.createdBefore?.toIso8601String(),
    };

_$FollowupItemImpl _$$FollowupItemImplFromJson(Map<String, dynamic> json) =>
    _$FollowupItemImpl(
      id: json['id'] as String,
      leadID: json['leadID'] as String,
      scheduledFor: DateTime.parse(json['scheduledFor'] as String),
      notes: json['notes'] as String,
      completedAt: json['completedAt'] as String?,
    );

Map<String, dynamic> _$$FollowupItemImplToJson(_$FollowupItemImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'leadID': instance.leadID,
      'scheduledFor': instance.scheduledFor.toIso8601String(),
      'notes': instance.notes,
      'completedAt': instance.completedAt,
    };
