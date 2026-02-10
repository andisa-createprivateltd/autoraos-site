import Foundation

struct DashboardMetrics: Hashable {
    let newLeadsToday: Int
    let avgResponseSeconds7d: Double
    let bookingsThisWeek: Int
    let missedLeads: Int
    let assignedLeads: [Lead]
}
