import Foundation

@MainActor
final class DashboardViewModel: ObservableObject {
    @Published var metrics = DashboardMetrics(
        newLeadsToday: 0,
        avgResponseSeconds7d: 0,
        bookingsThisWeek: 0,
        missedLeads: 0,
        assignedLeads: []
    )
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
            metrics = try await repository.fetchDashboard(session: session)
        } catch {
            errorMessage = error.localizedDescription
        }
    }
}
