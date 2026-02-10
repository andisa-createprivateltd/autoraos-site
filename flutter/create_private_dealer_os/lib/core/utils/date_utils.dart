extension DateTimeServerFormat on DateTime {
  String toServerIso() => toUtc().toIso8601String();
}

extension DateTimeWeekHelpers on DateTime {
  DateTime startOfUtcDay() {
    final DateTime utc = toUtc();
    return DateTime.utc(utc.year, utc.month, utc.day);
  }

  DateTime startOfUtcWeek() {
    final DateTime utc = toUtc();
    final int diff = utc.weekday - DateTime.monday;
    final DateTime day = DateTime.utc(utc.year, utc.month, utc.day);
    return day.subtract(Duration(days: diff));
  }
}
