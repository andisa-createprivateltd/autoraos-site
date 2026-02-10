// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'lead.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
  'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models',
);

Lead _$LeadFromJson(Map<String, dynamic> json) {
  return _Lead.fromJson(json);
}

/// @nodoc
mixin _$Lead {
  String get id => throw _privateConstructorUsedError;
  String get name => throw _privateConstructorUsedError;
  String get email => throw _privateConstructorUsedError;
  String get phone => throw _privateConstructorUsedError;
  LeadStatus get status => throw _privateConstructorUsedError;
  DateTime get createdAt => throw _privateConstructorUsedError;
  DateTime get updatedAt => throw _privateConstructorUsedError;
  String? get assignedToID => throw _privateConstructorUsedError;
  String? get assignedToName => throw _privateConstructorUsedError;
  String? get notes => throw _privateConstructorUsedError;
  String? get dealerID => throw _privateConstructorUsedError;

  /// Serializes this Lead to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of Lead
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $LeadCopyWith<Lead> get copyWith => throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $LeadCopyWith<$Res> {
  factory $LeadCopyWith(Lead value, $Res Function(Lead) then) =
      _$LeadCopyWithImpl<$Res, Lead>;
  @useResult
  $Res call({
    String id,
    String name,
    String email,
    String phone,
    LeadStatus status,
    DateTime createdAt,
    DateTime updatedAt,
    String? assignedToID,
    String? assignedToName,
    String? notes,
    String? dealerID,
  });
}

/// @nodoc
class _$LeadCopyWithImpl<$Res, $Val extends Lead>
    implements $LeadCopyWith<$Res> {
  _$LeadCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of Lead
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? name = null,
    Object? email = null,
    Object? phone = null,
    Object? status = null,
    Object? createdAt = null,
    Object? updatedAt = null,
    Object? assignedToID = freezed,
    Object? assignedToName = freezed,
    Object? notes = freezed,
    Object? dealerID = freezed,
  }) {
    return _then(
      _value.copyWith(
            id: null == id
                ? _value.id
                : id // ignore: cast_nullable_to_non_nullable
                      as String,
            name: null == name
                ? _value.name
                : name // ignore: cast_nullable_to_non_nullable
                      as String,
            email: null == email
                ? _value.email
                : email // ignore: cast_nullable_to_non_nullable
                      as String,
            phone: null == phone
                ? _value.phone
                : phone // ignore: cast_nullable_to_non_nullable
                      as String,
            status: null == status
                ? _value.status
                : status // ignore: cast_nullable_to_non_nullable
                      as LeadStatus,
            createdAt: null == createdAt
                ? _value.createdAt
                : createdAt // ignore: cast_nullable_to_non_nullable
                      as DateTime,
            updatedAt: null == updatedAt
                ? _value.updatedAt
                : updatedAt // ignore: cast_nullable_to_non_nullable
                      as DateTime,
            assignedToID: freezed == assignedToID
                ? _value.assignedToID
                : assignedToID // ignore: cast_nullable_to_non_nullable
                      as String?,
            assignedToName: freezed == assignedToName
                ? _value.assignedToName
                : assignedToName // ignore: cast_nullable_to_non_nullable
                      as String?,
            notes: freezed == notes
                ? _value.notes
                : notes // ignore: cast_nullable_to_non_nullable
                      as String?,
            dealerID: freezed == dealerID
                ? _value.dealerID
                : dealerID // ignore: cast_nullable_to_non_nullable
                      as String?,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$LeadImplCopyWith<$Res> implements $LeadCopyWith<$Res> {
  factory _$$LeadImplCopyWith(
    _$LeadImpl value,
    $Res Function(_$LeadImpl) then,
  ) = __$$LeadImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    String id,
    String name,
    String email,
    String phone,
    LeadStatus status,
    DateTime createdAt,
    DateTime updatedAt,
    String? assignedToID,
    String? assignedToName,
    String? notes,
    String? dealerID,
  });
}

/// @nodoc
class __$$LeadImplCopyWithImpl<$Res>
    extends _$LeadCopyWithImpl<$Res, _$LeadImpl>
    implements _$$LeadImplCopyWith<$Res> {
  __$$LeadImplCopyWithImpl(_$LeadImpl _value, $Res Function(_$LeadImpl) _then)
    : super(_value, _then);

  /// Create a copy of Lead
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? name = null,
    Object? email = null,
    Object? phone = null,
    Object? status = null,
    Object? createdAt = null,
    Object? updatedAt = null,
    Object? assignedToID = freezed,
    Object? assignedToName = freezed,
    Object? notes = freezed,
    Object? dealerID = freezed,
  }) {
    return _then(
      _$LeadImpl(
        id: null == id
            ? _value.id
            : id // ignore: cast_nullable_to_non_nullable
                  as String,
        name: null == name
            ? _value.name
            : name // ignore: cast_nullable_to_non_nullable
                  as String,
        email: null == email
            ? _value.email
            : email // ignore: cast_nullable_to_non_nullable
                  as String,
        phone: null == phone
            ? _value.phone
            : phone // ignore: cast_nullable_to_non_nullable
                  as String,
        status: null == status
            ? _value.status
            : status // ignore: cast_nullable_to_non_nullable
                  as LeadStatus,
        createdAt: null == createdAt
            ? _value.createdAt
            : createdAt // ignore: cast_nullable_to_non_nullable
                  as DateTime,
        updatedAt: null == updatedAt
            ? _value.updatedAt
            : updatedAt // ignore: cast_nullable_to_non_nullable
                  as DateTime,
        assignedToID: freezed == assignedToID
            ? _value.assignedToID
            : assignedToID // ignore: cast_nullable_to_non_nullable
                  as String?,
        assignedToName: freezed == assignedToName
            ? _value.assignedToName
            : assignedToName // ignore: cast_nullable_to_non_nullable
                  as String?,
        notes: freezed == notes
            ? _value.notes
            : notes // ignore: cast_nullable_to_non_nullable
                  as String?,
        dealerID: freezed == dealerID
            ? _value.dealerID
            : dealerID // ignore: cast_nullable_to_non_nullable
                  as String?,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$LeadImpl implements _Lead {
  const _$LeadImpl({
    required this.id,
    required this.name,
    required this.email,
    required this.phone,
    required this.status,
    required this.createdAt,
    required this.updatedAt,
    this.assignedToID,
    this.assignedToName,
    this.notes,
    this.dealerID,
  });

  factory _$LeadImpl.fromJson(Map<String, dynamic> json) =>
      _$$LeadImplFromJson(json);

  @override
  final String id;
  @override
  final String name;
  @override
  final String email;
  @override
  final String phone;
  @override
  final LeadStatus status;
  @override
  final DateTime createdAt;
  @override
  final DateTime updatedAt;
  @override
  final String? assignedToID;
  @override
  final String? assignedToName;
  @override
  final String? notes;
  @override
  final String? dealerID;

  @override
  String toString() {
    return 'Lead(id: $id, name: $name, email: $email, phone: $phone, status: $status, createdAt: $createdAt, updatedAt: $updatedAt, assignedToID: $assignedToID, assignedToName: $assignedToName, notes: $notes, dealerID: $dealerID)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$LeadImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.name, name) || other.name == name) &&
            (identical(other.email, email) || other.email == email) &&
            (identical(other.phone, phone) || other.phone == phone) &&
            (identical(other.status, status) || other.status == status) &&
            (identical(other.createdAt, createdAt) ||
                other.createdAt == createdAt) &&
            (identical(other.updatedAt, updatedAt) ||
                other.updatedAt == updatedAt) &&
            (identical(other.assignedToID, assignedToID) ||
                other.assignedToID == assignedToID) &&
            (identical(other.assignedToName, assignedToName) ||
                other.assignedToName == assignedToName) &&
            (identical(other.notes, notes) || other.notes == notes) &&
            (identical(other.dealerID, dealerID) ||
                other.dealerID == dealerID));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
    runtimeType,
    id,
    name,
    email,
    phone,
    status,
    createdAt,
    updatedAt,
    assignedToID,
    assignedToName,
    notes,
    dealerID,
  );

  /// Create a copy of Lead
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$LeadImplCopyWith<_$LeadImpl> get copyWith =>
      __$$LeadImplCopyWithImpl<_$LeadImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$LeadImplToJson(this);
  }
}

abstract class _Lead implements Lead {
  const factory _Lead({
    required final String id,
    required final String name,
    required final String email,
    required final String phone,
    required final LeadStatus status,
    required final DateTime createdAt,
    required final DateTime updatedAt,
    final String? assignedToID,
    final String? assignedToName,
    final String? notes,
    final String? dealerID,
  }) = _$LeadImpl;

  factory _Lead.fromJson(Map<String, dynamic> json) = _$LeadImpl.fromJson;

  @override
  String get id;
  @override
  String get name;
  @override
  String get email;
  @override
  String get phone;
  @override
  LeadStatus get status;
  @override
  DateTime get createdAt;
  @override
  DateTime get updatedAt;
  @override
  String? get assignedToID;
  @override
  String? get assignedToName;
  @override
  String? get notes;
  @override
  String? get dealerID;

  /// Create a copy of Lead
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$LeadImplCopyWith<_$LeadImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

LeadFilter _$LeadFilterFromJson(Map<String, dynamic> json) {
  return _LeadFilter.fromJson(json);
}

/// @nodoc
mixin _$LeadFilter {
  LeadStatus? get status => throw _privateConstructorUsedError;
  String? get assignedToID => throw _privateConstructorUsedError;
  DateTime? get createdAfter => throw _privateConstructorUsedError;
  DateTime? get createdBefore => throw _privateConstructorUsedError;

  /// Serializes this LeadFilter to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of LeadFilter
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $LeadFilterCopyWith<LeadFilter> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $LeadFilterCopyWith<$Res> {
  factory $LeadFilterCopyWith(
    LeadFilter value,
    $Res Function(LeadFilter) then,
  ) = _$LeadFilterCopyWithImpl<$Res, LeadFilter>;
  @useResult
  $Res call({
    LeadStatus? status,
    String? assignedToID,
    DateTime? createdAfter,
    DateTime? createdBefore,
  });
}

/// @nodoc
class _$LeadFilterCopyWithImpl<$Res, $Val extends LeadFilter>
    implements $LeadFilterCopyWith<$Res> {
  _$LeadFilterCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of LeadFilter
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? status = freezed,
    Object? assignedToID = freezed,
    Object? createdAfter = freezed,
    Object? createdBefore = freezed,
  }) {
    return _then(
      _value.copyWith(
            status: freezed == status
                ? _value.status
                : status // ignore: cast_nullable_to_non_nullable
                      as LeadStatus?,
            assignedToID: freezed == assignedToID
                ? _value.assignedToID
                : assignedToID // ignore: cast_nullable_to_non_nullable
                      as String?,
            createdAfter: freezed == createdAfter
                ? _value.createdAfter
                : createdAfter // ignore: cast_nullable_to_non_nullable
                      as DateTime?,
            createdBefore: freezed == createdBefore
                ? _value.createdBefore
                : createdBefore // ignore: cast_nullable_to_non_nullable
                      as DateTime?,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$LeadFilterImplCopyWith<$Res>
    implements $LeadFilterCopyWith<$Res> {
  factory _$$LeadFilterImplCopyWith(
    _$LeadFilterImpl value,
    $Res Function(_$LeadFilterImpl) then,
  ) = __$$LeadFilterImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    LeadStatus? status,
    String? assignedToID,
    DateTime? createdAfter,
    DateTime? createdBefore,
  });
}

/// @nodoc
class __$$LeadFilterImplCopyWithImpl<$Res>
    extends _$LeadFilterCopyWithImpl<$Res, _$LeadFilterImpl>
    implements _$$LeadFilterImplCopyWith<$Res> {
  __$$LeadFilterImplCopyWithImpl(
    _$LeadFilterImpl _value,
    $Res Function(_$LeadFilterImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of LeadFilter
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? status = freezed,
    Object? assignedToID = freezed,
    Object? createdAfter = freezed,
    Object? createdBefore = freezed,
  }) {
    return _then(
      _$LeadFilterImpl(
        status: freezed == status
            ? _value.status
            : status // ignore: cast_nullable_to_non_nullable
                  as LeadStatus?,
        assignedToID: freezed == assignedToID
            ? _value.assignedToID
            : assignedToID // ignore: cast_nullable_to_non_nullable
                  as String?,
        createdAfter: freezed == createdAfter
            ? _value.createdAfter
            : createdAfter // ignore: cast_nullable_to_non_nullable
                  as DateTime?,
        createdBefore: freezed == createdBefore
            ? _value.createdBefore
            : createdBefore // ignore: cast_nullable_to_non_nullable
                  as DateTime?,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$LeadFilterImpl implements _LeadFilter {
  const _$LeadFilterImpl({
    this.status,
    this.assignedToID,
    this.createdAfter,
    this.createdBefore,
  });

  factory _$LeadFilterImpl.fromJson(Map<String, dynamic> json) =>
      _$$LeadFilterImplFromJson(json);

  @override
  final LeadStatus? status;
  @override
  final String? assignedToID;
  @override
  final DateTime? createdAfter;
  @override
  final DateTime? createdBefore;

  @override
  String toString() {
    return 'LeadFilter(status: $status, assignedToID: $assignedToID, createdAfter: $createdAfter, createdBefore: $createdBefore)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$LeadFilterImpl &&
            (identical(other.status, status) || other.status == status) &&
            (identical(other.assignedToID, assignedToID) ||
                other.assignedToID == assignedToID) &&
            (identical(other.createdAfter, createdAfter) ||
                other.createdAfter == createdAfter) &&
            (identical(other.createdBefore, createdBefore) ||
                other.createdBefore == createdBefore));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
    runtimeType,
    status,
    assignedToID,
    createdAfter,
    createdBefore,
  );

  /// Create a copy of LeadFilter
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$LeadFilterImplCopyWith<_$LeadFilterImpl> get copyWith =>
      __$$LeadFilterImplCopyWithImpl<_$LeadFilterImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$LeadFilterImplToJson(this);
  }
}

abstract class _LeadFilter implements LeadFilter {
  const factory _LeadFilter({
    final LeadStatus? status,
    final String? assignedToID,
    final DateTime? createdAfter,
    final DateTime? createdBefore,
  }) = _$LeadFilterImpl;

  factory _LeadFilter.fromJson(Map<String, dynamic> json) =
      _$LeadFilterImpl.fromJson;

  @override
  LeadStatus? get status;
  @override
  String? get assignedToID;
  @override
  DateTime? get createdAfter;
  @override
  DateTime? get createdBefore;

  /// Create a copy of LeadFilter
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$LeadFilterImplCopyWith<_$LeadFilterImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

FollowupItem _$FollowupItemFromJson(Map<String, dynamic> json) {
  return _FollowupItem.fromJson(json);
}

/// @nodoc
mixin _$FollowupItem {
  String get id => throw _privateConstructorUsedError;
  String get leadID => throw _privateConstructorUsedError;
  DateTime get scheduledFor => throw _privateConstructorUsedError;
  String get notes => throw _privateConstructorUsedError;
  String? get completedAt => throw _privateConstructorUsedError;

  /// Serializes this FollowupItem to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of FollowupItem
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $FollowupItemCopyWith<FollowupItem> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $FollowupItemCopyWith<$Res> {
  factory $FollowupItemCopyWith(
    FollowupItem value,
    $Res Function(FollowupItem) then,
  ) = _$FollowupItemCopyWithImpl<$Res, FollowupItem>;
  @useResult
  $Res call({
    String id,
    String leadID,
    DateTime scheduledFor,
    String notes,
    String? completedAt,
  });
}

/// @nodoc
class _$FollowupItemCopyWithImpl<$Res, $Val extends FollowupItem>
    implements $FollowupItemCopyWith<$Res> {
  _$FollowupItemCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of FollowupItem
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? leadID = null,
    Object? scheduledFor = null,
    Object? notes = null,
    Object? completedAt = freezed,
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
            scheduledFor: null == scheduledFor
                ? _value.scheduledFor
                : scheduledFor // ignore: cast_nullable_to_non_nullable
                      as DateTime,
            notes: null == notes
                ? _value.notes
                : notes // ignore: cast_nullable_to_non_nullable
                      as String,
            completedAt: freezed == completedAt
                ? _value.completedAt
                : completedAt // ignore: cast_nullable_to_non_nullable
                      as String?,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$FollowupItemImplCopyWith<$Res>
    implements $FollowupItemCopyWith<$Res> {
  factory _$$FollowupItemImplCopyWith(
    _$FollowupItemImpl value,
    $Res Function(_$FollowupItemImpl) then,
  ) = __$$FollowupItemImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    String id,
    String leadID,
    DateTime scheduledFor,
    String notes,
    String? completedAt,
  });
}

/// @nodoc
class __$$FollowupItemImplCopyWithImpl<$Res>
    extends _$FollowupItemCopyWithImpl<$Res, _$FollowupItemImpl>
    implements _$$FollowupItemImplCopyWith<$Res> {
  __$$FollowupItemImplCopyWithImpl(
    _$FollowupItemImpl _value,
    $Res Function(_$FollowupItemImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of FollowupItem
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? leadID = null,
    Object? scheduledFor = null,
    Object? notes = null,
    Object? completedAt = freezed,
  }) {
    return _then(
      _$FollowupItemImpl(
        id: null == id
            ? _value.id
            : id // ignore: cast_nullable_to_non_nullable
                  as String,
        leadID: null == leadID
            ? _value.leadID
            : leadID // ignore: cast_nullable_to_non_nullable
                  as String,
        scheduledFor: null == scheduledFor
            ? _value.scheduledFor
            : scheduledFor // ignore: cast_nullable_to_non_nullable
                  as DateTime,
        notes: null == notes
            ? _value.notes
            : notes // ignore: cast_nullable_to_non_nullable
                  as String,
        completedAt: freezed == completedAt
            ? _value.completedAt
            : completedAt // ignore: cast_nullable_to_non_nullable
                  as String?,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$FollowupItemImpl implements _FollowupItem {
  const _$FollowupItemImpl({
    required this.id,
    required this.leadID,
    required this.scheduledFor,
    required this.notes,
    this.completedAt,
  });

  factory _$FollowupItemImpl.fromJson(Map<String, dynamic> json) =>
      _$$FollowupItemImplFromJson(json);

  @override
  final String id;
  @override
  final String leadID;
  @override
  final DateTime scheduledFor;
  @override
  final String notes;
  @override
  final String? completedAt;

  @override
  String toString() {
    return 'FollowupItem(id: $id, leadID: $leadID, scheduledFor: $scheduledFor, notes: $notes, completedAt: $completedAt)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$FollowupItemImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.leadID, leadID) || other.leadID == leadID) &&
            (identical(other.scheduledFor, scheduledFor) ||
                other.scheduledFor == scheduledFor) &&
            (identical(other.notes, notes) || other.notes == notes) &&
            (identical(other.completedAt, completedAt) ||
                other.completedAt == completedAt));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode =>
      Object.hash(runtimeType, id, leadID, scheduledFor, notes, completedAt);

  /// Create a copy of FollowupItem
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$FollowupItemImplCopyWith<_$FollowupItemImpl> get copyWith =>
      __$$FollowupItemImplCopyWithImpl<_$FollowupItemImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$FollowupItemImplToJson(this);
  }
}

abstract class _FollowupItem implements FollowupItem {
  const factory _FollowupItem({
    required final String id,
    required final String leadID,
    required final DateTime scheduledFor,
    required final String notes,
    final String? completedAt,
  }) = _$FollowupItemImpl;

  factory _FollowupItem.fromJson(Map<String, dynamic> json) =
      _$FollowupItemImpl.fromJson;

  @override
  String get id;
  @override
  String get leadID;
  @override
  DateTime get scheduledFor;
  @override
  String get notes;
  @override
  String? get completedAt;

  /// Create a copy of FollowupItem
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$FollowupItemImplCopyWith<_$FollowupItemImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
