import Foundation

@MainActor
final class SettingsViewModel: ObservableObject {
    @Published var businessHours: [String: BusinessHoursDay] = [:]
    @Published var faqText = ""
    @Published var marketingCanViewMessages = false
    @Published var allowAdminFullPhone = false
    @Published var teamMembers: [TeamMember] = []

    @Published var inviteName = ""
    @Published var inviteEmail = ""
    @Published var inviteRole: DealerRole = .dealerSales

    @Published var isLoading = false
    @Published var isSaving = false
    @Published var errorMessage: String?

    private let repository: DealerOSRepository

    init(repository: DealerOSRepository) {
        self.repository = repository
    }

    func load(session: AppSession) async {
        guard !isLoading else { return }
        isLoading = true
        defer { isLoading = false }

        do {
            async let settingsTask = repository.fetchDealerSettings(session: session)
            async let teamTask = repository.fetchTeamMembers(session: session)
            let settings = try await settingsTask
            let team = try await teamTask

            businessHours = settings.businessHours
            marketingCanViewMessages = settings.marketingCanViewMessages
            allowAdminFullPhone = settings.allowAdminFullPhone
            faqText = settings.faqs.joined(separator: "\n")
            teamMembers = team
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    func saveSettings(session: AppSession) async {
        guard !isSaving else { return }
        isSaving = true
        defer { isSaving = false }

        let settings = DealerSettings(
            businessHours: businessHours,
            faqs: faqText
                .split(separator: "\n")
                .map { $0.trimmingCharacters(in: .whitespacesAndNewlines) }
                .filter { !$0.isEmpty },
            marketingCanViewMessages: marketingCanViewMessages,
            allowAdminFullPhone: allowAdminFullPhone
        )

        do {
            try await repository.updateDealerSettings(settings, session: session)
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    func invite(session: AppSession) async {
        guard !isSaving else { return }
        let email = inviteEmail.trimmingCharacters(in: .whitespacesAndNewlines)
        let name = inviteName.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !email.isEmpty, !name.isEmpty else {
            errorMessage = "Name and email are required"
            return
        }

        isSaving = true
        defer { isSaving = false }

        do {
            try await repository.inviteUser(
                InviteUserRequest(email: email, name: name, role: inviteRole),
                session: session
            )
            inviteName = ""
            inviteEmail = ""
            teamMembers = try await repository.fetchTeamMembers(session: session)
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    func disableUser(_ id: UUID, session: AppSession) async {
        do {
            try await repository.disableUser(id, session: session)
            teamMembers = try await repository.fetchTeamMembers(session: session)
        } catch {
            errorMessage = error.localizedDescription
        }
    }
}
