import 'package:flutter/material.dart';
import 'package:collection/collection.dart';
import 'package:provider/provider.dart';

import '../../application/app_controller.dart';
import '../../application/view_models/conversations_view_model.dart';
import '../../domain/models/conversation.dart';
import '../../domain/repositories/dealer_os_repository.dart';
import '../widgets/conversation_row_tile.dart';
import '../widgets/error_banner.dart';
import '../widgets/loading_state_view.dart';
import 'conversation_detail_screen.dart';

class ConversationsScreen extends StatelessWidget {
  const ConversationsScreen({super.key, required this.repository});

  final DealerOsRepository repository;

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider<ConversationsViewModel>(
      create: (_) => ConversationsViewModel(repository: repository),
      child: _ConversationsBody(repository: repository),
    );
  }
}

class _ConversationsBody extends StatefulWidget {
  const _ConversationsBody({required this.repository});

  final DealerOsRepository repository;

  @override
  State<_ConversationsBody> createState() => _ConversationsBodyState();
}

class _ConversationsBodyState extends State<_ConversationsBody> {
  final TextEditingController _searchController = TextEditingController();
  bool _didLoad = false;
  bool _isOpeningDeepLink = false;

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (!_didLoad) {
      _didLoad = true;
      final appController = context.read<AppController>();
      final session = appController.session;
      if (session != null) {
        Future<void>.microtask(() async {
          await context.read<ConversationsViewModel>().load(session: session);
          _openDeepLinkIfNeeded();
        });
      }
    }

    WidgetsBinding.instance.addPostFrameCallback((_) {
      _openDeepLinkIfNeeded();
    });
  }

  Future<void> _openDeepLinkIfNeeded() async {
    if (_isOpeningDeepLink || !mounted) {
      return;
    }

    final AppController appController = context.read<AppController>();
    final String? targetId = appController.selectedConversationId;
    if (targetId == null) {
      return;
    }

    final ConversationsViewModel viewModel = context.read<ConversationsViewModel>();
    final Conversation? conversation = viewModel.conversations
        .where((Conversation item) => item.id == targetId)
        .firstOrNull;

    if (conversation == null) {
      return;
    }

    _isOpeningDeepLink = true;
    appController.consumeSelectedConversation();

    await Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (_) => ConversationDetailScreen(
          repository: widget.repository,
          conversation: conversation,
        ),
      ),
    );

    _isOpeningDeepLink = false;
  }

  @override
  Widget build(BuildContext context) {
    final AppController appController = context.watch<AppController>();
    final ConversationsViewModel viewModel = context.watch<ConversationsViewModel>();

    final session = appController.session;
    if (session == null) {
      return const LoadingStateView();
    }

    return Stack(
      children: <Widget>[
        Column(
          children: <Widget>[
            Padding(
              padding: const EdgeInsets.fromLTRB(12, 10, 12, 8),
              child: TextField(
                controller: _searchController,
                onChanged: (String value) {
                  viewModel.searchText = value;
                },
                decoration: const InputDecoration(
                  labelText: 'Search by lead or message',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.search),
                ),
              ),
            ),
            Expanded(
              child: RefreshIndicator(
                onRefresh: () => viewModel.load(session: session),
                child: ListView.builder(
                  itemCount: viewModel.filteredConversations.length,
                  itemBuilder: (BuildContext context, int index) {
                    final Conversation conversation = viewModel.filteredConversations[index];
                    return InkWell(
                      onTap: () {
                        Navigator.of(context).push(
                          MaterialPageRoute<void>(
                            builder: (_) => ConversationDetailScreen(
                              repository: widget.repository,
                              conversation: conversation,
                            ),
                          ),
                        );
                      },
                      child: ConversationRowTile(
                        conversation: conversation,
                        revealPhone: appController.canUnmaskPhone,
                        canViewMessagePreview: appController.canViewMessageContent,
                      ),
                    );
                  },
                ),
              ),
            ),
          ],
        ),
        if (viewModel.errorMessage != null)
          Positioned(
            left: 0,
            right: 0,
            bottom: 0,
            child: ErrorBanner(message: viewModel.errorMessage!),
          ),
      ],
    );
  }
}
