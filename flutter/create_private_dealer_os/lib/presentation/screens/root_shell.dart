import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../application/app_controller.dart';
import '../../core/routing/app_tab.dart';
import '../../domain/repositories/dealer_os_repository.dart';
import '../widgets/loading_state_view.dart';
import 'analytics_screen.dart';
import 'bookings_screen.dart';
import 'conversations_screen.dart';
import 'dashboard_screen.dart';
import 'leads_screen.dart';
import 'login_screen.dart';
import 'settings_screen.dart';

class RootShell extends StatelessWidget {
  const RootShell({super.key});

  @override
  Widget build(BuildContext context) {
    final AppController appController = context.watch<AppController>();
    final DealerOsRepository repository = context.read<DealerOsRepository>();

    if (appController.isBootstrapping) {
      return const Scaffold(body: LoadingStateView());
    }

    if (appController.session == null) {
      return const LoginScreen();
    }

    final List<AppTab> tabs = appController.availableTabs;
    if (tabs.isEmpty) {
      return const Scaffold(
        body: Center(child: Text('No tabs available for this role.')),
      );
    }

    if (!tabs.contains(appController.selectedTab) && tabs.isNotEmpty) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        appController.selectedTab = tabs.first;
      });
    }

    final int selectedIndex = tabs.indexOf(appController.selectedTab);
    final int safeIndex = selectedIndex < 0 ? 0 : selectedIndex;

    return Scaffold(
      appBar: AppBar(
        title: Text(appController.selectedTab.title),
        actions: <Widget>[
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () async {
              await appController.signOut();
            },
          ),
        ],
      ),
      body: IndexedStack(
        index: safeIndex,
        children: tabs
            .map(
              (AppTab tab) => _tabContent(tab: tab, repository: repository),
            )
            .toList(),
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: safeIndex,
        onTap: (int index) {
          appController.selectedTab = tabs[index];
        },
        items: tabs
            .map(
              (AppTab tab) => BottomNavigationBarItem(
                icon: Icon(_iconForTab(tab)),
                label: tab.title,
              ),
            )
            .toList(),
      ),
    );
  }

  Widget _tabContent({required AppTab tab, required DealerOsRepository repository}) {
    switch (tab) {
      case AppTab.dashboard:
        return DashboardScreen(repository: repository);
      case AppTab.conversations:
        return ConversationsScreen(repository: repository);
      case AppTab.leads:
        return LeadsScreen(repository: repository);
      case AppTab.bookings:
        return BookingsScreen(repository: repository);
      case AppTab.analytics:
        return AnalyticsScreen(repository: repository);
      case AppTab.settings:
        return SettingsScreen(repository: repository);
    }
  }

  IconData _iconForTab(AppTab tab) {
    switch (tab) {
      case AppTab.dashboard:
        return Icons.dashboard_outlined;
      case AppTab.conversations:
        return Icons.chat_bubble_outline;
      case AppTab.leads:
        return Icons.people_outline;
      case AppTab.bookings:
        return Icons.event_note_outlined;
      case AppTab.analytics:
        return Icons.show_chart;
      case AppTab.settings:
        return Icons.settings_outlined;
    }
  }
}
