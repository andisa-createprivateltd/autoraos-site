// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'booking.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
  'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models',
);

Booking _$BookingFromJson(Map<String, dynamic> json) {
  return _Booking.fromJson(json);
}

/// @nodoc
mixin _$Booking {
  String get id => throw _privateConstructorUsedError;
  String get leadID => throw _privateConstructorUsedError;
  String get leadName => throw _privateConstructorUsedError;
  DateTime get scheduledFor => throw _privateConstructorUsedError;
  BookingStatus get status => throw _privateConstructorUsedError;
  DateTime get createdAt => throw _privateConstructorUsedError;
  String? get notes => throw _privateConstructorUsedError;
  String? get dealerID => throw _privateConstructorUsedError;
  String? get createdByID => throw _privateConstructorUsedError;

  /// Serializes this Booking to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of Booking
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $BookingCopyWith<Booking> get copyWith => throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $BookingCopyWith<$Res> {
  factory $BookingCopyWith(Booking value, $Res Function(Booking) then) =
      _$BookingCopyWithImpl<$Res, Booking>;
  @useResult
  $Res call({
    String id,
    String leadID,
    String leadName,
    DateTime scheduledFor,
    BookingStatus status,
    DateTime createdAt,
    String? notes,
    String? dealerID,
    String? createdByID,
  });
}

/// @nodoc
class _$BookingCopyWithImpl<$Res, $Val extends Booking>
    implements $BookingCopyWith<$Res> {
  _$BookingCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of Booking
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? leadID = null,
    Object? leadName = null,
    Object? scheduledFor = null,
    Object? status = null,
    Object? createdAt = null,
    Object? notes = freezed,
    Object? dealerID = freezed,
    Object? createdByID = freezed,
  }) {
    return _then(
      _value.copyWith(
            id: null == id
                ? _value.id
                : id // ignore: cast_nullable_to_non_nullable
                      as String,
            leadID: null == leadID
                ? _value.leadID
                : leadID // ignore: cast_nullable_to_non_nullable
                      as String,
            leadName: null == leadName
                ? _value.leadName
                : leadName // ignore: cast_nullable_to_non_nullable
                      as String,
            scheduledFor: null == scheduledFor
                ? _value.scheduledFor
                : scheduledFor // ignore: cast_nullable_to_non_nullable
                      as DateTime,
            status: null == status
                ? _value.status
                : status // ignore: cast_nullable_to_non_nullable
                      as BookingStatus,
            createdAt: null == createdAt
                ? _value.createdAt
                : createdAt // ignore: cast_nullable_to_non_nullable
                      as DateTime,
            notes: freezed == notes
                ? _value.notes
                : notes // ignore: cast_nullable_to_non_nullable
                      as String?,
            dealerID: freezed == dealerID
                ? _value.dealerID
                : dealerID // ignore: cast_nullable_to_non_nullable
                      as String?,
            createdByID: freezed == createdByID
                ? _value.createdByID
                : createdByID // ignore: cast_nullable_to_non_nullable
                      as String?,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$BookingImplCopyWith<$Res> implements $BookingCopyWith<$Res> {
  factory _$$BookingImplCopyWith(
    _$BookingImpl value,
    $Res Function(_$BookingImpl) then,
  ) = __$$BookingImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    String id,
    String leadID,
    String leadName,
    DateTime scheduledFor,
    BookingStatus status,
    DateTime createdAt,
    String? notes,
    String? dealerID,
    String? createdByID,
  });
}

/// @nodoc
class __$$BookingImplCopyWithImpl<$Res>
    extends _$BookingCopyWithImpl<$Res, _$BookingImpl>
    implements _$$BookingImplCopyWith<$Res> {
  __$$BookingImplCopyWithImpl(
    _$BookingImpl _value,
    $Res Function(_$BookingImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of Booking
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? leadID = null,
    Object? leadName = null,
    Object? scheduledFor = null,
    Object? status = null,
    Object? createdAt = null,
    Object? notes = freezed,
    Object? dealerID = freezed,
    Object? createdByID = freezed,
  }) {
    return _then(
      _$BookingImpl(
        id: null == id
            ? _value.id
            : id // ignore: cast_nullable_to_non_nullable
                  as String,
        leadID: null == leadID
            ? _value.leadID
            : leadID // ignore: cast_nullable_to_non_nullable
                  as String,
        leadName: null == leadName
            ? _value.leadName
            : leadName // ignore: cast_nullable_to_non_nullable
                  as String,
        scheduledFor: null == scheduledFor
            ? _value.scheduledFor
            : scheduledFor // ignore: cast_nullable_to_non_nullable
                  as DateTime,
        status: null == status
            ? _value.status
            : status // ignore: cast_nullable_to_non_nullable
                  as BookingStatus,
        createdAt: null == createdAt
            ? _value.createdAt
            : createdAt // ignore: cast_nullable_to_non_nullable
                  as DateTime,
        notes: freezed == notes
            ? _value.notes
            : notes // ignore: cast_nullable_to_non_nullable
                  as String?,
        dealerID: freezed == dealerID
            ? _value.dealerID
            : dealerID // ignore: cast_nullable_to_non_nullable
                  as String?,
        createdByID: freezed == createdByID
            ? _value.createdByID
            : createdByID // ignore: cast_nullable_to_non_nullable
                  as String?,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$BookingImpl implements _Booking {
  const _$BookingImpl({
    required this.id,
    required this.leadID,
    required this.leadName,
    required this.scheduledFor,
    required this.status,
    required this.createdAt,
    this.notes,
    this.dealerID,
    this.createdByID,
  });

  factory _$BookingImpl.fromJson(Map<String, dynamic> json) =>
      _$$BookingImplFromJson(json);

  @override
  final String id;
  @override
  final String leadID;
  @override
  final String leadName;
  @override
  final DateTime scheduledFor;
  @override
  final BookingStatus status;
  @override
  final DateTime createdAt;
  @override
  final String? notes;
  @override
  final String? dealerID;
  @override
  final String? createdByID;

  @override
  String toString() {
    return 'Booking(id: $id, leadID: $leadID, leadName: $leadName, scheduledFor: $scheduledFor, status: $status, createdAt: $createdAt, notes: $notes, dealerID: $dealerID, createdByID: $createdByID)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$BookingImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.leadID, leadID) || other.leadID == leadID) &&
            (identical(other.leadName, leadName) ||
                other.leadName == leadName) &&
            (identical(other.scheduledFor, scheduledFor) ||
                other.scheduledFor == scheduledFor) &&
            (identical(other.status, status) || other.status == status) &&
            (identical(other.createdAt, createdAt) ||
                other.createdAt == createdAt) &&
            (identical(other.notes, notes) || other.notes == notes) &&
            (identical(other.dealerID, dealerID) ||
                other.dealerID == dealerID) &&
            (identical(other.createdByID, createdByID) ||
                other.createdByID == createdByID));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
    runtimeType,
    id,
    leadID,
    leadName,
    scheduledFor,
    status,
    createdAt,
    notes,
    dealerID,
    createdByID,
  );

  /// Create a copy of Booking
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$BookingImplCopyWith<_$BookingImpl> get copyWith =>
      __$$BookingImplCopyWithImpl<_$BookingImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$BookingImplToJson(this);
  }
}

abstract class _Booking implements Booking {
  const factory _Booking({
    required final String id,
    required final String leadID,
    required final String leadName,
    required final DateTime scheduledFor,
    required final BookingStatus status,
    required final DateTime createdAt,
    final String? notes,
    final String? dealerID,
    final String? createdByID,
  }) = _$BookingImpl;

  factory _Booking.fromJson(Map<String, dynamic> json) = _$BookingImpl.fromJson;

  @override
  String get id;
  @override
  String get leadID;
  @override
  String get leadName;
  @override
  DateTime get scheduledFor;
  @override
  BookingStatus get status;
  @override
  DateTime get createdAt;
  @override
  String? get notes;
  @override
  String? get dealerID;
  @override
  String? get createdByID;

  /// Create a copy of Booking
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$BookingImplCopyWith<_$BookingImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

NewBookingRequest _$NewBookingRequestFromJson(Map<String, dynamic> json) {
  return _NewBookingRequest.fromJson(json);
}

/// @nodoc
mixin _$NewBookingRequest {
  String get leadID => throw _privateConstructorUsedError;
  DateTime get scheduledFor => throw _privateConstructorUsedError;
  String? get notes => throw _privateConstructorUsedError;

  /// Serializes this NewBookingRequest to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of NewBookingRequest
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $NewBookingRequestCopyWith<NewBookingRequest> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $NewBookingRequestCopyWith<$Res> {
  factory $NewBookingRequestCopyWith(
    NewBookingRequest value,
    $Res Function(NewBookingRequest) then,
  ) = _$NewBookingRequestCopyWithImpl<$Res, NewBookingRequest>;
  @useResult
  $Res call({String leadID, DateTime scheduledFor, String? notes});
}

/// @nodoc
class _$NewBookingRequestCopyWithImpl<$Res, $Val extends NewBookingRequest>
    implements $NewBookingRequestCopyWith<$Res> {
  _$NewBookingRequestCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of NewBookingRequest
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? leadID = null,
    Object? scheduledFor = null,
    Object? notes = freezed,
  }) {
    return _then(
      _value.copyWith(
            leadID: null == leadID
                ? _value.leadID
                : leadID // ignore: cast_nullable_to_non_nullable
                      as String,
            scheduledFor: null == scheduledFor
                ? _value.scheduledFor
                : scheduledFor // ignore: cast_nullable_to_non_nullable
                      as DateTime,
            notes: freezed == notes
                ? _value.notes
                : notes // ignore: cast_nullable_to_non_nullable
                      as String?,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$NewBookingRequestImplCopyWith<$Res>
    implements $NewBookingRequestCopyWith<$Res> {
  factory _$$NewBookingRequestImplCopyWith(
    _$NewBookingRequestImpl value,
    $Res Function(_$NewBookingRequestImpl) then,
  ) = __$$NewBookingRequestImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({String leadID, DateTime scheduledFor, String? notes});
}

/// @nodoc
class __$$NewBookingRequestImplCopyWithImpl<$Res>
    extends _$NewBookingRequestCopyWithImpl<$Res, _$NewBookingRequestImpl>
    implements _$$NewBookingRequestImplCopyWith<$Res> {
  __$$NewBookingRequestImplCopyWithImpl(
    _$NewBookingRequestImpl _value,
    $Res Function(_$NewBookingRequestImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of NewBookingRequest
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? leadID = null,
    Object? scheduledFor = null,
    Object? notes = freezed,
  }) {
    return _then(
      _$NewBookingRequestImpl(
        leadID: null == leadID
            ? _value.leadID
            : leadID // ignore: cast_nullable_to_non_nullable
                  as String,
        scheduledFor: null == scheduledFor
            ? _value.scheduledFor
            : scheduledFor // ignore: cast_nullable_to_non_nullable
                  as DateTime,
        notes: freezed == notes
            ? _value.notes
            : notes // ignore: cast_nullable_to_non_nullable
                  as String?,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$NewBookingRequestImpl implements _NewBookingRequest {
  const _$NewBookingRequestImpl({
    required this.leadID,
    required this.scheduledFor,
    this.notes,
  });

  factory _$NewBookingRequestImpl.fromJson(Map<String, dynamic> json) =>
      _$$NewBookingRequestImplFromJson(json);

  @override
  final String leadID;
  @override
  final DateTime scheduledFor;
  @override
  final String? notes;

  @override
  String toString() {
    return 'NewBookingRequest(leadID: $leadID, scheduledFor: $scheduledFor, notes: $notes)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$NewBookingRequestImpl &&
            (identical(other.leadID, leadID) || other.leadID == leadID) &&
            (identical(other.scheduledFor, scheduledFor) ||
                other.scheduledFor == scheduledFor) &&
            (identical(other.notes, notes) || other.notes == notes));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, leadID, scheduledFor, notes);

  /// Create a copy of NewBookingRequest
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$NewBookingRequestImplCopyWith<_$NewBookingRequestImpl> get copyWith =>
      __$$NewBookingRequestImplCopyWithImpl<_$NewBookingRequestImpl>(
        this,
        _$identity,
      );

  @override
  Map<String, dynamic> toJson() {
    return _$$NewBookingRequestImplToJson(this);
  }
}

abstract class _NewBookingRequest implements NewBookingRequest {
  const factory _NewBookingRequest({
    required final String leadID,
    required final DateTime scheduledFor,
    final String? notes,
  }) = _$NewBookingRequestImpl;

  factory _NewBookingRequest.fromJson(Map<String, dynamic> json) =
      _$NewBookingRequestImpl.fromJson;

  @override
  String get leadID;
  @override
  DateTime get scheduledFor;
  @override
  String? get notes;

  /// Create a copy of NewBookingRequest
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$NewBookingRequestImplCopyWith<_$NewBookingRequestImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
