// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'app_session.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
  'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models',
);

AppSession _$AppSessionFromJson(Map<String, dynamic> json) {
  return _AppSession.fromJson(json);
}

/// @nodoc
mixin _$AppSession {
  String get accessToken => throw _privateConstructorUsedError;
  String get refreshToken => throw _privateConstructorUsedError;
  DateTime get expiresAt => throw _privateConstructorUsedError;
  UserProfile get userProfile => throw _privateConstructorUsedError;

  /// Serializes this AppSession to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of AppSession
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $AppSessionCopyWith<AppSession> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $AppSessionCopyWith<$Res> {
  factory $AppSessionCopyWith(
    AppSession value,
    $Res Function(AppSession) then,
  ) = _$AppSessionCopyWithImpl<$Res, AppSession>;
  @useResult
  $Res call({
    String accessToken,
    String refreshToken,
    DateTime expiresAt,
    UserProfile userProfile,
  });

  $UserProfileCopyWith<$Res> get userProfile;
}

/// @nodoc
class _$AppSessionCopyWithImpl<$Res, $Val extends AppSession>
    implements $AppSessionCopyWith<$Res> {
  _$AppSessionCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of AppSession
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? accessToken = null,
    Object? refreshToken = null,
    Object? expiresAt = null,
    Object? userProfile = null,
  }) {
    return _then(
      _value.copyWith(
            accessToken: null == accessToken
                ? _value.accessToken
                : accessToken // ignore: cast_nullable_to_non_nullable
                      as String,
            refreshToken: null == refreshToken
                ? _value.refreshToken
                : refreshToken // ignore: cast_nullable_to_non_nullable
                      as String,
            expiresAt: null == expiresAt
                ? _value.expiresAt
                : expiresAt // ignore: cast_nullable_to_non_nullable
                      as DateTime,
            userProfile: null == userProfile
                ? _value.userProfile
                : userProfile // ignore: cast_nullable_to_non_nullable
                      as UserProfile,
          )
          as $Val,
    );
  }

  /// Create a copy of AppSession
  /// with the given fields replaced by the non-null parameter values.
  @override
  @pragma('vm:prefer-inline')
  $UserProfileCopyWith<$Res> get userProfile {
    return $UserProfileCopyWith<$Res>(_value.userProfile, (value) {
      return _then(_value.copyWith(userProfile: value) as $Val);
    });
  }
}

/// @nodoc
abstract class _$$AppSessionImplCopyWith<$Res>
    implements $AppSessionCopyWith<$Res> {
  factory _$$AppSessionImplCopyWith(
    _$AppSessionImpl value,
    $Res Function(_$AppSessionImpl) then,
  ) = __$$AppSessionImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    String accessToken,
    String refreshToken,
    DateTime expiresAt,
    UserProfile userProfile,
  });

  @override
  $UserProfileCopyWith<$Res> get userProfile;
}

/// @nodoc
class __$$AppSessionImplCopyWithImpl<$Res>
    extends _$AppSessionCopyWithImpl<$Res, _$AppSessionImpl>
    implements _$$AppSessionImplCopyWith<$Res> {
  __$$AppSessionImplCopyWithImpl(
    _$AppSessionImpl _value,
    $Res Function(_$AppSessionImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of AppSession
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? accessToken = null,
    Object? refreshToken = null,
    Object? expiresAt = null,
    Object? userProfile = null,
  }) {
    return _then(
      _$AppSessionImpl(
        accessToken: null == accessToken
            ? _value.accessToken
            : accessToken // ignore: cast_nullable_to_non_nullable
                  as String,
        refreshToken: null == refreshToken
            ? _value.refreshToken
            : refreshToken // ignore: cast_nullable_to_non_nullable
                  as String,
        expiresAt: null == expiresAt
            ? _value.expiresAt
            : expiresAt // ignore: cast_nullable_to_non_nullable
                  as DateTime,
        userProfile: null == userProfile
            ? _value.userProfile
            : userProfile // ignore: cast_nullable_to_non_nullable
                  as UserProfile,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$AppSessionImpl implements _AppSession {
  const _$AppSessionImpl({
    required this.accessToken,
    required this.refreshToken,
    required this.expiresAt,
    required this.userProfile,
  });

  factory _$AppSessionImpl.fromJson(Map<String, dynamic> json) =>
      _$$AppSessionImplFromJson(json);

  @override
  final String accessToken;
  @override
  final String refreshToken;
  @override
  final DateTime expiresAt;
  @override
  final UserProfile userProfile;

  @override
  String toString() {
    return 'AppSession(accessToken: $accessToken, refreshToken: $refreshToken, expiresAt: $expiresAt, userProfile: $userProfile)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$AppSessionImpl &&
            (identical(other.accessToken, accessToken) ||
                other.accessToken == accessToken) &&
            (identical(other.refreshToken, refreshToken) ||
                other.refreshToken == refreshToken) &&
            (identical(other.expiresAt, expiresAt) ||
                other.expiresAt == expiresAt) &&
            (identical(other.userProfile, userProfile) ||
                other.userProfile == userProfile));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
    runtimeType,
    accessToken,
    refreshToken,
    expiresAt,
    userProfile,
  );

  /// Create a copy of AppSession
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$AppSessionImplCopyWith<_$AppSessionImpl> get copyWith =>
      __$$AppSessionImplCopyWithImpl<_$AppSessionImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$AppSessionImplToJson(this);
  }
}

abstract class _AppSession implements AppSession {
  const factory _AppSession({
    required final String accessToken,
    required final String refreshToken,
    required final DateTime expiresAt,
    required final UserProfile userProfile,
  }) = _$AppSessionImpl;

  factory _AppSession.fromJson(Map<String, dynamic> json) =
      _$AppSessionImpl.fromJson;

  @override
  String get accessToken;
  @override
  String get refreshToken;
  @override
  DateTime get expiresAt;
  @override
  UserProfile get userProfile;

  /// Create a copy of AppSession
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$AppSessionImplCopyWith<_$AppSessionImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

AuthSessionPayload _$AuthSessionPayloadFromJson(Map<String, dynamic> json) {
  return _AuthSessionPayload.fromJson(json);
}

/// @nodoc
mixin _$AuthSessionPayload {
  String get accessToken => throw _privateConstructorUsedError;
  String get refreshToken => throw _privateConstructorUsedError;
  DateTime get expiresAt => throw _privateConstructorUsedError;
  String get userID => throw _privateConstructorUsedError;

  /// Serializes this AuthSessionPayload to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of AuthSessionPayload
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $AuthSessionPayloadCopyWith<AuthSessionPayload> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $AuthSessionPayloadCopyWith<$Res> {
  factory $AuthSessionPayloadCopyWith(
    AuthSessionPayload value,
    $Res Function(AuthSessionPayload) then,
  ) = _$AuthSessionPayloadCopyWithImpl<$Res, AuthSessionPayload>;
  @useResult
  $Res call({
    String accessToken,
    String refreshToken,
    DateTime expiresAt,
    String userID,
  });
}

/// @nodoc
class _$AuthSessionPayloadCopyWithImpl<$Res, $Val extends AuthSessionPayload>
    implements $AuthSessionPayloadCopyWith<$Res> {
  _$AuthSessionPayloadCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of AuthSessionPayload
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? accessToken = null,
    Object? refreshToken = null,
    Object? expiresAt = null,
    Object? userID = null,
  }) {
    return _then(
      _value.copyWith(
            accessToken: null == accessToken
                ? _value.accessToken
                : accessToken // ignore: cast_nullable_to_non_nullable
                      as String,
            refreshToken: null == refreshToken
                ? _value.refreshToken
                : refreshToken // ignore: cast_nullable_to_non_nullable
                      as String,
            expiresAt: null == expiresAt
                ? _value.expiresAt
                : expiresAt // ignore: cast_nullable_to_non_nullable
                      as DateTime,
            userID: null == userID
                ? _value.userID
                : userID // ignore: cast_nullable_to_non_nullable
                      as String,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$AuthSessionPayloadImplCopyWith<$Res>
    implements $AuthSessionPayloadCopyWith<$Res> {
  factory _$$AuthSessionPayloadImplCopyWith(
    _$AuthSessionPayloadImpl value,
    $Res Function(_$AuthSessionPayloadImpl) then,
  ) = __$$AuthSessionPayloadImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    String accessToken,
    String refreshToken,
    DateTime expiresAt,
    String userID,
  });
}

/// @nodoc
class __$$AuthSessionPayloadImplCopyWithImpl<$Res>
    extends _$AuthSessionPayloadCopyWithImpl<$Res, _$AuthSessionPayloadImpl>
    implements _$$AuthSessionPayloadImplCopyWith<$Res> {
  __$$AuthSessionPayloadImplCopyWithImpl(
    _$AuthSessionPayloadImpl _value,
    $Res Function(_$AuthSessionPayloadImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of AuthSessionPayload
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? accessToken = null,
    Object? refreshToken = null,
    Object? expiresAt = null,
    Object? userID = null,
  }) {
    return _then(
      _$AuthSessionPayloadImpl(
        accessToken: null == accessToken
            ? _value.accessToken
            : accessToken // ignore: cast_nullable_to_non_nullable
                  as String,
        refreshToken: null == refreshToken
            ? _value.refreshToken
            : refreshToken // ignore: cast_nullable_to_non_nullable
                  as String,
        expiresAt: null == expiresAt
            ? _value.expiresAt
            : expiresAt // ignore: cast_nullable_to_non_nullable
                  as DateTime,
        userID: null == userID
            ? _value.userID
            : userID // ignore: cast_nullable_to_non_nullable
                  as String,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$AuthSessionPayloadImpl implements _AuthSessionPayload {
  const _$AuthSessionPayloadImpl({
    required this.accessToken,
    required this.refreshToken,
    required this.expiresAt,
    required this.userID,
  });

  factory _$AuthSessionPayloadImpl.fromJson(Map<String, dynamic> json) =>
      _$$AuthSessionPayloadImplFromJson(json);

  @override
  final String accessToken;
  @override
  final String refreshToken;
  @override
  final DateTime expiresAt;
  @override
  final String userID;

  @override
  String toString() {
    return 'AuthSessionPayload(accessToken: $accessToken, refreshToken: $refreshToken, expiresAt: $expiresAt, userID: $userID)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$AuthSessionPayloadImpl &&
            (identical(other.accessToken, accessToken) ||
                other.accessToken == accessToken) &&
            (identical(other.refreshToken, refreshToken) ||
                other.refreshToken == refreshToken) &&
            (identical(other.expiresAt, expiresAt) ||
                other.expiresAt == expiresAt) &&
            (identical(other.userID, userID) || other.userID == userID));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode =>
      Object.hash(runtimeType, accessToken, refreshToken, expiresAt, userID);

  /// Create a copy of AuthSessionPayload
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$AuthSessionPayloadImplCopyWith<_$AuthSessionPayloadImpl> get copyWith =>
      __$$AuthSessionPayloadImplCopyWithImpl<_$AuthSessionPayloadImpl>(
        this,
        _$identity,
      );

  @override
  Map<String, dynamic> toJson() {
    return _$$AuthSessionPayloadImplToJson(this);
  }
}

abstract class _AuthSessionPayload implements AuthSessionPayload {
  const factory _AuthSessionPayload({
    required final String accessToken,
    required final String refreshToken,
    required final DateTime expiresAt,
    required final String userID,
  }) = _$AuthSessionPayloadImpl;

  factory _AuthSessionPayload.fromJson(Map<String, dynamic> json) =
      _$AuthSessionPayloadImpl.fromJson;

  @override
  String get accessToken;
  @override
  String get refreshToken;
  @override
  DateTime get expiresAt;
  @override
  String get userID;

  /// Create a copy of AuthSessionPayload
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$AuthSessionPayloadImplCopyWith<_$AuthSessionPayloadImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
