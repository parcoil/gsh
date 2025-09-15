import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { User, Site } from "@/types/types";
import { toast } from "sonner";
import { useNavigate } from "react-router";

export default function MySites() {
  const [user, setUser] = useState<User | null>(null);
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSite, setEditingSite] = useState<Site | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [urlError, setUrlError] = useState("");
  const router = useNavigate();

  useEffect(() => {
    async function fetchUserAndSites() {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data?.user) {
        console.error("Error fetching user:", error);
        setLoading(false);
        return;
      }

      const userData: User = {
        id: data.user.id,
        email: data.user.email || "",
        username: data.user.user_metadata?.username || "",
      };

      setUser(userData);

      const { data: sitesData, error: sitesError } = await supabase
        .from("sites")
        .select(
          "id, created_at, site_name, site_url, site_image, site_description, approved"
        )
        .eq("user_id", userData.id)
        .order("created_at", { ascending: false });

      if (sitesError) console.error("Error fetching sites:", sitesError);

      if (sitesData) {
        setSites(
          sitesData.map((s) => ({
            ...s,
            approved: !!s.approved,
          }))
        );
      }

      setLoading(false);
    }

    fetchUserAndSites();
  }, []);

  const validateUrls = (urls: string) => {
    const lines = urls.split("\n").map((line) => line.trim()).filter(Boolean);
    for (const line of lines) {
      try {
        new URL(line);
      } catch {
        return false;
      }
    }
    return true;
  };

  const handleSave = async () => {
    if (!editingSite) return;

    if (!validateUrls(editingSite.site_url)) {
      setUrlError(
        "One or more URLs are invalid. Make sure each URL is on its own line and valid."
      );
      return;
    }

    setEditLoading(true);
    toast.loading("Updating site...");

    const { error } = await supabase
      .from("sites")
      .update({
        site_name: editingSite.site_name,
        site_url: editingSite.site_url,
        site_image: editingSite.site_image,
        site_description: editingSite.site_description,
      })
      .eq("id", editingSite.id);

    if (error) {
      console.error("Error updating site:", error);
      toast.dismiss();
      toast.error("Failed to update site.");
    } else {
      setSites((prev) =>
        prev.map((s) => (s.id === editingSite.id ? editingSite : s))
      );
      setEditingSite(null);
      setUrlError("");
       toast.dismiss();
      toast.success("Site updated successfully!");
    }

    setEditLoading(false);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10 space-y-6">
        <Skeleton className="h-10 w-1/3 rounded" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <Card key={idx} className="animate-pulse">
              <CardHeader>
                <Skeleton className="h-40 w-full rounded-lg mb-4" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-6 w-3/4 rounded" />
                <Skeleton className="h-4 w-full rounded" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-8 w-full rounded" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!user) {
    router("/login");
    return null;
  }

  return (
    <div className="container mx-auto py-10 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-muted-foreground">Email: {user.email}</p>
      </div>

      <h2 className="text-2xl font-semibold mt-6">My Sites</h2>
      {sites.length === 0 ? (
        <p className="text-muted-foreground">
          You haven't added any sites yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sites.map((site) => (
            <Card
              key={site.id}
              className="hover:scale-105 transition duration-300"
            >
              <CardHeader>
                <img
                  src={`https://corsproxy.io/?url=${site.site_image}`}
                  alt={site.site_name}
                  className="rounded-lg h-20 mb-4"
                />
              </CardHeader>
              <CardContent className="space-y-2">
                <h3 className="font-semibold text-xl">{site.site_name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {site.site_description}
                </p>
                <p className="text-xs font-medium">
                  Status:{" "}
                  {site.approved ? (
                    <span className="text-green-500">Approved</span>
                  ) : (
                    <span className="text-yellow-400">Pending Approval</span>
                  )}
                </p>
                <p className="text-xs text-muted-foreground">
                  Added: {new Date(site.created_at).toLocaleDateString()}
                </p>
              </CardContent>
              <CardFooter className="flex flex-col space-y-2">
                <Button
                  onClick={() => site.approved && setEditingSite(site)}
                  className="w-full"
                  disabled={!site.approved}
                >
                  {site.approved ? "Edit" : "Pending"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Dialog
        open={!!editingSite}
        onOpenChange={() => {
          setEditingSite(null);
          setUrlError("");
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Site</DialogTitle>
          </DialogHeader>
          {editingSite && (
            <div className="space-y-4">
              <Input
                value={editingSite.site_name}
                onChange={(e) =>
                  setEditingSite({ ...editingSite, site_name: e.target.value })
                }
                placeholder="Site Name"
              />
              <Textarea
                value={editingSite.site_url}
                onChange={(e) =>
                  setEditingSite({ ...editingSite, site_url: e.target.value })
                }
                placeholder="Enter one URL per line"
                rows={4}
              />
              {urlError && <p className="text-red-500 text-sm">{urlError}</p>}
              <Input
                value={editingSite.site_image}
                onChange={(e) =>
                  setEditingSite({ ...editingSite, site_image: e.target.value })
                }
                placeholder="Image URL"
              />
              <Input
                value={editingSite.site_description}
                onChange={(e) =>
                  setEditingSite({
                    ...editingSite,
                    site_description: e.target.value,
                  })
                }
                placeholder="Description"
              />
            </div>
          )}
          <DialogFooter className="space-x-2 mt-4">
            <Button onClick={handleSave} disabled={editLoading}>
              {editLoading ? "Saving..." : "Save"}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setEditingSite(null);
                setUrlError("");
              }}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
