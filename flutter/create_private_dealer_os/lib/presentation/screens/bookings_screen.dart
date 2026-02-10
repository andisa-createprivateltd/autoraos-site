import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:collection/collection.dart';
import 'package:provider/provider.dart';

import '../../application/app_controller.dart';
import '../../application/view_models/bookings_view_model.dart';
import '../../domain/models/booking.dart';
import '../../domain/models/lead.dart';
import '../../domain/repositories/dealer_os_repository.dart';
import '../widgets/error_banner.dart';
import '../widgets/loading_state_view.dart';

class BookingsScreen extends StatelessWidget {
  const BookingsScreen({super.key, required this.repository});

  final DealerOsRepository repository;

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider<BookingsViewModel>(
      create: (_) => BookingsViewModel(repository: repository),
      child: const _BookingsBody(),
    );
  }
}

class _BookingsBody extends StatefulWidget {
  const _BookingsBody();

  @override
  State<_BookingsBody> createState() => _BookingsBodyState();
}

class _BookingsBodyState extends State<_BookingsBody> {
  bool _didLoad = false;
  bool _isHandlingBookingDeepLink = false;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (!_didLoad) {
      _didLoad = true;
      final AppController appController = context.read<AppController>();
      final session = appController.session;
      if (session != null) {
        Future<void>.microtask(() async {
          await context.read<BookingsViewModel>().load(session: session);
          _applyPreselectedLead();
          _showDeepLinkedBookingIfNeeded();
        });
      }
    }

    WidgetsBinding.instance.addPostFrameCallback((_) {
      _applyPreselectedLead();
      _showDeepLinkedBookingIfNeeded();
    });
  }

  void _applyPreselectedLead() {
    final AppController appController = context.read<AppController>();
    final String? leadId = appController.preselectedBookingLeadId;
    if (leadId != null) {
      context.read<BookingsViewModel>().selectedLeadId = leadId;
      appController.setPreselectedBookingLead(null);
    }
  }

  Future<void> _showDeepLinkedBookingIfNeeded() async {
    if (_isHandlingBookingDeepLink || !mounted) {
      return;
    }

    final AppController appController = context.read<AppController>();
    final String? bookingId = appController.selectedBookingId;
    if (bookingId == null) {
      return;
    }

    final Booking? booking = context
        .read<BookingsViewModel>()
        .bookings
        .where((Booking item) => item.id == bookingId)
        .firstOrNull;

    if (booking == null) {
      return;
    }

    _isHandlingBookingDeepLink = true;
    appController.consumeSelectedBooking();

    await showDialog<void>(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text('Booking'),
        content: Text(
          '${booking.type.label}\n${DateFormat('MMM d, HH:mm').format(booking.scheduledFor.toLocal())}\nStatus: ${booking.status.label}',
        ),
        actions: <Widget>[
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Close'),
          ),
        ],
      ),
    );

    _isHandlingBookingDeepLink = false;
  }

  @override
  Widget build(BuildContext context) {
    final AppController appController = context.watch<AppController>();
    final BookingsViewModel viewModel = context.watch<BookingsViewModel>();
    final session = appController.session;

    if (session == null) {
      return const LoadingStateView();
    }

    final DateFormat dtf = DateFormat('MMM d, HH:mm');

    return Stack(
      children: <Widget>[
        RefreshIndicator(
          onRefresh: () => viewModel.load(session: session),
          child: ListView(
            padding: const EdgeInsets.all(12),
            children: <Widget>[
              if (session.userProfile.role.canWriteConversations) ...<Widget>[
                Text('Create Booking', style: Theme.of(context).textTheme.titleMedium),
                const SizedBox(height: 8),
                DropdownButtonFormField<String?>(
                  value: viewModel.selectedLeadId,
                  decoration: const InputDecoration(
                    labelText: 'Lead',
                    border: OutlineInputBorder(),
                  ),
                  items: <DropdownMenuItem<String?>>[
                    const DropdownMenuItem<String?>(
                      value: null,
                      child: Text('Select Lead'),
                    ),
                    ...viewModel.leadOptions.map(
                      (Lead lead) => DropdownMenuItem<String?>(
                        value: lead.id,
                        child: Text(lead.displayName),
                      ),
                    ),
                  ],
                  onChanged: (String? value) {
                    viewModel.selectedLeadId = value;
                  },
                ),
                const SizedBox(height: 8),
                DropdownButtonFormField<BookingType>(
                  value: viewModel.bookingType,
                  decoration: const InputDecoration(
                    labelText: 'Type',
                    border: OutlineInputBorder(),
                  ),
                  items: BookingType.values
                      .map(
                        (BookingType type) => DropdownMenuItem<BookingType>(
                          value: type,
                          child: Text(type.label),
                        ),
                      )
                      .toList(),
                  onChanged: (BookingType? value) {
                    if (value != null) {
                      viewModel.bookingType = value;
                    }
                  },
                ),
                const SizedBox(height: 8),
                OutlinedButton(
                  onPressed: () async {
                    final DateTime? value = await showDatePicker(
                      context: context,
                      firstDate: DateTime.now(),
                      lastDate: DateTime.now().add(const Duration(days: 365)),
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
                  child: Text(
                    'Scheduled: ${dtf.format(viewModel.bookingDate.toLocal())}',
                  ),
                ),
                const SizedBox(height: 8),
                TextField(
                  onChanged: (String value) => viewModel.notes = value,
                  decoration: const InputDecoration(
                    labelText: 'Notes',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 8),
                FilledButton(
                  onPressed: () => viewModel.createBooking(session: session),
                  child: const Text('Create'),
                ),
                const Divider(height: 24),
              ],
              Text('Upcoming', style: Theme.of(context).textTheme.titleMedium),
              const SizedBox(height: 8),
              ...viewModel.bookings.map(
                (Booking booking) => Card(
                  child: ListTile(
                    title: Text(booking.lead?.displayName ?? 'Lead'),
                    subtitle: Text(
                      '${booking.type.label} - ${dtf.format(booking.scheduledFor.toLocal())}',
                    ),
                    trailing: session.userProfile.role.canWriteConversations
                        ? DropdownButton<BookingStatus>(
                            value: booking.status,
                            items: BookingStatus.values
                                .map(
                                  (BookingStatus status) => DropdownMenuItem<BookingStatus>(
                                    value: status,
                                    child: Text(status.label),
                                  ),
                                )
                                .toList(),
                            onChanged: (BookingStatus? value) {
                              if (value != null) {
                                viewModel.updateStatus(
                                  bookingId: booking.id,
                                  status: value,
                                  session: session,
                                );
                              }
                            },
                          )
                        : Text('Status: ${booking.status.label}'),
                  ),
                ),
              ),
            ],
          ),
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
