import '../../core/routing/app_tab.dart';

enum DealerRole {
  dealerAdmin('dealer_admin'),
  dealerSales('dealer_sales'),
  dealerMarketing('dealer_marketing'),
  platformOwner('platform_owner'),
  platformSupport('platform_support');

  const DealerRole(this.value);
  final String value;

  static DealerRole fromString(String raw) {
    return DealerRole.values.firstWhere(
      (role) => role.value == raw,
      orElse: () => DealerRole.dealerSales,
    );
  }

  bool get canManageSettings {
    return this == DealerRole.dealerAdmin ||
        this == DealerRole.platformOwner ||
        this == DealerRole.platformSupport;
  }

  bool get canWriteConversations {
    return this == DealerRole.dealerAdmin ||
        this == DealerRole.dealerSales ||
        this == DealerRole.platformOwner ||
        this == DealerRole.platformSupport;
  }

  bool canViewMessageContent({required bool marketingFeatureFlag}) {
    switch (this) {
      case DealerRole.dealerAdmin:
      case DealerRole.dealerSales:
      case DealerRole.platformOwner:
      case DealerRole.platformSupport:
        return true;
      case DealerRole.dealerMarketing:
        return marketingFeatureFlag;
    }
  }

  List<AppTab> get tabs {
    switch (this) {
      case DealerRole.dealerAdmin:
        return <AppTab>[
          AppTab.dashboard,
          AppTab.conversations,
          AppTab.leads,
          AppTab.bookings,
          AppTab.analytics,
          AppTab.settings,
        ];
      case DealerRole.dealerSales:
      case DealerRole.dealerMarketing:
        return <AppTab>[
          AppTab.dashboard,
          AppTab.conversations,
          AppTab.leads,
          AppTab.bookings,
          AppTab.analytics,
        ];
      case DealerRole.platformOwner:
      case DealerRole.platformSupport:
        return <AppTab>[AppTab.dashboard, AppTab.analytics];
    }
  }
}
