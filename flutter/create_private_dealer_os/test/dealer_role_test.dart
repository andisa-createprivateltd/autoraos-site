import 'package:flutter_test/flutter_test.dart';

import 'package:create_private_dealer_os/domain/models/dealer_role.dart';

void main() {
  test('marketing message access follows feature flag', () {
    expect(
      DealerRole.dealerMarketing.canViewMessageContent(marketingFeatureFlag: false),
      false,
    );
    expect(
      DealerRole.dealerMarketing.canViewMessageContent(marketingFeatureFlag: true),
      true,
    );
  });

  test('sales can write conversations', () {
    expect(DealerRole.dealerSales.canWriteConversations, true);
  });
}
