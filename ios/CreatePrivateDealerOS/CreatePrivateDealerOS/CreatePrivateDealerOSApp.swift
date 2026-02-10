import SwiftUI

@main
struct CreatePrivateDealerOSApp: App {
    @UIApplicationDelegateAdaptor(AppDelegate.self) private var appDelegate

    private let container: AppContainer
    @StateObject private var appViewModel: AppViewModel
    @StateObject private var pushManager: PushNotificationManager

    init() {
        let pushManager = PushNotificationManager()
        _pushManager = StateObject(wrappedValue: pushManager)
        let container = AppContainer(pushManager: pushManager)
        self.container = container
        _appViewModel = StateObject(
            wrappedValue: AppViewModel(
                repository: container.repository,
                allowAdminPhoneUnmask: container.config.allowAdminPhoneUnmask
            )
        )
        AppDelegate.pushManager = pushManager
    }

    var body: some Scene {
        WindowGroup {
            RootView(repository: container.repository)
                .environmentObject(appViewModel)
                .onAppear {
                    pushManager.delegate = appViewModel
                }
                .task {
                    await appViewModel.bootstrap()
                }
                .task(id: \"\\(pushManager.latestDeviceToken ?? \"\"):\\(appViewModel.session?.userProfile.id.uuidString ?? \"\")\") {
                    guard
                        let token = pushManager.latestDeviceToken,
                        let session = appViewModel.session
                    else {
                        return
                    }
                    await container.repository.registerDeviceToken(token, session: session)
                }
        }
    }
}
