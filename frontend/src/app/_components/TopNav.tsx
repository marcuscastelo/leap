import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@radix-ui/react-navigation-menu'
import {
  CopyIcon,
  EllipsisVerticalIcon,
  SearchIcon,
  TvMinimalPlay,
} from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'

export async function TopNav() {
  return (
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
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
        {/* <Avatar className="my-auto">
          <AvatarFallback>
            <UserIcon />
          </AvatarFallback>
        </Avatar> */}
      </nav>
    </header>
  )
}
