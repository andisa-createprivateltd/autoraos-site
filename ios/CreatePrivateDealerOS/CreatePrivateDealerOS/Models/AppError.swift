import Foundation

enum AppError: LocalizedError {
    case unauthorized
    case forbidden
    case invalidConfiguration
    case noData
    case network(String)
    case decoding
    case generic(String)

    var errorDescription: String? {
        switch self {
        case .unauthorized:
            return "Your session expired. Please sign in again."
        case .forbidden:
            return "You do not have permission for this action."
        case .invalidConfiguration:
            return "App config is missing required values."
        case .noData:
            return "No data available."
        case let .network(message):
            return message
        case .decoding:
            return "Failed to decode server response."
        case let .generic(message):
            return message
        }
    }
}
