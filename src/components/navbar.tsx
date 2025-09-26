import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";
import { getUrl } from "../utils/getUrl";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router";
import { ModeToggle } from "@/components/mode-toggle";
import { ExternalLinkIcon, Globe, Paperclip, Plus, ScrollText, User } from "lucide-react";

const Navbar = () => {
  const url = getUrl();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: url,
      },
    });
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  const userPfp =
    user?.user_metadata?.avatar_url || "https://parcoil.com/parcoil.png";

  return (
    <nav className="border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img src="/logo512.png" alt="Logo" width={40} />
              <span className="text-xl font-bold ml-5">GSH (Beta)</span>
            </Link>
          </div>

          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList className="flex items-center space-x-4">
              <NavigationMenuItem>
                <Link to="/">
                  <NavigationMenuLink className="text-sm">
                <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" /> 
                Sites
                </div>
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/submit">
                  <NavigationMenuLink className="text-sm">
                <div className="flex items-center gap-2">
                <Plus className="h-4 w-4" /> 
                Submit a Site
                </div>
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/request">
                  <NavigationMenuLink className="text-sm">
                <div className="flex items-center gap-2">
                <Paperclip className="h-4 w-4" /> 
                Request a Site
                </div>
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/changelog">
                  <NavigationMenuLink className="text-sm">
                <div className="flex items-center gap-2">
                <ScrollText className="h-4 w-4" /> 
                Changelog
                </div>
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              {user ? (
                <NavigationMenuItem>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Avatar className="cursor-pointer hover:ring-2 hover:ring-primary">
                        <AvatarImage src={userPfp} alt="Profile picture" />
                        <AvatarFallback>User</AvatarFallback>
                      </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link to="/mysites">
                        <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" /> 
                        My Sites
                        </div>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={signOut}>
                        <div className="flex items-center gap-2">
                        <ExternalLinkIcon className="h-4 w-4" /> 
                        Log Out
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </NavigationMenuItem>
              ) : (
                <NavigationMenuItem>
                  <Button onClick={signInWithGoogle} size="sm">
                <div className="flex items-center gap-2">
                <User className="h-4 w-4" /> 
                Log In
                </div>
                  </Button>
                </NavigationMenuItem>
              )}
              <NavigationMenuItem >
                <ModeToggle />
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
