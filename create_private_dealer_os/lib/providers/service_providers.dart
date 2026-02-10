import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

import '../config/app_config.dart';
import '../repositories/dealer_os_repository.dart';
import '../services/auth_service.dart';
import '../services/remote_data_service.dart';
import '../utils/secure_storage.dart';

// Config provider
final appConfigProvider = Provider<AppConfig>((ref) {
  return AppConfig.development();
});

// Supabase client provider
final supabaseClientProvider = Provider<SupabaseClient>((ref) {
  // Assuming Supabase is already initialized in main.dart
  return Supabase.instance.client;
});

// Secure storage provider
final secureStorageProvider = Provider<SecureStorage>((ref) {
  const storage = FlutterSecureStorage();
  return SecureStorage(storage);
});

// Auth service provider
final authServiceProvider = Provider<AuthService>((ref) {
  final client = ref.watch(supabaseClientProvider);
  final storage = ref.watch(secureStorageProvider);
  return AuthService(client, storage, useDemoMode: true);
});

// Remote data service provider
final remoteDataServiceProvider = Provider<RemoteDataService>((ref) {
  final config = ref.watch(appConfigProvider);
  return RemoteDataService(
    baseUrl: config.supabaseUrl,
    supabaseKey: config.supabaseAnonKey,
    useDemoMode: true,
  );
});

// Repository provider
final dealerOSRepositoryProvider = Provider<DealerOSRepository>((ref) {
  final authService = ref.watch(authServiceProvider);
  final remoteDataService = ref.watch(remoteDataServiceProvider);
  return LiveDealerOSRepository(authService, remoteDataService);
});
