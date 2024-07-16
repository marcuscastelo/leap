import { Avatar } from '@radix-ui/react-avatar'
import { CircleIcon, VideoIcon } from 'lucide-react'
import { EnsAvatar } from '~/components/web3/EnsAvatar'
import { getUsers } from '~/server/queries'

export async function ChannelSidebar() {
  const users = await getUsers()

  return (
    <aside
      id="channel-navigation"
      // On self-start: https://stackoverflow.com/questions/44446671/my-position-sticky-element-isnt-sticky-when-using-flexbox
      className="sticky top-12 hidden h-[calc(100vh-3.5rem)] self-start border-r border-zinc-800 bg-zinc-900 p-3 sm:block xl:w-72"
    >
      {/* <div className="absolute left-0 top-0 -z-10 h-screen w-full border-r border-zinc-800 bg-zinc-900"></div> */}
      <nav className="flex flex-col gap-1">
        <VideoIcon className="block w-full xl:hidden" />
        <span className="hidden p-1 text-sm font-semibold text-zinc-100 xl:block">
          RECOMENDED CHANNELS
        </span>
        {users.map((user) => (
          <div key={user.id} className="flex justify-between gap-2">
            <a
              className="my-auto flex gap-1 self-start xl:grow"
              href={`/${user.name}`}
            >
              <Avatar>
                <EnsAvatar ensName={user.name} />
              </Avatar>
              <div className="my-auto hidden text-sm xl:block">
                <span className="block">{user.name}</span>
                <span className="block text-xs font-light text-zinc-400">
                  IRL
                </span>
              </div>
            </a>
            <div className="my-auto hidden justify-between gap-1 self-end xl:flex ">
              <CircleIcon
                fill="red"
                stroke="red"
                size={8}
                className="my-auto"
              />
              <span className="my-auto">
                {(Math.random() * 10).toFixed(1)}K
              </span>
            </div>
          </div>
        ))}
      </nav>
    </aside>
  )
}
