import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '~/components/ui/navigation-menu'

export default async function Home() {
  return (
    <div>
      <aside className="w-full bg-zinc-800 flex justify-between">
        <strong>LeapTV</strong>
        <NavigationMenu>
          {/* <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Item One</NavigationMenuTrigger>
              <NavigationMenuContent>
                <NavigationMenuLink>Link</NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem> */}
          {/* </NavigationMenuList> */}
        </NavigationMenu>
      </aside>
      <main>
        <h1>Home</h1>
      </main>
      <footer>
        <p>Footer</p>
      </footer>
    </div>
  )
}
