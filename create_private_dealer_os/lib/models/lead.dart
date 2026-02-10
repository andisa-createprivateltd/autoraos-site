import 'package:freezed_annotation/freezed_annotation.dart';

part 'lead.freezed.dart';
part 'lead.g.dart';

enum LeadStatus {
  new_,
  contacted,
  interested,
  negotiating,
  qualified,
  closed,
  lost;
}

@freezed
class Lead with _$Lead {
  const factory Lead({
    required String id,
    required String name,
    required String email,
    required String phone,
    required LeadStatus status,
    required DateTime createdAt,
    required DateTime updatedAt,
    String? assignedToID,
    String? assignedToName,
    String? notes,
    String? dealerID,
  }) = _Lead;

  factory Lead.fromJson(Map<String, dynamic> json) => _$LeadFromJson(json);
}

@freezed
class LeadFilter with _$LeadFilter {
  const factory LeadFilter({
    LeadStatus? status,
    String? assignedToID,
    DateTime? createdAfter,
    DateTime? createdBefore,
  }) = _LeadFilter;

  factory LeadFilter.fromJson(Map<String, dynamic> json) =>
      _$LeadFilterFromJson(json);
}

@freezed
class FollowupItem with _$FollowupItem {
  const factory FollowupItem({
    required String id,
    required String leadID,
    required DateTime scheduledFor,
    required String notes,
    String? completedAt,
  }) = _FollowupItem;

  factory FollowupItem.fromJson(Map<String, dynamic> json) =>
      _$FollowupItemFromJson(json);
}
