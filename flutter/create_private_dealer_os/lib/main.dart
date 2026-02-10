import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

import 'app.dart';
import 'core/config/app_config.dart';
import 'core/di/app_container.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  final AppConfig config = AppConfig.fromEnvironment();

  if (!kIsWeb && config.enablePush && !config.enableMockMode) {
    try {
      await Firebase.initializeApp();
    } catch (_) {
      // Push setup is optional in beta startup.
    }
  }

  try {
    final AppContainer container = await AppContainer.create(config);
    runApp(DealerOsApp(container: container));
  } catch (error) {
    runApp(
      MaterialApp(
        home: Scaffold(
          body: Center(
            child: Padding(
              padding: const EdgeInsets.all(24),
              child: Text(
                'Failed to start app:\n$error',
                textAlign: TextAlign.center,
              ),
            ),
          ),
        ),
      ),
    );
  }
}
