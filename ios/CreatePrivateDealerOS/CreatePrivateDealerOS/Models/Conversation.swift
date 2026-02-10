import Foundation

enum MessageDirection: String, Codable {
    case inbound
    case outbound
}

enum MessageSenderType: String, Codable {
    case lead
    case ai
    case human
    case system
}

enum MessageType: String, Codable {
    case text
    case button
    case image
}

struct Conversation: Codable, Identifiable, Hashable {
    let id: UUID
    let dealerID: UUID
    let leadID: UUID
    let channel: String
    let isOpen: Bool
    let lastMessageAt: Date
    let createdAt: Date

    var lead: Lead?
    var lastMessagePreview: String?
}

struct Message: Codable, Identifiable, Hashable {
    let id: UUID
    let dealerID: UUID
    let conversationID: UUID
    let leadID: UUID
    let direction: MessageDirection
    let senderType: MessageSenderType
    let senderUserID: UUID?
    let content: String
    let messageType: MessageType
    let providerMessageID: String?
    let createdAt: Date
}
