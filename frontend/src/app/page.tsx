import { Avatar } from '~/components/ui/avatar'
import { EnsAvatar } from '~/components/web3/EnsAvatar'
import { db } from '~/server/db'

export const dynamic = 'force-dynamic'

// export const dynamic = 'force-dynamic'
export default async function Home() {
  // TODO: homepage
  const users = await db.query.users.findMany()
  return (
    <>
      {users.map((user) => (
        <a href={`/${user.name}`} key={user.id} className="flex gap-1">
          <Avatar>
            <EnsAvatar ensName={user.name} />
          </Avatar>
          <div className="my-auto">{user.name}</div>
        </a>
      ))}
    </>
  )
}
