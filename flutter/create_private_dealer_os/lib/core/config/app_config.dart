class AppConfig {
  const AppConfig({
    required this.supabaseUrl,
    required this.supabaseAnonKey,
    required this.backendBaseUrl,
    required this.enableMockMode,
    required this.allowAdminPhoneUnmask,
    required this.marketingCanViewMessagesDefault,
    required this.missedLeadMinutes,
    required this.enablePush,
  });

  final String supabaseUrl;
  final String supabaseAnonKey;
  final String backendBaseUrl;
  final bool enableMockMode;
  final bool allowAdminPhoneUnmask;
  final bool marketingCanViewMessagesDefault;
  final int missedLeadMinutes;
  final bool enablePush;

  bool get hasSupabaseConfig => supabaseUrl.isNotEmpty && supabaseAnonKey.isNotEmpty;

  static AppConfig fromEnvironment() {
    const String supabaseUrl = String.fromEnvironment('SUPABASE_URL', defaultValue: '');
    const String supabaseAnonKey =
        String.fromEnvironment('SUPABASE_ANON_KEY', defaultValue: '');
    const String backendBaseUrl =
        String.fromEnvironment('BACKEND_BASE_URL', defaultValue: '');
    const String mockModeRaw =
        String.fromEnvironment('ENABLE_MOCK_MODE', defaultValue: '0');
    const String unmaskRaw =
        String.fromEnvironment('ALLOW_ADMIN_PHONE_UNMASK', defaultValue: '0');
    const String marketingRaw =
        String.fromEnvironment('MARKETING_CAN_VIEW_MESSAGES_DEFAULT', defaultValue: '0');
    const String missedRaw =
        String.fromEnvironment('MISSED_LEAD_MINUTES', defaultValue: '10');
    const String pushRaw = String.fromEnvironment('ENABLE_PUSH', defaultValue: '1');

    return AppConfig(
      supabaseUrl: supabaseUrl,
      supabaseAnonKey: supabaseAnonKey,
      backendBaseUrl: backendBaseUrl,
      enableMockMode: mockModeRaw == '1' || mockModeRaw.toLowerCase() == 'true',
      allowAdminPhoneUnmask: unmaskRaw == '1' || unmaskRaw.toLowerCase() == 'true',
      marketingCanViewMessagesDefault:
          marketingRaw == '1' || marketingRaw.toLowerCase() == 'true',
      missedLeadMinutes: int.tryParse(missedRaw) ?? 10,
      enablePush: pushRaw == '1' || pushRaw.toLowerCase() == 'true',
    );
  }
}
