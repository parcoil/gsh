import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";
import { useNavigate } from "react-router";

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
    <div>
      <div className="max-w-lg mx-auto mt-5 p-6 bg-gray-800 text-white rounded-lg shadow-lg mb-5">
        <h1 className="text-2xl font-bold mb-6">Submit a Site</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block mb-1">Site Name</label>
            <input
              type="text"
              placeholder="my epic site"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              required
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block mb-1">Site URL(s)</label>
            <textarea
              value={siteUrl}
              placeholder="Please place one link per line"
              onChange={(e) => setSiteUrl(e.target.value)}
              required
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:border-blue-500 focus:outline-none"
            />
            <p className="text-sm text-gray-400 mt-1">
              Each link must be on its own line and must be a valid URL.
            </p>
          </div>

          <div>
            <label className="block mb-1">Site Image (URL)</label>
            <input
              type="url"
              value={siteImage}
              placeholder="https://lunaar.org/media/logo.svg"
              onChange={(e) => setSiteImage(e.target.value)}
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block mb-1">Site Description</label>
            <textarea
              value={siteDescription}
              onChange={(e) => setSiteDescription(e.target.value)}
              rows={3}
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:border-blue-500 focus:outline-none"
              placeholder="A short description of the site"
            />
          </div>

          <div>
            <label className="block mb-1">Discord URL</label>
            <input
              type="url"
              value={discordUrl}
              placeholder="https://dsc.gg/parcoil"
              onChange={(e) => setDiscordUrl(e.target.value)}
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-medium transition disabled:opacity-50"
          >
            {loading ? "Submitting…" : "Submit Site"}
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-400">
          You will need to wait for an admin to approve your site. If you need
          help, join our discord:{" "}
          <a href="https://dsc.gg/parcoil" className="text-blue-400">
            https://dsc.gg/parcoil
          </a>
        </p>
        <p className="mt-4 text-sm text-gray-300">
          You can also request a site to be added in our discord server.{" "}
          <span className="text-blue-500">
            If you would like to update a site create a ticket in our discord
            server
          </span>
        </p>
      </div>
    </div>
  );
}

export default Submit;
