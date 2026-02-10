import 'package:flutter_test/flutter_test.dart';

import 'package:create_private_dealer_os/core/utils/phone_masker.dart';

void main() {
  test('masks phone numbers by default', () {
    expect(PhoneMasker.mask('+27820001111', revealFull: false), '***-***-1111');
  });

  test('returns full phone when reveal is enabled', () {
    expect(PhoneMasker.mask('+27820001111', revealFull: true), '+27820001111');
  });
}
