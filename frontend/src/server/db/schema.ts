import { pgTableCreator, serial, varchar } from 'drizzle-orm/pg-core'

export const createTable = pgTableCreator((name) => `leaptv_${name}`)

export const users = createTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 64 }).notNull(),
})
