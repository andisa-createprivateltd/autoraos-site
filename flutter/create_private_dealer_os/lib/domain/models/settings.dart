import 'dealer_role.dart';

class BusinessHoursDay {
  const BusinessHoursDay({required this.open, required this.close});

  final String open;
  final String close;

  Map<String, dynamic> toJson() {
    return <String, dynamic>{'open': open, 'close': close};
  }

  factory BusinessHoursDay.fromJson(Map<String, dynamic> json) {
    return BusinessHoursDay(
      open: (json['open'] as String?) ?? '08:00',
      close: (json['close'] as String?) ?? '17:00',
    );
  }
}

class DealerSettings {
  const DealerSettings({
    required this.businessHours,
    required this.faqs,
    required this.marketingCanViewMessages,
    required this.allowAdminFullPhone,
  });

  final Map<String, BusinessHoursDay> businessHours;
  final List<String> faqs;
  final bool marketingCanViewMessages;
  final bool allowAdminFullPhone;

  DealerSettings copyWith({
    Map<String, BusinessHoursDay>? businessHours,
    List<String>? faqs,
    bool? marketingCanViewMessages,
    bool? allowAdminFullPhone,
  }) {
    return DealerSettings(
      businessHours: businessHours ?? this.businessHours,
      faqs: faqs ?? this.faqs,
      marketingCanViewMessages:
          marketingCanViewMessages ?? this.marketingCanViewMessages,
      allowAdminFullPhone: allowAdminFullPhone ?? this.allowAdminFullPhone,
    );
  }

  static DealerSettings defaults({bool marketingViewDefault = false}) {
    return DealerSettings(
      businessHours: <String, BusinessHoursDay>{
        'mon': const BusinessHoursDay(open: '08:00', close: '17:00'),
        'tue': const BusinessHoursDay(open: '08:00', close: '17:00'),
        'wed': const BusinessHoursDay(open: '08:00', close: '17:00'),
        'thu': const BusinessHoursDay(open: '08:00', close: '17:00'),
        'fri': const BusinessHoursDay(open: '08:00', close: '17:00'),
      },
      faqs: const <String>[],
      marketingCanViewMessages: marketingViewDefault,
      allowAdminFullPhone: false,
    );
  }
}

class TeamMember {
  const TeamMember({
    required this.id,
    required this.dealerId,
    required this.name,
    required this.email,
    required this.role,
    required this.isActive,
    required this.createdAt,
  });

  final String id;
  final String dealerId;
  final String name;
  final String email;
  final DealerRole role;
  final bool isActive;
  final DateTime createdAt;

  factory TeamMember.fromJson(Map<String, dynamic> json) {
    return TeamMember(
      id: json['id'] as String,
      dealerId: json['dealer_id'] as String,
      name: (json['name'] as String?) ?? '',
      email: (json['email'] as String?) ?? '',
      role: DealerRole.fromString((json['role'] as String?) ?? 'dealer_sales'),
      isActive: (json['is_active'] as bool?) ?? true,
      createdAt: DateTime.parse(json['created_at'] as String).toUtc(),
    );
  }

  TeamMember copyWith({bool? isActive}) {
    return TeamMember(
      id: id,
      dealerId: dealerId,
      name: name,
      email: email,
      role: role,
      isActive: isActive ?? this.isActive,
      createdAt: createdAt,
    );
  }
}

class InviteUserRequest {
  const InviteUserRequest({
    required this.email,
    required this.name,
    required this.role,
  });

  final String email;
  final String name;
  final DealerRole role;

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'email': email,
      'name': name,
      'role': role.value,
    };
  }
}
