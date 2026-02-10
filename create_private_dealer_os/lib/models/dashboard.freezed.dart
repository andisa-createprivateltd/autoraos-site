// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'dashboard.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
  'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models',
);

DashboardMetrics _$DashboardMetricsFromJson(Map<String, dynamic> json) {
  return _DashboardMetrics.fromJson(json);
}

/// @nodoc
mixin _$DashboardMetrics {
  int get totalLeads => throw _privateConstructorUsedError;
  int get activeLeads => throw _privateConstructorUsedError;
  int get completedBookings => throw _privateConstructorUsedError;
  int get pendingBookings => throw _privateConstructorUsedError;
  int get unreadMessages => throw _privateConstructorUsedError;
  double get conversionRate => throw _privateConstructorUsedError;
  double get averageResponseTime => throw _privateConstructorUsedError;
  List<DailyMetric> get dailyMetrics => throw _privateConstructorUsedError;

  /// Serializes this DashboardMetrics to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of DashboardMetrics
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $DashboardMetricsCopyWith<DashboardMetrics> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $DashboardMetricsCopyWith<$Res> {
  factory $DashboardMetricsCopyWith(
    DashboardMetrics value,
    $Res Function(DashboardMetrics) then,
  ) = _$DashboardMetricsCopyWithImpl<$Res, DashboardMetrics>;
  @useResult
  $Res call({
    int totalLeads,
    int activeLeads,
    int completedBookings,
    int pendingBookings,
    int unreadMessages,
    double conversionRate,
    double averageResponseTime,
    List<DailyMetric> dailyMetrics,
  });
}

/// @nodoc
class _$DashboardMetricsCopyWithImpl<$Res, $Val extends DashboardMetrics>
    implements $DashboardMetricsCopyWith<$Res> {
  _$DashboardMetricsCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of DashboardMetrics
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? totalLeads = null,
    Object? activeLeads = null,
    Object? completedBookings = null,
    Object? pendingBookings = null,
    Object? unreadMessages = null,
    Object? conversionRate = null,
    Object? averageResponseTime = null,
    Object? dailyMetrics = null,
  }) {
    return _then(
      _value.copyWith(
            totalLeads: null == totalLeads
                ? _value.totalLeads
                : totalLeads // ignore: cast_nullable_to_non_nullable
                      as int,
            activeLeads: null == activeLeads
                ? _value.activeLeads
                : activeLeads // ignore: cast_nullable_to_non_nullable
                      as int,
            completedBookings: null == completedBookings
                ? _value.completedBookings
                : completedBookings // ignore: cast_nullable_to_non_nullable
                      as int,
            pendingBookings: null == pendingBookings
                ? _value.pendingBookings
                : pendingBookings // ignore: cast_nullable_to_non_nullable
                      as int,
            unreadMessages: null == unreadMessages
                ? _value.unreadMessages
                : unreadMessages // ignore: cast_nullable_to_non_nullable
                      as int,
            conversionRate: null == conversionRate
                ? _value.conversionRate
                : conversionRate // ignore: cast_nullable_to_non_nullable
                      as double,
            averageResponseTime: null == averageResponseTime
                ? _value.averageResponseTime
                : averageResponseTime // ignore: cast_nullable_to_non_nullable
                      as double,
            dailyMetrics: null == dailyMetrics
                ? _value.dailyMetrics
                : dailyMetrics // ignore: cast_nullable_to_non_nullable
                      as List<DailyMetric>,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$DashboardMetricsImplCopyWith<$Res>
    implements $DashboardMetricsCopyWith<$Res> {
  factory _$$DashboardMetricsImplCopyWith(
    _$DashboardMetricsImpl value,
    $Res Function(_$DashboardMetricsImpl) then,
  ) = __$$DashboardMetricsImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    int totalLeads,
    int activeLeads,
    int completedBookings,
    int pendingBookings,
    int unreadMessages,
    double conversionRate,
    double averageResponseTime,
    List<DailyMetric> dailyMetrics,
  });
}

/// @nodoc
class __$$DashboardMetricsImplCopyWithImpl<$Res>
    extends _$DashboardMetricsCopyWithImpl<$Res, _$DashboardMetricsImpl>
    implements _$$DashboardMetricsImplCopyWith<$Res> {
  __$$DashboardMetricsImplCopyWithImpl(
    _$DashboardMetricsImpl _value,
    $Res Function(_$DashboardMetricsImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of DashboardMetrics
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? totalLeads = null,
    Object? activeLeads = null,
    Object? completedBookings = null,
    Object? pendingBookings = null,
    Object? unreadMessages = null,
    Object? conversionRate = null,
    Object? averageResponseTime = null,
    Object? dailyMetrics = null,
  }) {
    return _then(
      _$DashboardMetricsImpl(
        totalLeads: null == totalLeads
            ? _value.totalLeads
            : totalLeads // ignore: cast_nullable_to_non_nullable
                  as int,
        activeLeads: null == activeLeads
            ? _value.activeLeads
            : activeLeads // ignore: cast_nullable_to_non_nullable
                  as int,
        completedBookings: null == completedBookings
            ? _value.completedBookings
            : completedBookings // ignore: cast_nullable_to_non_nullable
                  as int,
        pendingBookings: null == pendingBookings
            ? _value.pendingBookings
            : pendingBookings // ignore: cast_nullable_to_non_nullable
                  as int,
        unreadMessages: null == unreadMessages
            ? _value.unreadMessages
            : unreadMessages // ignore: cast_nullable_to_non_nullable
                  as int,
        conversionRate: null == conversionRate
            ? _value.conversionRate
            : conversionRate // ignore: cast_nullable_to_non_nullable
                  as double,
        averageResponseTime: null == averageResponseTime
            ? _value.averageResponseTime
            : averageResponseTime // ignore: cast_nullable_to_non_nullable
                  as double,
        dailyMetrics: null == dailyMetrics
            ? _value._dailyMetrics
            : dailyMetrics // ignore: cast_nullable_to_non_nullable
                  as List<DailyMetric>,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$DashboardMetricsImpl implements _DashboardMetrics {
  const _$DashboardMetricsImpl({
    required this.totalLeads,
    required this.activeLeads,
    required this.completedBookings,
    required this.pendingBookings,
    required this.unreadMessages,
    required this.conversionRate,
    required this.averageResponseTime,
    required final List<DailyMetric> dailyMetrics,
  }) : _dailyMetrics = dailyMetrics;

  factory _$DashboardMetricsImpl.fromJson(Map<String, dynamic> json) =>
      _$$DashboardMetricsImplFromJson(json);

  @override
  final int totalLeads;
  @override
  final int activeLeads;
  @override
  final int completedBookings;
  @override
  final int pendingBookings;
  @override
  final int unreadMessages;
  @override
  final double conversionRate;
  @override
  final double averageResponseTime;
  final List<DailyMetric> _dailyMetrics;
  @override
  List<DailyMetric> get dailyMetrics {
    if (_dailyMetrics is EqualUnmodifiableListView) return _dailyMetrics;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_dailyMetrics);
  }

  @override
  String toString() {
    return 'DashboardMetrics(totalLeads: $totalLeads, activeLeads: $activeLeads, completedBookings: $completedBookings, pendingBookings: $pendingBookings, unreadMessages: $unreadMessages, conversionRate: $conversionRate, averageResponseTime: $averageResponseTime, dailyMetrics: $dailyMetrics)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$DashboardMetricsImpl &&
            (identical(other.totalLeads, totalLeads) ||
                other.totalLeads == totalLeads) &&
            (identical(other.activeLeads, activeLeads) ||
                other.activeLeads == activeLeads) &&
            (identical(other.completedBookings, completedBookings) ||
                other.completedBookings == completedBookings) &&
            (identical(other.pendingBookings, pendingBookings) ||
                other.pendingBookings == pendingBookings) &&
            (identical(other.unreadMessages, unreadMessages) ||
                other.unreadMessages == unreadMessages) &&
            (identical(other.conversionRate, conversionRate) ||
                other.conversionRate == conversionRate) &&
            (identical(other.averageResponseTime, averageResponseTime) ||
                other.averageResponseTime == averageResponseTime) &&
            const DeepCollectionEquality().equals(
              other._dailyMetrics,
              _dailyMetrics,
            ));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
    runtimeType,
    totalLeads,
    activeLeads,
    completedBookings,
    pendingBookings,
    unreadMessages,
    conversionRate,
    averageResponseTime,
    const DeepCollectionEquality().hash(_dailyMetrics),
  );

  /// Create a copy of DashboardMetrics
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$DashboardMetricsImplCopyWith<_$DashboardMetricsImpl> get copyWith =>
      __$$DashboardMetricsImplCopyWithImpl<_$DashboardMetricsImpl>(
        this,
        _$identity,
      );

  @override
  Map<String, dynamic> toJson() {
    return _$$DashboardMetricsImplToJson(this);
  }
}

abstract class _DashboardMetrics implements DashboardMetrics {
  const factory _DashboardMetrics({
    required final int totalLeads,
    required final int activeLeads,
    required final int completedBookings,
    required final int pendingBookings,
    required final int unreadMessages,
    required final double conversionRate,
    required final double averageResponseTime,
    required final List<DailyMetric> dailyMetrics,
  }) = _$DashboardMetricsImpl;

  factory _DashboardMetrics.fromJson(Map<String, dynamic> json) =
      _$DashboardMetricsImpl.fromJson;

  @override
  int get totalLeads;
  @override
  int get activeLeads;
  @override
  int get completedBookings;
  @override
  int get pendingBookings;
  @override
  int get unreadMessages;
  @override
  double get conversionRate;
  @override
  double get averageResponseTime;
  @override
  List<DailyMetric> get dailyMetrics;

  /// Create a copy of DashboardMetrics
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$DashboardMetricsImplCopyWith<_$DashboardMetricsImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

DailyMetric _$DailyMetricFromJson(Map<String, dynamic> json) {
  return _DailyMetric.fromJson(json);
}

/// @nodoc
mixin _$DailyMetric {
  DateTime get date => throw _privateConstructorUsedError;
  int get leadsGenerated => throw _privateConstructorUsedError;
  int get bookingsCreated => throw _privateConstructorUsedError;
  int get messagesCount => throw _privateConstructorUsedError;

  /// Serializes this DailyMetric to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of DailyMetric
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $DailyMetricCopyWith<DailyMetric> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $DailyMetricCopyWith<$Res> {
  factory $DailyMetricCopyWith(
    DailyMetric value,
    $Res Function(DailyMetric) then,
  ) = _$DailyMetricCopyWithImpl<$Res, DailyMetric>;
  @useResult
  $Res call({
    DateTime date,
    int leadsGenerated,
    int bookingsCreated,
    int messagesCount,
  });
}

/// @nodoc
class _$DailyMetricCopyWithImpl<$Res, $Val extends DailyMetric>
    implements $DailyMetricCopyWith<$Res> {
  _$DailyMetricCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of DailyMetric
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? date = null,
    Object? leadsGenerated = null,
    Object? bookingsCreated = null,
    Object? messagesCount = null,
  }) {
    return _then(
      _value.copyWith(
            date: null == date
                ? _value.date
                : date // ignore: cast_nullable_to_non_nullable
                      as DateTime,
            leadsGenerated: null == leadsGenerated
                ? _value.leadsGenerated
                : leadsGenerated // ignore: cast_nullable_to_non_nullable
                      as int,
            bookingsCreated: null == bookingsCreated
                ? _value.bookingsCreated
                : bookingsCreated // ignore: cast_nullable_to_non_nullable
                      as int,
            messagesCount: null == messagesCount
                ? _value.messagesCount
                : messagesCount // ignore: cast_nullable_to_non_nullable
                      as int,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$DailyMetricImplCopyWith<$Res>
    implements $DailyMetricCopyWith<$Res> {
  factory _$$DailyMetricImplCopyWith(
    _$DailyMetricImpl value,
    $Res Function(_$DailyMetricImpl) then,
  ) = __$$DailyMetricImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    DateTime date,
    int leadsGenerated,
    int bookingsCreated,
    int messagesCount,
  });
}

/// @nodoc
class __$$DailyMetricImplCopyWithImpl<$Res>
    extends _$DailyMetricCopyWithImpl<$Res, _$DailyMetricImpl>
    implements _$$DailyMetricImplCopyWith<$Res> {
  __$$DailyMetricImplCopyWithImpl(
    _$DailyMetricImpl _value,
    $Res Function(_$DailyMetricImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of DailyMetric
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? date = null,
    Object? leadsGenerated = null,
    Object? bookingsCreated = null,
    Object? messagesCount = null,
  }) {
    return _then(
      _$DailyMetricImpl(
        date: null == date
            ? _value.date
            : date // ignore: cast_nullable_to_non_nullable
                  as DateTime,
        leadsGenerated: null == leadsGenerated
            ? _value.leadsGenerated
            : leadsGenerated // ignore: cast_nullable_to_non_nullable
                  as int,
        bookingsCreated: null == bookingsCreated
            ? _value.bookingsCreated
            : bookingsCreated // ignore: cast_nullable_to_non_nullable
                  as int,
        messagesCount: null == messagesCount
            ? _value.messagesCount
            : messagesCount // ignore: cast_nullable_to_non_nullable
                  as int,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$DailyMetricImpl implements _DailyMetric {
  const _$DailyMetricImpl({
    required this.date,
    required this.leadsGenerated,
    required this.bookingsCreated,
    required this.messagesCount,
  });

  factory _$DailyMetricImpl.fromJson(Map<String, dynamic> json) =>
      _$$DailyMetricImplFromJson(json);

  @override
  final DateTime date;
  @override
  final int leadsGenerated;
  @override
  final int bookingsCreated;
  @override
  final int messagesCount;

  @override
  String toString() {
    return 'DailyMetric(date: $date, leadsGenerated: $leadsGenerated, bookingsCreated: $bookingsCreated, messagesCount: $messagesCount)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$DailyMetricImpl &&
            (identical(other.date, date) || other.date == date) &&
            (identical(other.leadsGenerated, leadsGenerated) ||
                other.leadsGenerated == leadsGenerated) &&
            (identical(other.bookingsCreated, bookingsCreated) ||
                other.bookingsCreated == bookingsCreated) &&
            (identical(other.messagesCount, messagesCount) ||
                other.messagesCount == messagesCount));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
    runtimeType,
    date,
    leadsGenerated,
    bookingsCreated,
    messagesCount,
  );

  /// Create a copy of DailyMetric
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$DailyMetricImplCopyWith<_$DailyMetricImpl> get copyWith =>
      __$$DailyMetricImplCopyWithImpl<_$DailyMetricImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$DailyMetricImplToJson(this);
  }
}

abstract class _DailyMetric implements DailyMetric {
  const factory _DailyMetric({
    required final DateTime date,
    required final int leadsGenerated,
    required final int bookingsCreated,
    required final int messagesCount,
  }) = _$DailyMetricImpl;

  factory _DailyMetric.fromJson(Map<String, dynamic> json) =
      _$DailyMetricImpl.fromJson;

  @override
  DateTime get date;
  @override
  int get leadsGenerated;
  @override
  int get bookingsCreated;
  @override
  int get messagesCount;

  /// Create a copy of DailyMetric
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$DailyMetricImplCopyWith<_$DailyMetricImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

AnalyticsSnapshot _$AnalyticsSnapshotFromJson(Map<String, dynamic> json) {
  return _AnalyticsSnapshot.fromJson(json);
}

/// @nodoc
mixin _$AnalyticsSnapshot {
  DateTime get timestamp => throw _privateConstructorUsedError;
  Map<String, dynamic> get metrics => throw _privateConstructorUsedError;

  /// Serializes this AnalyticsSnapshot to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of AnalyticsSnapshot
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $AnalyticsSnapshotCopyWith<AnalyticsSnapshot> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $AnalyticsSnapshotCopyWith<$Res> {
  factory $AnalyticsSnapshotCopyWith(
    AnalyticsSnapshot value,
    $Res Function(AnalyticsSnapshot) then,
  ) = _$AnalyticsSnapshotCopyWithImpl<$Res, AnalyticsSnapshot>;
  @useResult
  $Res call({DateTime timestamp, Map<String, dynamic> metrics});
}

/// @nodoc
class _$AnalyticsSnapshotCopyWithImpl<$Res, $Val extends AnalyticsSnapshot>
    implements $AnalyticsSnapshotCopyWith<$Res> {
  _$AnalyticsSnapshotCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of AnalyticsSnapshot
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({Object? timestamp = null, Object? metrics = null}) {
    return _then(
      _value.copyWith(
            timestamp: null == timestamp
                ? _value.timestamp
                : timestamp // ignore: cast_nullable_to_non_nullable
                      as DateTime,
            metrics: null == metrics
                ? _value.metrics
                : metrics // ignore: cast_nullable_to_non_nullable
                      as Map<String, dynamic>,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$AnalyticsSnapshotImplCopyWith<$Res>
    implements $AnalyticsSnapshotCopyWith<$Res> {
  factory _$$AnalyticsSnapshotImplCopyWith(
    _$AnalyticsSnapshotImpl value,
    $Res Function(_$AnalyticsSnapshotImpl) then,
  ) = __$$AnalyticsSnapshotImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({DateTime timestamp, Map<String, dynamic> metrics});
}

/// @nodoc
class __$$AnalyticsSnapshotImplCopyWithImpl<$Res>
    extends _$AnalyticsSnapshotCopyWithImpl<$Res, _$AnalyticsSnapshotImpl>
    implements _$$AnalyticsSnapshotImplCopyWith<$Res> {
  __$$AnalyticsSnapshotImplCopyWithImpl(
    _$AnalyticsSnapshotImpl _value,
    $Res Function(_$AnalyticsSnapshotImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of AnalyticsSnapshot
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({Object? timestamp = null, Object? metrics = null}) {
    return _then(
      _$AnalyticsSnapshotImpl(
        timestamp: null == timestamp
            ? _value.timestamp
            : timestamp // ignore: cast_nullable_to_non_nullable
                  as DateTime,
        metrics: null == metrics
            ? _value._metrics
            : metrics // ignore: cast_nullable_to_non_nullable
                  as Map<String, dynamic>,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$AnalyticsSnapshotImpl implements _AnalyticsSnapshot {
  const _$AnalyticsSnapshotImpl({
    required this.timestamp,
    required final Map<String, dynamic> metrics,
  }) : _metrics = metrics;

  factory _$AnalyticsSnapshotImpl.fromJson(Map<String, dynamic> json) =>
      _$$AnalyticsSnapshotImplFromJson(json);

  @override
  final DateTime timestamp;
  final Map<String, dynamic> _metrics;
  @override
  Map<String, dynamic> get metrics {
    if (_metrics is EqualUnmodifiableMapView) return _metrics;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableMapView(_metrics);
  }

  @override
  String toString() {
    return 'AnalyticsSnapshot(timestamp: $timestamp, metrics: $metrics)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$AnalyticsSnapshotImpl &&
            (identical(other.timestamp, timestamp) ||
                other.timestamp == timestamp) &&
            const DeepCollectionEquality().equals(other._metrics, _metrics));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
    runtimeType,
    timestamp,
    const DeepCollectionEquality().hash(_metrics),
  );

  /// Create a copy of AnalyticsSnapshot
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$AnalyticsSnapshotImplCopyWith<_$AnalyticsSnapshotImpl> get copyWith =>
      __$$AnalyticsSnapshotImplCopyWithImpl<_$AnalyticsSnapshotImpl>(
        this,
        _$identity,
      );

  @override
  Map<String, dynamic> toJson() {
    return _$$AnalyticsSnapshotImplToJson(this);
  }
}

abstract class _AnalyticsSnapshot implements AnalyticsSnapshot {
  const factory _AnalyticsSnapshot({
    required final DateTime timestamp,
    required final Map<String, dynamic> metrics,
  }) = _$AnalyticsSnapshotImpl;

  factory _AnalyticsSnapshot.fromJson(Map<String, dynamic> json) =
      _$AnalyticsSnapshotImpl.fromJson;

  @override
  DateTime get timestamp;
  @override
  Map<String, dynamic> get metrics;

  /// Create a copy of AnalyticsSnapshot
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$AnalyticsSnapshotImplCopyWith<_$AnalyticsSnapshotImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
