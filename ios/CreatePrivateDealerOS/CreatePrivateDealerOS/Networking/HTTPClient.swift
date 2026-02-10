import Foundation

protocol HTTPClient {
    func perform(_ request: URLRequest) async throws -> Data
}

final class URLSessionHTTPClient: HTTPClient {
    private let session: URLSession

    init(session: URLSession = .shared) {
        self.session = session
    }

    func perform(_ request: URLRequest) async throws -> Data {
        let (data, response) = try await session.data(for: request)
        guard let httpResponse = response as? HTTPURLResponse else {
            throw AppError.network("Invalid server response")
        }

        switch httpResponse.statusCode {
        case 200 ..< 300:
            return data
        case 401:
            throw AppError.unauthorized
        case 403:
            throw AppError.forbidden
        default:
            let message = String(data: data, encoding: .utf8) ?? "Unexpected error"
            throw AppError.network("HTTP \(httpResponse.statusCode): \(message)")
        }
    }
}
