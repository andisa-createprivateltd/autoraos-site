import SwiftUI

struct LeadsView: View {
    @EnvironmentObject private var appViewModel: AppViewModel
    @StateObject private var viewModel: LeadsViewModel
    private let repository: DealerOSRepository

    init(repository: DealerOSRepository) {
        self.repository = repository
        _viewModel = StateObject(wrappedValue: LeadsViewModel(repository: repository))
    }

    var body: some View {
        NavigationStack {
            Group {
                if let session = appViewModel.session {
                    VStack(spacing: 12) {
                        filters

                        List {
                            ForEach(viewModel.leads) { lead in
                                NavigationLink {
                                    LeadDetailView(
                                        lead: lead,
                                        repository: repository,
                                        canViewMessageContent: appViewModel.canViewMessageContent,
                                        revealPhone: appViewModel.canUnmaskPhone
                                    )
                                    .environmentObject(appViewModel)
                                } label: {
                                    HStack {
                                        VStack(alignment: .leading, spacing: 4) {
                                            Text(lead.displayName)
                                            Text(PhoneMasker.mask(lead.phone, revealFull: appViewModel.canUnmaskPhone))
                                                .font(.caption)
                                                .foregroundStyle(.secondary)
                                            if appViewModel.role != .dealerMarketing {
                                                Text(lead.vehicleInterest ?? "No vehicle selected")
                                                    .font(.caption)
                                                    .foregroundStyle(.secondary)
                                            }
                                        }
                                        Spacer()
                                        Text(lead.status.label)
                                            .font(.caption)
                                            .padding(.horizontal, 8)
                                            .padding(.vertical, 4)
                                            .background(Color(.secondarySystemBackground), in: Capsule())
                                    }
                                }
                            }
                        }
                        .listStyle(.plain)
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
            .navigationTitle("Leads")
            .overlay(alignment: .bottom) {
                if let error = viewModel.errorMessage {
                    ErrorBanner(message: error)
                }
            }
        }
    }

    private var filters: some View {
        HStack {
            Picker("Status", selection: $viewModel.statusFilter) {
                Text("All").tag(LeadStatus?.none)
                ForEach(LeadStatus.allCases) { status in
                    Text(status.label).tag(Optional(status))
                }
            }
            .pickerStyle(.menu)

            Picker("Source", selection: $viewModel.sourceFilter) {
                Text("All").tag(LeadSource?.none)
                ForEach(LeadSource.allCases) { source in
                    Text(source.rawValue.capitalized).tag(Optional(source))
                }
            }
            .pickerStyle(.menu)

            if let session = appViewModel.session {
                Button(viewModel.assignedUserFilter == session.userProfile.id ? "Assigned: Me" : "Assigned") {
                    if viewModel.assignedUserFilter == session.userProfile.id {
                        viewModel.assignedUserFilter = nil
                    } else {
                        viewModel.assignedUserFilter = session.userProfile.id
                    }
                }
                .buttonStyle(.bordered)

                Button("Apply") {
                    Task { await viewModel.load(session: session) }
                }
                .buttonStyle(.bordered)
            }
        }
        .padding(.horizontal)
    }
}
