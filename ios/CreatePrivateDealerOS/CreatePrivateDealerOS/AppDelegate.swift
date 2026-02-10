import Foundation
import UIKit

final class AppDelegate: NSObject, UIApplicationDelegate {
    static weak var pushManager: PushNotificationManager?

    func application(
        _ application: UIApplication,
        didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
    ) -> Bool {
        AppDelegate.pushManager?.configure(application: application)

        if let payload = launchOptions?[.remoteNotification] as? [AnyHashable: Any] {
            AppDelegate.pushManager?.handleNotificationPayload(payload)
        }

        return true
    }

    func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
        AppDelegate.pushManager?.didRegisterForRemoteNotifications(deviceTokenData: deviceToken)
    }

    func application(_ application: UIApplication, didFailToRegisterForRemoteNotificationsWithError error: Error) {
        AppDelegate.pushManager?.didFailToRegister(error: error)
    }
}
