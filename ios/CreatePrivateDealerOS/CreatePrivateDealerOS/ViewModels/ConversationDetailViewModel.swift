import Foundation

@MainActor
final class ConversationDetailViewModel: ObservableObject {
    @Published var messages: [Message] = []
    @Published var teamMembers: [TeamMember] = []
    @Published var draftMessage = ""
    @Published var selectedStatus: LeadStatus = .new
    @Published var selectedAssigneeID: UUID?
    @Published var bookingType: BookingType = .testDrive
    @Published var bookingDate = Date().addingTimeInterval(3_600)
    @Published var handoffReason = ""

    @Published var isLoading = false
    @Published var isSubmitting = false
    @Published var errorMessage: String?

    private let repository: DealerOSRepository

    init(repository: DealerOSRepository) {
        self.repository = repository
    }

    func load(conversation: Conversation, session: AppSession) async {
        guard !isLoading else { return }
        isLoading = true
        defer { isLoading = false }

        selectedStatus = conversation.lead?.status ?? .new
        selectedAssigneeID = conversation.lead?.assignedUserID

        do {
            async let messagesTask = repository.fetchMessages(conversationID: conversation.id, session: session)
            async let teamTask = repository.fetchTeamMembers(session: session)
            messages = try await messagesTask
            let team = try await teamTask
            teamMembers = team.filter { $0.isActive }
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    func sendMessage(conversation: Conversation, session: AppSession) async {
        let trimmed = draftMessage.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty, !isSubmitting else { return }
        isSubmitting = true
        defer { isSubmitting = false }

        do {
            try await repository.sendMessage(
                conversationID: conversation.id,
                leadID: conversation.leadID,
                content: trimmed,
                session: session
            )
            draftMessage = ""
            messages = try await repository.fetchMessages(conversationID: conversation.id, session: session)
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    func updateLeadStatus(conversation: Conversation, session: AppSession) async {
        guard !isSubmitting else { return }
        isSubmitting = true
        defer { isSubmitting = false }

        do {
            try await repository.updateLeadStatus(
                leadID: conversation.leadID,
                status: selectedStatus,
                session: session
            )
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    func assignLead(conversation: Conversation, session: AppSession) async {
        guard !isSubmitting, let selectedAssigneeID else { return }
        isSubmitting = true
        defer { isSubmitting = false }

        do {
            try await repository.assignLead(
                leadID: conversation.leadID,
                userID: selectedAssigneeID,
                session: session
            )
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    func createBooking(conversation: Conversation, session: AppSession) async {
        guard !isSubmitting else { return }
        isSubmitting = true
        defer { isSubmitting = false }

        let request = NewBookingRequest(
            dealerID: session.userProfile.dealerID,
            leadID: conversation.leadID,
            type: bookingType,
            requestedAt: Date(),
            scheduledFor: bookingDate,
            status: .booked,
            createdBy: "human"
        )

        do {
            try await repository.createBooking(request, session: session)
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    func handoff(conversation: Conversation, session: AppSession) async {
        guard !isSubmitting else { return }
        let reason = handoffReason.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !reason.isEmpty else { return }

        isSubmitting = true
        defer { isSubmitting = false }

        do {
            try await repository.handoff(
                conversationID: conversation.id,
                leadID: conversation.leadID,
                reason: reason,
                session: session
            )
            handoffReason = ""
        } catch {
            errorMessage = error.localizedDescription
        }
    }
}
