import SwiftUI

struct SettingsView: View {
    @EnvironmentObject private var appViewModel: AppViewModel
    @StateObject private var viewModel: SettingsViewModel

    init(repository: DealerOSRepository) {
        _viewModel = StateObject(wrappedValue: SettingsViewModel(repository: repository))
    }

    var body: some View {
        NavigationStack {
            Group {
                if let session = appViewModel.session {
                    List {
                        Section("Business Hours") {
                            ForEach(viewModel.businessHours.keys.sorted(), id: \.self) { day in
                                if let entry = viewModel.businessHours[day] {
                                    HStack {
                                        Text(day.uppercased())
                                            .frame(width: 48, alignment: .leading)
                                        TextField("Open", text: Binding(
                                            get: { entry.open },
                                            set: { viewModel.businessHours[day]?.open = $0 }
                                        ))
                                        .textFieldStyle(.roundedBorder)
                                        TextField("Close", text: Binding(
                                            get: { entry.close },
                                            set: { viewModel.businessHours[day]?.close = $0 }
                                        ))
                                        .textFieldStyle(.roundedBorder)
                                    }
                                }
                            }
                        }

                        Section("FAQs") {
                            TextEditor(text: $viewModel.faqText)
                                .frame(minHeight: 120)
                            Text("One FAQ per line")
                                .font(.caption)
                                .foregroundStyle(.secondary)
                        }

                        Section("Permissions") {
                            Toggle("Marketing can view message content", isOn: $viewModel.marketingCanViewMessages)
                            Toggle("Allow admin full phone visibility", isOn: $viewModel.allowAdminFullPhone)
                        }

                        Section {
                            Button("Save Settings") {
                                Task {
                                    await viewModel.saveSettings(session: session)
                                    await appViewModel.loadSettingsIfNeeded()
                                }
                            }
                            .buttonStyle(.borderedProminent)
                        }

                        Section("Team Management") {
                            TextField("Name", text: $viewModel.inviteName)
                            TextField("Email", text: $viewModel.inviteEmail)
                                .textInputAutocapitalization(.never)
                                .keyboardType(.emailAddress)
                            Picker("Role", selection: $viewModel.inviteRole) {
                                Text("Sales").tag(DealerRole.dealerSales)
                                Text("Marketing").tag(DealerRole.dealerMarketing)
                                Text("Admin").tag(DealerRole.dealerAdmin)
                            }

                            Button("Invite User") {
                                Task {
                                    await viewModel.invite(session: session)
                                }
                            }
                            .buttonStyle(.borderedProminent)

                            ForEach(viewModel.teamMembers) { member in
                                HStack {
                                    VStack(alignment: .leading) {
                                        Text(member.name)
                                        Text(member.email)
                                            .font(.caption)
                                            .foregroundStyle(.secondary)
                                    }
                                    Spacer()
                                    Text(member.role.rawValue)
                                        .font(.caption2)
                                        .foregroundStyle(.secondary)
                                    if member.isActive {
                                        Button("Disable") {
                                            Task {
                                                await viewModel.disableUser(member.id, session: session)
                                            }
                                        }
                                        .buttonStyle(.bordered)
                                    } else {
                                        Text("Disabled")
                                            .font(.caption)
                                            .foregroundStyle(.red)
                                    }
                                }
                            }
                        }
                    }
                    .task(id: session.userProfile.id) {
                        await viewModel.load(session: session)
                    }
                } else {
                    LoadingStateView()
                }
            }
            .navigationTitle("Settings")
            .overlay(alignment: .bottom) {
                if let error = viewModel.errorMessage {
                    ErrorBanner(message: error)
                }
            }
        }
    }
}
