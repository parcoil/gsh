"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
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
import { ModeToggle } from "@/components/mode-toggle";
import {
  ExternalLinkIcon,
  Globe,
  Paperclip,
  Plus,
  ScrollText,
  User,
  ShieldCheck,
} from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface NavbarClientProps {
  user: SupabaseUser | null;
  isAdmin: boolean;
  userPfp: string;
}

export function NavbarClient({ user, isAdmin, userPfp }: NavbarClientProps) {
  const router = useRouter();
  const supabase = createClient();

  async function signInWithGoogle() {
    const redirectUrl = `${window.location.origin}/auth/callback`;
    
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectUrl,
      },
    });
  }

  async function signOut() {
    await supabase.auth.signOut();
    router.refresh();
  }

  return (
    <nav className="border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <img src="/logo512.png" alt="Logo" width={40} />
              <span className="text-xl font-bold ml-5">GSH (Beta)</span>
            </Link>
          </div>

          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList className="flex items-center space-x-4">
              <NavigationMenuItem>
                <Link href="/">
                  <NavigationMenuLink className="text-sm">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Sites
                    </div>
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/submit">
                  <NavigationMenuLink className="text-sm">
                    <div className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Submit a Site
                    </div>
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/request">
                  <NavigationMenuLink className="text-sm">
                    <div className="flex items-center gap-2">
                      <Paperclip className="h-4 w-4" />
                      Request a Site
                    </div>
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/changelog">
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
                        <Link href="/mysites">
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            My Sites
                          </div>
                        </Link>
                      </DropdownMenuItem>
                      {isAdmin && (
                        <DropdownMenuItem asChild>
                          <Link href="/admin">
                            <div className="flex items-center gap-2">
                              <ShieldCheck className="h-4 w-4" />
                              Admin Panel
                            </div>
                          </Link>
                        </DropdownMenuItem>
                      )}
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
              <NavigationMenuItem>
                <ModeToggle />
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </nav>
  );
}
