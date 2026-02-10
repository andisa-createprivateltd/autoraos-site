import Charts
import SwiftUI

struct AnalyticsView: View {
    @EnvironmentObject private var appViewModel: AppViewModel
    @StateObject private var viewModel: AnalyticsViewModel

    init(repository: DealerOSRepository) {
        _viewModel = StateObject(wrappedValue: AnalyticsViewModel(repository: repository))
    }

    var body: some View {
        NavigationStack {
            Group {
                if let session = appViewModel.session {
                    ScrollView {
                        VStack(alignment: .leading, spacing: 16) {
                            Picker("Range", selection: $viewModel.selectedRangeDays) {
                                Text("7 days").tag(7)
                                Text("30 days").tag(30)
                            }
                            .pickerStyle(.segmented)

                            VStack(alignment: .leading, spacing: 8) {
                                Text("Response Time Trend")
                                    .font(.headline)

                                Chart(trendPoints) { point in
                                    LineMark(
                                        x: .value("Date", point.date),
                                        y: .value("Seconds", point.avgSeconds)
                                    )
                                    .interpolationMethod(.catmullRom)
                                    .foregroundStyle(.blue)
                                }
                                .frame(height: 220)
                            }

                            VStack(alignment: .leading, spacing: 8) {
                                Text("Leads by Source")
                                    .font(.headline)
                                Chart(viewModel.snapshot.sourceBreakdown) { item in
                                    BarMark(
                                        x: .value("Source", item.source.rawValue.capitalized),
                                        y: .value("Count", item.count)
                                    )
                                    .foregroundStyle(.orange)
                                }
                                .frame(height: 220)
                            }

                            HStack(spacing: 12) {
                                MetricTile(
                                    title: "Bookings",
                                    value: "\(viewModel.snapshot.bookingsCount)",
                                    color: .green
                                )
                                MetricTile(
                                    title: "After-hours handled",
                                    value: "\(Int(viewModel.snapshot.afterHoursHandledPercent))%",
                                    color: .purple
                                )
                            }
                        }
                        .padding()
                    }
                    .task(id: session.userProfile.id) {
                        await viewModel.load(session: session)
                    }
                    .refreshable {
                        await viewModel.load(session: session)
                    }
                } else {
                    LoadingStateView()
                }
            }
            .navigationTitle("Analytics")
            .overlay(alignment: .bottom) {
                if let error = viewModel.errorMessage {
                    ErrorBanner(message: error)
                }
            }
        }
    }

    private var trendPoints: [ResponseTrendPoint] {
        viewModel.selectedRangeDays == 7 ? viewModel.snapshot.responseTrend7d : viewModel.snapshot.responseTrend30d
    }
}
