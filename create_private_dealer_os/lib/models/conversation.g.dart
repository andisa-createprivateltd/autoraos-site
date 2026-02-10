// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'conversation.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$ConversationImpl _$$ConversationImplFromJson(Map<String, dynamic> json) =>
    _$ConversationImpl(
      id: json['id'] as String,
      leadID: json['leadID'] as String,
      leadName: json['leadName'] as String,
      createdAt: DateTime.parse(json['createdAt'] as String),
      lastMessageAt: DateTime.parse(json['lastMessageAt'] as String),
      lastMessage: json['lastMessage'] as String,
      unreadCount: (json['unreadCount'] as num).toInt(),
    );

Map<String, dynamic> _$$ConversationImplToJson(_$ConversationImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'leadID': instance.leadID,
      'leadName': instance.leadName,
      'createdAt': instance.createdAt.toIso8601String(),
      'lastMessageAt': instance.lastMessageAt.toIso8601String(),
      'lastMessage': instance.lastMessage,
      'unreadCount': instance.unreadCount,
    };

_$MessageImpl _$$MessageImplFromJson(Map<String, dynamic> json) =>
    _$MessageImpl(
      id: json['id'] as String,
      conversationID: json['conversationID'] as String,
      senderID: json['senderID'] as String,
      senderName: json['senderName'] as String,
      content: json['content'] as String,
      sentAt: DateTime.parse(json['sentAt'] as String),
      isRead: json['isRead'] as bool?,
    );

Map<String, dynamic> _$$MessageImplToJson(_$MessageImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'conversationID': instance.conversationID,
      'senderID': instance.senderID,
      'senderName': instance.senderName,
      'content': instance.content,
      'sentAt': instance.sentAt.toIso8601String(),
      'isRead': instance.isRead,
    };
