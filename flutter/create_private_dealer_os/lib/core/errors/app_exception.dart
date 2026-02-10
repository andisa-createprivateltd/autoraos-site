class AppException implements Exception {
  const AppException(this.message, {this.code});

  final String message;
  final int? code;

  @override
  String toString() => message;

  static AppException unauthorized() {
    return const AppException('Your session expired. Please sign in again.', code: 401);
  }

  static AppException forbidden() {
    return const AppException('You do not have permission for this action.', code: 403);
  }

  static AppException invalidConfiguration() {
    return const AppException('App config is missing required values.');
  }
}
