import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

function Submit() {
  const navigate = useNavigate();
  const [siteName, setSiteName] = useState("");
  const [siteUrl, setSiteUrl] = useState("");
  const [siteImage, setSiteImage] = useState("");
  const [siteDescription, setSiteDescription] = useState("");
  const [discordUrl, setDiscordUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [_, setUser] = useState<any>(null);

  useEffect(() => {
    async function checkUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/login");
      } else {
        setUser(user);
      }
    }

    checkUser();
  }, [navigate]);

  function isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const urls = siteUrl
      .split("\n")
      .map((u) => u.trim())
      .filter(Boolean);

    for (const url of urls) {
      if (!isValidUrl(url)) {
        setLoading(false);
        alert(`Invalid URL detected: ${url}`);
        return;
      }
    }

    const { error } = await supabase.from("sites").insert([
      {
        site_name: siteName,
        site_url: urls.join("\n"),
        site_image: siteImage,
        site_description: siteDescription,
        discord_url: discordUrl,
      },
    ]);

    setLoading(false);

    if (error) {
      alert(error.message);
    } else {
      alert("Site submitted successfully!");
      navigate("/");
    }
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Submit a Site</h1>
      <p className="text-center text-muted-foreground mb-6">this page is for site owners to submit their sites. if you are not a site owner please use the <Link to="/request" className="text-primary hover:text-primary/80 underline">request a site</Link></p>
      <Card className="max-w-lg mx-auto">
   
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">Site Name</Label>
              <Input
                id="siteName"
                placeholder="my epic site"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="siteUrl">Site URL(s)</Label>
              <Textarea
                id="siteUrl"
                value={siteUrl}
                placeholder="Please place one link per line"
                onChange={(e) => setSiteUrl(e.target.value)}
                required
              />
              <p className="text-sm text-muted-foreground">
                Each link must be on its own line and must be a valid URL.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="siteImage">Site Image (URL)</Label>
              <Input
                id="siteImage"
                type="url"
                value={siteImage}
                placeholder="https://lunaar.org/media/logo.svg"
                onChange={(e) => setSiteImage(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="siteDescription">Site Description</Label>
              <Textarea
                id="siteDescription"
                value={siteDescription}
                onChange={(e) => setSiteDescription(e.target.value)}
                rows={3}
                placeholder="A short description of the site"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="discordUrl">Discord URL (Optional)</Label>
              <Input
                id="discordUrl"
                type="url"
                value={discordUrl}
                placeholder="https://dsc.gg/parcoil"
                onChange={(e) => setDiscordUrl(e.target.value)}
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Submitting…" : "Submit Site"}
            </Button>
          </form>

          <div className="mt-6 space-y-2 text-sm text-muted-foreground">
            <p>
              You will need to wait for an admin to approve your site. If you need
              help, join our discord:{" "}
              <a href="https://dsc.gg/parcoil">https://dsc.gg/parcoil</a>
            </p>
            <p>
              You can also request a site to be added in our discord server.{" "}
              <span className="text-primary">
                If you would like to update a site and you are not the owner create a ticket in our discord
                server
              </span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Submit;
