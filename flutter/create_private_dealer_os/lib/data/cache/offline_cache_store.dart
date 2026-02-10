import 'dart:convert';

import 'package:path/path.dart' as p;
import 'package:path_provider/path_provider.dart';
import 'package:sqflite/sqflite.dart';

import '../../domain/models/conversation.dart';

abstract class OfflineCacheStore {
  Future<void> saveConversations({
    required List<Conversation> conversations,
    required String dealerId,
  });

  Future<List<Conversation>> loadConversations({required String dealerId});

  Future<void> saveMessages({
    required List<Message> messages,
    required String dealerId,
    required String conversationId,
  });

  Future<List<Message>> loadMessages({
    required String dealerId,
    required String conversationId,
  });
}

class SqliteOfflineCacheStore implements OfflineCacheStore {
  SqliteOfflineCacheStore();

  Database? _db;

  Future<Database> _database() async {
    if (_db != null) {
      return _db!;
    }

    final directory = await getTemporaryDirectory();
    final String dbPath = p.join(directory.path, 'dealer_os_cache.sqlite');

    _db = await openDatabase(
      dbPath,
      version: 1,
      onCreate: (Database db, int version) async {
        await db.execute('''
          CREATE TABLE conversation_cache (
            dealer_id TEXT NOT NULL,
            conversation_id TEXT PRIMARY KEY,
            payload TEXT NOT NULL,
            last_message_at INTEGER NOT NULL
          )
        ''');

        await db.execute('''
          CREATE TABLE message_cache (
            dealer_id TEXT NOT NULL,
            conversation_id TEXT NOT NULL,
            message_id TEXT PRIMARY KEY,
            payload TEXT NOT NULL,
            created_at INTEGER NOT NULL
          )
        ''');

        await db.execute(
          'CREATE INDEX idx_conversation_cache_dealer ON conversation_cache(dealer_id, last_message_at DESC)',
        );
        await db.execute(
          'CREATE INDEX idx_message_cache_scope ON message_cache(dealer_id, conversation_id, created_at DESC)',
        );
      },
    );

    return _db!;
  }

  @override
  Future<void> saveConversations({
    required List<Conversation> conversations,
    required String dealerId,
  }) async {
    final Database db = await _database();

    await db.transaction((Transaction txn) async {
      for (final Conversation conversation in conversations) {
        await txn.insert(
          'conversation_cache',
          <String, Object?>{
            'dealer_id': dealerId,
            'conversation_id': conversation.id,
            'payload': jsonEncode(conversation.toJson()),
            'last_message_at': conversation.lastMessageAt.millisecondsSinceEpoch,
          },
          conflictAlgorithm: ConflictAlgorithm.replace,
        );
      }

      await txn.execute('''
        DELETE FROM conversation_cache
        WHERE dealer_id = ?
        AND conversation_id NOT IN (
          SELECT conversation_id
          FROM conversation_cache
          WHERE dealer_id = ?
          ORDER BY last_message_at DESC
          LIMIT 50
        )
      ''', <Object?>[dealerId, dealerId]);
    });
  }

  @override
  Future<List<Conversation>> loadConversations({required String dealerId}) async {
    final Database db = await _database();
    final List<Map<String, Object?>> rows = await db.query(
      'conversation_cache',
      columns: <String>['payload'],
      where: 'dealer_id = ?',
      whereArgs: <Object>[dealerId],
      orderBy: 'last_message_at DESC',
      limit: 50,
    );

    return rows
        .map((Map<String, Object?> row) {
          final String payload = row['payload'] as String;
          return Conversation.fromJson(
            jsonDecode(payload) as Map<String, dynamic>,
          );
        })
        .toList();
  }

  @override
  Future<void> saveMessages({
    required List<Message> messages,
    required String dealerId,
    required String conversationId,
  }) async {
    final Database db = await _database();

    await db.transaction((Transaction txn) async {
      for (final Message message in messages) {
        await txn.insert(
          'message_cache',
          <String, Object?>{
            'dealer_id': dealerId,
            'conversation_id': conversationId,
            'message_id': message.id,
            'payload': jsonEncode(message.toJson()),
            'created_at': message.createdAt.millisecondsSinceEpoch,
          },
          conflictAlgorithm: ConflictAlgorithm.replace,
        );
      }

      await txn.execute('''
        DELETE FROM message_cache
        WHERE dealer_id = ?
        AND conversation_id = ?
        AND message_id NOT IN (
          SELECT message_id
          FROM message_cache
          WHERE dealer_id = ?
          AND conversation_id = ?
          ORDER BY created_at DESC
          LIMIT 50
        )
      ''', <Object?>[dealerId, conversationId, dealerId, conversationId]);
    });
  }

  @override
  Future<List<Message>> loadMessages({
    required String dealerId,
    required String conversationId,
  }) async {
    final Database db = await _database();
    final List<Map<String, Object?>> rows = await db.query(
      'message_cache',
      columns: <String>['payload'],
      where: 'dealer_id = ? AND conversation_id = ?',
      whereArgs: <Object>[dealerId, conversationId],
      orderBy: 'created_at ASC',
      limit: 50,
    );

    return rows
        .map((Map<String, Object?> row) {
          final String payload = row['payload'] as String;
          return Message.fromJson(jsonDecode(payload) as Map<String, dynamic>);
        })
        .toList();
  }
}
