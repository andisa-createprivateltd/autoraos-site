import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../providers/data_providers.dart';

class ConversationsScreen extends ConsumerWidget {
  const ConversationsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final conversationsAsync = ref.watch(conversationsProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Conversations'),
      ),
      body: conversationsAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (err, stack) => Center(
          child: Text('Error: $err'),
        ),
        data: (conversations) => conversations.isEmpty
            ? const Center(
                child: Text('No conversations found'),
              )
            : ListView.builder(
                itemCount: conversations.length,
                itemBuilder: (context, index) {
                  final conversation = conversations[index];
                  return ListTile(
                    leading: CircleAvatar(
                      child: Text(conversation.leadName[0]),
                    ),
                    title: Text(conversation.leadName),
                    subtitle: Text(conversation.lastMessage),
                    trailing: conversation.unreadCount > 0
                        ? Badge(
                            label: Text(conversation.unreadCount.toString()),
                          )
                        : null,
                    onTap: () {
                      // TODO: Navigate to conversation detail
                    },
                  );
                },
              ),
      ),
    );
  }
}
