import Foundation

struct ResponseTrendPoint: Identifiable, Hashable {
    let id = UUID()
    let date: Date
    let avgSeconds: Double
}

struct SourceBreakdown: Identifiable, Hashable {
    let id = UUID()
    let source: LeadSource
    let count: Int
}

struct AnalyticsSnapshot: Hashable {
    let responseTrend7d: [ResponseTrendPoint]
    let responseTrend30d: [ResponseTrendPoint]
    let sourceBreakdown: [SourceBreakdown]
    let bookingsCount: Int
    let afterHoursHandledPercent: Double
}
