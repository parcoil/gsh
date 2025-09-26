import { useEffect, useState } from "react";
import { formatDistanceToNow, parseISO } from "date-fns";
import { GitPullRequest } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface Release {
  id: number;
  tag_name: string;
  name: string;
  body: string;
  published_at: string;
  draft: boolean;
}

export default function Changelog() {
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const owner = "parcoil";
  const repo = "gsh";

  useEffect(() => {
    const fetchReleases = async () => {
      try {
        setLoading(true);
        const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/releases`);
        if (!res.ok) throw new Error("GitHub API error");
        const data = await res.json();
        setReleases(data.filter((r: Release) => !r.draft));
      } catch (err) {
        console.error(err);
        setError("Failed to load changelog.");
      } finally {
        setLoading(false);
      }
    };

    fetchReleases();
  }, [owner, repo]);

  return (
    <div className="container mx-auto py-8">
        <p className="text-center text-muted-foreground mb-2">older versions creation dates are inaccurate.</p>
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <GitPullRequest className="h-6 w-6" />
            Release Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-32" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : releases.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No releases found.
            </div>
          ) : (
            <div className="space-y-8">
              {releases.map((release) => (
                <div key={release.id}>
                  <h3 className="text-xl font-semibold">{release.name || release.tag_name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Released {formatDistanceToNow(parseISO(release.published_at), { addSuffix: true })}
                  </p>
                  <div
                    className="prose prose-sm dark:prose-invert mt-2 max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: release.body
                        .replace(/\r\n/g, "\n")
                        .replace(/^# (.*$)/gm, "<h3>$1</h3>")
                        .replace(/## (.*$)/gm, "<h4>$1</h4>")
                        .replace(/\n/g, "<br>")
                        .replace(/`([^`]+)`/g, "<code>$1</code>")
                        .replace(/\[(.*?)\]\((.*?)\)/g, "$1"),
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
