import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'application/app_controller.dart';
import 'core/di/app_container.dart';
import 'domain/models/app_session.dart';
import 'domain/repositories/dealer_os_repository.dart';
import 'presentation/screens/root_shell.dart';

class DealerOsApp extends StatefulWidget {
  const DealerOsApp({super.key, required this.container});

  final AppContainer container;

  @override
  State<DealerOsApp> createState() => _DealerOsAppState();
}

class _DealerOsAppState extends State<DealerOsApp> {
  late final AppController _appController;

  String? _deviceToken;
  String? _registeredForUserId;

  @override
  void initState() {
    super.initState();
    _appController = AppController(
      repository: widget.container.repository,
      allowAdminPhoneUnmask: widget.container.config.allowAdminPhoneUnmask,
      marketingCanViewMessagesDefault:
          widget.container.config.marketingCanViewMessagesDefault,
    );

    _appController.addListener(_onAppStateChanged);
    _bootstrap();
  }

  Future<void> _bootstrap() async {
    await _appController.bootstrap();

    if (!kIsWeb &&
        widget.container.config.enablePush &&
        !widget.container.config.enableMockMode) {
      try {
        _deviceToken = await widget.container.pushNotificationService.configure(
          onDeepLink: _appController.handleDeepLink,
        );
      } catch (_) {
        _deviceToken = null;
      }
    }

    await _registerDeviceTokenIfNeeded();
  }

  Future<void> _registerDeviceTokenIfNeeded() async {
    final String? token = _deviceToken;
    final AppSession? session = _appController.session;

    if (token == null || session == null) {
      _registeredForUserId = null;
      return;
    }

    if (_registeredForUserId == session.userId) {
      return;
    }

    await widget.container.repository.registerDeviceToken(
      deviceToken: token,
      session: session,
    );

    _registeredForUserId = session.userId;
  }

  void _onAppStateChanged() {
    Future<void>.microtask(_registerDeviceTokenIfNeeded);
  }

  @override
  void dispose() {
    _appController.removeListener(_onAppStateChanged);
    _appController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        Provider<DealerOsRepository>.value(value: widget.container.repository),
        ChangeNotifierProvider<AppController>.value(value: _appController),
      ],
      child: MaterialApp(
        title: 'CreatePrivate Dealer OS',
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          colorScheme: ColorScheme.fromSeed(seedColor: Colors.blue),
          useMaterial3: true,
        ),
        home: const RootShell(),
      ),
    );
  }
}
