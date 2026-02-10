import SwiftUI

struct DashboardView: View {
    @EnvironmentObject private var appViewModel: AppViewModel
    @StateObject private var viewModel: DashboardViewModel

    init(repository: DealerOSRepository) {
        _viewModel = StateObject(wrappedValue: DashboardViewModel(repository: repository))
    }

    var body: some View {
        Group {
            if let session = appViewModel.session {
                ScrollView {
                    LazyVStack(alignment: .leading, spacing: 16) {
                        HStack(spacing: 12) {
                            MetricTile(
                                title: "New Leads Today",
                                value: "\(viewModel.metrics.newLeadsToday)",
                                color: .blue
                            )
                            MetricTile(
                                title: "Avg Response (7d)",
                                value: "\(Int(viewModel.metrics.avgResponseSeconds7d))s",
                                color: .green
                            )
                        }

                        HStack(spacing: 12) {
                            MetricTile(
                                title: "Bookings This Week",
                                value: "\(viewModel.metrics.bookingsThisWeek)",
                                color: .orange
                            )
                            MetricTile(
                                title: "Missed Leads",
                                value: "\(viewModel.metrics.missedLeads)",
                                color: .red
                            )
                        }

                        if session.userProfile.role == .dealerSales {
                            VStack(alignment: .leading, spacing: 8) {
                                Text("Assigned Priority Leads")
                                    .font(.headline)

                                ForEach(viewModel.metrics.assignedLeads.prefix(8)) { lead in
                                    HStack {
                                        VStack(alignment: .leading) {
                                            Text(lead.displayName)
                                            Text(lead.vehicleInterest ?? "No vehicle selected")
                                                .font(.caption)
                                                .foregroundStyle(.secondary)
                                        }
                                        Spacer()
                                        Text(lead.status.label)
                                            .font(.caption)
                                            .padding(.horizontal, 8)
                                            .padding(.vertical, 4)
                                            .background(Color(.secondarySystemBackground), in: Capsule())
                                    }
                                    .padding(.vertical, 4)
                                }
                            }
                            .padding()
                            .background(
                                RoundedRectangle(cornerRadius: 12)
                                    .fill(Color(.secondarySystemBackground))
                            )
                        }
                    }
                    .padding()
                }
                .refreshable {
                    await viewModel.load(session: session)
                }
                .task(id: session.userProfile.id) {
                    await viewModel.load(session: session)
                }
            } else {
                LoadingStateView()
            }
        }
        .navigationTitle("Money View")
        .overlay(alignment: .bottom) {
            if let error = viewModel.errorMessage {
                ErrorBanner(message: error)
            }
        }
    }
}
