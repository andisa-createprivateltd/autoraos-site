import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

import '../../core/utils/phone_masker.dart';
import '../../domain/models/conversation.dart';

class ConversationRowTile extends StatelessWidget {
  const ConversationRowTile({
    super.key,
    required this.conversation,
    required this.revealPhone,
    required this.canViewMessagePreview,
  });

  final Conversation conversation;
  final bool revealPhone;
  final bool canViewMessagePreview;

  @override
  Widget build(BuildContext context) {
    final DateFormat format = DateFormat('MMM d, HH:mm');

    return ListTile(
      title: Text(conversation.lead?.displayName ?? 'Unknown Lead'),
      subtitle: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Text(PhoneMasker.mask(conversation.lead?.phone ?? '', revealFull: revealPhone)),
          const SizedBox(height: 2),
          Text(
            canViewMessagePreview
                ? (conversation.lastMessagePreview ?? 'No messages yet')
                : 'Message preview hidden for your role',
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
      trailing: Text(
        format.format(conversation.lastMessageAt.toLocal()),
        style: Theme.of(context).textTheme.labelSmall,
      ),
      contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
    );
  }
}
