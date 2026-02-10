import Foundation
import Security

protocol AuthTokenStore {
    func save(session: AuthSessionPayload) throws
    func loadSession() throws -> AuthSessionPayload?
    func clear() throws
}

enum TokenStoreError: Error {
    case unhandled(OSStatus)
}

final class KeychainAuthTokenStore: AuthTokenStore {
    private let service = "com.createprivate.dealeros.session"
    private let account = "supabase-auth"

    func save(session: AuthSessionPayload) throws {
        let data = try JSONEncoder().encode(session)

        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecAttrAccount as String: account
        ]

        SecItemDelete(query as CFDictionary)

        var newQuery = query
        newQuery[kSecValueData as String] = data
        newQuery[kSecAttrAccessible as String] = kSecAttrAccessibleAfterFirstUnlockThisDeviceOnly

        let status = SecItemAdd(newQuery as CFDictionary, nil)
        guard status == errSecSuccess else {
            throw TokenStoreError.unhandled(status)
        }
    }

    func loadSession() throws -> AuthSessionPayload? {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecAttrAccount as String: account,
            kSecReturnData as String: true,
            kSecMatchLimit as String: kSecMatchLimitOne
        ]

        var result: AnyObject?
        let status = SecItemCopyMatching(query as CFDictionary, &result)
        if status == errSecItemNotFound {
            return nil
        }
        guard status == errSecSuccess else {
            throw TokenStoreError.unhandled(status)
        }

        guard let data = result as? Data else {
            return nil
        }

        return try JSONDecoder().decode(AuthSessionPayload.self, from: data)
    }

    func clear() throws {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecAttrAccount as String: account
        ]

        let status = SecItemDelete(query as CFDictionary)
        if status == errSecItemNotFound || status == errSecSuccess {
            return
        }
        throw TokenStoreError.unhandled(status)
    }
}
