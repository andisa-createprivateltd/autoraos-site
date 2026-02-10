import 'package:freezed_annotation/freezed_annotation.dart';

part 'booking.freezed.dart';
part 'booking.g.dart';

enum BookingStatus {
  pending,
  confirmed,
  inProgress,
  completed,
  cancelled;
}

@freezed
class Booking with _$Booking {
  const factory Booking({
    required String id,
    required String leadID,
    required String leadName,
    required DateTime scheduledFor,
    required BookingStatus status,
    required DateTime createdAt,
    String? notes,
    String? dealerID,
    String? createdByID,
  }) = _Booking;

  factory Booking.fromJson(Map<String, dynamic> json) =>
      _$BookingFromJson(json);
}

@freezed
class NewBookingRequest with _$NewBookingRequest {
  const factory NewBookingRequest({
    required String leadID,
    required DateTime scheduledFor,
    String? notes,
  }) = _NewBookingRequest;

  factory NewBookingRequest.fromJson(Map<String, dynamic> json) =>
      _$NewBookingRequestFromJson(json);
}
