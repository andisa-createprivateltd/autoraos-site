// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'booking.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$BookingImpl _$$BookingImplFromJson(Map<String, dynamic> json) =>
    _$BookingImpl(
      id: json['id'] as String,
      leadID: json['leadID'] as String,
      leadName: json['leadName'] as String,
      scheduledFor: DateTime.parse(json['scheduledFor'] as String),
      status: $enumDecode(_$BookingStatusEnumMap, json['status']),
      createdAt: DateTime.parse(json['createdAt'] as String),
      notes: json['notes'] as String?,
      dealerID: json['dealerID'] as String?,
      createdByID: json['createdByID'] as String?,
    );

Map<String, dynamic> _$$BookingImplToJson(_$BookingImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'leadID': instance.leadID,
      'leadName': instance.leadName,
      'scheduledFor': instance.scheduledFor.toIso8601String(),
      'status': _$BookingStatusEnumMap[instance.status]!,
      'createdAt': instance.createdAt.toIso8601String(),
      'notes': instance.notes,
      'dealerID': instance.dealerID,
      'createdByID': instance.createdByID,
    };

const _$BookingStatusEnumMap = {
  BookingStatus.pending: 'pending',
  BookingStatus.confirmed: 'confirmed',
  BookingStatus.inProgress: 'inProgress',
  BookingStatus.completed: 'completed',
  BookingStatus.cancelled: 'cancelled',
};

_$NewBookingRequestImpl _$$NewBookingRequestImplFromJson(
  Map<String, dynamic> json,
) => _$NewBookingRequestImpl(
  leadID: json['leadID'] as String,
  scheduledFor: DateTime.parse(json['scheduledFor'] as String),
  notes: json['notes'] as String?,
);

Map<String, dynamic> _$$NewBookingRequestImplToJson(
  _$NewBookingRequestImpl instance,
) => <String, dynamic>{
  'leadID': instance.leadID,
  'scheduledFor': instance.scheduledFor.toIso8601String(),
  'notes': instance.notes,
};
