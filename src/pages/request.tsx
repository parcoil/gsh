import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxMioxwxmCFrDF6rRampd_8OysAgXIsR2P8bvb2BbxqOjbYl_76_MFxr-6a2BQ4K7oE/exec';

export default function RequestPage() {
  const [formData, setFormData] = useState({
    site_name: "",
    site_url: "",
    site_description: "",
    reason_for_addition: "",
    discord_link: "",
    requester_email: ""
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    

    if (!formData.site_name.trim() || !formData.site_url.trim() || !formData.site_description.trim() || !formData.reason_for_addition.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.discord_link && !formData.discord_link.match(/^https?:\/\/(www\.)?discord\.(gg|com)\//)) {
      toast.error("Please enter a valid Discord invite link");
      return;
    }

    try {
      new URL(formData.site_url);
    } catch (e) {
      toast.error("Please enter a valid URL (include http:// or https://)");
      return;
    }

    setLoading(true);

    try {
     //@ts-ignore
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          timestamp: new Date().toISOString(),
        }),
      });

      toast.success("Request submitted successfully!");
      
      setFormData({
        site_name: "",
        site_url: "",
        site_description: "",
        reason_for_addition: "",
        discord_link: "",
        requester_email: ""
      });
      
    } catch (error) {
      console.error("Error submitting request:", error);
      toast.error("Failed to submit request. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Request a Site</h1>
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          {/* <CardTitle>Request a Site</CardTitle> */}
          <p className="text-sm text-muted-foreground">
            Suggest a site to be added to our directory. We'll review your submission and add it if appropriate.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="site_name">Site Name *</Label>
              <Input
                id="site_name"
                name="site_name"
                value={formData.site_name}
                onChange={handleChange}
                placeholder="e.g., Cool Games Hub"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="site_url">Site URL *</Label>
              <Input
                id="site_url"
                name="site_url"
                type="url"
                value={formData.site_url}
                onChange={handleChange}
                placeholder="https://example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="site_description">Site Description *</Label>
              <Textarea
                id="site_description"
                name="site_description"
                value={formData.site_description}
                onChange={handleChange}
                placeholder="Provide a brief description of the site"
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason_for_addition">Why should this site be added? *</Label>
              <Textarea
                id="reason_for_addition"
                name="reason_for_addition"
                value={formData.reason_for_addition}
                onChange={handleChange}
                placeholder="Explain why this site would be valuable to our community"
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="discord_link">Discord Invite Link (Optional)</Label>
              <Input
                id="discord_link"
                name="discord_link"
                type="url"
                value={formData.discord_link}
                onChange={handleChange}
                placeholder="https://discord.gg/example"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requester_email">Your Email (Optional)</Label>
              <Input
                id="requester_email"
                name="requester_email"
                type="email"
                value={formData.requester_email}
                onChange={handleChange}
                placeholder="email@example.com"
              />
              <p className="text-xs text-muted-foreground">
                Provide your email if you'd like to be notified when the site is added.
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Submitting..." : "Submit Request"}
            </Button>
          </form>
          
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Are you a site owner? <a href="/submit" className="text-primary hover:underline">Submit your site directly</a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}