import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../application/app_controller.dart';
import '../../application/view_models/settings_view_model.dart';
import '../../domain/models/dealer_role.dart';
import '../../domain/models/settings.dart';
import '../../domain/repositories/dealer_os_repository.dart';
import '../widgets/error_banner.dart';
import '../widgets/loading_state_view.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key, required this.repository});

  final DealerOsRepository repository;

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider<SettingsViewModel>(
      create: (_) => SettingsViewModel(repository: repository),
      child: const _SettingsBody(),
    );
  }
}

class _SettingsBody extends StatefulWidget {
  const _SettingsBody();

  @override
  State<_SettingsBody> createState() => _SettingsBodyState();
}

class _SettingsBodyState extends State<_SettingsBody> {
  bool _didLoad = false;
  final TextEditingController _faqController = TextEditingController();

  @override
  void dispose() {
    _faqController.dispose();
    super.dispose();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (_didLoad) {
      return;
    }

    _didLoad = true;
    final session = context.read<AppController>().session;
    if (session != null) {
      Future<void>.microtask(() async {
        await context.read<SettingsViewModel>().load(session: session);
        if (mounted) {
          _faqController.text = context.read<SettingsViewModel>().faqText;
        }
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final AppController appController = context.watch<AppController>();
    final SettingsViewModel viewModel = context.watch<SettingsViewModel>();
    final session = appController.session;

    if (session == null) {
      return const LoadingStateView();
    }

    if (!session.userProfile.role.canManageSettings) {
      return const Center(child: Text('Settings are restricted for your role.'));
    }

    return Stack(
      children: <Widget>[
        ListView(
          padding: const EdgeInsets.all(12),
          children: <Widget>[
            Text('Business Hours', style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 8),
            ...viewModel.businessHours.entries.map(
              (MapEntry<String, BusinessHoursDay> entry) => Row(
                children: <Widget>[
                  SizedBox(
                    width: 44,
                    child: Text(entry.key.toUpperCase()),
                  ),
                  Expanded(
                    child: TextFormField(
                      initialValue: entry.value.open,
                      decoration: const InputDecoration(
                        labelText: 'Open',
                        border: OutlineInputBorder(),
                      ),
                      onChanged: (String value) {
                        viewModel.updateBusinessHour(
                          day: entry.key,
                          value: BusinessHoursDay(open: value, close: entry.value.close),
                        );
                      },
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: TextFormField(
                      initialValue: entry.value.close,
                      decoration: const InputDecoration(
                        labelText: 'Close',
                        border: OutlineInputBorder(),
                      ),
                      onChanged: (String value) {
                        viewModel.updateBusinessHour(
                          day: entry.key,
                          value: BusinessHoursDay(open: entry.value.open, close: value),
                        );
                      },
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 14),
            Text('FAQs', style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 8),
            TextField(
              controller: _faqController,
              minLines: 5,
              maxLines: 8,
              decoration: const InputDecoration(
                hintText: 'One FAQ per line',
                border: OutlineInputBorder(),
              ),
              onChanged: (String value) => viewModel.faqText = value,
            ),
            const SizedBox(height: 14),
            SwitchListTile(
              value: viewModel.marketingCanViewMessages,
              onChanged: (bool value) => viewModel.marketingCanViewMessages = value,
              title: const Text('Marketing can view message content'),
            ),
            SwitchListTile(
              value: viewModel.allowAdminFullPhone,
              onChanged: (bool value) => viewModel.allowAdminFullPhone = value,
              title: const Text('Allow admin full phone visibility'),
            ),
            FilledButton(
              onPressed: () async {
                final DealerSettings? settings =
                    await viewModel.saveSettings(session: session);
                if (settings != null) {
                  await appController.updateSettings(settings);
                }
              },
              child: const Text('Save Settings'),
            ),
            const Divider(height: 24),
            Text('Team Management', style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 8),
            TextField(
              decoration: const InputDecoration(
                labelText: 'Name',
                border: OutlineInputBorder(),
              ),
              onChanged: (String value) => viewModel.inviteName = value,
            ),
            const SizedBox(height: 8),
            TextField(
              decoration: const InputDecoration(
                labelText: 'Email',
                border: OutlineInputBorder(),
              ),
              onChanged: (String value) => viewModel.inviteEmail = value,
            ),
            const SizedBox(height: 8),
            DropdownButtonFormField<DealerRole>(
              value: viewModel.inviteRole,
              decoration: const InputDecoration(
                labelText: 'Role',
                border: OutlineInputBorder(),
              ),
              items: const <DropdownMenuItem<DealerRole>>[
                DropdownMenuItem<DealerRole>(
                  value: DealerRole.dealerSales,
                  child: Text('Sales'),
                ),
                DropdownMenuItem<DealerRole>(
                  value: DealerRole.dealerMarketing,
                  child: Text('Marketing'),
                ),
                DropdownMenuItem<DealerRole>(
                  value: DealerRole.dealerAdmin,
                  child: Text('Admin'),
                ),
              ],
              onChanged: (DealerRole? value) {
                if (value != null) {
                  viewModel.inviteRole = value;
                }
              },
            ),
            const SizedBox(height: 8),
            FilledButton(
              onPressed: () => viewModel.invite(session: session),
              child: const Text('Invite User'),
            ),
            const SizedBox(height: 10),
            ...viewModel.teamMembers.map(
              (TeamMember member) => ListTile(
                contentPadding: EdgeInsets.zero,
                title: Text(member.name),
                subtitle: Text(member.email),
                trailing: member.isActive
                    ? OutlinedButton(
                        onPressed: () => viewModel.disableUser(
                          userId: member.id,
                          session: session,
                        ),
                        child: const Text('Disable'),
                      )
                    : const Text('Disabled', style: TextStyle(color: Colors.red)),
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
