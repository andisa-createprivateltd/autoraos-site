import Foundation
import UIKit
import UserNotifications

protocol PushRegistrationDelegate: AnyObject {
    func didReceiveDeepLink(_ target: DeepLinkTarget)
}

final class PushNotificationManager: NSObject, ObservableObject {
    @Published private(set) var latestDeviceToken: String?
    weak var delegate: PushRegistrationDelegate?

    func configure(application: UIApplication) {
        UNUserNotificationCenter.current().delegate = self
        UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .sound, .badge]) { granted, _ in
            guard granted else { return }
            DispatchQueue.main.async {
                application.registerForRemoteNotifications()
            }
        }
    }

    func didRegisterForRemoteNotifications(deviceTokenData: Data) {
        let token = deviceTokenData.map { String(format: "%02.2hhx", $0) }.joined()
        latestDeviceToken = token
    }

    func didFailToRegister(error: Error) {
        // Notification registration failures are non-blocking for beta.
        _ = error
    }

    func handleNotificationPayload(_ userInfo: [AnyHashable: Any]) {
        guard
            let type = userInfo["type"] as? String,
            let idString = userInfo["id"] as? String,
            let id = UUID(uuidString: idString)
        else {
            return
        }

        switch type {
        case "conversation":
            delegate?.didReceiveDeepLink(.conversation(id))
        case "booking":
            delegate?.didReceiveDeepLink(.booking(id))
        default:
            break
        }
    }
}

extension PushNotificationManager: UNUserNotificationCenterDelegate {
    func userNotificationCenter(_ center: UNUserNotificationCenter, didReceive response: UNNotificationResponse) async {
        handleNotificationPayload(response.notification.request.content.userInfo)
    }

    func userNotificationCenter(_ center: UNUserNotificationCenter, willPresent notification: UNNotification) async -> UNNotificationPresentationOptions {
        [.banner, .sound, .badge]
    }
}
