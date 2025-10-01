import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";
import { useNavigate } from "react-router";
import { useAdmin } from "@/utils/useAdmin";
import type { Site } from "@/types/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { CheckCircle, XCircle, Trash2, Edit, ShieldCheck } from "lucide-react";

// for all of the skids looking at this no. you cant use the admin page to access the database.

export default function Admin() {
  const { isAdmin, loading: adminLoading } = useAdmin();
  const router = useNavigate();
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSites: 0,
    approvedSites: 0,
    pendingSites: 0,
    totalUsers: 0,
  });
  const [editingSite, setEditingSite] = useState<Site | null>(null);
  const [filter, setFilter] = useState<"all" | "approved" | "pending">("all");

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      router("/");
      return;
    }

    if (isAdmin) {
      loadSites();
      loadStats();
    }
  }, [isAdmin, adminLoading, router]);

  const loadStats = async () => {
    try {
      const { count: totalSites } = await supabase
        .from("sites")
        .select("*", { count: "exact", head: true });

      const { count: approvedSites } = await supabase
        .from("sites")
        .select("*", { count: "exact", head: true })
        .eq("approved", true);

      const { count: pendingSites } = await supabase
        .from("sites")
        .select("*", { count: "exact", head: true })
        .eq("approved", false);

      setStats({
        totalSites: totalSites || 0,
        approvedSites: approvedSites || 0,
        pendingSites: pendingSites || 0,
        totalUsers: 0,
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const loadSites = async () => {
    try {
      setLoading(true);
      const { data: sitesData, error } = await supabase
        .from("sites")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading sites:", error);
        toast.error("Failed to load sites");
        return;
      }

      if (sitesData) {
        setSites(sitesData as Site[]);
      }
    } catch (error) {
      console.error("Error loading sites:", error);
      toast.error("Failed to load sites");
    } finally {
      setLoading(false);
    }
  };

  const approveSite = async (siteId: number) => {
    toast.loading("Approving site...");
    const { error } = await supabase
      .from("sites")
      .update({ approved: true })
      .eq("id", siteId);

    if (error) {
      console.error("Error approving site:", error);
      toast.dismiss();
      toast.error("Failed to approve site");
    } else {
      toast.dismiss();
      toast.success("Site approved!");
      loadSites();
      loadStats();
    }
  };

  const rejectSite = async (siteId: number) => {
    toast.loading("Rejecting site...");
    const { error } = await supabase
      .from("sites")
      .update({ approved: false })
      .eq("id", siteId);

    if (error) {
      console.error("Error rejecting site:", error);
      toast.dismiss();
      toast.error("Failed to reject site");
    } else {
      toast.dismiss();
      toast.success("Site rejected");
      loadSites();
      loadStats();
    }
  };

  const deleteSite = async (siteId: number) => {
    if (
      !confirm(
        "Are you sure you want to delete this site? This action cannot be undone."
      )
    ) {
      return;
    }

    toast.loading("Deleting site...");
    const { error } = await supabase.from("sites").delete().eq("id", siteId);

    if (error) {
      console.error("Error deleting site:", error);
      toast.dismiss();
      toast.error("Failed to delete site");
    } else {
      toast.dismiss();
      toast.success("Site deleted");
      loadSites();
      loadStats();
    }
  };

  const updateSite = async () => {
    if (!editingSite) return;

    toast.loading("Updating site...");
    const { error } = await supabase
      .from("sites")
      .update({
        site_name: editingSite.site_name,
        site_url: editingSite.site_url,
        site_image: editingSite.site_image,
        site_description: editingSite.site_description,
        discord_url: editingSite.discord_url,
      })
      .eq("id", editingSite.id);

    if (error) {
      console.error("Error updating site:", error);
      toast.dismiss();
      toast.error("Failed to update site");
    } else {
      toast.dismiss();
      toast.success("Site updated!");
      setEditingSite(null);
      loadSites();
    }
  };

  const filteredSites = sites.filter((site) => {
    if (filter === "all") return true;
    if (filter === "approved") return site.approved === true;
    if (filter === "pending") return site.approved === false;
    return true;
  });

  if (adminLoading || loading) {
    return (
      <div className="container mx-auto py-10 space-y-6">
        <Skeleton className="h-12 w-1/3 rounded" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <Skeleton key={idx} className="h-32 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-96 rounded-lg" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="container mx-auto py-10 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold flex items-center gap-3">
            <ShieldCheck className="h-8 w-8 text-primary" />
            Admin Panel
          </h1>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          onClick={() => setFilter("all")}
        >
          All Sites ({stats.totalSites})
        </Button>
        <Button
          variant={filter === "approved" ? "default" : "outline"}
          onClick={() => setFilter("approved")}
        >
          Approved ({stats.approvedSites})
        </Button>
        <Button
          variant={filter === "pending" ? "default" : "outline"}
          onClick={() => setFilter("pending")}
        >
          Pending ({stats.pendingSites})
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSites.map((site) => (
          <Card key={site.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <img
                  src={`https://corsproxy.io/?url=${site.site_image}`}
                  alt={site.site_name}
                  className="rounded-lg h-16 w-16 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/logo512.png";
                  }}
                />
                <div
                  className={`px-2 py-1 rounded-sm text-xs font-medium ${
                    site.approved
                      ? "bg-green-500/10 text-green-500"
                      : "bg-yellow-500/10 text-yellow-500"
                  }`}
                >
                  {site.approved ? "Approved" : "Pending"}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <h3 className="font-semibold text-lg">{site.site_name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {site.site_description}
              </p>
              <p className="text-xs text-muted-foreground">
                Votes: {site.votes || 0}
              </p>
              <p className="text-xs text-muted-foreground">
                Added: {new Date(site.created_at).toLocaleDateString()}
              </p>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <div className="flex gap-2 w-full">
                {!site.approved && (
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => approveSite(site.id)}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                )}
                {site.approved && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => rejectSite(site.id)}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Unapprove
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditingSite(site)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteSite(site.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredSites.length === 0 && (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">
              No sites found matching the current filter.
            </p>
          </CardContent>
        </Card>
      )}

      <Dialog open={!!editingSite} onOpenChange={() => setEditingSite(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Site</DialogTitle>
          </DialogHeader>
          {editingSite && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Site Name</label>
                <Input
                  value={editingSite.site_name}
                  onChange={(e) =>
                    setEditingSite({
                      ...editingSite,
                      site_name: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium">Site URL(s)</label>
                <Textarea
                  value={editingSite.site_url}
                  onChange={(e) =>
                    setEditingSite({ ...editingSite, site_url: e.target.value })
                  }
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Image URL</label>
                <Input
                  value={editingSite.site_image}
                  onChange={(e) =>
                    setEditingSite({
                      ...editingSite,
                      site_image: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={editingSite.site_description}
                  onChange={(e) =>
                    setEditingSite({
                      ...editingSite,
                      site_description: e.target.value,
                    })
                  }
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm font-medium">
                  Discord URL (optional)
                </label>
                <Input
                  value={editingSite.discord_url || ""}
                  onChange={(e) =>
                    setEditingSite({
                      ...editingSite,
                      discord_url: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          )}
          <DialogFooter className="space-x-2 mt-4">
            <Button onClick={updateSite}>Save Changes</Button>
            <Button variant="outline" onClick={() => setEditingSite(null)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
