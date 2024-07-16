import { boolean, integer, pgTableCreator, text } from 'drizzle-orm/pg-core'

export const createTable = pgTableCreator((name) => `leaptv_${name}`)

export const users = createTable('users', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  about: text('about'),
  banners: text('banners'), // TODO: https://masonry.desandro.com/options
  live: boolean('live').default(false),
})
