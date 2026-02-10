import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../providers/data_providers.dart';

class BookingsScreen extends ConsumerWidget {
  const BookingsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final bookingsAsync = ref.watch(bookingsProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Bookings'),
      ),
      body: bookingsAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (err, stack) => Center(
          child: Text('Error: $err'),
        ),
        data: (bookings) => bookings.isEmpty
            ? const Center(
                child: Text('No bookings found'),
              )
            : ListView.builder(
                itemCount: bookings.length,
                itemBuilder: (context, index) {
                  final booking = bookings[index];
                  return ListTile(
                    leading: const Icon(Icons.calendar_today),
                    title: Text(booking.leadName),
                    subtitle: Text(
                      booking.scheduledFor.toString(),
                    ),
                    trailing: Chip(
                      label: Text(booking.status.name),
                      backgroundColor: _statusColor(booking.status),
                    ),
                    onTap: () {
                      // TODO: Navigate to booking detail
                    },
                  );
                },
              ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          // TODO: Navigate to create booking
        },
        child: const Icon(Icons.add),
      ),
    );
  }

  Color _statusColor(dynamic status) {
    return Colors.blue; // TODO: Implement status color mapping
  }
}
