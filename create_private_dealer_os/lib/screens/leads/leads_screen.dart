import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../providers/data_providers.dart';

class LeadsScreen extends ConsumerWidget {
  const LeadsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final leadsAsync = ref.watch(leadsProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Leads'),
      ),
      body: leadsAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (err, stack) => Center(
          child: Text('Error: $err'),
        ),
        data: (leads) => leads.isEmpty
            ? const Center(
                child: Text('No leads found'),
              )
            : ListView.builder(
                itemCount: leads.length,
                itemBuilder: (context, index) {
                  final lead = leads[index];
                  return ListTile(
                    leading: CircleAvatar(
                      child: Text(lead.name[0]),
                    ),
                    title: Text(lead.name),
                    subtitle: Text(lead.email),
                    trailing: Chip(
                      label: Text(lead.status.name),
                      backgroundColor: _statusColor(lead.status),
                    ),
                    onTap: () {
                      // TODO: Navigate to lead detail
                    },
                  );
                },
              ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          // TODO: Navigate to add new lead
        },
        child: const Icon(Icons.add),
      ),
    );
  }

  Color _statusColor(dynamic status) {
    return Colors.green; // TODO: Implement status color mapping
  }
}
