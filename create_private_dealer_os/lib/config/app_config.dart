class AppConfig {
  final String supabaseUrl;
  final String supabaseAnonKey;
  final bool allowAdminPhoneUnmask;

  AppConfig({
    required this.supabaseUrl,
    required this.supabaseAnonKey,
    required this.allowAdminPhoneUnmask,
  });

  static AppConfig development() {
    return AppConfig(
      supabaseUrl: 'https://your-supabase-url.supabase.co',
      supabaseAnonKey: 'your-anon-key',
      allowAdminPhoneUnmask: false,
    );
  }

  static AppConfig production() {
    return AppConfig(
      supabaseUrl: 'https://your-supabase-url.supabase.co',
      supabaseAnonKey: 'your-anon-key',
      allowAdminPhoneUnmask: false,
    );
  }
}
