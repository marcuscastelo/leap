import { Avatar } from '~/components/ui/avatar'
import { EnsAvatar } from '~/components/web3/EnsAvatar'
import { getUsers } from '~/server/queries'

export const dynamic = 'force-dynamic'

// export const dynamic = 'force-dynamic'
export default async function Home() {
  // TODO: homepage
  const users = await getUsers()

  return (
    <>
      {users.map((user) => (
        <a href={`/live/${user.name}`} key={user.id} className="flex gap-1">
          <Avatar>
            <EnsAvatar ensName={user.name} />
          </Avatar>
          <div className="my-auto">{user.name}</div>
        </a>
      ))}
    </>
  )
}
