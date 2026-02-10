import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../providers/app_providers.dart';
import '../../providers/data_providers.dart';

class SettingsScreen extends ConsumerWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final session = ref.watch(appSessionProvider);
    final settingsAsync = ref.watch(dealerSettingsProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Settings'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // User Profile Section
            if (session != null) ...[
              Text(
                'Profile',
                style: Theme.of(context).textTheme.titleLarge,
              ),
              const SizedBox(height: 16),
              ListTile(
                leading: CircleAvatar(
                  child: Text(session.userProfile.name[0]),
                ),
                title: Text(session.userProfile.name),
                subtitle: Text(session.userProfile.email),
              ),
              const SizedBox(height: 24),
            ],

            // Settings Section
            Text(
              'Business Settings',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 16),
            settingsAsync.when(
              loading: () => const CircularProgressIndicator(),
              error: (err, stack) => Text('Error: $err'),
              data: (settings) => Column(
                children: [
                  SwitchListTile(
                    title: const Text('Allow Full Phone Numbers'),
                    subtitle: const Text('Show full phone numbers in messages'),
                    value: settings.allowAdminFullPhone,
                    onChanged: (value) {
                      // TODO: Implement update
                    },
                  ),
                  SwitchListTile(
                    title: const Text('Marketing Message View'),
                    subtitle: const Text('Marketing can view message content'),
                    value: settings.marketingCanViewMessages,
                    onChanged: (value) {
                      // TODO: Implement update
                    },
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Sign Out
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: () {
                  ref.read(appSessionProvider.notifier).signOut();
                },
                icon: const Icon(Icons.logout),
                label: const Text('Sign Out'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.red,
                  foregroundColor: Colors.white,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
