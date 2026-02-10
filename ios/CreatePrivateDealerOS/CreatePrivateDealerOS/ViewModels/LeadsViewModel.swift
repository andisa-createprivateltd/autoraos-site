import Foundation

@MainActor
final class LeadsViewModel: ObservableObject {
    @Published var leads: [Lead] = []
    @Published var statusFilter: LeadStatus?
    @Published var sourceFilter: LeadSource?
    @Published var assignedUserFilter: UUID?
    @Published var isLoading = false
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
            leads = try await repository.fetchLeads(
                filter: LeadFilter(status: statusFilter, source: sourceFilter, assignedUserID: assignedUserFilter),
                session: session
            )
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    func updateStatus(leadID: UUID, status: LeadStatus, session: AppSession) async {
        do {
            try await repository.updateLeadStatus(leadID: leadID, status: status, session: session)
            if let idx = leads.firstIndex(where: { $0.id == leadID }) {
                leads[idx].status = status
            }
        } catch {
            errorMessage = error.localizedDescription
        }
    }
}
