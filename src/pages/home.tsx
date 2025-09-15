import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";
import { useNavigate } from "react-router";
import type {Site} from "../types/site";


function Home() {
  const [sites, setSites] = useState<Site[]>([]);
  const [search, setSearch] = useState("");
  const router = useNavigate();

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
    <div className="m-4 flex flex-col items-center max-w-7xl mx-auto">
      <img src="/logo512.png" alt="" width={100}   height={100}/>
      <h1 className="text-4xl font-bold mb-8 text-center">Game Sites Hub (Beta)</h1>

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
                src={`https://corsproxy.io/?url=${site.site_image}`}
                alt={site.site_name}
                className="min-w-15 max-h-17 rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">{site.site_name}</h3>
              <p className="text-gray-300 text-sm mb-2 lg:line-clamp-3">
                {site.site_description}
              </p>
            </div>
            <div className="">
              <p className="text-gray-400 text-xs mb-2">
                Added: {new Date(site.created_at).toLocaleDateString()}
              </p>
              <div className="w-full flex justify-center text-center">
                <a
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-4 rounded transition"
                  onClick={() => router(`/site/${site.id}`)}
                  href={`/site/${site.id}`}
                >
                  View
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
