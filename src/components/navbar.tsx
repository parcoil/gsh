import { useState, useEffect } from "react"
import { supabase } from "../utils/supabase"
import { getUrl } from "../utils/getUrl"

const Navbar = () => {
    const url = getUrl()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({ provider: "google",      options: {
        redirectTo: url,
      } }

    )
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  const userPfp =
    user?.user_metadata?.avatar_url || "https://parcoil.com/parcoil.png"

  return (
    <nav className="bg-gray-800 shadow-lg mb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <img src="/logo512.png" alt="Logo" width={40} />
              <span className="text-white text-xl font-bold ml-5">
                GSH (Beta)
              </span>
            </a>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <a
              href="/"
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Sites
            </a>
            <a
              href="/submit"
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Submit a site
            </a>
            {/* <a
              href="/about"
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              About
            </a> */}
            {user ? (
              <img
                src={userPfp}
                alt="Profile"
                onClick={signOut}
                title="Click to log out"
                className="w-10 h-10 rounded-full cursor-pointer hover:ring-2 hover:ring-blue-500"
              />
            ) : (
              <button
                onClick={signInWithGoogle}
                className="bg-blue-500 px-3 py-2 rounded-md text-sm font-medium text-white cursor-pointer hover:scale-105 active:scale-95 transition-all"
              >
                Log In
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
