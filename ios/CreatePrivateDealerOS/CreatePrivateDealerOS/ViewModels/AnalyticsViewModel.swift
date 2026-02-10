import Foundation

@MainActor
final class AnalyticsViewModel: ObservableObject {
    @Published var snapshot = AnalyticsSnapshot(
        responseTrend7d: [],
        responseTrend30d: [],
        sourceBreakdown: [],
        bookingsCount: 0,
        afterHoursHandledPercent: 0
    )
    @Published var selectedRangeDays = 7
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
            snapshot = try await repository.fetchAnalytics(session: session)
        } catch {
            errorMessage = error.localizedDescription
        }
    }
}
