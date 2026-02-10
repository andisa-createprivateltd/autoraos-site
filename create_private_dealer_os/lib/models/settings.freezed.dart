// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'settings.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
  'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models',
);

DealerSettings _$DealerSettingsFromJson(Map<String, dynamic> json) {
  return _DealerSettings.fromJson(json);
}

/// @nodoc
mixin _$DealerSettings {
  Map<String, BusinessHours> get businessHours =>
      throw _privateConstructorUsedError;
  List<FAQ> get faqs => throw _privateConstructorUsedError;
  bool get marketingCanViewMessages => throw _privateConstructorUsedError;
  bool get allowAdminFullPhone => throw _privateConstructorUsedError;

  /// Serializes this DealerSettings to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of DealerSettings
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $DealerSettingsCopyWith<DealerSettings> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $DealerSettingsCopyWith<$Res> {
  factory $DealerSettingsCopyWith(
    DealerSettings value,
    $Res Function(DealerSettings) then,
  ) = _$DealerSettingsCopyWithImpl<$Res, DealerSettings>;
  @useResult
  $Res call({
    Map<String, BusinessHours> businessHours,
    List<FAQ> faqs,
    bool marketingCanViewMessages,
    bool allowAdminFullPhone,
  });
}

/// @nodoc
class _$DealerSettingsCopyWithImpl<$Res, $Val extends DealerSettings>
    implements $DealerSettingsCopyWith<$Res> {
  _$DealerSettingsCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of DealerSettings
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? businessHours = null,
    Object? faqs = null,
    Object? marketingCanViewMessages = null,
    Object? allowAdminFullPhone = null,
  }) {
    return _then(
      _value.copyWith(
            businessHours: null == businessHours
                ? _value.businessHours
                : businessHours // ignore: cast_nullable_to_non_nullable
                      as Map<String, BusinessHours>,
            faqs: null == faqs
                ? _value.faqs
                : faqs // ignore: cast_nullable_to_non_nullable
                      as List<FAQ>,
            marketingCanViewMessages: null == marketingCanViewMessages
                ? _value.marketingCanViewMessages
                : marketingCanViewMessages // ignore: cast_nullable_to_non_nullable
                      as bool,
            allowAdminFullPhone: null == allowAdminFullPhone
                ? _value.allowAdminFullPhone
                : allowAdminFullPhone // ignore: cast_nullable_to_non_nullable
                      as bool,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$DealerSettingsImplCopyWith<$Res>
    implements $DealerSettingsCopyWith<$Res> {
  factory _$$DealerSettingsImplCopyWith(
    _$DealerSettingsImpl value,
    $Res Function(_$DealerSettingsImpl) then,
  ) = __$$DealerSettingsImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    Map<String, BusinessHours> businessHours,
    List<FAQ> faqs,
    bool marketingCanViewMessages,
    bool allowAdminFullPhone,
  });
}

/// @nodoc
class __$$DealerSettingsImplCopyWithImpl<$Res>
    extends _$DealerSettingsCopyWithImpl<$Res, _$DealerSettingsImpl>
    implements _$$DealerSettingsImplCopyWith<$Res> {
  __$$DealerSettingsImplCopyWithImpl(
    _$DealerSettingsImpl _value,
    $Res Function(_$DealerSettingsImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of DealerSettings
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? businessHours = null,
    Object? faqs = null,
    Object? marketingCanViewMessages = null,
    Object? allowAdminFullPhone = null,
  }) {
    return _then(
      _$DealerSettingsImpl(
        businessHours: null == businessHours
            ? _value._businessHours
            : businessHours // ignore: cast_nullable_to_non_nullable
                  as Map<String, BusinessHours>,
        faqs: null == faqs
            ? _value._faqs
            : faqs // ignore: cast_nullable_to_non_nullable
                  as List<FAQ>,
        marketingCanViewMessages: null == marketingCanViewMessages
            ? _value.marketingCanViewMessages
            : marketingCanViewMessages // ignore: cast_nullable_to_non_nullable
                  as bool,
        allowAdminFullPhone: null == allowAdminFullPhone
            ? _value.allowAdminFullPhone
            : allowAdminFullPhone // ignore: cast_nullable_to_non_nullable
                  as bool,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$DealerSettingsImpl implements _DealerSettings {
  const _$DealerSettingsImpl({
    required final Map<String, BusinessHours> businessHours,
    required final List<FAQ> faqs,
    required this.marketingCanViewMessages,
    required this.allowAdminFullPhone,
  }) : _businessHours = businessHours,
       _faqs = faqs;

  factory _$DealerSettingsImpl.fromJson(Map<String, dynamic> json) =>
      _$$DealerSettingsImplFromJson(json);

  final Map<String, BusinessHours> _businessHours;
  @override
  Map<String, BusinessHours> get businessHours {
    if (_businessHours is EqualUnmodifiableMapView) return _businessHours;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableMapView(_businessHours);
  }

  final List<FAQ> _faqs;
  @override
  List<FAQ> get faqs {
    if (_faqs is EqualUnmodifiableListView) return _faqs;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_faqs);
  }

  @override
  final bool marketingCanViewMessages;
  @override
  final bool allowAdminFullPhone;

  @override
  String toString() {
    return 'DealerSettings(businessHours: $businessHours, faqs: $faqs, marketingCanViewMessages: $marketingCanViewMessages, allowAdminFullPhone: $allowAdminFullPhone)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$DealerSettingsImpl &&
            const DeepCollectionEquality().equals(
              other._businessHours,
              _businessHours,
            ) &&
            const DeepCollectionEquality().equals(other._faqs, _faqs) &&
            (identical(
                  other.marketingCanViewMessages,
                  marketingCanViewMessages,
                ) ||
                other.marketingCanViewMessages == marketingCanViewMessages) &&
            (identical(other.allowAdminFullPhone, allowAdminFullPhone) ||
                other.allowAdminFullPhone == allowAdminFullPhone));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
    runtimeType,
    const DeepCollectionEquality().hash(_businessHours),
    const DeepCollectionEquality().hash(_faqs),
    marketingCanViewMessages,
    allowAdminFullPhone,
  );

  /// Create a copy of DealerSettings
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$DealerSettingsImplCopyWith<_$DealerSettingsImpl> get copyWith =>
      __$$DealerSettingsImplCopyWithImpl<_$DealerSettingsImpl>(
        this,
        _$identity,
      );

  @override
  Map<String, dynamic> toJson() {
    return _$$DealerSettingsImplToJson(this);
  }
}

abstract class _DealerSettings implements DealerSettings {
  const factory _DealerSettings({
    required final Map<String, BusinessHours> businessHours,
    required final List<FAQ> faqs,
    required final bool marketingCanViewMessages,
    required final bool allowAdminFullPhone,
  }) = _$DealerSettingsImpl;

  factory _DealerSettings.fromJson(Map<String, dynamic> json) =
      _$DealerSettingsImpl.fromJson;

  @override
  Map<String, BusinessHours> get businessHours;
  @override
  List<FAQ> get faqs;
  @override
  bool get marketingCanViewMessages;
  @override
  bool get allowAdminFullPhone;

  /// Create a copy of DealerSettings
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$DealerSettingsImplCopyWith<_$DealerSettingsImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

BusinessHours _$BusinessHoursFromJson(Map<String, dynamic> json) {
  return _BusinessHours.fromJson(json);
}

/// @nodoc
mixin _$BusinessHours {
  String get open => throw _privateConstructorUsedError;
  String get close => throw _privateConstructorUsedError;

  /// Serializes this BusinessHours to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of BusinessHours
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $BusinessHoursCopyWith<BusinessHours> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $BusinessHoursCopyWith<$Res> {
  factory $BusinessHoursCopyWith(
    BusinessHours value,
    $Res Function(BusinessHours) then,
  ) = _$BusinessHoursCopyWithImpl<$Res, BusinessHours>;
  @useResult
  $Res call({String open, String close});
}

/// @nodoc
class _$BusinessHoursCopyWithImpl<$Res, $Val extends BusinessHours>
    implements $BusinessHoursCopyWith<$Res> {
  _$BusinessHoursCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of BusinessHours
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({Object? open = null, Object? close = null}) {
    return _then(
      _value.copyWith(
            open: null == open
                ? _value.open
                : open // ignore: cast_nullable_to_non_nullable
                      as String,
            close: null == close
                ? _value.close
                : close // ignore: cast_nullable_to_non_nullable
                      as String,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$BusinessHoursImplCopyWith<$Res>
    implements $BusinessHoursCopyWith<$Res> {
  factory _$$BusinessHoursImplCopyWith(
    _$BusinessHoursImpl value,
    $Res Function(_$BusinessHoursImpl) then,
  ) = __$$BusinessHoursImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({String open, String close});
}

/// @nodoc
class __$$BusinessHoursImplCopyWithImpl<$Res>
    extends _$BusinessHoursCopyWithImpl<$Res, _$BusinessHoursImpl>
    implements _$$BusinessHoursImplCopyWith<$Res> {
  __$$BusinessHoursImplCopyWithImpl(
    _$BusinessHoursImpl _value,
    $Res Function(_$BusinessHoursImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of BusinessHours
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({Object? open = null, Object? close = null}) {
    return _then(
      _$BusinessHoursImpl(
        open: null == open
            ? _value.open
            : open // ignore: cast_nullable_to_non_nullable
                  as String,
        close: null == close
            ? _value.close
            : close // ignore: cast_nullable_to_non_nullable
                  as String,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$BusinessHoursImpl implements _BusinessHours {
  const _$BusinessHoursImpl({required this.open, required this.close});

  factory _$BusinessHoursImpl.fromJson(Map<String, dynamic> json) =>
      _$$BusinessHoursImplFromJson(json);

  @override
  final String open;
  @override
  final String close;

  @override
  String toString() {
    return 'BusinessHours(open: $open, close: $close)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$BusinessHoursImpl &&
            (identical(other.open, open) || other.open == open) &&
            (identical(other.close, close) || other.close == close));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, open, close);

  /// Create a copy of BusinessHours
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$BusinessHoursImplCopyWith<_$BusinessHoursImpl> get copyWith =>
      __$$BusinessHoursImplCopyWithImpl<_$BusinessHoursImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$BusinessHoursImplToJson(this);
  }
}

abstract class _BusinessHours implements BusinessHours {
  const factory _BusinessHours({
    required final String open,
    required final String close,
  }) = _$BusinessHoursImpl;

  factory _BusinessHours.fromJson(Map<String, dynamic> json) =
      _$BusinessHoursImpl.fromJson;

  @override
  String get open;
  @override
  String get close;

  /// Create a copy of BusinessHours
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$BusinessHoursImplCopyWith<_$BusinessHoursImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

FAQ _$FAQFromJson(Map<String, dynamic> json) {
  return _FAQ.fromJson(json);
}

/// @nodoc
mixin _$FAQ {
  String get id => throw _privateConstructorUsedError;
  String get question => throw _privateConstructorUsedError;
  String get answer => throw _privateConstructorUsedError;

  /// Serializes this FAQ to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of FAQ
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $FAQCopyWith<FAQ> get copyWith => throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $FAQCopyWith<$Res> {
  factory $FAQCopyWith(FAQ value, $Res Function(FAQ) then) =
      _$FAQCopyWithImpl<$Res, FAQ>;
  @useResult
  $Res call({String id, String question, String answer});
}

/// @nodoc
class _$FAQCopyWithImpl<$Res, $Val extends FAQ> implements $FAQCopyWith<$Res> {
  _$FAQCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of FAQ
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? question = null,
    Object? answer = null,
  }) {
    return _then(
      _value.copyWith(
            id: null == id
                ? _value.id
                : id // ignore: cast_nullable_to_non_nullable
                      as String,
            question: null == question
                ? _value.question
                : question // ignore: cast_nullable_to_non_nullable
                      as String,
            answer: null == answer
                ? _value.answer
                : answer // ignore: cast_nullable_to_non_nullable
                      as String,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$FAQImplCopyWith<$Res> implements $FAQCopyWith<$Res> {
  factory _$$FAQImplCopyWith(_$FAQImpl value, $Res Function(_$FAQImpl) then) =
      __$$FAQImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({String id, String question, String answer});
}

/// @nodoc
class __$$FAQImplCopyWithImpl<$Res> extends _$FAQCopyWithImpl<$Res, _$FAQImpl>
    implements _$$FAQImplCopyWith<$Res> {
  __$$FAQImplCopyWithImpl(_$FAQImpl _value, $Res Function(_$FAQImpl) _then)
    : super(_value, _then);

  /// Create a copy of FAQ
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? question = null,
    Object? answer = null,
  }) {
    return _then(
      _$FAQImpl(
        id: null == id
            ? _value.id
            : id // ignore: cast_nullable_to_non_nullable
                  as String,
        question: null == question
            ? _value.question
            : question // ignore: cast_nullable_to_non_nullable
                  as String,
        answer: null == answer
            ? _value.answer
            : answer // ignore: cast_nullable_to_non_nullable
                  as String,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$FAQImpl implements _FAQ {
  const _$FAQImpl({
    required this.id,
    required this.question,
    required this.answer,
  });

  factory _$FAQImpl.fromJson(Map<String, dynamic> json) =>
      _$$FAQImplFromJson(json);

  @override
  final String id;
  @override
  final String question;
  @override
  final String answer;

  @override
  String toString() {
    return 'FAQ(id: $id, question: $question, answer: $answer)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$FAQImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.question, question) ||
                other.question == question) &&
            (identical(other.answer, answer) || other.answer == answer));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, id, question, answer);

  /// Create a copy of FAQ
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$FAQImplCopyWith<_$FAQImpl> get copyWith =>
      __$$FAQImplCopyWithImpl<_$FAQImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$FAQImplToJson(this);
  }
}

abstract class _FAQ implements FAQ {
  const factory _FAQ({
    required final String id,
    required final String question,
    required final String answer,
  }) = _$FAQImpl;

  factory _FAQ.fromJson(Map<String, dynamic> json) = _$FAQImpl.fromJson;

  @override
  String get id;
  @override
  String get question;
  @override
  String get answer;

  /// Create a copy of FAQ
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$FAQImplCopyWith<_$FAQImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

TeamMember _$TeamMemberFromJson(Map<String, dynamic> json) {
  return _TeamMember.fromJson(json);
}

/// @nodoc
mixin _$TeamMember {
  String get id => throw _privateConstructorUsedError;
  String get name => throw _privateConstructorUsedError;
  String get email => throw _privateConstructorUsedError;
  String get role => throw _privateConstructorUsedError;
  bool? get isActive => throw _privateConstructorUsedError;

  /// Serializes this TeamMember to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of TeamMember
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $TeamMemberCopyWith<TeamMember> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $TeamMemberCopyWith<$Res> {
  factory $TeamMemberCopyWith(
    TeamMember value,
    $Res Function(TeamMember) then,
  ) = _$TeamMemberCopyWithImpl<$Res, TeamMember>;
  @useResult
  $Res call({
    String id,
    String name,
    String email,
    String role,
    bool? isActive,
  });
}

/// @nodoc
class _$TeamMemberCopyWithImpl<$Res, $Val extends TeamMember>
    implements $TeamMemberCopyWith<$Res> {
  _$TeamMemberCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of TeamMember
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? name = null,
    Object? email = null,
    Object? role = null,
    Object? isActive = freezed,
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
            role: null == role
                ? _value.role
                : role // ignore: cast_nullable_to_non_nullable
                      as String,
            isActive: freezed == isActive
                ? _value.isActive
                : isActive // ignore: cast_nullable_to_non_nullable
                      as bool?,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$TeamMemberImplCopyWith<$Res>
    implements $TeamMemberCopyWith<$Res> {
  factory _$$TeamMemberImplCopyWith(
    _$TeamMemberImpl value,
    $Res Function(_$TeamMemberImpl) then,
  ) = __$$TeamMemberImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    String id,
    String name,
    String email,
    String role,
    bool? isActive,
  });
}

/// @nodoc
class __$$TeamMemberImplCopyWithImpl<$Res>
    extends _$TeamMemberCopyWithImpl<$Res, _$TeamMemberImpl>
    implements _$$TeamMemberImplCopyWith<$Res> {
  __$$TeamMemberImplCopyWithImpl(
    _$TeamMemberImpl _value,
    $Res Function(_$TeamMemberImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of TeamMember
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? name = null,
    Object? email = null,
    Object? role = null,
    Object? isActive = freezed,
  }) {
    return _then(
      _$TeamMemberImpl(
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
        role: null == role
            ? _value.role
            : role // ignore: cast_nullable_to_non_nullable
                  as String,
        isActive: freezed == isActive
            ? _value.isActive
            : isActive // ignore: cast_nullable_to_non_nullable
                  as bool?,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$TeamMemberImpl implements _TeamMember {
  const _$TeamMemberImpl({
    required this.id,
    required this.name,
    required this.email,
    required this.role,
    this.isActive,
  });

  factory _$TeamMemberImpl.fromJson(Map<String, dynamic> json) =>
      _$$TeamMemberImplFromJson(json);

  @override
  final String id;
  @override
  final String name;
  @override
  final String email;
  @override
  final String role;
  @override
  final bool? isActive;

  @override
  String toString() {
    return 'TeamMember(id: $id, name: $name, email: $email, role: $role, isActive: $isActive)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$TeamMemberImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.name, name) || other.name == name) &&
            (identical(other.email, email) || other.email == email) &&
            (identical(other.role, role) || other.role == role) &&
            (identical(other.isActive, isActive) ||
                other.isActive == isActive));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, id, name, email, role, isActive);

  /// Create a copy of TeamMember
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$TeamMemberImplCopyWith<_$TeamMemberImpl> get copyWith =>
      __$$TeamMemberImplCopyWithImpl<_$TeamMemberImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$TeamMemberImplToJson(this);
  }
}

abstract class _TeamMember implements TeamMember {
  const factory _TeamMember({
    required final String id,
    required final String name,
    required final String email,
    required final String role,
    final bool? isActive,
  }) = _$TeamMemberImpl;

  factory _TeamMember.fromJson(Map<String, dynamic> json) =
      _$TeamMemberImpl.fromJson;

  @override
  String get id;
  @override
  String get name;
  @override
  String get email;
  @override
  String get role;
  @override
  bool? get isActive;

  /// Create a copy of TeamMember
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$TeamMemberImplCopyWith<_$TeamMemberImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

InviteUserRequest _$InviteUserRequestFromJson(Map<String, dynamic> json) {
  return _InviteUserRequest.fromJson(json);
}

/// @nodoc
mixin _$InviteUserRequest {
  String get email => throw _privateConstructorUsedError;
  String get role => throw _privateConstructorUsedError;

  /// Serializes this InviteUserRequest to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of InviteUserRequest
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $InviteUserRequestCopyWith<InviteUserRequest> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $InviteUserRequestCopyWith<$Res> {
  factory $InviteUserRequestCopyWith(
    InviteUserRequest value,
    $Res Function(InviteUserRequest) then,
  ) = _$InviteUserRequestCopyWithImpl<$Res, InviteUserRequest>;
  @useResult
  $Res call({String email, String role});
}

/// @nodoc
class _$InviteUserRequestCopyWithImpl<$Res, $Val extends InviteUserRequest>
    implements $InviteUserRequestCopyWith<$Res> {
  _$InviteUserRequestCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of InviteUserRequest
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({Object? email = null, Object? role = null}) {
    return _then(
      _value.copyWith(
            email: null == email
                ? _value.email
                : email // ignore: cast_nullable_to_non_nullable
                      as String,
            role: null == role
                ? _value.role
                : role // ignore: cast_nullable_to_non_nullable
                      as String,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$InviteUserRequestImplCopyWith<$Res>
    implements $InviteUserRequestCopyWith<$Res> {
  factory _$$InviteUserRequestImplCopyWith(
    _$InviteUserRequestImpl value,
    $Res Function(_$InviteUserRequestImpl) then,
  ) = __$$InviteUserRequestImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({String email, String role});
}

/// @nodoc
class __$$InviteUserRequestImplCopyWithImpl<$Res>
    extends _$InviteUserRequestCopyWithImpl<$Res, _$InviteUserRequestImpl>
    implements _$$InviteUserRequestImplCopyWith<$Res> {
  __$$InviteUserRequestImplCopyWithImpl(
    _$InviteUserRequestImpl _value,
    $Res Function(_$InviteUserRequestImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of InviteUserRequest
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({Object? email = null, Object? role = null}) {
    return _then(
      _$InviteUserRequestImpl(
        email: null == email
            ? _value.email
            : email // ignore: cast_nullable_to_non_nullable
                  as String,
        role: null == role
            ? _value.role
            : role // ignore: cast_nullable_to_non_nullable
                  as String,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$InviteUserRequestImpl implements _InviteUserRequest {
  const _$InviteUserRequestImpl({required this.email, required this.role});

  factory _$InviteUserRequestImpl.fromJson(Map<String, dynamic> json) =>
      _$$InviteUserRequestImplFromJson(json);

  @override
  final String email;
  @override
  final String role;

  @override
  String toString() {
    return 'InviteUserRequest(email: $email, role: $role)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$InviteUserRequestImpl &&
            (identical(other.email, email) || other.email == email) &&
            (identical(other.role, role) || other.role == role));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, email, role);

  /// Create a copy of InviteUserRequest
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$InviteUserRequestImplCopyWith<_$InviteUserRequestImpl> get copyWith =>
      __$$InviteUserRequestImplCopyWithImpl<_$InviteUserRequestImpl>(
        this,
        _$identity,
      );

  @override
  Map<String, dynamic> toJson() {
    return _$$InviteUserRequestImplToJson(this);
  }
}

abstract class _InviteUserRequest implements InviteUserRequest {
  const factory _InviteUserRequest({
    required final String email,
    required final String role,
  }) = _$InviteUserRequestImpl;

  factory _InviteUserRequest.fromJson(Map<String, dynamic> json) =
      _$InviteUserRequestImpl.fromJson;

  @override
  String get email;
  @override
  String get role;

  /// Create a copy of InviteUserRequest
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$InviteUserRequestImplCopyWith<_$InviteUserRequestImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
