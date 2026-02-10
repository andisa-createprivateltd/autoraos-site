import Foundation

final class AppContainer {
    let config: AppConfig
    let repository: DealerOSRepository
    let pushManager: PushNotificationManager

    init(config: AppConfig = .load(), pushManager: PushNotificationManager = PushNotificationManager()) {
        self.config = config
        self.pushManager = pushManager

        if config.enableMockMode {
            repository = MockDealerOSRepository()
        } else {
            let authService = SupabaseAuthService(config: config, tokenStore: KeychainAuthTokenStore())
            let remoteService = SupabaseRemoteDataService(config: config, client: URLSessionHTTPClient())
            repository = LiveDealerOSRepository(
                authService: authService,
                remoteDataService: remoteService,
                cacheStore: SQLiteOfflineCacheStore(),
                config: config
            )
        }
    }
}
