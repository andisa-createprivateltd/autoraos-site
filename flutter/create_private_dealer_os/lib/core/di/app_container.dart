import 'package:supabase_flutter/supabase_flutter.dart';

import '../../data/cache/offline_cache_store.dart';
import '../../data/repositories/live_dealer_os_repository.dart';
import '../../data/repositories/mock_dealer_os_repository.dart';
import '../../data/services/auth_service.dart';
import '../../data/services/http_client.dart';
import '../../data/services/push_notification_service.dart';
import '../../data/services/remote_data_service.dart';
import '../../data/services/session_store.dart';
import '../../data/services/supabase_remote_data_service.dart';
import '../../domain/repositories/dealer_os_repository.dart';
import '../config/app_config.dart';
import '../errors/app_exception.dart';

class AppContainer {
  const AppContainer({
    required this.config,
    required this.repository,
    required this.pushNotificationService,
  });

  final AppConfig config;
  final DealerOsRepository repository;
  final PushNotificationService pushNotificationService;

  static Future<AppContainer> create(AppConfig config) async {
    final PushNotificationService pushService = PushNotificationService();

    if (config.enableMockMode) {
      return AppContainer(
        config: config,
        repository: MockDealerOsRepository(),
        pushNotificationService: pushService,
      );
    }

    if (!config.hasSupabaseConfig || config.backendBaseUrl.isEmpty) {
      throw AppException.invalidConfiguration();
    }

    bool needsSupabaseInit = true;
    try {
      Supabase.instance.client;
      needsSupabaseInit = false;
    } catch (_) {
      needsSupabaseInit = true;
    }

    if (needsSupabaseInit) {
      await Supabase.initialize(
        url: config.supabaseUrl,
        anonKey: config.supabaseAnonKey,
      );
    }

    final AuthService authService = SupabaseAuthService(
      sessionStore: SecureSessionStore(),
    );

    final RemoteDataService remoteDataService = SupabaseRemoteDataService(
      config: config,
      client: HttpClient(),
    );

    final DealerOsRepository repository = LiveDealerOsRepository(
      authService: authService,
      remoteDataService: remoteDataService,
      cacheStore: SqliteOfflineCacheStore(),
      config: config,
    );

    return AppContainer(
      config: config,
      repository: repository,
      pushNotificationService: pushService,
    );
  }
}
