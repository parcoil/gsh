import { createClient } from "@/utils/supabase/server";
import { NavbarClient } from "./navbar-client";

export async function Navbar() {
  const supabase = await createClient();
  
  // Fetch user on the server
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Check if user is admin (assuming you have an admin check in your database)
  let isAdmin = false;
  if (user) {
    // You may need to adjust this query based on your database schema
    // Example: checking a user_roles table or a profile with admin flag
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single();
    
    isAdmin = profile?.is_admin ?? false;
  }

  const userPfp =
    user?.user_metadata?.avatar_url || "https://parcoil.com/parcoil.png";

  return (
    <NavbarClient 
      user={user} 
      isAdmin={isAdmin} 
      userPfp={userPfp} 
    />
  );
}
