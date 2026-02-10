import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../application/app_controller.dart';
import '../../application/view_models/dashboard_view_model.dart';
import '../../domain/models/dealer_role.dart';
import '../../domain/repositories/dealer_os_repository.dart';
import '../widgets/error_banner.dart';
import '../widgets/loading_state_view.dart';
import '../widgets/metric_tile.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key, required this.repository});

  final DealerOsRepository repository;

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider<DashboardViewModel>(
      create: (_) => DashboardViewModel(repository: repository),
      child: const _DashboardBody(),
    );
  }
}

class _DashboardBody extends StatefulWidget {
  const _DashboardBody();

  @override
  State<_DashboardBody> createState() => _DashboardBodyState();
}

class _DashboardBodyState extends State<_DashboardBody> {
  bool _didLoad = false;

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
        context.read<DashboardViewModel>().load(session: session);
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final AppController appController = context.watch<AppController>();
    final DashboardViewModel viewModel = context.watch<DashboardViewModel>();

    final session = appController.session;
    if (session == null) {
      return const LoadingStateView();
    }

    return Stack(
      children: <Widget>[
        RefreshIndicator(
          onRefresh: () => viewModel.load(session: session),
          child: ListView(
            padding: const EdgeInsets.all(16),
            children: <Widget>[
              Row(
                children: <Widget>[
                  MetricTile(
                    title: 'New Leads Today',
                    value: '${viewModel.metrics.newLeadsToday}',
                    color: Colors.blue,
                  ),
                  const SizedBox(width: 10),
                  MetricTile(
                    title: 'Avg Response (7d)',
                    value: '${viewModel.metrics.avgResponseSeconds7d.toStringAsFixed(0)}s',
                    color: Colors.green,
                  ),
                ],
              ),
              const SizedBox(height: 10),
              Row(
                children: <Widget>[
                  MetricTile(
                    title: 'Bookings This Week',
                    value: '${viewModel.metrics.bookingsThisWeek}',
                    color: Colors.orange,
                  ),
                  const SizedBox(width: 10),
                  MetricTile(
                    title: 'Missed Leads',
                    value: '${viewModel.metrics.missedLeads}',
                    color: Colors.red,
                  ),
                ],
              ),
              const SizedBox(height: 16),
              if (session.userProfile.role == DealerRole.dealerSales) ...<Widget>[
                Text(
                  'Assigned Priority Leads',
                  style: Theme.of(context).textTheme.titleMedium,
                ),
                const SizedBox(height: 8),
                ...viewModel.metrics.assignedLeads.take(8).map(
                      (lead) => ListTile(
                        title: Text(lead.displayName),
                        subtitle: Text(lead.vehicleInterest ?? 'No vehicle selected'),
                        trailing: Chip(label: Text(lead.status.label)),
                      ),
                    ),
              ],
              if (viewModel.isLoading) const Padding(
                padding: EdgeInsets.only(top: 16),
                child: Center(child: CircularProgressIndicator()),
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
