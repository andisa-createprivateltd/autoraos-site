import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../application/app_controller.dart';
import '../../application/view_models/leads_view_model.dart';
import '../../domain/models/dealer_role.dart';
import '../../core/utils/phone_masker.dart';
import '../../domain/models/lead.dart';
import '../../domain/repositories/dealer_os_repository.dart';
import '../widgets/error_banner.dart';
import '../widgets/loading_state_view.dart';
import 'lead_detail_screen.dart';

class LeadsScreen extends StatelessWidget {
  const LeadsScreen({super.key, required this.repository});

  final DealerOsRepository repository;

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider<LeadsViewModel>(
      create: (_) => LeadsViewModel(repository: repository),
      child: _LeadsBody(repository: repository),
    );
  }
}

class _LeadsBody extends StatefulWidget {
  const _LeadsBody({required this.repository});

  final DealerOsRepository repository;

  @override
  State<_LeadsBody> createState() => _LeadsBodyState();
}

class _LeadsBodyState extends State<_LeadsBody> {
  bool _didLoad = false;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (_didLoad) {
      return;
    }

    _didLoad = true;
    final AppController appController = context.read<AppController>();
    final session = appController.session;
    if (session != null) {
      Future<void>.microtask(() {
        context.read<LeadsViewModel>().load(session: session);
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final AppController appController = context.watch<AppController>();
    final LeadsViewModel viewModel = context.watch<LeadsViewModel>();
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
              child: Row(
                children: <Widget>[
                  Expanded(
                    child: DropdownButtonFormField<LeadStatus?>(
                      value: viewModel.statusFilter,
                      decoration: const InputDecoration(
                        labelText: 'Status',
                        border: OutlineInputBorder(),
                      ),
                      items: <DropdownMenuItem<LeadStatus?>>[
                        const DropdownMenuItem<LeadStatus?>(
                          value: null,
                          child: Text('All'),
                        ),
                        ...LeadStatus.values.map(
                          (LeadStatus status) => DropdownMenuItem<LeadStatus?>(
                            value: status,
                            child: Text(status.label),
                          ),
                        ),
                      ],
                      onChanged: (LeadStatus? status) {
                        viewModel.statusFilter = status;
                      },
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: DropdownButtonFormField<LeadSource?>(
                      value: viewModel.sourceFilter,
                      decoration: const InputDecoration(
                        labelText: 'Source',
                        border: OutlineInputBorder(),
                      ),
                      items: <DropdownMenuItem<LeadSource?>>[
                        const DropdownMenuItem<LeadSource?>(
                          value: null,
                          child: Text('All'),
                        ),
                        ...LeadSource.values.map(
                          (LeadSource source) => DropdownMenuItem<LeadSource?>(
                            value: source,
                            child: Text(source.value),
                          ),
                        ),
                      ],
                      onChanged: (LeadSource? source) {
                        viewModel.sourceFilter = source;
                      },
                    ),
                  ),
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 12),
              child: Row(
                children: <Widget>[
                  OutlinedButton(
                    onPressed: () {
                      if (viewModel.assignedUserFilter == session.userId) {
                        viewModel.assignedUserFilter = null;
                      } else {
                        viewModel.assignedUserFilter = session.userId;
                      }
                    },
                    child: Text(
                      viewModel.assignedUserFilter == session.userId
                          ? 'Assigned: Me'
                          : 'Assigned',
                    ),
                  ),
                  const SizedBox(width: 8),
                  FilledButton(
                    onPressed: () => viewModel.load(session: session),
                    child: const Text('Apply'),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 8),
            Expanded(
              child: RefreshIndicator(
                onRefresh: () => viewModel.load(session: session),
                child: ListView.builder(
                  itemCount: viewModel.leads.length,
                  itemBuilder: (BuildContext context, int index) {
                    final Lead lead = viewModel.leads[index];
                    return ListTile(
                      onTap: () {
                        Navigator.of(context).push(
                          MaterialPageRoute<void>(
                            builder: (_) => LeadDetailScreen(
                              repository: widget.repository,
                              lead: lead,
                            ),
                          ),
                        );
                      },
                      title: Text(lead.displayName),
                      subtitle: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: <Widget>[
                          Text(
                            PhoneMasker.mask(
                              lead.phone,
                              revealFull: appController.canUnmaskPhone,
                            ),
                          ),
                          if (appController.role != DealerRole.dealerMarketing)
                            Text(lead.vehicleInterest ?? 'No vehicle selected'),
                        ],
                      ),
                      trailing: Chip(label: Text(lead.status.label)),
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
