import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { supabase } from "../utils/supabase";
import type { Site } from "../types/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowUpIcon, ExternalLink } from "lucide-react";
import { toast } from "sonner";

export default function SitePage() {
  const { id } = useParams<{ id: string }>();
  const [site, setSite] = useState<Site | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasVoted, setHasVoted] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const router = useNavigate();

  useEffect(() => {
    if (!id) return;

    const votedSites = JSON.parse(localStorage.getItem("votedSites") || "[]");
    setHasVoted(votedSites.includes(Number(id)));
  }, [id]);

  const handleVote = async () => {
    if (!site || hasVoted || !id) return;

    setIsVoting(true);

    try {
      const { data: siteData, error: fetchError } = await supabase
        .from("sites")
        .select("votes")
        .eq("id", Number(id))
        .single();

      if (fetchError) throw fetchError;

      const currentVotes = siteData?.votes || 0;
      const newVotes = currentVotes + 1;

      const { error: updateError } = await supabase
        .from("sites")
        .update({ votes: newVotes })
        .eq("id", Number(id));

      if (updateError) throw updateError;

      setSite({ ...site, votes: newVotes });

      const votedSites = JSON.parse(localStorage.getItem("votedSites") || "[]");
      const newVotedSites = [...votedSites, Number(id)];
      localStorage.setItem("votedSites", JSON.stringify(newVotedSites));

      setHasVoted(true);
      toast.success("Thanks for your vote!");
    } catch (error) {
      console.error("Error voting:", error);
      toast.error("Failed to submit vote. Please try again.");
    } finally {
      setIsVoting(false);
    }
  };

  useEffect(() => {
    async function getSite() {
      const { data, error } = await supabase
        .from("sites")
        .select(
          "id, created_at, site_name, site_url, site_image, site_description, votes, discord_url"
        )
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
    ? site.site_url
        .split("\n")
        .map((url) => url.trim())
        .filter(Boolean)
    : [];

  return (
    <>
      <div className="flex justify-center py-10 px-4">
        <div className="max-w-xl w-full space-y-4">
          <Button
            onClick={() => router(-1)}
            variant="ghost"
            className="flex items-center gap-2 hover:gap-3 transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to All Sites
          </Button>
          <Card className="w-full space-y-6">
            <CardHeader className="mb-0">
              <img
                src={
                  site.site_image
                    ? `https://corsproxy.io/?url=${site.site_image}`
                    : "/logo512.png"
                }
                alt={site.site_name}
                className="rounded-xl mb-6 max-h-40 max-w-full border-2"
                loading="lazy"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (target.src !== window.location.origin + "/logo512.png") {
                    target.src = "/logo512.png";
                    target.alt = "Placeholder Image";
                  }
                }}
              />
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold scroll-m-20">
                  {site.site_name}
                </h1>
                <div
                  className={
                    "flex items-center space-x-2" +
                    (hasVoted ? "cursor-not-allowed" : "cursor-pointer")
                  }
                >
                  <Button
                    onClick={handleVote}
                    disabled={hasVoted || isVoting}
                    aria-label="Vote for this site"
                  >
                    <ArrowUpIcon
                      className={`h-5 w-5 ${hasVoted ? "fill-current" : ""}`}
                    />
                    <span>{site.votes || 0}</span>
                    {hasVoted && "Voted"}
                    {!hasVoted && "Upvote"}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{site.site_description}</p>
              <img
                src={`https://api.microlink.io/?url=${encodeURIComponent(
                  siteLinks[0]
                )}&screenshot=true&embed=screenshot.url&ttl=1d`}
                alt=""
                className="rounded-xl border-2 max-w-full mb-0"
              />
              <p className="text-xs text-muted-foreground/60 text-center mt-1">
                Images update every day (Uses First Link Provided)
              </p>
              {site.discord_url && (
                <a
                  href={site.discord_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 underline"
                >
                  <Button>
                    <ExternalLink /> Join Discord Server
                  </Button>
                </a>
              )}

              {siteLinks.length > 0 && (
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold mt-4">Site Links:</h2>
                  <ul className="space-y-1">
                    {siteLinks.map((url, i) => (
                      <li key={i}>
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-destructive hover:text-destructive/80 hover:underline"
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
      </div>
    </>
  );
}
