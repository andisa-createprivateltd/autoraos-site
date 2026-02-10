import SwiftUI

struct ConversationDetailView: View {
    @EnvironmentObject private var appViewModel: AppViewModel
    @StateObject private var viewModel: ConversationDetailViewModel

    let conversation: Conversation
    let canViewMessageContent: Bool
    let canWriteConversation: Bool
    let revealPhone: Bool

    init(
        conversation: Conversation,
        repository: DealerOSRepository,
        canViewMessageContent: Bool,
        canWriteConversation: Bool,
        revealPhone: Bool
    ) {
        self.conversation = conversation
        self.canViewMessageContent = canViewMessageContent
        self.canWriteConversation = canWriteConversation
        self.revealPhone = revealPhone
        _viewModel = StateObject(wrappedValue: ConversationDetailViewModel(repository: repository))
    }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                leadHeader

                if canViewMessageContent {
                    messagesTimeline
                } else {
                    Text("Message content is restricted for your role.")
                        .font(.subheadline)
                        .foregroundStyle(.secondary)
                }

                if canWriteConversation {
                    quickActions
                    composer
                }
            }
            .padding()
        }
        .navigationTitle("Thread")
        .task {
            if let session = appViewModel.session {
                await viewModel.load(conversation: conversation, session: session)
            }
        }
        .overlay(alignment: .bottom) {
            if let error = viewModel.errorMessage {
                ErrorBanner(message: error)
            }
        }
    }

    private var leadHeader: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(conversation.lead?.displayName ?? "Unknown Lead")
                .font(.title3.bold())
            Text(PhoneMasker.mask(conversation.lead?.phone ?? "", revealFull: revealPhone))
                .font(.subheadline)
                .foregroundStyle(.secondary)
            if canViewMessageContent, let vehicle = conversation.lead?.vehicleInterest {
                Text(vehicle)
                    .font(.subheadline)
            }
        }
    }

    private var messagesTimeline: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Messages")
                .font(.headline)

            ForEach(viewModel.messages) { message in
                HStack {
                    if message.direction == .outbound { Spacer() }

                    VStack(alignment: .leading, spacing: 4) {
                        Text(message.content)
                            .font(.subheadline)
                        Text(message.createdAt, style: .time)
                            .font(.caption2)
                            .foregroundStyle(.secondary)
                    }
                    .padding(10)
                    .background(
                        RoundedRectangle(cornerRadius: 10)
                            .fill(message.direction == .outbound ? Color.blue.opacity(0.15) : Color(.secondarySystemBackground))
                    )

                    if message.direction == .inbound { Spacer() }
                }
            }
        }
    }

    private var quickActions: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Quick Actions")
                .font(.headline)

            HStack {
                Picker("Lead Status", selection: $viewModel.selectedStatus) {
                    ForEach(LeadStatus.allCases) { status in
                        Text(status.label).tag(status)
                    }
                }
                .pickerStyle(.menu)

                Button("Update") {
                    Task {
                        guard let session = appViewModel.session else { return }
                        await viewModel.updateLeadStatus(conversation: conversation, session: session)
                    }
                }
                .buttonStyle(.bordered)
            }

            HStack {
                Picker("Assign", selection: $viewModel.selectedAssigneeID) {
                    Text("Unassigned").tag(UUID?.none)
                    ForEach(viewModel.teamMembers) { member in
                        Text(member.name).tag(Optional(member.id))
                    }
                }
                .pickerStyle(.menu)

                Button("Assign") {
                    Task {
                        guard let session = appViewModel.session else { return }
                        await viewModel.assignLead(conversation: conversation, session: session)
                    }
                }
                .buttonStyle(.bordered)
            }

            HStack {
                Picker("Booking", selection: $viewModel.bookingType) {
                    ForEach(BookingType.allCases) { type in
                        Text(type.label).tag(type)
                    }
                }
                .pickerStyle(.menu)

                DatePicker("", selection: $viewModel.bookingDate)
                    .labelsHidden()

                Button("Create") {
                    Task {
                        guard let session = appViewModel.session else { return }
                        await viewModel.createBooking(conversation: conversation, session: session)
                    }
                }
                .buttonStyle(.bordered)
            }

            TextField("Escalation reason", text: $viewModel.handoffReason)
                .textFieldStyle(.roundedBorder)

            Button("Handoff / Escalate") {
                Task {
                    guard let session = appViewModel.session else { return }
                    await viewModel.handoff(conversation: conversation, session: session)
                }
            }
            .buttonStyle(.bordered)
        }
        .padding()
        .background(
            RoundedRectangle(cornerRadius: 12)
                .fill(Color(.secondarySystemBackground))
        )
    }

    private var composer: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Reply")
                .font(.headline)
            HStack {
                TextField("Type your message", text: $viewModel.draftMessage, axis: .vertical)
                    .textFieldStyle(.roundedBorder)
                Button("Send") {
                    Task {
                        guard let session = appViewModel.session else { return }
                        await viewModel.sendMessage(conversation: conversation, session: session)
                    }
                }
                .buttonStyle(.borderedProminent)
            }
        }
    }
}
