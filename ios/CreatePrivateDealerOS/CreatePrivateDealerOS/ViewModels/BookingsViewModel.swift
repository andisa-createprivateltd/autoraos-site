import Foundation

@MainActor
final class BookingsViewModel: ObservableObject {
    @Published var bookings: [Booking] = []
    @Published var leadOptions: [Lead] = []
    @Published var isLoading = false
    @Published var errorMessage: String?

    @Published var selectedLeadID: UUID?
    @Published var bookingType: BookingType = .testDrive
    @Published var bookingDate: Date = Date().addingTimeInterval(3600)
    @Published var notes = ""

    private let repository: DealerOSRepository

    init(repository: DealerOSRepository) {
        self.repository = repository
    }

    func load(session: AppSession) async {
        guard !isLoading else { return }
        isLoading = true
        defer { isLoading = false }

        do {
            async let bookingsTask = repository.fetchBookings(session: session)
            async let leadsTask = repository.fetchLeads(filter: LeadFilter(status: nil, source: nil, assignedUserID: nil), session: session)
            bookings = try await bookingsTask
            leadOptions = try await leadsTask
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    func createBooking(session: AppSession) async {
        guard let selectedLeadID else {
            errorMessage = "Select a lead first."
            return
        }

        let request = NewBookingRequest(
            dealerID: session.userProfile.dealerID,
            leadID: selectedLeadID,
            type: bookingType,
            requestedAt: Date(),
            scheduledFor: bookingDate,
            status: .booked,
            createdBy: "human"
        )

        do {
            try await repository.createBooking(request, session: session)
            bookings = try await repository.fetchBookings(session: session)
            notes = ""
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    func updateStatus(bookingID: UUID, status: BookingStatus, session: AppSession) async {
        do {
            try await repository.updateBookingStatus(bookingID: bookingID, status: status, session: session)
            if let index = bookings.firstIndex(where: { $0.id == bookingID }) {
                bookings[index].status = status
            }
        } catch {
            errorMessage = error.localizedDescription
        }
    }
}
