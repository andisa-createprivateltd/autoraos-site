import Foundation

struct SendMessagePayload: Encodable {
    let conversationID: UUID
    let leadID: UUID
    let content: String
}

struct HandoffPayload: Encodable {
    let conversationID: UUID
    let leadID: UUID
    let reason: String
}

struct DeviceTokenPayload: Encodable {
    let deviceToken: String
    let platform: String
}
