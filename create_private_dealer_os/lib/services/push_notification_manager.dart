// Push notifications are temporarily disabled for web testing
// They will be re-enabled for mobile builds with proper Firebase configuration

class PushNotificationManager {
  String? _deviceToken;

  String? get latestDeviceToken => _deviceToken;

  Future<void> initialize() async {
    // TODO: Initialize Firebase Messaging for mobile builds
  }

  Future<void> unsubscribeFromTopic(String topic) async {
    // TODO: Implement for mobile
  }

  Future<void> subscribeToTopic(String topic) async {
    // TODO: Implement for mobile
  }
}

// Handle background messages at the top level
Future<void> firebaseMessagingBackgroundHandler(dynamic message) async {
  // TODO: Handle background message
}
