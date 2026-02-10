import SwiftUI

struct LeadDetailView: View {
    @EnvironmentObject private var appViewModel: AppViewModel
    @StateObject private var viewModel: LeadDetailViewModel

    let lead: Lead
    let canViewMessageContent: Bool
    let revealPhone: Bool

    init(lead: Lead, repository: DealerOSRepository, canViewMessageContent: Bool, revealPhone: Bool) {
        self.lead = lead
        self.canViewMessageContent = canViewMessageContent
        self.revealPhone = revealPhone
        _viewModel = StateObject(wrappedValue: LeadDetailViewModel(repository: repository))
    }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                VStack(alignment: .leading, spacing: 6) {
                    Text(lead.displayName)
                        .font(.title3.bold())
                    Text(PhoneMasker.mask(lead.phone, revealFull: revealPhone))
                        .font(.subheadline)
                        .foregroundStyle(.secondary)
                    if appViewModel.role != .dealerMarketing {
                        Text(lead.vehicleInterest ?? "No vehicle selected")
                            .font(.subheadline)
                    }
                }

                if appViewModel.role?.canWriteConversations == true {
                    Button("Create Booking") {
                        appViewModel.preselectedBookingLeadID = lead.id
                        appViewModel.selectedTab = .bookings
                    }
                    .buttonStyle(.borderedProminent)
                }

                VStack(alignment: .leading, spacing: 8) {
                    Text("Recent Messages")
                        .font(.headline)

                    if canViewMessageContent {
                        ForEach(viewModel.relatedMessages.suffix(8)) { message in
                            Text(message.content)
                                .font(.subheadline)
                                .padding(.vertical, 2)
                        }
                    } else {
                        Text("Message content is restricted for your role.")
                            .font(.subheadline)
                            .foregroundStyle(.secondary)
                    }
                }

                VStack(alignment: .leading, spacing: 8) {
                    Text("Followups")
                        .font(.headline)
                    ForEach(viewModel.followups) { followup in
                        HStack {
                            Text(followup.type.capitalized)
                            Spacer()
                            Text(followup.responded ? "Responded" : "Pending")
                                .foregroundStyle(followup.responded ? .green : .orange)
                        }
                        .font(.subheadline)
                    }
                }
            }
            .padding()
        }
        .navigationTitle("Lead Detail")
        .task {
            if let session = appViewModel.session {
                await viewModel.load(lead: lead, session: session)
            }
        }
        .overlay(alignment: .bottom) {
            if let error = viewModel.errorMessage {
                ErrorBanner(message: error)
            }
        }
    }
}
