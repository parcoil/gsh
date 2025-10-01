"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Site } from "@/types/types";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpIcon, Crown } from "lucide-react";

interface HomeClientProps {
  initialSites: Site[];
}

export default function HomeClient({ initialSites }: HomeClientProps) {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const filteredSites = initialSites.filter((site) =>
    site.site_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col items-center space-y-4">
        <img
          src="/logo512.png"
          alt=""
          width={100}
          height={100}
          className="h-24 w-24"
        />
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">
          Game Sites Hub
        </h1>
        <p className="text-muted-foreground">
          Find the best unblocked game sites on the internet!
        </p>
        <p className="text-muted-foreground text-sm mb-1">
          Upvote sites you like and help others find the best sites!
        </p>
        <p className="text-muted-foreground text-xs m-0 font-bold">
          Sites are ranked by votes
        </p>
      </div>

      <div className="flex justify-center">
        <Input
          type="text"
          placeholder="Search for game sites"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
      </div>

      {filteredSites.length === 0 && (
        <p className="text-center text-muted-foreground">No sites available.</p>
      )}

      {filteredSites.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSites.map((site, index) => (
            <Card
              key={site.id}
              className={`hover:scale-105 transition duration-300 ${
                index === 0
                  ? "border-2 border-amber-400"
                  : index === 1
                  ? "border-2 border-slate-400"
                  : index === 2
                  ? "border-2 border-amber-700"
                  : ""
              }`}
            >
              <CardHeader>
                <img
                  src={
                    site.site_image
                      ? `https://corsproxy.io/?url=${site.site_image}`
                      : "/logo512.png"
                  }
                  alt={site.site_name}
                  title={site.site_name}
                  className="min-w-15 max-h-17 rounded-lg"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (
                      target.src !==
                      window.location.origin + "/logo512.png"
                    ) {
                      target.src = "/logo512.png";
                      target.alt = "Placeholder Image";
                    }
                  }}
                />
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-xl flex items-center gap-2">
                    {site.site_name}
                    {index === 0 && (
                      <Crown className="h-5 w-5 text-amber-400 fill-amber-400" />
                    )}
                    {index === 1 && (
                      <Crown className="h-5 w-5 text-slate-400" />
                    )}
                    {index === 2 && (
                      <Crown className="h-5 w-5 text-amber-700" />
                    )}
                  </h3>
                  <div className="flex items-center space-x-1 text-muted-foreground">
                    <ArrowUpIcon className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {site.votes || 0}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {site.site_description}
                </p>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-muted-foreground">
                    Added: {new Date(site.created_at).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
              <CardFooter className="mt-auto">
                <Button className="w-full" asChild>
                  <Link href={`/site/${site.id}`}>View</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      <p className="text-center text-muted-foreground text-sm">
        Be sure to spread this site to other Site Owners!
      </p>
    </div>
  );
}
