import { supabase } from '../utils/supabase'
import { getUrl } from '../utils/getUrl'
import { Button } from "@/components/ui/button"

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
    <Button
      variant="default"
      className="transition-all hover:scale-105 active:scale-95"
      onClick={signInWithGoogle}
    >
      Sign in with Google
    </Button>
  )
}
