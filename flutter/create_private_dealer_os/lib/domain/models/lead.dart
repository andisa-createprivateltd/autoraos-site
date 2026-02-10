enum LeadStatus {
  newLead('new'),
  contacted('contacted'),
  booked('booked'),
  visited('visited'),
  sold('sold'),
  lost('lost');

  const LeadStatus(this.value);
  final String value;

  static LeadStatus fromString(String raw) {
    return LeadStatus.values.firstWhere(
      (status) => status.value == raw,
      orElse: () => LeadStatus.newLead,
    );
  }

  String get label {
    return value[0].toUpperCase() + value.substring(1);
  }
}

enum LeadSource {
  whatsapp('whatsapp'),
  website('website'),
  ads('ads'),
  oem('oem');

  const LeadSource(this.value);
  final String value;

  static LeadSource fromString(String raw) {
    return LeadSource.values.firstWhere(
      (source) => source.value == raw,
      orElse: () => LeadSource.whatsapp,
    );
  }
}

class Lead {
  const Lead({
    required this.id,
    required this.dealerId,
    required this.source,
    required this.firstContactAt,
    required this.name,
    required this.phone,
    required this.vehicleInterest,
    required this.budgetRange,
    required this.status,
    required this.assignedUserId,
    required this.lastActivityAt,
    required this.createdAt,
  });

  final String id;
  final String dealerId;
  final LeadSource source;
  final DateTime firstContactAt;
  final String? name;
  final String phone;
  final String? vehicleInterest;
  final String? budgetRange;
  final LeadStatus status;
  final String? assignedUserId;
  final DateTime lastActivityAt;
  final DateTime createdAt;

  String get displayName {
    final String rawName = (name ?? '').trim();
    return rawName.isEmpty ? 'Unknown Lead' : rawName;
  }

  factory Lead.fromJson(Map<String, dynamic> json) {
    return Lead(
      id: json['id'] as String,
      dealerId: json['dealer_id'] as String,
      source: LeadSource.fromString((json['source'] as String?) ?? 'whatsapp'),
      firstContactAt: DateTime.parse(json['first_contact_at'] as String).toUtc(),
      name: json['name'] as String?,
      phone: (json['phone'] as String?) ?? '',
      vehicleInterest: json['vehicle_interest'] as String?,
      budgetRange: json['budget_range'] as String?,
      status: LeadStatus.fromString((json['status'] as String?) ?? 'new'),
      assignedUserId: json['assigned_user_id'] as String?,
      lastActivityAt: DateTime.parse(json['last_activity_at'] as String).toUtc(),
      createdAt: DateTime.parse(json['created_at'] as String).toUtc(),
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'id': id,
      'dealer_id': dealerId,
      'source': source.value,
      'first_contact_at': firstContactAt.toIso8601String(),
      'name': name,
      'phone': phone,
      'vehicle_interest': vehicleInterest,
      'budget_range': budgetRange,
      'status': status.value,
      'assigned_user_id': assignedUserId,
      'last_activity_at': lastActivityAt.toIso8601String(),
      'created_at': createdAt.toIso8601String(),
    };
  }

  Lead copyWith({LeadStatus? status, String? assignedUserId}) {
    return Lead(
      id: id,
      dealerId: dealerId,
      source: source,
      firstContactAt: firstContactAt,
      name: name,
      phone: phone,
      vehicleInterest: vehicleInterest,
      budgetRange: budgetRange,
      status: status ?? this.status,
      assignedUserId: assignedUserId ?? this.assignedUserId,
      lastActivityAt: lastActivityAt,
      createdAt: createdAt,
    );
  }
}

class LeadFilter {
  const LeadFilter({this.status, this.source, this.assignedUserId});

  final LeadStatus? status;
  final LeadSource? source;
  final String? assignedUserId;
}
