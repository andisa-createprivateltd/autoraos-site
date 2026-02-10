class PhoneMasker {
  const PhoneMasker._();

  static String mask(String phone, {required bool revealFull}) {
    if (revealFull) {
      return phone;
    }

    if (phone.isEmpty) {
      return 'No phone';
    }

    if (phone.length <= 4) {
      return '****';
    }

    final String suffix = phone.substring(phone.length - 4);
    return '***-***-$suffix';
  }
}
