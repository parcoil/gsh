import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";

type Site = {
  id: number;
  created_at: string;
  site_name: string;
  site_url: string;
  site_image: string;
  site_description: string;
};

function Home() {
  const [sites, setSites] = useState<Site[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function getSites() {
      const { data: sites, error } = await supabase
        .from("sites")
        .select(
          "id, created_at, site_name, site_url, site_image, site_description"
        )
        .eq("approved", true);

      if (error) console.error(error);
      if (sites && sites.length > 0) setSites(sites as Site[]);
    }

    getSites();
  }, []);

  const filteredSites = sites.filter((site) =>
    site.site_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="m-4 flex flex-col items-center">
      <img src="/logo512.png" alt="" width={100} />
      <h1 className="text-4xl font-bold mb-8 text-center">Game Sites Hub</h1>

      <input
        type="text"
        placeholder="Search for a game site"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-md px-4 py-2 text-gray-200 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 placeholder-gray-500 mb-5"
      />

      {filteredSites.length === 0 && (
        <p className="text-center text-gray-400">No sites available.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredSites.map((site) => (
          <div
            key={site.id}
            className="bg-gray-800 p-6 rounded-xl shadow-lg hover:scale-105 transform transition duration-300 flex flex-col justify-between max-w-5xl"
          >
            <div>
              <img
                src={site.site_image}
                alt={site.site_name}
                className="w-full h-15 rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">{site.site_name}</h3>
              <p className="text-gray-300 text-sm mb-2 line-clamp-3">
                {site.site_description}
              </p>
              <a
                href={site.site_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline break-all text-sm"
              >
                {site.site_url}
              </a>
            </div>
            <div className="mt-4">
              <p className="text-gray-400 text-xs mb-2">
                Added: {new Date(site.created_at).toLocaleDateString()}
              </p>
              <div>
                <button
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-4 rounded transition"
                  onClick={() => window.open(site.site_url)}
                >
                  Visit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
