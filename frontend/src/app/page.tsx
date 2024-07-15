'use client'

import { AvatarIcon } from '@radix-ui/react-icons'
import ReactHlsPlayer from 'react-hls-player'
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
import { Badge, badgeVariants } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'

export default function Home() {
  return (
    <div className="flex h-[calc(200vh)] flex-col ">
      <header className="sticky top-0 z-10 flex h-14 w-full justify-between bg-zinc-900 py-1 shadow-md shadow-zinc-950">
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
            <Input placeholder="Search" className="bg-zinc-800" />
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
        <aside
          id="channel-navigation"
          // On self-start: https://stackoverflow.com/questions/44446671/my-position-sticky-element-isnt-sticky-when-using-flexbox
          className="sticky top-14  h-[calc(100vh-3.5rem)] self-start border-r border-zinc-800 bg-zinc-900 p-1 xl:w-60"
        >
          {/* <div className="absolute left-0 top-0 -z-10 h-screen w-full border-r border-zinc-800 bg-zinc-900"></div> */}
          <nav className="flex flex-col gap-1">
            <VideoIcon className="ml-2 block xl:hidden" />
            <span className="hidden p-1 text-sm font-semibold text-zinc-100 xl:block">
              RECOMENDED CHANNELS
            </span>
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="flex justify-between gap-2">
                <div className="my-auto flex gap-1 self-start xl:grow">
                  <AvatarIcon width={35} height={35} />
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
              <ReactHlsPlayer
                src="https://leaptv.ddns.net/live/gary/index.m3u8"
                autoPlay={true}
                hlsConfig={{
                  maxLoadingDelay: 4,
                  minAutoBitrate: 0,
                  lowLatencyMode: true,
                }}
              />
            </AspectRatio>
          </div>
          <div className="px-4 pt-4">
            <div className="flex min-h-24 gap-4">
              <div className="my-auto ">
                <Avatar className="size-20 border-2 border-purple-600 outline outline-purple-950">
                  <AvatarImage src="https://static-cdn.jtvnw.net/jtv_user_pictures/5b424627-5db4-44fb-b6af-a88de4aaa5e4-profile_image-70x70.png" />
                </Avatar>
                <div className="mx-auto h-6 w-12 -translate-y-3 rounded border border-black bg-red-600 p-0 text-center">
                  <span className="pb-2 text-sm font-medium">LIVE</span>
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <strong className="flex gap-3 text-xl font-semibold">
                  CazeTV_
                  <VerifiedIcon className="my-1" width={15} fill="#a970ff" />
                </strong>
                <span className="text-sm font-medium">
                  AO VIVO E COM IMAGENS: ESPANHA X INGLATERRA | UEFA EURO 2024 |
                  FINAL
                </span>
                <div className="flex gap-3">
                  <a
                    href="/category/sports"
                    className="font-medium text-purple-300"
                  >
                    Sports
                  </a>
                  <Badge
                    className={badgeVariants({
                      variant: 'secondary',
                      className: 'font-semibold text-zinc-500 bg-purple-800',
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
                  <div className="flex gap-2">
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
        {/* <aside className="right-0 top-64 hidden h-full  min-w-96 self-start border-l border-zinc-700 bg-zinc-900 lg:flex lg:flex-col"> */}
        <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] min-w-96 self-start border-l border-zinc-700 bg-zinc-900 lg:block ">
          Chat
        </aside>
      </div>
    </div>
  )
}
