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
  EllipsisVerticalIcon,
  SearchIcon,
  TvMinimalPlay,
  UserIcon,
} from 'lucide-react'
import { Avatar, AvatarFallback } from '~/components/ui/avatar'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'

export default async function Home() {
  return (
    <div className="flex h-screen flex-col">
      <header className="flex h-14 w-full justify-between bg-zinc-800 ">
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
      <div className="flex-1">
        <aside>Channel Navigation</aside>
        <main className="">
          <span>Live Player</span>
        </main>
        <aside>Comments</aside>
        <aside>Description</aside>
      </div>
      <footer className="h-10">
        <p>Footer</p>
      </footer>
    </div>
  )
}
