import Foundation

enum DealerRole: String, Codable, CaseIterable {
    case dealerAdmin = "dealer_admin"
    case dealerSales = "dealer_sales"
    case dealerMarketing = "dealer_marketing"
    case platformOwner = "platform_owner"
    case platformSupport = "platform_support"

    var canManageSettings: Bool {
        self == .dealerAdmin || self == .platformOwner || self == .platformSupport
    }

    var canWriteConversations: Bool {
        self == .dealerAdmin || self == .dealerSales || self == .platformOwner || self == .platformSupport
    }

    func canViewMessageContent(marketingFeatureFlag: Bool) -> Bool {
        switch self {
        case .dealerAdmin, .dealerSales, .platformOwner, .platformSupport:
            return true
        case .dealerMarketing:
            return marketingFeatureFlag
        }
    }

    var tabItems: [AppTab] {
        switch self {
        case .dealerAdmin:
            return [.dashboard, .conversations, .leads, .bookings, .analytics, .settings]
        case .dealerSales:
            return [.dashboard, .conversations, .leads, .bookings, .analytics]
        case .dealerMarketing:
            return [.dashboard, .conversations, .leads, .bookings, .analytics]
        case .platformOwner, .platformSupport:
            return [.dashboard, .analytics]
        }
    }
}
