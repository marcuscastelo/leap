import { pgTableCreator, serial, text } from 'drizzle-orm/pg-core'

export const createTable = pgTableCreator((name) => `leaptv_${name}`)

export const users = createTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
})
