import Foundation

enum MockSeedData {
    static let dealerID = UUID(uuidString: "4d17fc5f-0638-4f15-95bf-95f1f40bf1ab")!
    static let adminID = UUID(uuidString: "6db89242-6d38-4f8f-8c75-c26f77d5275c")!
    static let salesID = UUID(uuidString: "f6acdc19-78f3-45ac-baa6-b17366db75f0")!

    static var userProfile: UserProfile {
        UserProfile(
            id: adminID,
            dealerID: dealerID,
            name: "Dealer Admin",
            email: "admin@createprivate.co",
            role: .dealerAdmin,
            isActive: true,
            lastLoginAt: Date()
        )
    }

    static var leads: [Lead] {
        [
            Lead(
                id: UUID(uuidString: "4c8a2075-4cce-4f4d-a68e-a5150b7a4f5f")!,
                dealerID: dealerID,
                source: .whatsapp,
                firstContactAt: Date().addingTimeInterval(-4_000),
                name: "Lerato Molefe",
                phone: "+27820001111",
                vehicleInterest: "Jaecoo J7",
                budgetRange: "R500k-R700k",
                status: .contacted,
                assignedUserID: salesID,
                lastActivityAt: Date().addingTimeInterval(-900),
                createdAt: Date().addingTimeInterval(-4_000)
            ),
            Lead(
                id: UUID(uuidString: "3f3904b0-ec17-410f-8e64-d6644ea89dd8")!,
                dealerID: dealerID,
                source: .website,
                firstContactAt: Date().addingTimeInterval(-14_000),
                name: "Neo Dlamini",
                phone: "+27820002222",
                vehicleInterest: "Haval H6",
                budgetRange: "R450k-R600k",
                status: .new,
                assignedUserID: salesID,
                lastActivityAt: Date().addingTimeInterval(-5_400),
                createdAt: Date().addingTimeInterval(-14_000)
            )
        ]
    }

    static var conversations: [Conversation] {
        [
            Conversation(
                id: UUID(uuidString: "7cfca36c-54b6-4f96-90f6-3f8e89ec9cb3")!,
                dealerID: dealerID,
                leadID: leads[0].id,
                channel: "whatsapp",
                isOpen: true,
                lastMessageAt: Date().addingTimeInterval(-900),
                createdAt: Date().addingTimeInterval(-3_600),
                lead: leads[0],
                lastMessagePreview: "Can I test drive on Saturday?"
            ),
            Conversation(
                id: UUID(uuidString: "e5dc1850-f4d8-4759-a5f8-1b9e4d7712f9")!,
                dealerID: dealerID,
                leadID: leads[1].id,
                channel: "whatsapp",
                isOpen: true,
                lastMessageAt: Date().addingTimeInterval(-4_200),
                createdAt: Date().addingTimeInterval(-8_000),
                lead: leads[1],
                lastMessagePreview: "What are your finance options?"
            )
        ]
    }

    static var messagesByConversation: [UUID: [Message]] {
        [
            conversations[0].id: [
                Message(
                    id: UUID(),
                    dealerID: dealerID,
                    conversationID: conversations[0].id,
                    leadID: leads[0].id,
                    direction: .inbound,
                    senderType: .lead,
                    senderUserID: nil,
                    content: "Can I test drive on Saturday?",
                    messageType: .text,
                    providerMessageID: nil,
                    createdAt: Date().addingTimeInterval(-1_200)
                ),
                Message(
                    id: UUID(),
                    dealerID: dealerID,
                    conversationID: conversations[0].id,
                    leadID: leads[0].id,
                    direction: .outbound,
                    senderType: .human,
                    senderUserID: salesID,
                    content: "Yes, 10:00 works. I can book it now.",
                    messageType: .text,
                    providerMessageID: nil,
                    createdAt: Date().addingTimeInterval(-900)
                )
            ],
            conversations[1].id: [
                Message(
                    id: UUID(),
                    dealerID: dealerID,
                    conversationID: conversations[1].id,
                    leadID: leads[1].id,
                    direction: .inbound,
                    senderType: .lead,
                    senderUserID: nil,
                    content: "What are your finance options?",
                    messageType: .text,
                    providerMessageID: nil,
                    createdAt: Date().addingTimeInterval(-4_200)
                )
            ]
        ]
    }

    static var bookings: [Booking] {
        [
            Booking(
                id: UUID(uuidString: "a2df2fec-c6ba-4f3b-8583-8f09c9ff9130")!,
                dealerID: dealerID,
                leadID: leads[0].id,
                type: .testDrive,
                requestedAt: Date().addingTimeInterval(-1_000),
                scheduledFor: Date().addingTimeInterval(86_400),
                status: .booked,
                createdBy: "human",
                createdAt: Date().addingTimeInterval(-1_000),
                lead: leads[0]
            )
        ]
    }

    static var team: [TeamMember] {
        [
            TeamMember(
                id: adminID,
                dealerID: dealerID,
                name: "Dealer Admin",
                email: "admin@createprivate.co",
                role: .dealerAdmin,
                isActive: true,
                createdAt: Date().addingTimeInterval(-860_000)
            ),
            TeamMember(
                id: salesID,
                dealerID: dealerID,
                name: "Sales Specialist",
                email: "sales@createprivate.co",
                role: .dealerSales,
                isActive: true,
                createdAt: Date().addingTimeInterval(-760_000)
            )
        ]
    }
}
