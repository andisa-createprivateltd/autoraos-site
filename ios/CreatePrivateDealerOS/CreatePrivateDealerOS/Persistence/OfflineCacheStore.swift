import Foundation
import SQLite3

private let SQLITE_TRANSIENT = unsafeBitCast(-1, to: sqlite3_destructor_type.self)

protocol OfflineCacheStore {
    func saveConversations(_ conversations: [Conversation], dealerID: UUID)
    func loadConversations(dealerID: UUID) -> [Conversation]

    func saveMessages(_ messages: [Message], dealerID: UUID, conversationID: UUID)
    func loadMessages(dealerID: UUID, conversationID: UUID) -> [Message]
}

final class SQLiteOfflineCacheStore: OfflineCacheStore {
    private var db: OpaquePointer?
    private let encoder = JSONCoding.encoder()
    private let decoder = JSONCoding.decoder()

    init(fileManager: FileManager = .default) {
        let directory = fileManager.urls(for: .cachesDirectory, in: .userDomainMask).first
            ?? URL(fileURLWithPath: NSTemporaryDirectory())
        let dbURL = directory.appendingPathComponent("dealer_os_cache.sqlite")
        sqlite3_open(dbURL.path, &db)
        createTablesIfNeeded()
    }

    deinit {
        sqlite3_close(db)
    }

    func saveConversations(_ conversations: [Conversation], dealerID: UUID) {
        withTransaction {
            for conversation in conversations {
                guard let payload = try? encoder.encode(conversation), let payloadString = String(data: payload, encoding: .utf8) else {
                    continue
                }
                let sql = """
                insert into conversation_cache (dealer_id, conversation_id, payload, last_message_at)
                values (?, ?, ?, ?)
                on conflict(conversation_id) do update set
                  payload = excluded.payload,
                  last_message_at = excluded.last_message_at
                """

                execute(sql: sql, bindings: [
                    dealerID.uuidString.lowercased(),
                    conversation.id.uuidString.lowercased(),
                    payloadString,
                    conversation.lastMessageAt.timeIntervalSince1970
                ])
            }

            execute(
                sql: """
                delete from conversation_cache
                where dealer_id = ?
                  and conversation_id not in (
                    select conversation_id
                    from conversation_cache
                    where dealer_id = ?
                    order by last_message_at desc
                    limit 50
                  )
                """,
                bindings: [dealerID.uuidString.lowercased(), dealerID.uuidString.lowercased()]
            )
        }
    }

    func loadConversations(dealerID: UUID) -> [Conversation] {
        queryConversations(
            sql: """
            select payload
            from conversation_cache
            where dealer_id = ?
            order by last_message_at desc
            limit 50
            """,
            bindings: [dealerID.uuidString.lowercased()]
        )
    }

    func saveMessages(_ messages: [Message], dealerID: UUID, conversationID: UUID) {
        withTransaction {
            for message in messages {
                guard let payload = try? encoder.encode(message), let payloadString = String(data: payload, encoding: .utf8) else {
                    continue
                }

                let sql = """
                insert into message_cache (dealer_id, conversation_id, message_id, payload, created_at)
                values (?, ?, ?, ?, ?)
                on conflict(message_id) do update set
                  payload = excluded.payload,
                  created_at = excluded.created_at
                """

                execute(sql: sql, bindings: [
                    dealerID.uuidString.lowercased(),
                    conversationID.uuidString.lowercased(),
                    message.id.uuidString.lowercased(),
                    payloadString,
                    message.createdAt.timeIntervalSince1970
                ])
            }

            execute(
                sql: """
                delete from message_cache
                where dealer_id = ? and conversation_id = ?
                  and message_id not in (
                    select message_id
                    from message_cache
                    where dealer_id = ? and conversation_id = ?
                    order by created_at desc
                    limit 50
                  )
                """,
                bindings: [
                    dealerID.uuidString.lowercased(),
                    conversationID.uuidString.lowercased(),
                    dealerID.uuidString.lowercased(),
                    conversationID.uuidString.lowercased()
                ]
            )
        }
    }

    func loadMessages(dealerID: UUID, conversationID: UUID) -> [Message] {
        queryMessages(
            sql: """
            select payload
            from message_cache
            where dealer_id = ? and conversation_id = ?
            order by created_at asc
            limit 50
            """,
            bindings: [dealerID.uuidString.lowercased(), conversationID.uuidString.lowercased()]
        )
    }

    private func createTablesIfNeeded() {
        execute(
            sql: """
            create table if not exists conversation_cache (
              dealer_id text not null,
              conversation_id text primary key,
              payload text not null,
              last_message_at real not null
            )
            """
        )

        execute(
            sql: """
            create table if not exists message_cache (
              dealer_id text not null,
              conversation_id text not null,
              message_id text primary key,
              payload text not null,
              created_at real not null
            )
            """
        )

        execute(sql: "create index if not exists idx_conversation_cache_dealer on conversation_cache (dealer_id, last_message_at desc)")
        execute(sql: "create index if not exists idx_message_cache_scope on message_cache (dealer_id, conversation_id, created_at desc)")
    }

    private func withTransaction(_ work: () -> Void) {
        execute(sql: "begin transaction")
        work()
        execute(sql: "commit")
    }

    private func execute(sql: String, bindings: [Any] = []) {
        guard let db else { return }
        var statement: OpaquePointer?
        guard sqlite3_prepare_v2(db, sql, -1, &statement, nil) == SQLITE_OK else {
            sqlite3_finalize(statement)
            return
        }

        for (index, value) in bindings.enumerated() {
            let position = Int32(index + 1)
            switch value {
            case let string as String:
                sqlite3_bind_text(statement, position, string, -1, SQLITE_TRANSIENT)
            case let double as Double:
                sqlite3_bind_double(statement, position, double)
            default:
                sqlite3_bind_null(statement, position)
            }
        }

        sqlite3_step(statement)
        sqlite3_finalize(statement)
    }

    private func queryConversations(sql: String, bindings: [Any]) -> [Conversation] {
        queryPayloads(sql: sql, bindings: bindings)
            .compactMap { try? decoder.decode(Conversation.self, from: Data($0.utf8)) }
    }

    private func queryMessages(sql: String, bindings: [Any]) -> [Message] {
        queryPayloads(sql: sql, bindings: bindings)
            .compactMap { try? decoder.decode(Message.self, from: Data($0.utf8)) }
    }

    private func queryPayloads(sql: String, bindings: [Any]) -> [String] {
        guard let db else { return [] }
        var statement: OpaquePointer?
        guard sqlite3_prepare_v2(db, sql, -1, &statement, nil) == SQLITE_OK else {
            sqlite3_finalize(statement)
            return []
        }

        for (index, value) in bindings.enumerated() {
            let position = Int32(index + 1)
            switch value {
            case let string as String:
                sqlite3_bind_text(statement, position, string, -1, SQLITE_TRANSIENT)
            default:
                sqlite3_bind_null(statement, position)
            }
        }

        var rows: [String] = []
        while sqlite3_step(statement) == SQLITE_ROW {
            if let cString = sqlite3_column_text(statement, 0) {
                rows.append(String(cString: cString))
            }
        }

        sqlite3_finalize(statement)
        return rows
    }
}
