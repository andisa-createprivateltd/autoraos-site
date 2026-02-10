import Foundation

enum AppTab: String, Hashable, CaseIterable {
    case dashboard
    case conversations
    case leads
    case bookings
    case analytics
    case settings

    var title: String {
        switch self {
        case .dashboard: return "Dashboard"
        case .conversations: return "Inbox"
        case .leads: return "Leads"
        case .bookings: return "Bookings"
        case .analytics: return "Analytics"
        case .settings: return "Settings"
        }
    }

    var systemImage: String {
        switch self {
        case .dashboard: return "rectangle.grid.2x2"
        case .conversations: return "message"
        case .leads: return "person.2"
        case .bookings: return "calendar"
        case .analytics: return "chart.xyaxis.line"
        case .settings: return "gearshape"
        }
    }
}

enum DeepLinkTarget: Hashable {
    case conversation(UUID)
    case booking(UUID)
}
