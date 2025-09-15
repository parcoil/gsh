import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";
import { useNavigate } from "react-router";
import type { Site } from "../types/types";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

function Home() {
  const [sites, setSites] = useState<Site[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useNavigate();

  useEffect(() => {
    async function getSites() {
      const { data: sites, error } = await supabase
        .from("sites")
        .select(
          "id, created_at, site_name, site_url, site_image, site_description"
        )
        .eq("approved", true);

      if (error) console.error(error);
      if (sites) setSites(sites as Site[]);
      setLoading(false);
    }

    getSites();
  }, []);

  const filteredSites = sites.filter((site) =>
    site.site_name.toLowerCase().includes(search.toLowerCase())
  );

  const skeletonArray = Array.from({ length: 6 });

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col items-center space-y-4">
        <img src="/logo512.png" alt="" width={100} height={100} className="h-24 w-24" />
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">Game Sites Hub (Beta)</h1>
      </div>

      <div className="flex justify-center">
        <Input
          type="text"
          placeholder="Search for a game site"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
      </div>

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {skeletonArray.map((_, idx) => (
            <Card key={idx}>
              <CardHeader>
                <Skeleton className="h-40 w-full rounded-lg mb-4" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-6 w-3/4 rounded" />
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-4 w-5/6 rounded" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-8 w-full rounded" />
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {!loading && filteredSites.length === 0 && (
        <p className="text-center text-muted-foreground">No sites available.</p>
      )}

      {!loading && filteredSites.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSites.map((site) => (
            <Card key={site.id} className="hover:scale-105 transition duration-300 h-full">
              <CardHeader>
                <img
                  src={`https://corsproxy.io/?url=${site.site_image}`}
                  alt={site.site_name}
                  className="min-w-15 max-h-17 rounded-lg mb-4"
                />
              </CardHeader>
              <CardContent className="space-y-2">
                <h3 className="font-semibold text-xl">{site.site_name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {site.site_description}
                </p>
                <p className="text-xs text-muted-foreground">
                  Added: {new Date(site.created_at).toLocaleDateString()}
                </p>
              </CardContent>
              <CardFooter className="mt-auto">
                <Button 
                  className="w-full" 
                  onClick={() => router(`/site/${site.id}`)}
                  asChild
                >
                  <a href={`/site/${site.id}`}>View</a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
