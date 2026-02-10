import Foundation

struct BackendRequestBuilder {
    let config: AppConfig

    func makePOST(path: String, token: String, payload: Encodable) throws -> URLRequest {
        let url = config.backendBaseURL.appendingPathComponent(path)
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.timeoutInterval = 30
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")
        request.addValue("application/json", forHTTPHeaderField: "Accept")
        request.addValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        request.httpBody = try JSONCoding.encoder().encode(AnyEncodable(payload))
        return request
    }
}

private struct AnyEncodable: Encodable {
    private let encodeFunction: (Encoder) throws -> Void

    init(_ encodable: Encodable) {
        self.encodeFunction = encodable.encode
    }

    func encode(to encoder: Encoder) throws {
        try encodeFunction(encoder)
    }
}
