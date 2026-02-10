import 'package:flutter/foundation.dart';

import '../../domain/models/app_session.dart';
import '../../domain/models/booking.dart';
import '../../domain/models/conversation.dart';
import '../../domain/models/lead.dart';
import '../../domain/models/settings.dart';
import '../../domain/repositories/dealer_os_repository.dart';

class ConversationDetailViewModel extends ChangeNotifier {
  ConversationDetailViewModel({required DealerOsRepository repository})
      : _repository = repository;

  final DealerOsRepository _repository;

  List<Message> _messages = <Message>[];
  List<TeamMember> _teamMembers = <TeamMember>[];
  String _draftMessage = '';
  LeadStatus _selectedStatus = LeadStatus.newLead;
  String? _selectedAssigneeId;
  BookingType _bookingType = BookingType.testDrive;
  DateTime _bookingDate = DateTime.now().toUtc().add(const Duration(hours: 1));
  String _handoffReason = '';

  bool _isLoading = false;
  bool _isSubmitting = false;
  String? _errorMessage;

  List<Message> get messages => _messages;
  List<TeamMember> get teamMembers => _teamMembers;
  String get draftMessage => _draftMessage;
  LeadStatus get selectedStatus => _selectedStatus;
  String? get selectedAssigneeId => _selectedAssigneeId;
  BookingType get bookingType => _bookingType;
  DateTime get bookingDate => _bookingDate;
  String get handoffReason => _handoffReason;
  bool get isLoading => _isLoading;
  bool get isSubmitting => _isSubmitting;
  String? get errorMessage => _errorMessage;

  set draftMessage(String value) {
    _draftMessage = value;
    notifyListeners();
  }

  set selectedStatus(LeadStatus value) {
    _selectedStatus = value;
    notifyListeners();
  }

  set selectedAssigneeId(String? value) {
    _selectedAssigneeId = value;
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

  set handoffReason(String value) {
    _handoffReason = value;
    notifyListeners();
  }

  Future<void> load({
    required Conversation conversation,
    required AppSession session,
  }) async {
    if (_isLoading) {
      return;
    }

    _isLoading = true;
    _errorMessage = null;
    _selectedStatus = conversation.lead?.status ?? LeadStatus.newLead;
    _selectedAssigneeId = conversation.lead?.assignedUserId;
    notifyListeners();

    try {
      final List<dynamic> values = await Future.wait<dynamic>(<Future<dynamic>>[
        _repository.fetchMessages(
          conversationId: conversation.id,
          session: session,
        ),
        _repository.fetchTeamMembers(session: session),
      ]);

      _messages = values[0] as List<Message>;
      _teamMembers = (values[1] as List<TeamMember>)
          .where((TeamMember member) => member.isActive)
          .toList();
    } catch (error) {
      _errorMessage = error.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> sendMessage({
    required Conversation conversation,
    required AppSession session,
  }) async {
    final String trimmed = _draftMessage.trim();
    if (trimmed.isEmpty || _isSubmitting) {
      return;
    }

    _isSubmitting = true;
    _errorMessage = null;
    notifyListeners();

    try {
      await _repository.sendMessage(
        conversationId: conversation.id,
        leadId: conversation.leadId,
        content: trimmed,
        session: session,
      );

      _draftMessage = '';
      _messages = await _repository.fetchMessages(
        conversationId: conversation.id,
        session: session,
      );
    } catch (error) {
      _errorMessage = error.toString();
    } finally {
      _isSubmitting = false;
      notifyListeners();
    }
  }

  Future<void> updateLeadStatus({
    required Conversation conversation,
    required AppSession session,
  }) async {
    if (_isSubmitting) {
      return;
    }

    _isSubmitting = true;
    _errorMessage = null;
    notifyListeners();

    try {
      await _repository.updateLeadStatus(
        leadId: conversation.leadId,
        status: _selectedStatus,
        session: session,
      );
    } catch (error) {
      _errorMessage = error.toString();
    } finally {
      _isSubmitting = false;
      notifyListeners();
    }
  }

  Future<void> assignLead({
    required Conversation conversation,
    required AppSession session,
  }) async {
    if (_isSubmitting || _selectedAssigneeId == null) {
      return;
    }

    _isSubmitting = true;
    _errorMessage = null;
    notifyListeners();

    try {
      await _repository.assignLead(
        leadId: conversation.leadId,
        userId: _selectedAssigneeId!,
        session: session,
      );
    } catch (error) {
      _errorMessage = error.toString();
    } finally {
      _isSubmitting = false;
      notifyListeners();
    }
  }

  Future<void> createBooking({
    required Conversation conversation,
    required AppSession session,
  }) async {
    if (_isSubmitting) {
      return;
    }

    _isSubmitting = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final NewBookingRequest request = NewBookingRequest(
        dealerId: session.userProfile.dealerId,
        leadId: conversation.leadId,
        type: _bookingType,
        requestedAt: DateTime.now().toUtc(),
        scheduledFor: _bookingDate,
        status: BookingStatus.booked,
        createdBy: 'human',
      );

      await _repository.createBooking(request: request, session: session);
    } catch (error) {
      _errorMessage = error.toString();
    } finally {
      _isSubmitting = false;
      notifyListeners();
    }
  }

  Future<void> handoff({
    required Conversation conversation,
    required AppSession session,
  }) async {
    final String reason = _handoffReason.trim();
    if (_isSubmitting || reason.isEmpty) {
      return;
    }

    _isSubmitting = true;
    _errorMessage = null;
    notifyListeners();

    try {
      await _repository.handoff(
        conversationId: conversation.id,
        leadId: conversation.leadId,
        reason: reason,
        session: session,
      );

      _handoffReason = '';
    } catch (error) {
      _errorMessage = error.toString();
    } finally {
      _isSubmitting = false;
      notifyListeners();
    }
  }
}
