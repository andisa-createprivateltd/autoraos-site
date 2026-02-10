class FollowupItem {
  const FollowupItem({
    required this.id,
    required this.dealerId,
    required this.leadId,
    required this.type,
    required this.sentVia,
    required this.sentAt,
    required this.responded,
    required this.responseAt,
    required this.createdAt,
  });

  final String id;
  final String dealerId;
  final String leadId;
  final String type;
  final String sentVia;
  final DateTime? sentAt;
  final bool responded;
  final DateTime? responseAt;
  final DateTime createdAt;

  factory FollowupItem.fromJson(Map<String, dynamic> json) {
    return FollowupItem(
      id: json['id'] as String,
      dealerId: json['dealer_id'] as String,
      leadId: json['lead_id'] as String,
      type: (json['type'] as String?) ?? '',
      sentVia: (json['sent_via'] as String?) ?? '',
      sentAt: json['sent_at'] == null
          ? null
          : DateTime.parse(json['sent_at'] as String).toUtc(),
      responded: (json['responded'] as bool?) ?? false,
      responseAt: json['response_at'] == null
          ? null
          : DateTime.parse(json['response_at'] as String).toUtc(),
      createdAt: DateTime.parse(json['created_at'] as String).toUtc(),
    );
  }
}
