import { useState, useEffect } from "react";
import { useParams } from "react-router"; 
import { supabase } from "../utils/supabase";
import type { Site } from "../types/site";

export default function SitePage() {
  const { id } = useParams<{ id: string }>();
  const [site, setSite] = useState<Site | null>(null);

  useEffect(() => {
    async function getSite() {
      const { data, error } = await supabase
        .from("sites")
        .select("id, created_at, site_name, site_url, site_image, site_description")
        .eq("id", Number(id))
        .single();

      if (error) {
        console.error("Error fetching site:", error);
      } else {
        setSite(data);
      }
    }

    if (id) {
      getSite();
    }
  }, [id]);

  if (!site) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-400">
        Loading site...
      </div>
    );
  }

  const siteLinks = site.site_url
    ? site.site_url.split("\n").map((url) => url.trim()).filter(Boolean)
    : [];

  return (
    <div className="flex justify-center py-10 px-4">
      <div className="bg-gray-800 text-white p-8 rounded-2xl shadow-xl max-w-xl w-full">
        <h1 className="text-3xl font-bold mb-4">{site.site_name}</h1>

        <img
          src={`https://corsproxy.io/?url=${site.site_image}`}
          alt={site.site_name}
          className="rounded-xl mb-6 max-h-64 max-w-full bg-gray-600 "
        />

        <p className="text-gray-300 mb-6">{site.site_description}</p>

        <div>
          <h2 className="text-xl font-semibold mb-3">Site Links</h2>
          <ul className="space-y-2">
            {siteLinks.map((url, i) => (
              <li key={i}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  {url}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
