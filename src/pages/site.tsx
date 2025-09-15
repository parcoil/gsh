import { useState, useEffect } from "react";
import { useParams } from "react-router"; 
import { supabase } from "../utils/supabase";
import type { Site } from "../types/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function SitePage() {
  const { id } = useParams<{ id: string }>();
  const [site, setSite] = useState<Site | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getSite() {
      const { data, error } = await supabase
        .from("sites")
        .select("id, created_at, site_name, site_url, site_image, site_description, discord_url")
        .eq("id", Number(id))
        .single();

      if (error) {
        console.error("Error fetching site:", error);
      } else {
        setSite(data);
      }
      setLoading(false);
    }

    if (id) getSite();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-10 px-4">
        <Card className="max-w-xl w-full space-y-4 animate-pulse">
          <CardHeader>
            <Skeleton className="h-10 w-3/4 rounded" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-64 w-full rounded-xl" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-5/6 rounded" />
            <Skeleton className="h-6 w-1/4 rounded mt-2" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-5/6 rounded" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!site) {
    return (
      <div className="flex items-center justify-center h-screen text-muted-foreground">
        Site not found.
      </div>
    );
  }

  const siteLinks = site.site_url
    ? site.site_url.split("\n").map((url) => url.trim()).filter(Boolean)
    : [];

  return (
    <div className="flex justify-center py-10 px-4">
      <Card className="max-w-xl w-full space-y-6">
        <CardHeader>
          <h1 className="text-3xl font-bold scroll-m-20">{site.site_name}</h1>
        </CardHeader>
        <CardContent className="space-y-4">
          <img
            src={`https://corsproxy.io/?url=${site.site_image}`}
            alt={site.site_name}
            className="rounded-xl mb-6 max-h-64 max-w-full  bg-muted"
            loading="lazy"
          />
          <p className="text-muted-foreground">{site.site_description}</p>

          {site.discord_url && (
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Discord</h2>
              <a
                href={site.discord_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 underline"
              >
                Join Discord Server
              </a>
            </div>
          )}

          {siteLinks.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Site Links</h2>
              <ul className="space-y-1">
                {siteLinks.map((url, i) => (
                  <li key={i}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80 underline"
                    >
                      {url}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
