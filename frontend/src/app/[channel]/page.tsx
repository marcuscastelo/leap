import {
  CircleIcon,
  EllipsisVerticalIcon,
  HeartIcon,
  UploadIcon,
  UserIcon,
  VerifiedIcon,
  VideoIcon,
  YoutubeIcon,
} from 'lucide-react'
import { DebugWebRTCPlayer } from '~/components/livestream/DebugWebRTCPlayer'
import { AspectRatio } from '~/components/ui/aspect-ratio'
import { Avatar } from '~/components/ui/avatar'
import { Badge, badgeVariants } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { EnsAvatar } from '~/components/web3/EnsAvatar'
import { getUsers } from '~/server/queries'

export default async function ChannelPage({
  params: { channel },
}: {
  params: { channel: string }
}) {
  const users = await getUsers()
  return (
    <div className="flex w-full">
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
      <main className="flex flex-1 flex-col">
        <div className="w-full border-b border-zinc-700 bg-black">
          <AspectRatio ratio={16 / 9}>
            {/* <HLSPlayer /> */}
            <DebugWebRTCPlayer streamId={channel} />
          </AspectRatio>
        </div>
        <div className="px-4 pt-4">
          <div className="flex min-h-24 gap-4">
            <div className="">
              <Avatar className="size-14 border-2 border-purple-600 outline outline-purple-950 sm:size-20">
                <EnsAvatar ensName={channel} />
              </Avatar>
              <div className="mx-auto hidden h-6 w-12 -translate-y-3 rounded border border-black bg-red-600 p-0 text-center sm:block">
                <span className="pb-2 text-sm font-medium">LIVE</span>
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-0 sm:gap-2">
              <strong className="flex gap-3 text-xl font-semibold">
                {channel}
                <VerifiedIcon className="my-1" width={15} fill="#a970ff" />
              </strong>
              <span className="hidden text-sm font-medium sm:block">
                AO VIVO E COM IMAGENS: ESPANHA X INGLATERRA | UEFA EURO 2024 |
                FINAL
              </span>
              <div className="flex gap-3">
                <span>
                  <span className="inline sm:hidden">Playing </span>
                  <a
                    href="/category/sports"
                    className="font-medium text-purple-300"
                  >
                    Sports
                  </a>
                </span>
                <Badge
                  className={badgeVariants({
                    variant: 'secondary',
                    className:
                      'font-semibold text-zinc-500 bg-purple-800 hidden sm:block',
                  })}
                >
                  Português
                </Badge>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-end">
                <Button
                  size="sm"
                  className="bg-purple-600 font-semibold text-white"
                >
                  <div className="flex gap-2">
                    <HeartIcon size={16} />
                    Follow
                  </div>
                </Button>
              </div>
              <div className="flex flex-col gap-2 2xl:flex-row">
                <div className="hidden gap-2 sm:flex">
                  <div className="my-auto flex text-sm text-red-400">
                    <UserIcon height={18} />
                    <span>45,516</span>
                  </div>
                  <span className="my-auto text-xs">8:34:11</span>
                </div>
                <div className="flex gap-2 self-end">
                  <UploadIcon className="my-auto" />
                  <EllipsisVerticalIcon className="my-auto" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mx-5 my-10 hidden sm:block">
          <strong className="flex gap-3 text-base font-semibold">
            About {channel}
            <VerifiedIcon className="my-1" width={15} fill="#a970ff" />
          </strong>
          <div className="flex flex-col gap-3 bg-zinc-900 p-4">
            <div className="flex flex-col gap-2">
              <span className="text-sm font-light">
                <strong className="text-base font-semibold">626K</strong>{' '}
                followers
              </span>
              <span className="text-sm">{channel} streams Sports.</span>
            </div>
            <div className="mb-3 h-0 border border-zinc-800" />
            <div className="flex gap-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <div className="flex font-bold text-zinc-400" key={i}>
                  <YoutubeIcon fill="#999999" stroke="black" />
                  <span className="my-auto text-sm">Youtube</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <aside className="block flex-1 border-t border-zinc-700 bg-zinc-900 sm:hidden">
          Chat (Mobile)
        </aside>
      </main>
      {/* <aside className="right-0 top-64 hidden h-full  min-w-96 self-start border-l border-zinc-700 bg-zinc-900 lg:flex lg:flex-col"> */}
      <aside className="sticky top-12 hidden h-[calc(100vh-3.5rem)] min-w-96 self-start border-l border-zinc-700 bg-zinc-900 lg:block ">
        Chat
      </aside>
    </div>
  )
}
