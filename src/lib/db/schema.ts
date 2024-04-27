import {integer, pgEnum, pgTable, serial, text, timestamp, varchar} from 'drizzle-orm/pg-core'


export const roleEnum = pgEnum('role', ['user', 'system'])

export const chats = pgTable('chats',{
    id: serial('id').primaryKey(),
    pdfName: text('pdf_name').notNull(),
    pdfUrl: text('pdf_url').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    userId: varchar('user_id', {length: 256}).notNull(),
    fileKey: text('file_key').notNull(),
})

export type drizzleChat = typeof chats.$inferSelect

export const messages = pgTable('messages',{
    id: serial('id').primaryKey(),
    chatId: integer('chat_id').notNull().references(() => chats.id),
    conten: text('content').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    role: roleEnum('role').notNull()
}) 