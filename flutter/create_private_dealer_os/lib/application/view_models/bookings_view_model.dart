import 'package:flutter/foundation.dart';

import '../../domain/models/app_session.dart';
import '../../domain/models/booking.dart';
import '../../domain/models/lead.dart';
import '../../domain/repositories/dealer_os_repository.dart';

class BookingsViewModel extends ChangeNotifier {
  BookingsViewModel({required DealerOsRepository repository})
      : _repository = repository;

  final DealerOsRepository _repository;

  List<Booking> _bookings = <Booking>[];
  List<Lead> _leadOptions = <Lead>[];
  bool _isLoading = false;
  String? _errorMessage;

  String? _selectedLeadId;
  BookingType _bookingType = BookingType.testDrive;
  DateTime _bookingDate = DateTime.now().toUtc().add(const Duration(hours: 1));
  String _notes = '';

  List<Booking> get bookings => _bookings;
  List<Lead> get leadOptions => _leadOptions;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;
  String? get selectedLeadId => _selectedLeadId;
  BookingType get bookingType => _bookingType;
  DateTime get bookingDate => _bookingDate;
  String get notes => _notes;

  set selectedLeadId(String? value) {
    _selectedLeadId = value;
    notifyListeners();
  }

  set bookingType(BookingType value) {
    _bookingType = value;
    notifyListeners();
  }

  set bookingDate(DateTime value) {
    _bookingDate = value.toUtc();
    notifyListeners();
  }

  set notes(String value) {
    _notes = value;
    notifyListeners();
  }

  Future<void> load({required AppSession session}) async {
    if (_isLoading) {
      return;
    }

    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final List<dynamic> values = await Future.wait<dynamic>(<Future<dynamic>>[
        _repository.fetchBookings(session: session),
        _repository.fetchLeads(
          filter: const LeadFilter(),
          session: session,
        ),
      ]);

      _bookings = values[0] as List<Booking>;
      _leadOptions = values[1] as List<Lead>;
    } catch (error) {
      _errorMessage = error.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> createBooking({required AppSession session}) async {
    final String? leadId = _selectedLeadId;
    if (leadId == null || leadId.isEmpty) {
      _errorMessage = 'Select a lead first.';
      notifyListeners();
      return;
    }

    final NewBookingRequest request = NewBookingRequest(
      dealerId: session.userProfile.dealerId,
      leadId: leadId,
      type: _bookingType,
      requestedAt: DateTime.now().toUtc(),
      scheduledFor: _bookingDate,
      status: BookingStatus.booked,
      createdBy: 'human',
    );

    try {
      await _repository.createBooking(request: request, session: session);
      _bookings = await _repository.fetchBookings(session: session);
      _notes = '';
      notifyListeners();
    } catch (error) {
      _errorMessage = error.toString();
      notifyListeners();
    }
  }

  Future<void> updateStatus({
    required String bookingId,
    required BookingStatus status,
    required AppSession session,
  }) async {
    try {
      await _repository.updateBookingStatus(
        bookingId: bookingId,
        status: status,
        session: session,
      );

      final int index = _bookings.indexWhere((Booking booking) => booking.id == bookingId);
      if (index >= 0) {
        _bookings[index] = _bookings[index].copyWith(status: status);
      }
      notifyListeners();
    } catch (error) {
      _errorMessage = error.toString();
      notifyListeners();
    }
  }
}
