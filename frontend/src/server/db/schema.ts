import { pgTableCreator, serial, text } from 'drizzle-orm/pg-core'

export const createTable = pgTableCreator((name) => `leaptv_${name}`)

export const users = createTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  about: text('about').notNull(),
  banners: text('banners').notNull(), // TODO: https://masonry.desandro.com/options
})

export const userFollows = createTable('user_follows', {
  followerId: serial('follower_id')
    .notNull()
    .references(() => users.id),
  followeeId: serial('followee_id')
    .notNull()
    .references(() => users.id),
})
