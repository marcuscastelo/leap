import 'server-only'
import { db } from './db'

export async function getUsers() {
  return db.query.users.findMany({
    orderBy: (user, { asc }) => asc(user.name),
  })
}
