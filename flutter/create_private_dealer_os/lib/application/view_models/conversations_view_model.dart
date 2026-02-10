import 'package:flutter/foundation.dart';

import '../../domain/models/app_session.dart';
import '../../domain/models/conversation.dart';
import '../../domain/repositories/dealer_os_repository.dart';

class ConversationsViewModel extends ChangeNotifier {
  ConversationsViewModel({required DealerOsRepository repository})
      : _repository = repository;

  final DealerOsRepository _repository;

  List<Conversation> _conversations = <Conversation>[];
  String _searchText = '';
  bool _isLoading = false;
  String? _errorMessage;

  List<Conversation> get conversations => _conversations;
  String get searchText => _searchText;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  set searchText(String value) {
    _searchText = value;
    notifyListeners();
  }

  List<Conversation> get filteredConversations {
    if (_searchText.trim().isEmpty) {
      return _conversations;
    }

    final String query = _searchText.toLowerCase();
    return _conversations.where((Conversation conversation) {
      final String leadName = (conversation.lead?.displayName ?? '').toLowerCase();
      final String preview = (conversation.lastMessagePreview ?? '').toLowerCase();
      return leadName.contains(query) || preview.contains(query);
    }).toList();
  }

  Future<void> load({required AppSession session}) async {
    if (_isLoading) {
      return;
    }

    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      _conversations = await _repository.fetchConversations(session: session);
    } catch (error) {
      _errorMessage = error.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}
