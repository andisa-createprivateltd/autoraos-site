import Foundation
import Supabase

protocol AuthService {
    func restoreSession() async -> AuthSessionPayload?
    func signIn(email: String, password: String) async throws -> AuthSessionPayload
    func signOut() async
    func resetPassword(email: String) async throws
    func currentAccessToken() async -> String?
}

final class SupabaseAuthService: AuthService {
    private let client: SupabaseClient
    private let tokenStore: AuthTokenStore

    init(config: AppConfig, tokenStore: AuthTokenStore) {
        client = SupabaseClient(supabaseURL: config.supabaseURL, supabaseKey: config.supabaseAnonKey)
        self.tokenStore = tokenStore
    }

    func restoreSession() async -> AuthSessionPayload? {
        guard let stored = try? tokenStore.loadSession() else {
            return nil
        }

        guard let stored else {
            return nil
        }

        do {
            _ = try await client.auth.setSession(accessToken: stored.accessToken, refreshToken: stored.refreshToken)
            return stored
        } catch {
            try? tokenStore.clear()
            return nil
        }
    }

    func signIn(email: String, password: String) async throws -> AuthSessionPayload {
        let response = try await client.auth.signIn(email: email, password: password)
        let payload = AuthSessionPayload(
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            expiresAt: Date(timeIntervalSince1970: TimeInterval(response.expiresAt)),
            userID: response.user.id
        )
        try tokenStore.save(session: payload)
        return payload
    }

    func signOut() async {
        try? await client.auth.signOut()
        try? tokenStore.clear()
    }

    func resetPassword(email: String) async throws {
        try await client.auth.resetPasswordForEmail(email)
    }

    func currentAccessToken() async -> String? {
        do {
            let session = try await client.auth.session
            if session.expiresAt > Int(Date().timeIntervalSince1970) {
                return session.accessToken
            }
        } catch {
            return (try? tokenStore.loadSession())?.accessToken
        }

        return (try? tokenStore.loadSession())?.accessToken
    }
}
