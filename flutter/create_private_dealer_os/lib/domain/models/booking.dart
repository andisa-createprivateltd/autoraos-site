import 'lead.dart';

enum BookingType {
  testDrive('test_drive'),
  call('call'),
  appointment('appointment');

  const BookingType(this.value);
  final String value;

  static BookingType fromString(String raw) {
    return BookingType.values.firstWhere(
      (type) => type.value == raw,
      orElse: () => BookingType.testDrive,
    );
  }

  String get label {
    return value.replaceAll('_', ' ');
  }
}

enum BookingStatus {
  booked('booked'),
  completed('completed'),
  noShow('no_show'),
  cancelled('cancelled');

  const BookingStatus(this.value);
  final String value;

  static BookingStatus fromString(String raw) {
    return BookingStatus.values.firstWhere(
      (status) => status.value == raw,
      orElse: () => BookingStatus.booked,
    );
  }

  String get label {
    return value.replaceAll('_', ' ');
  }
}

class Booking {
  const Booking({
    required this.id,
    required this.dealerId,
    required this.leadId,
    required this.type,
    required this.requestedAt,
    required this.scheduledFor,
    required this.status,
    required this.createdBy,
    required this.createdAt,
    this.lead,
  });

  final String id;
  final String dealerId;
  final String leadId;
  final BookingType type;
  final DateTime requestedAt;
  final DateTime scheduledFor;
  final BookingStatus status;
  final String createdBy;
  final DateTime createdAt;
  final Lead? lead;

  factory Booking.fromJson(Map<String, dynamic> json) {
    return Booking(
      id: json['id'] as String,
      dealerId: json['dealer_id'] as String,
      leadId: json['lead_id'] as String,
      type: BookingType.fromString((json['type'] as String?) ?? 'test_drive'),
      requestedAt: DateTime.parse(json['requested_at'] as String).toUtc(),
      scheduledFor: DateTime.parse(json['scheduled_for'] as String).toUtc(),
      status: BookingStatus.fromString((json['status'] as String?) ?? 'booked'),
      createdBy: (json['created_by'] as String?) ?? 'human',
      createdAt: DateTime.parse(json['created_at'] as String).toUtc(),
    );
  }

  Booking copyWith({BookingStatus? status, Lead? lead}) {
    return Booking(
      id: id,
      dealerId: dealerId,
      leadId: leadId,
      type: type,
      requestedAt: requestedAt,
      scheduledFor: scheduledFor,
      status: status ?? this.status,
      createdBy: createdBy,
      createdAt: createdAt,
      lead: lead ?? this.lead,
    );
  }
}

class NewBookingRequest {
  const NewBookingRequest({
    required this.dealerId,
    required this.leadId,
    required this.type,
    required this.requestedAt,
    required this.scheduledFor,
    required this.status,
    required this.createdBy,
  });

  final String dealerId;
  final String leadId;
  final BookingType type;
  final DateTime requestedAt;
  final DateTime scheduledFor;
  final BookingStatus status;
  final String createdBy;

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'dealer_id': dealerId,
      'lead_id': leadId,
      'type': type.value,
      'requested_at': requestedAt.toUtc().toIso8601String(),
      'scheduled_for': scheduledFor.toUtc().toIso8601String(),
      'status': status.value,
      'created_by': createdBy,
    };
  }
}
