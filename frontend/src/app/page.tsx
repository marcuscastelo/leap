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
  CameraIcon,
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
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'

export default async function Home() {
  return (
    <div className="flex h-screen flex-col">
      <header className="flex h-14 w-full justify-between bg-zinc-800 py-1 ">
        <nav className="flex gap-x-10 px-4 align-middle ">
          <div className="my-auto ">
            <TvMinimalPlay height={40} />
          </div>
          <div className="my-auto">
            <a href="/browse">Browse</a>
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
        <nav id="search-bar" className="my-auto w-1/2">
          <div className="flex ">
            <Input placeholder="Search" className="bg-zinc-700" />
            <div className="flex w-0 -translate-x-10 flex-col overflow-visible">
              <div className="flex-1"></div>
              <SearchIcon className="my-auto block " />
              <div className="flex-1"></div>
            </div>
          </div>
        </nav>
        <nav className="my-auto flex gap-3 px-4">
          <Button className="bg-zinc-700 text-white">Login</Button>
          <Button className="bg-purple-700 text-white">Sign Up</Button>
          <Avatar className="my-auto">
            <AvatarFallback>
              <UserIcon />
            </AvatarFallback>
          </Avatar>
        </nav>
      </header>
      <div className="flex flex-1">
        <aside id="channel-navigation" className="min-w-8 bg-zinc-900 p-1">
          <nav className="flex flex-col gap-1">
            <VideoIcon className="ml-2" />
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="flex gap-2">
                <AvatarIcon width={'100%'} height={40} />
                {/* <span>Channel {i}</span> */}
              </div>
            ))}
          </nav>
        </aside>
        <main className="flex flex-1 flex-col">
          <div className="w-full bg-white">
            <AspectRatio ratio={16 / 9}>
              <span>Live Player</span>
            </AspectRatio>
          </div>
          <div className="px-4 pt-4">
            <div className="flex min-h-24 gap-4">
              <div className="my-auto">
                <Avatar className="size-20 border-2 border-purple-600 outline outline-purple-950">
                  <AvatarImage src="https://static-cdn.jtvnw.net/jtv_user_pictures/5b424627-5db4-44fb-b6af-a88de4aaa5e4-profile_image-70x70.png" />
                </Avatar>
              </div>
              <div className="flex flex-1 flex-col">
                <strong className="flex gap-3 text-xl font-semibold">
                  CazeTV_
                  <VerifiedIcon className="my-1" width={15} fill="#a970ff" />
                </strong>
                <span className="text-sm font-medium">
                  AO VIVO E COM IMAGENS: ESPANHA X INGLATERRA | UEFA EURO 2024 |
                  FINAL
                </span>
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
                <div className="flex gap-2">
                  <div className="my-auto flex text-sm text-red-400">
                    <UserIcon height={18} />
                    <span>45,516</span>
                  </div>
                  <span className="my-auto text-xs">8:34:11</span>
                  <UploadIcon className="my-auto" />
                  <EllipsisVerticalIcon className="my-auto" />
                </div>
              </div>
            </div>
          </div>
          <div className="mx-5 my-10">
            <strong className="flex gap-3 text-base font-semibold">
              About CazeTV_
              <VerifiedIcon className="my-1" width={15} fill="#a970ff" />
            </strong>
            <div className="flex flex-col gap-3 bg-zinc-900 p-4">
              <div className="flex flex-col gap-2">
                <span className="text-sm font-light">
                  <strong className="text-base font-semibold">626K</strong>{' '}
                  followers
                </span>
                <span className="text-sm">CazeTV_ streams Sports.</span>
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
        </main>
      </div>
    </div>
  )
}
