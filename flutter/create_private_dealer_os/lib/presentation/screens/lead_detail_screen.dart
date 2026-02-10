import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../application/app_controller.dart';
import '../../application/view_models/lead_detail_view_model.dart';
import '../../core/routing/app_tab.dart';
import '../../core/utils/phone_masker.dart';
import '../../domain/models/dealer_role.dart';
import '../../domain/models/lead.dart';
import '../../domain/repositories/dealer_os_repository.dart';
import '../widgets/error_banner.dart';

class LeadDetailScreen extends StatelessWidget {
  const LeadDetailScreen({
    super.key,
    required this.repository,
    required this.lead,
  });

  final DealerOsRepository repository;
  final Lead lead;

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider<LeadDetailViewModel>(
      create: (_) => LeadDetailViewModel(repository: repository),
      child: _LeadDetailBody(lead: lead),
    );
  }
}

class _LeadDetailBody extends StatefulWidget {
  const _LeadDetailBody({required this.lead});

  final Lead lead;

  @override
  State<_LeadDetailBody> createState() => _LeadDetailBodyState();
}

class _LeadDetailBodyState extends State<_LeadDetailBody> {
  bool _didLoad = false;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (_didLoad) {
      return;
    }

    _didLoad = true;
    final session = context.read<AppController>().session;
    if (session != null) {
      Future<void>.microtask(() {
        context.read<LeadDetailViewModel>().load(lead: widget.lead, session: session);
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final appController = context.watch<AppController>();
    final viewModel = context.watch<LeadDetailViewModel>();
    final session = appController.session;

    return Scaffold(
      appBar: AppBar(title: const Text('Lead Detail')),
      body: Stack(
        children: <Widget>[
          ListView(
            padding: const EdgeInsets.all(12),
            children: <Widget>[
              Text(widget.lead.displayName, style: Theme.of(context).textTheme.titleLarge),
              const SizedBox(height: 4),
              Text(
                PhoneMasker.mask(
                  widget.lead.phone,
                  revealFull: appController.canUnmaskPhone,
                ),
              ),
              if (appController.role != DealerRole.dealerMarketing)
                Text(widget.lead.vehicleInterest ?? 'No vehicle selected'),
              const SizedBox(height: 12),
              if (session != null && session.userProfile.role.canWriteConversations)
                FilledButton(
                  onPressed: () {
                    appController.setPreselectedBookingLead(widget.lead.id);
                    appController.selectedTab = AppTab.bookings;
                    Navigator.of(context).pop();
                  },
                  child: const Text('Create Booking'),
                ),
              const SizedBox(height: 16),
              Text('Recent Messages', style: Theme.of(context).textTheme.titleMedium),
              const SizedBox(height: 8),
              if (appController.canViewMessageContent)
                ...viewModel.relatedMessages.take(8).map(
                      (message) => Padding(
                        padding: const EdgeInsets.symmetric(vertical: 2),
                        child: Text(message.content),
                      ),
                    )
              else
                const Text('Message content is restricted for your role.'),
              const SizedBox(height: 16),
              Text('Followups', style: Theme.of(context).textTheme.titleMedium),
              const SizedBox(height: 8),
              ...viewModel.followups.map(
                (followup) => ListTile(
                  dense: true,
                  contentPadding: EdgeInsets.zero,
                  title: Text(followup.type),
                  subtitle: Text(followup.sentVia),
                  trailing: Text(
                    followup.responded ? 'Responded' : 'Pending',
                    style: TextStyle(
                      color: followup.responded ? Colors.green : Colors.orange,
                    ),
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
      ),
    );
  }
}
