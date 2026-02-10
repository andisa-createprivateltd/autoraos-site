enum AppTab {
  dashboard,
  conversations,
  leads,
  bookings,
  analytics,
  settings,
}

extension AppTabX on AppTab {
  String get title {
    switch (this) {
      case AppTab.dashboard:
        return 'Dashboard';
      case AppTab.conversations:
        return 'Inbox';
      case AppTab.leads:
        return 'Leads';
      case AppTab.bookings:
        return 'Bookings';
      case AppTab.analytics:
        return 'Analytics';
      case AppTab.settings:
        return 'Settings';
    }
  }

  String get icon {
    switch (this) {
      case AppTab.dashboard:
        return 'dashboard';
      case AppTab.conversations:
        return 'chat';
      case AppTab.leads:
        return 'group';
      case AppTab.bookings:
        return 'event';
      case AppTab.analytics:
        return 'analytics';
      case AppTab.settings:
        return 'settings';
    }
  }
}

enum DeepLinkTargetType { conversation, booking }

class DeepLinkTarget {
  const DeepLinkTarget({required this.type, required this.id});

  final DeepLinkTargetType type;
  final String id;
}
