import { useState, useEffect } from "react";
import { supabase } from "./supabase";
import type { User } from "@/types/types";

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function checkAdmin() {
      try {
        const { data, error } = await supabase.auth.getUser();

        if (error || !data?.user) {
          setIsAdmin(false);
          setUser(null);
          setLoading(false);
          return;
        }

        setUser({
          id: data.user.id,
          email: data.user.email ?? "",
          user_metadata: data.user.user_metadata,
        });

        const adminStatus = data.user.user_metadata?.admin === true;
        setIsAdmin(adminStatus);
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    }

    checkAdmin();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      checkAdmin();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { isAdmin, loading, user };
}
