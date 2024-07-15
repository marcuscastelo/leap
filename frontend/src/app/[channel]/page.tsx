import { AvatarIcon } from '@radix-ui/react-icons'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@radix-ui/react-navigation-menu'
import {
  CircleIcon,
  CopyIcon,
  EllipsisVerticalIcon,
  HeartIcon,
  SearchIcon,
  TvMinimalPlay,
  UploadIcon,
  UserIcon,
  VerifiedIcon,
  VideoIcon,
  YoutubeIcon,
} from 'lucide-react'
import { AspectRatio } from '~/components/ui/aspect-ratio'
import { Avatar, AvatarFallback } from '~/components/ui/avatar'
import { Badge, badgeVariants } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { EnsAvatar } from '~/components/web3/EnsAvatar'
import { DebugWebRTCPlayer } from '~/components/livestream/DebugWebRTCPlayer'

export default async function ChannelPage({
  params: { channel },
}: {
  params: { channel: string }
}) {
  return (
    <div className="flex h-[calc(100vh)] flex-col ">
      <header className="sticky top-0 z-10 flex h-14 w-full justify-between bg-zinc-900 py-1 shadow-md shadow-zinc-950">
        <nav className="flex gap-4 px-4 align-middle sm:gap-x-10 ">
          <div className="my-auto ">
            <TvMinimalPlay height={40} />
          </div>
          <div className="my-auto">
            <div className="hidden sm:block">
              <a href="/browse">Browse</a>
            </div>
            <div className="block sm:hidden">
              <a href="/browse">
                <CopyIcon />
              </a>
            </div>
          </div>
          <div className="my-auto">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem className="h-6">
                  <NavigationMenuTrigger className="">
                    <EllipsisVerticalIcon />
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <NavigationMenuLink>Link</NavigationMenuLink>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </nav>
        <nav id="search-bar" className="my-auto hidden w-1/2 sm:block">
          <div className="flex ">
            <Input placeholder="Search" className="bg-zinc-800" />
            <div className="flex w-0 -translate-x-10 flex-col overflow-visible">
              <div className="flex-1"></div>
              <SearchIcon className="my-auto block " />
              <div className="flex-1"></div>
            </div>
          </div>
        </nav>
        <nav className="my-auto flex gap-3 px-4">
          <div className="hidden sm:visible">
            <Button className="bg-zinc-700 text-white">Login</Button>
            <Button className="bg-purple-700 text-white">Sign Up</Button>
          </div>
          <div className="my-auto block sm:hidden">
            <SearchIcon className="my-auto block " />
          </div>
          <Avatar className="my-auto">
            <AvatarFallback>
              <UserIcon />
            </AvatarFallback>
          </Avatar>
        </nav>
      </header>
      <div className="flex flex-1">
        <aside
          id="channel-navigation"
          // On self-start: https://stackoverflow.com/questions/44446671/my-position-sticky-element-isnt-sticky-when-using-flexbox
          className="sticky top-10 hidden h-[calc(100vh-3.5rem)] self-start border-r border-zinc-800 bg-zinc-900 p-3 sm:block xl:w-60"
        >
          {/* <div className="absolute left-0 top-0 -z-10 h-screen w-full border-r border-zinc-800 bg-zinc-900"></div> */}
          <nav className="flex flex-col gap-1">
            <VideoIcon className="block w-full xl:hidden" />
            <span className="hidden p-1 text-sm font-semibold text-zinc-100 xl:block">
              RECOMENDED CHANNELS
            </span>
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="flex justify-between gap-2">
                <div className="my-auto flex gap-1 self-start xl:grow">
                  <AvatarIcon
                    className="block shrink "
                    width={30}
                    height={30}
                  />
                  <div className="my-auto hidden text-sm xl:block">
                    <span className="block">Channel {i}</span>
                    <span className="block text-xs font-light text-zinc-400">
                      IRL
                    </span>
                  </div>
                </div>
                <div className="my-auto hidden justify-between gap-1 self-end xl:flex ">
                  <CircleIcon
                    fill="red"
                    stroke="red"
                    size={8}
                    className="my-auto"
                  />
                  <span className="my-auto">
                    {(Math.random() * 100).toFixed(1)}K
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
        <aside className="sticky top-10 hidden h-[calc(100vh-3.5rem)] min-w-96 self-start border-l border-zinc-700 bg-zinc-900 lg:block ">
          Chat
        </aside>
      </div>
    </div>
  )
}
