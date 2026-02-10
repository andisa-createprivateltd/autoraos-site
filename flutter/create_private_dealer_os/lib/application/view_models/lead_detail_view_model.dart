import 'package:flutter/foundation.dart';
import 'package:collection/collection.dart';

import '../../domain/models/app_session.dart';
import '../../domain/models/conversation.dart';
import '../../domain/models/followup_item.dart';
import '../../domain/models/lead.dart';
import '../../domain/repositories/dealer_os_repository.dart';

class LeadDetailViewModel extends ChangeNotifier {
  LeadDetailViewModel({required DealerOsRepository repository})
      : _repository = repository;

  final DealerOsRepository _repository;

  List<Message> _relatedMessages = <Message>[];
  List<FollowupItem> _followups = <FollowupItem>[];
  bool _isLoading = false;
  String? _errorMessage;

  List<Message> get relatedMessages => _relatedMessages;
  List<FollowupItem> get followups => _followups;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  Future<void> load({required Lead lead, required AppSession session}) async {
    if (_isLoading) {
      return;
    }

    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final Future<List<FollowupItem>> followupsFuture =
          _repository.fetchFollowups(leadId: lead.id, session: session);

      final List<Conversation> conversations =
          await _repository.fetchConversations(session: session);
      final Conversation? conversation = conversations
          .where((Conversation item) => item.leadId == lead.id)
          .firstOrNull;

      if (conversation != null) {
        _relatedMessages = await _repository.fetchMessages(
          conversationId: conversation.id,
          session: session,
        );
      } else {
        _relatedMessages = <Message>[];
      }

      _followups = await followupsFuture;
    } catch (error) {
      _errorMessage = error.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}
