import { supabase } from '../utils/supabase'
import { getUrl } from '../utils/getUrl'

export default function GoogleLogin() {
    const url = getUrl()
    console.log(url)
  async function signInWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: url,
      }
    })
    if (error) alert(error.message)
  }

  return (
    <button
      className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded transition-all hover:scale-105 active:scale-95"
      onClick={signInWithGoogle}
    >
      Sign in with Google
    </button>
  )
}
