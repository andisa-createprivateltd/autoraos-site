import Foundation

@MainActor
final class AppViewModel: ObservableObject {
    @Published var session: AppSession?
    @Published var selectedTab: AppTab = .dashboard
    @Published var selectedConversationID: UUID?
    @Published var selectedBookingID: UUID?
    @Published var preselectedBookingLeadID: UUID?

    @Published var isBootstrapping = false
    @Published var isSigningIn = false
    @Published var errorMessage: String?

    @Published var dealerSettings = DealerSettings(
        businessHours: [
            "mon": .init(open: "08:00", close: "17:00"),
            "tue": .init(open: "08:00", close: "17:00"),
            "wed": .init(open: "08:00", close: "17:00"),
            "thu": .init(open: "08:00", close: "17:00"),
            "fri": .init(open: "08:00", close: "17:00")
        ],
        faqs: [],
        marketingCanViewMessages: false,
        allowAdminFullPhone: false
    )

    private let repository: DealerOSRepository
    private let allowAdminPhoneUnmask: Bool

    init(repository: DealerOSRepository, allowAdminPhoneUnmask: Bool) {
        self.repository = repository
        self.allowAdminPhoneUnmask = allowAdminPhoneUnmask
    }

    var role: DealerRole? {
        session?.userProfile.role
    }

    var availableTabs: [AppTab] {
        role?.tabItems ?? []
    }

    var canViewMessageContent: Bool {
        guard let role else { return false }
        return role.canViewMessageContent(marketingFeatureFlag: dealerSettings.marketingCanViewMessages)
    }

    var canUnmaskPhone: Bool {
        guard let role else { return false }
        return allowAdminPhoneUnmask && role == .dealerAdmin && dealerSettings.allowAdminFullPhone
    }

    func bootstrap() async {
        guard !isBootstrapping else { return }
        isBootstrapping = true
        defer { isBootstrapping = false }

        if JailbreakDetector.isLikelyJailbroken {
            errorMessage = "This device appears insecure. Please use a trusted device."
            return
        }

        if let restored = await repository.restoreSession() {
            session = restored
            await loadSettingsIfNeeded()
        }
    }

    func signIn(email: String, password: String) async {
        guard !isSigningIn else { return }
        isSigningIn = true
        defer { isSigningIn = false }

        do {
            let signedInSession = try await repository.signIn(email: email, password: password)
            session = signedInSession
            await loadSettingsIfNeeded()
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    func signOut() async {
        await repository.signOut()
        session = nil
        selectedConversationID = nil
        selectedBookingID = nil
        preselectedBookingLeadID = nil
    }

    func resetPassword(email: String) async {
        do {
            try await repository.resetPassword(email: email)
            errorMessage = "Password reset email sent."
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    func loadSettingsIfNeeded() async {
        guard let session else { return }
        do {
            dealerSettings = try await repository.fetchDealerSettings(session: session)
        } catch {
            // Keep defaults to avoid blocking core workflows.
        }
    }

    func updateSettings(_ settings: DealerSettings) async {
        guard let session else { return }

        do {
            try await repository.updateDealerSettings(settings, session: session)
            dealerSettings = settings
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    func clearError() {
        errorMessage = nil
    }

    func handleDeepLink(_ target: DeepLinkTarget) {
        switch target {
        case let .conversation(id):
            guard availableTabs.contains(.conversations) else { return }
            selectedTab = .conversations
            selectedConversationID = id
        case let .booking(id):
            guard availableTabs.contains(.bookings) else { return }
            selectedTab = .bookings
            selectedBookingID = id
        }
    }
}

extension AppViewModel: PushRegistrationDelegate {
    func didReceiveDeepLink(_ target: DeepLinkTarget) {
        handleDeepLink(target)
    }
}
