import 'lead.dart';

enum MessageDirection {
  inbound('inbound'),
  outbound('outbound');

  const MessageDirection(this.value);
  final String value;

  static MessageDirection fromString(String raw) {
    return MessageDirection.values.firstWhere(
      (direction) => direction.value == raw,
      orElse: () => MessageDirection.inbound,
    );
  }
}

enum MessageSenderType {
  lead('lead'),
  ai('ai'),
  human('human'),
  system('system');

  const MessageSenderType(this.value);
  final String value;

  static MessageSenderType fromString(String raw) {
    return MessageSenderType.values.firstWhere(
      (type) => type.value == raw,
      orElse: () => MessageSenderType.human,
    );
  }
}

enum MessageType {
  text('text'),
  button('button'),
  image('image');

  const MessageType(this.value);
  final String value;

  static MessageType fromString(String raw) {
    return MessageType.values.firstWhere(
      (type) => type.value == raw,
      orElse: () => MessageType.text,
    );
  }
}

class Conversation {
  const Conversation({
    required this.id,
    required this.dealerId,
    required this.leadId,
    required this.channel,
    required this.isOpen,
    required this.lastMessageAt,
    required this.createdAt,
    this.lead,
    this.lastMessagePreview,
  });

  final String id;
  final String dealerId;
  final String leadId;
  final String channel;
  final bool isOpen;
  final DateTime lastMessageAt;
  final DateTime createdAt;
  final Lead? lead;
  final String? lastMessagePreview;

  factory Conversation.fromJson(Map<String, dynamic> json) {
    return Conversation(
      id: json['id'] as String,
      dealerId: json['dealer_id'] as String,
      leadId: json['lead_id'] as String,
      channel: (json['channel'] as String?) ?? 'whatsapp',
      isOpen: (json['is_open'] as bool?) ?? true,
      lastMessageAt: DateTime.parse(json['last_message_at'] as String).toUtc(),
      createdAt: DateTime.parse(json['created_at'] as String).toUtc(),
      lead: json['lead'] == null
          ? null
          : Lead.fromJson(json['lead'] as Map<String, dynamic>),
      lastMessagePreview: json['last_message_preview'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'id': id,
      'dealer_id': dealerId,
      'lead_id': leadId,
      'channel': channel,
      'is_open': isOpen,
      'last_message_at': lastMessageAt.toIso8601String(),
      'created_at': createdAt.toIso8601String(),
      'lead': lead?.toJson(),
      'last_message_preview': lastMessagePreview,
    };
  }

  Conversation copyWith({Lead? lead, String? lastMessagePreview}) {
    return Conversation(
      id: id,
      dealerId: dealerId,
      leadId: leadId,
      channel: channel,
      isOpen: isOpen,
      lastMessageAt: lastMessageAt,
      createdAt: createdAt,
      lead: lead ?? this.lead,
      lastMessagePreview: lastMessagePreview ?? this.lastMessagePreview,
    );
  }
}

class Message {
  const Message({
    required this.id,
    required this.dealerId,
    required this.conversationId,
    required this.leadId,
    required this.direction,
    required this.senderType,
    required this.senderUserId,
    required this.content,
    required this.messageType,
    required this.providerMessageId,
    required this.createdAt,
  });

  final String id;
  final String dealerId;
  final String conversationId;
  final String leadId;
  final MessageDirection direction;
  final MessageSenderType senderType;
  final String? senderUserId;
  final String content;
  final MessageType messageType;
  final String? providerMessageId;
  final DateTime createdAt;

  factory Message.fromJson(Map<String, dynamic> json) {
    return Message(
      id: json['id'] as String,
      dealerId: json['dealer_id'] as String,
      conversationId: json['conversation_id'] as String,
      leadId: json['lead_id'] as String,
      direction: MessageDirection.fromString((json['direction'] as String?) ?? 'inbound'),
      senderType: MessageSenderType.fromString((json['sender_type'] as String?) ?? 'human'),
      senderUserId: json['sender_user_id'] as String?,
      content: (json['content'] as String?) ?? '',
      messageType: MessageType.fromString((json['message_type'] as String?) ?? 'text'),
      providerMessageId: json['provider_message_id'] as String?,
      createdAt: DateTime.parse(json['created_at'] as String).toUtc(),
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'id': id,
      'dealer_id': dealerId,
      'conversation_id': conversationId,
      'lead_id': leadId,
      'direction': direction.value,
      'sender_type': senderType.value,
      'sender_user_id': senderUserId,
      'content': content,
      'message_type': messageType.value,
      'provider_message_id': providerMessageId,
      'created_at': createdAt.toIso8601String(),
    };
  }
}
