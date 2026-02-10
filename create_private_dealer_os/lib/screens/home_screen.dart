import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/app_providers.dart';
import '../providers/data_providers.dart';
import 'leads/leads_screen.dart';
import 'bookings/bookings_screen.dart';
import 'conversations/conversations_screen.dart';
import 'settings/settings_screen.dart';

class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({super.key});

  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen> {
  int _selectedIndex = 0;

  static const List<Widget> _screens = [
    DashboardTab(),
    LeadsScreen(),
    BookingsScreen(),
    ConversationsScreen(),
    SettingsScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _screens[_selectedIndex],
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _selectedIndex,
        onTap: (index) {
          setState(() {
            _selectedIndex = index;
          });
        },
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.dashboard), label: 'Dashboard'),
          BottomNavigationBarItem(icon: Icon(Icons.people), label: 'Leads'),
          BottomNavigationBarItem(icon: Icon(Icons.calendar_today), label: 'Bookings'),
          BottomNavigationBarItem(icon: Icon(Icons.chat), label: 'Messages'),
          BottomNavigationBarItem(icon: Icon(Icons.settings), label: 'Settings'),
        ],
      ),
    );
  }
}

class DashboardTab extends ConsumerWidget {
  const DashboardTab({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final session = ref.watch(appSessionProvider);
    final dashboardAsync = ref.watch(dashboardProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Dashboard'),
      ),
      body: dashboardAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (err, stack) => Center(
          child: Text('Error: $err'),
        ),
        data: (dashboard) => SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Welcome, ${session?.userProfile.name ?? 'User'}',
                style: Theme.of(context).textTheme.headlineSmall,
              ),
              const SizedBox(height: 24),
              _buildMetricCard(
                title: 'Total Leads',
                value: dashboard.totalLeads.toString(),
                color: Colors.blue,
              ),
              const SizedBox(height: 16),
              _buildMetricCard(
                title: 'Active Leads',
                value: dashboard.activeLeads.toString(),
                color: Colors.green,
              ),
              const SizedBox(height: 16),
              _buildMetricCard(
                title: 'Pending Bookings',
                value: dashboard.pendingBookings.toString(),
                color: Colors.orange,
              ),
              const SizedBox(height: 16),
              _buildMetricCard(
                title: 'Completed Bookings',
                value: dashboard.completedBookings.toString(),
                color: Colors.purple,
              ),
              const SizedBox(height: 16),
              _buildMetricCard(
                title: 'Unread Messages',
                value: dashboard.unreadMessages.toString(),
                color: Colors.red,
              ),
              const SizedBox(height: 24),
              Text(
                'Analytics',
                style: Theme.of(context).textTheme.titleLarge,
              ),
              const SizedBox(height: 16),
              _buildMetricCard(
                title: 'Conversion Rate',
                value: '${(dashboard.conversionRate * 100).toStringAsFixed(1)}%',
                color: Colors.teal,
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildMetricCard({
    required String title,
    required String value,
    required Color color,
  }) {
    return Card(
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: color.withValues(alpha: 0.1),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    color: Colors.grey,
                    fontSize: 12,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  value,
                  style: TextStyle(
                    fontSize: 28,
                    fontWeight: FontWeight.bold,
                    color: color,
                  ),
                ),
              ],
            ),
            Icon(Icons.trending_up, color: color, size: 32),
          ],
        ),
      ),
    );
  }
}
