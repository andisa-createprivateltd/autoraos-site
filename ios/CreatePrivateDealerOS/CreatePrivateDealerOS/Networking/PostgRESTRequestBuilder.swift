import Foundation

struct PostgRESTRequestBuilder {
    let config: AppConfig

    func makeRequest(
        table: String,
        method: String = "GET",
        token: String,
        queryItems: [URLQueryItem] = [],
        body: Data? = nil,
        prefer: String? = nil
    ) throws -> URLRequest {
        var components = URLComponents(url: config.supabaseURL.appendingPathComponent("rest/v1/\(table)"), resolvingAgainstBaseURL: false)
        components?.queryItems = queryItems

        guard let url = components?.url else {
            throw AppError.invalidConfiguration
        }

        var request = URLRequest(url: url)
        request.httpMethod = method
        request.httpBody = body
        request.timeoutInterval = 30
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")
        request.addValue("application/json", forHTTPHeaderField: "Accept")
        request.addValue(config.supabaseAnonKey, forHTTPHeaderField: "apikey")
        request.addValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        if let prefer {
            request.addValue(prefer, forHTTPHeaderField: "Prefer")
        }
        return request
    }

    func makeRPCRequest(
        function: String,
        token: String,
        body: Data? = nil
    ) throws -> URLRequest {
        let url = config.supabaseURL.appendingPathComponent("rest/v1/rpc/\(function)")
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.httpBody = body
        request.timeoutInterval = 30
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")
        request.addValue("application/json", forHTTPHeaderField: "Accept")
        request.addValue(config.supabaseAnonKey, forHTTPHeaderField: "apikey")
        request.addValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        return request
    }
}
