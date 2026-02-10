import 'package:firebase_messaging/firebase_messaging.dart';

import '../../core/routing/app_tab.dart';

typedef PushDeepLinkHandler = void Function(DeepLinkTarget target);

class PushNotificationService {
  PushNotificationService({FirebaseMessaging? messaging})
      : _messaging = messaging ?? FirebaseMessaging.instance;

  final FirebaseMessaging _messaging;

  Future<String?> configure({required PushDeepLinkHandler onDeepLink}) async {
    await _messaging.requestPermission(alert: true, badge: true, sound: true);

    FirebaseMessaging.onMessageOpenedApp.listen((RemoteMessage message) {
      final DeepLinkTarget? target = _targetFromData(message.data);
      if (target != null) {
        onDeepLink(target);
      }
    });

    final RemoteMessage? initial = await _messaging.getInitialMessage();
    if (initial != null) {
      final DeepLinkTarget? target = _targetFromData(initial.data);
      if (target != null) {
        onDeepLink(target);
      }
    }

    return _messaging.getToken();
  }

  DeepLinkTarget? _targetFromData(Map<String, dynamic> data) {
    final String? type = data['type'] as String?;
    final String? id = data['id'] as String?;

    if (type == null || id == null || id.isEmpty) {
      return null;
    }

    if (type == 'conversation') {
      return DeepLinkTarget(type: DeepLinkTargetType.conversation, id: id);
    }

    if (type == 'booking') {
      return DeepLinkTarget(type: DeepLinkTargetType.booking, id: id);
    }

    return null;
  }
}
