import SwiftUI

struct ConversationRowView: View {
    let conversation: Conversation
    let revealPhone: Bool
    let canViewMessagePreview: Bool

    var body: some View {
        HStack(alignment: .top, spacing: 12) {
            Circle()
                .fill(Color.blue.opacity(0.2))
                .frame(width: 36, height: 36)
                .overlay(Text(String(conversation.lead?.displayName.prefix(1) ?? "?")))

            VStack(alignment: .leading, spacing: 4) {
                Text(conversation.lead?.displayName ?? "Unknown Lead")
                    .font(.subheadline.weight(.semibold))
                Text(PhoneMasker.mask(conversation.lead?.phone ?? "", revealFull: revealPhone))
                    .font(.caption)
                    .foregroundStyle(.secondary)
                Text(canViewMessagePreview ? (conversation.lastMessagePreview ?? "No messages yet") : "Message preview hidden")
                    .font(.caption)
                    .foregroundStyle(.secondary)
                    .lineLimit(1)
            }

            Spacer()

            Text(conversation.lastMessageAt, style: .time)
                .font(.caption2)
                .foregroundStyle(.secondary)
        }
        .padding(.vertical, 4)
    }
}
