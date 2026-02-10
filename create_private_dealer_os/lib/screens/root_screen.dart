import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/app_providers.dart';
import 'auth/login_screen.dart';
import 'home_screen.dart';

class RootScreen extends ConsumerWidget {
  const RootScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    ref.listen(appSessionProvider, (prev, next) {
      if (prev != null && next == null) {
        // User logged out
      }
    });

    final session = ref.watch(appSessionProvider);

    if (session == null) {
      return const LoginScreen();
    }

    return const HomeScreen();
  }
}
