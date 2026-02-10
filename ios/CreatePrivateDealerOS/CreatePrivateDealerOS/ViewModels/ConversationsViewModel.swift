import Foundation

@MainActor
final class ConversationsViewModel: ObservableObject {
    @Published var conversations: [Conversation] = []
    @Published var searchText = ""
    @Published var isLoading = false
    @Published var errorMessage: String?

    private let repository: DealerOSRepository

    init(repository: DealerOSRepository) {
        self.repository = repository
    }

    var filteredConversations: [Conversation] {
        guard !searchText.isEmpty else {
            return conversations
        }

        let query = searchText.lowercased()
        return conversations.filter { conversation in
            let leadName = conversation.lead?.displayName.lowercased() ?? ""
            let preview = conversation.lastMessagePreview?.lowercased() ?? ""
            return leadName.contains(query) || preview.contains(query)
        }
    }

    func load(session: AppSession) async {
        guard !isLoading else { return }
        isLoading = true
        defer { isLoading = false }

        do {
            conversations = try await repository.fetchConversations(session: session)
        } catch {
            errorMessage = error.localizedDescription
        }
    }
}
