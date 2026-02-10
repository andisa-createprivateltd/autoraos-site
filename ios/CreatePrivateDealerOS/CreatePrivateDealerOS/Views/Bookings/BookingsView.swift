import SwiftUI

struct BookingsView: View {
    @EnvironmentObject private var appViewModel: AppViewModel
    @StateObject private var viewModel: BookingsViewModel
    @State private var deepLinkedBooking: Booking?

    init(repository: DealerOSRepository) {
        _viewModel = StateObject(wrappedValue: BookingsViewModel(repository: repository))
    }

    var body: some View {
        NavigationStack {
            Group {
                if let session = appViewModel.session {
                    List {
                        if session.userProfile.role.canWriteConversations {
                            Section("Create Booking") {
                                Picker("Lead", selection: $viewModel.selectedLeadID) {
                                    Text("Select Lead").tag(UUID?.none)
                                    ForEach(viewModel.leadOptions) { lead in
                                        Text(lead.displayName).tag(Optional(lead.id))
                                    }
                                }

                                Picker("Type", selection: $viewModel.bookingType) {
                                    ForEach(BookingType.allCases) { type in
                                        Text(type.label).tag(type)
                                    }
                                }

                                DatePicker("Scheduled For", selection: $viewModel.bookingDate)

                                TextField("Notes", text: $viewModel.notes)

                                Button("Create") {
                                    Task {
                                        await viewModel.createBooking(session: session)
                                    }
                                }
                                .buttonStyle(.borderedProminent)
                            }
                        }

                        Section("Upcoming") {
                            ForEach(viewModel.bookings) { booking in
                                VStack(alignment: .leading, spacing: 8) {
                                    Text(booking.lead?.displayName ?? "Lead")
                                        .font(.headline)
                                    Text("\(booking.type.label) • \(booking.scheduledFor.formatted(date: .abbreviated, time: .shortened))")
                                        .font(.subheadline)

                                    if session.userProfile.role.canWriteConversations {
                                        Picker("Status", selection: Binding(
                                            get: { booking.status },
                                            set: { newStatus in
                                                Task {
                                                    await viewModel.updateStatus(bookingID: booking.id, status: newStatus, session: session)
                                                }
                                            }
                                        )) {
                                            ForEach(BookingStatus.allCases) { status in
                                                Text(status.label).tag(status)
                                            }
                                        }
                                        .pickerStyle(.menu)
                                    } else {
                                        Text("Status: \(booking.status.label)")
                                            .font(.caption)
                                            .foregroundStyle(.secondary)
                                    }
                                }
                                .padding(.vertical, 4)
                            }
                        }
                    }
                    .task(id: session.userProfile.id) {
                        await viewModel.load(session: session)
                        consumeDeepLinkIfNeeded()
                    }
                    .onChange(of: appViewModel.preselectedBookingLeadID) { value in
                        if let value {
                            viewModel.selectedLeadID = value
                        }
                    }
                    .onChange(of: appViewModel.selectedBookingID) { _ in
                        consumeDeepLinkIfNeeded()
                    }
                    .refreshable {
                        await viewModel.load(session: session)
                    }
                } else {
                    LoadingStateView()
                }
            }
            .navigationTitle("Bookings")
            .overlay(alignment: .bottom) {
                if let error = viewModel.errorMessage {
                    ErrorBanner(message: error)
                }
            }
            .sheet(item: $deepLinkedBooking) { booking in
                NavigationStack {
                    VStack(alignment: .leading, spacing: 12) {
                        Text(booking.lead?.displayName ?? "Lead")
                            .font(.title3.bold())
                        Text(booking.type.label)
                        Text(booking.scheduledFor.formatted(date: .abbreviated, time: .shortened))
                        Text("Status: \(booking.status.label)")
                        Spacer()
                    }
                    .padding()
                    .navigationTitle("Booking")
                }
            }
        }
    }

    private func consumeDeepLinkIfNeeded() {
        guard let targetID = appViewModel.selectedBookingID else { return }
        guard let booking = viewModel.bookings.first(where: { $0.id == targetID }) else { return }
        deepLinkedBooking = booking
        appViewModel.selectedBookingID = nil
    }
}
