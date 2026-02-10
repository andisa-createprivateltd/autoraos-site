import SwiftUI

struct ConversationsView: View {
    @EnvironmentObject private var appViewModel: AppViewModel
    @StateObject private var viewModel: ConversationsViewModel
    private let repository: DealerOSRepository
    @State private var deepLinkedConversation: Conversation?

    init(repository: DealerOSRepository) {
        self.repository = repository
        _viewModel = StateObject(wrappedValue: ConversationsViewModel(repository: repository))
    }

    var body: some View {
        NavigationStack {
            Group {
                if let session = appViewModel.session {
                    List {
                        ForEach(viewModel.filteredConversations) { conversation in
                            NavigationLink {
                                ConversationDetailView(
                                    conversation: conversation,
                                    repository: repository,
                                    canViewMessageContent: appViewModel.canViewMessageContent,
                                    canWriteConversation: session.userProfile.role.canWriteConversations,
                                    revealPhone: appViewModel.canUnmaskPhone
                                )
                            } label: {
                                ConversationRowView(
                                    conversation: conversation,
                                    revealPhone: appViewModel.canUnmaskPhone,
                                    canViewMessagePreview: appViewModel.canViewMessageContent
                                )
                            }
                        }
                    }
                    .searchable(text: $viewModel.searchText, prompt: "Search by lead or message")
                    .refreshable {
                        await viewModel.load(session: session)
                    }
                    .task(id: session.userProfile.id) {
                        await viewModel.load(session: session)
                        consumeDeepLinkIfNeeded()
                    }
                } else {
                    LoadingStateView()
                }
            }
            .onChange(of: appViewModel.selectedConversationID) { _ in
                consumeDeepLinkIfNeeded()
            }
            .navigationTitle("Conversations")
            .overlay(alignment: .bottom) {
                if let error = viewModel.errorMessage {
                    ErrorBanner(message: error)
                }
            }
            .sheet(item: $deepLinkedConversation) { conversation in
                NavigationStack {
                    ConversationDetailView(
                        conversation: conversation,
                        repository: repository,
                        canViewMessageContent: appViewModel.canViewMessageContent,
                        canWriteConversation: appViewModel.session?.userProfile.role.canWriteConversations ?? false,
                        revealPhone: appViewModel.canUnmaskPhone
                    )
                    .environmentObject(appViewModel)
                }
            }
        }
    }

    private func consumeDeepLinkIfNeeded() {
        guard let targetID = appViewModel.selectedConversationID else { return }
        guard let conversation = viewModel.conversations.first(where: { $0.id == targetID }) else { return }
        deepLinkedConversation = conversation
        appViewModel.selectedConversationID = nil
    }
}
