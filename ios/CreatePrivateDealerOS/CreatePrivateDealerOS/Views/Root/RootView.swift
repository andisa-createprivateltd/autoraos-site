import SwiftUI

struct RootView: View {
    @EnvironmentObject private var appViewModel: AppViewModel

    let repository: DealerOSRepository

    var body: some View {
        Group {
            if appViewModel.isBootstrapping {
                LoadingStateView()
            } else if appViewModel.session == nil {
                LoginView()
            } else {
                tabShell
            }
        }
        .overlay(alignment: .top) {
            if let error = appViewModel.errorMessage {
                ErrorBanner(message: error)
            }
        }
    }

    private var tabShell: some View {
        TabView(selection: $appViewModel.selectedTab) {
            ForEach(appViewModel.availableTabs, id: \.self) { tab in
                tabContent(tab)
                    .tabItem {
                        Label(tab.title, systemImage: tab.systemImage)
                }
                    .tag(tab)
            }
        }
        .safeAreaInset(edge: .top) {
            HStack {
                Spacer()
                Button {
                    Task { await appViewModel.signOut() }
                } label: {
                    Image(systemName: "rectangle.portrait.and.arrow.right")
                        .font(.headline)
                        .padding(10)
                        .background(Color(.secondarySystemBackground), in: Circle())
                }
                .accessibilityLabel("Sign Out")
            }
            .padding(.horizontal)
            .padding(.top, 4)
        }
    }

    @ViewBuilder
    private func tabContent(_ tab: AppTab) -> some View {
        switch tab {
        case .dashboard:
            DashboardView(repository: repository)
        case .conversations:
            ConversationsView(repository: repository)
        case .leads:
            LeadsView(repository: repository)
        case .bookings:
            BookingsView(repository: repository)
        case .analytics:
            AnalyticsView(repository: repository)
        case .settings:
            if appViewModel.role?.canManageSettings == true {
                SettingsView(repository: repository)
            } else {
                Text("Settings are restricted for your role.")
            }
        }
    }
}
