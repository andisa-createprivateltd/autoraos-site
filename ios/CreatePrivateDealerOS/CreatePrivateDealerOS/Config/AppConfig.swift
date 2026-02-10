import Foundation

struct AppConfig {
    let supabaseURL: URL
    let supabaseAnonKey: String
    let backendBaseURL: URL
    let enableMockMode: Bool
    let allowAdminPhoneUnmask: Bool
    let marketingCanViewMessagesByDefault: Bool
    let missedLeadMinutes: Int

    static func load(bundle: Bundle = .main) -> AppConfig {
        guard
            let supabaseURLString = bundle.object(forInfoDictionaryKey: "SUPABASE_URL") as? String,
            let supabaseURL = URL(string: supabaseURLString),
            let backendURLString = bundle.object(forInfoDictionaryKey: "BACKEND_BASE_URL") as? String,
            let backendBaseURL = URL(string: backendURLString),
            let supabaseAnonKey = bundle.object(forInfoDictionaryKey: "SUPABASE_ANON_KEY") as? String,
            !supabaseAnonKey.isEmpty
        else {
            fatalError("Missing required config values in Info.plist")
        }

        return AppConfig(
            supabaseURL: supabaseURL,
            supabaseAnonKey: supabaseAnonKey,
            backendBaseURL: backendBaseURL,
            enableMockMode: (bundle.object(forInfoDictionaryKey: "ENABLE_MOCK_MODE") as? String) == "1",
            allowAdminPhoneUnmask: (bundle.object(forInfoDictionaryKey: "ALLOW_ADMIN_PHONE_UNMASK") as? String) == "1",
            marketingCanViewMessagesByDefault: (bundle.object(forInfoDictionaryKey: "MARKETING_CAN_VIEW_MESSAGES_DEFAULT") as? String) == "1",
            missedLeadMinutes: Int(bundle.object(forInfoDictionaryKey: "MISSED_LEAD_MINUTES") as? String ?? "10") ?? 10
        )
    }
}
