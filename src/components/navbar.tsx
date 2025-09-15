import { useState, useEffect } from "react"
import { supabase } from "../utils/supabase"
import { getUrl } from "../utils/getUrl"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const Navbar = () => {
  const url = getUrl()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: url,
      }
    })
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  const userPfp =
    user?.user_metadata?.avatar_url || "https://parcoil.com/parcoil.png"

  return (
    <nav className="border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <img src="/logo512.png" alt="Logo" width={40} />
              <span className="text-xl font-bold ml-5">GSH (Beta)</span>
            </a>
          </div>
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList className="flex items-center space-x-4">
              <NavigationMenuItem>
                <NavigationMenuLink className="text-sm" href="/">
                  Sites
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink className="text-sm" href="/submit">
                  Submit a site
                </NavigationMenuLink>
              </NavigationMenuItem>
              {user ? (
                <NavigationMenuItem>
                  <Avatar onClick={signOut} className="cursor-pointer hover:ring-2 hover:ring-primary">
                    <AvatarImage src={userPfp} alt="Profile picture" />
                    <AvatarFallback>User</AvatarFallback>
                  </Avatar>
                </NavigationMenuItem>
              ) : (
                <NavigationMenuItem>
                  <Button onClick={signInWithGoogle} size="sm">
                    Log In
                  </Button>
                </NavigationMenuItem>
              )}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
