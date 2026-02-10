import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';

import '../../application/app_controller.dart';
import '../../application/view_models/conversation_detail_view_model.dart';
import '../../core/utils/phone_masker.dart';
import '../../domain/models/booking.dart';
import '../../domain/models/conversation.dart';
import '../../domain/models/lead.dart';
import '../../domain/models/settings.dart';
import '../../domain/repositories/dealer_os_repository.dart';
import '../widgets/error_banner.dart';

class ConversationDetailScreen extends StatelessWidget {
  const ConversationDetailScreen({
    super.key,
    required this.repository,
    required this.conversation,
  });

  final DealerOsRepository repository;
  final Conversation conversation;

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider<ConversationDetailViewModel>(
      create: (_) => ConversationDetailViewModel(repository: repository),
      child: _ConversationDetailBody(conversation: conversation),
    );
  }
}

class _ConversationDetailBody extends StatefulWidget {
  const _ConversationDetailBody({required this.conversation});

  final Conversation conversation;

  @override
  State<_ConversationDetailBody> createState() => _ConversationDetailBodyState();
}

class _ConversationDetailBodyState extends State<_ConversationDetailBody> {
  bool _didLoad = false;
  final TextEditingController _draftController = TextEditingController();
  final TextEditingController _handoffController = TextEditingController();

  @override
  void dispose() {
    _draftController.dispose();
    _handoffController.dispose();
    super.dispose();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (_didLoad) {
      return;
    }
    _didLoad = true;

    final appController = context.read<AppController>();
    final session = appController.session;
    if (session != null) {
      Future<void>.microtask(() {
        context.read<ConversationDetailViewModel>().load(
              conversation: widget.conversation,
              session: session,
            );
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final appController = context.watch<AppController>();
    final viewModel = context.watch<ConversationDetailViewModel>();
    final session = appController.session;

    if (session == null) {
      return const Scaffold(body: SizedBox());
    }

    final bool canViewMessageContent = appController.canViewMessageContent;
    final bool canWriteConversation = session.userProfile.role.canWriteConversations;
    final DateFormat timeFormat = DateFormat('HH:mm');

    return Scaffold(
      appBar: AppBar(title: const Text('Thread')),
      body: Stack(
        children: <Widget>[
          ListView(
            padding: const EdgeInsets.all(12),
            children: <Widget>[
              Text(
                widget.conversation.lead?.displayName ?? 'Unknown Lead',
                style: Theme.of(context).textTheme.titleLarge,
              ),
              const SizedBox(height: 4),
              Text(
                PhoneMasker.mask(
                  widget.conversation.lead?.phone ?? '',
                  revealFull: appController.canUnmaskPhone,
                ),
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: Colors.black54),
              ),
              if (canViewMessageContent && widget.conversation.lead?.vehicleInterest != null)
                Text(widget.conversation.lead!.vehicleInterest!),
              const SizedBox(height: 12),
              Text('Messages', style: Theme.of(context).textTheme.titleMedium),
              const SizedBox(height: 6),
              if (!canViewMessageContent)
                const Text('Message content is restricted for your role.')
              else
                ...viewModel.messages.map(
                  (Message message) => Align(
                    alignment: message.direction == MessageDirection.outbound
                        ? Alignment.centerRight
                        : Alignment.centerLeft,
                    child: Container(
                      margin: const EdgeInsets.symmetric(vertical: 4),
                      padding: const EdgeInsets.all(10),
                      constraints: const BoxConstraints(maxWidth: 320),
                      decoration: BoxDecoration(
                        color: message.direction == MessageDirection.outbound
                            ? Colors.blue.shade50
                            : Colors.grey.shade100,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: <Widget>[
                          Text(message.content),
                          const SizedBox(height: 4),
                          Text(
                            timeFormat.format(message.createdAt.toLocal()),
                            style: Theme.of(context)
                                .textTheme
                                .labelSmall
                                ?.copyWith(color: Colors.black54),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              const SizedBox(height: 16),
              if (canWriteConversation) ...<Widget>[
                Text('Quick Actions', style: Theme.of(context).textTheme.titleMedium),
                const SizedBox(height: 8),
                Row(
                  children: <Widget>[
                    Expanded(
                      child: DropdownButtonFormField<LeadStatus>(
                        value: viewModel.selectedStatus,
                        items: LeadStatus.values
                            .map(
                              (LeadStatus status) => DropdownMenuItem<LeadStatus>(
                                value: status,
                                child: Text(status.label),
                              ),
                            )
                            .toList(),
                        onChanged: (LeadStatus? status) {
                          if (status != null) {
                            viewModel.selectedStatus = status;
                          }
                        },
                        decoration: const InputDecoration(
                          labelText: 'Lead Status',
                          border: OutlineInputBorder(),
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    OutlinedButton(
                      onPressed: viewModel.isSubmitting
                          ? null
                          : () => viewModel.updateLeadStatus(
                                conversation: widget.conversation,
                                session: session,
                              ),
                      child: const Text('Update'),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Row(
                  children: <Widget>[
                    Expanded(
                      child: DropdownButtonFormField<String?>(
                        value: viewModel.selectedAssigneeId,
                        items: <DropdownMenuItem<String?>>[
                          const DropdownMenuItem<String?>(
                            value: null,
                            child: Text('Unassigned'),
                          ),
                          ...viewModel.teamMembers.map(
                            (TeamMember member) => DropdownMenuItem<String?>(
                              value: member.id,
                              child: Text(member.name),
                            ),
                          ),
                        ],
                        onChanged: (String? value) {
                          viewModel.selectedAssigneeId = value;
                        },
                        decoration: const InputDecoration(
                          labelText: 'Assign Lead',
                          border: OutlineInputBorder(),
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    OutlinedButton(
                      onPressed: viewModel.isSubmitting
                          ? null
                          : () => viewModel.assignLead(
                                conversation: widget.conversation,
                                session: session,
                              ),
                      child: const Text('Assign'),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Row(
                  children: <Widget>[
                    Expanded(
                      child: DropdownButtonFormField<BookingType>(
                        value: viewModel.bookingType,
                        items: BookingType.values
                            .map(
                              (BookingType type) => DropdownMenuItem<BookingType>(
                                value: type,
                                child: Text(type.label),
                              ),
                            )
                            .toList(),
                        onChanged: (BookingType? type) {
                          if (type != null) {
                            viewModel.bookingType = type;
                          }
                        },
                        decoration: const InputDecoration(
                          labelText: 'Create Booking',
                          border: OutlineInputBorder(),
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    OutlinedButton(
                      onPressed: () async {
                        final DateTime? value = await showDatePicker(
                          context: context,
                          firstDate: DateTime.now(),
                          lastDate: DateTime.now().add(const Duration(days: 180)),
                          initialDate: viewModel.bookingDate.toLocal(),
                        );
                        if (value != null) {
                          viewModel.bookingDate = DateTime.utc(
                            value.year,
                            value.month,
                            value.day,
                            viewModel.bookingDate.hour,
                            viewModel.bookingDate.minute,
                          );
                        }
                      },
                      child: const Text('Date'),
                    ),
                    const SizedBox(width: 8),
                    OutlinedButton(
                      onPressed: viewModel.isSubmitting
                          ? null
                          : () => viewModel.createBooking(
                                conversation: widget.conversation,
                                session: session,
                              ),
                      child: const Text('Create'),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                TextField(
                  controller: _handoffController,
                  onChanged: (String value) => viewModel.handoffReason = value,
                  decoration: const InputDecoration(
                    labelText: 'Escalation reason',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 8),
                OutlinedButton(
                  onPressed: viewModel.isSubmitting
                      ? null
                      : () async {
                          await viewModel.handoff(
                            conversation: widget.conversation,
                            session: session,
                          );
                          _handoffController.text = viewModel.handoffReason;
                        },
                  child: const Text('Handoff / Escalate'),
                ),
                const SizedBox(height: 12),
                Row(
                  children: <Widget>[
                    Expanded(
                      child: TextField(
                        controller: _draftController,
                        onChanged: (String value) => viewModel.draftMessage = value,
                        decoration: const InputDecoration(
                          labelText: 'Type your message',
                          border: OutlineInputBorder(),
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    FilledButton(
                      onPressed: viewModel.isSubmitting
                          ? null
                          : () async {
                              await viewModel.sendMessage(
                                conversation: widget.conversation,
                                session: session,
                              );
                              _draftController.text = viewModel.draftMessage;
                            },
                      child: const Text('Send'),
                    ),
                  ],
                ),
              ],
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
      ),
    );
  }
}
