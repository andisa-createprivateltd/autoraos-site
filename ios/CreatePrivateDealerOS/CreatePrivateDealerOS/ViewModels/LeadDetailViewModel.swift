import Foundation

@MainActor
final class LeadDetailViewModel: ObservableObject {
    @Published var relatedMessages: [Message] = []
    @Published var followups: [FollowupItem] = []
    @Published var isLoading = false
    @Published var errorMessage: String?

    private let repository: DealerOSRepository

    init(repository: DealerOSRepository) {
        self.repository = repository
    }

    func load(lead: Lead, session: AppSession) async {
        guard !isLoading else { return }
        isLoading = true
        defer { isLoading = false }

        do {
            async let followupTask = repository.fetchFollowups(leadID: lead.id, session: session)
            let conversations = try await repository.fetchConversations(session: session)
            if let conversation = conversations.first(where: { $0.leadID == lead.id }) {
                relatedMessages = try await repository.fetchMessages(conversationID: conversation.id, session: session)
            } else {
                relatedMessages = []
            }
            followups = try await followupTask
        } catch {
            errorMessage = error.localizedDescription
        }
    }
}
