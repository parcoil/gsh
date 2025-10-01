import { createClient } from "@/utils/supabase/server";
import HomeClient from "@/components/views/HomeClient";
import type { Site } from "@/types/types";

export default async function Home() {
  const supabase = await createClient();

  const { data: sites, error } = await supabase
    .from("sites")
    .select(
      "id, created_at, site_name, site_url, site_image, site_description, votes"
    )
    .eq("approved", true)
    .order("votes", { ascending: false, nullsFirst: false });

  if (error) {
    console.error("Error fetching sites:", error);
  }

  return <HomeClient initialSites={(sites as Site[]) || []} />;
}
