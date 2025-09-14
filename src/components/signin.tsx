'use client'
import { supabase } from '../utils/supabase'

export default function GoogleLogin() {
  async function signInWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    })
    if (error) alert(error.message)
  }

  return (
    <button
      className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded"
      onClick={signInWithGoogle}
    >
      Sign in with Google
    </button>
  )
}
