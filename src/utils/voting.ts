import { supabase } from './supabase';

type VoteResult =
  | { status: 'ok' }
  | { status: 'local_cooldown' }
  | { status: 'rate_limited' }
  | { status: 'error'; error: unknown };

async function sha256Hex(str: string): Promise<string> {
  const enc = new TextEncoder();
  const data = enc.encode(str);
  const hash = await crypto.subtle.digest('SHA-256', data);
  const bytes = new Uint8Array(hash);
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function getPublicIp(): Promise<string> {
  const res = await fetch('https://api.ipify.org?format=json');
  if (!res.ok) throw new Error('Failed to fetch public IP');
  const data = await res.json();
  return data.ip;
}

function truncateIp(ip: string): string {
  if (ip.includes('.')) {
    return ip.split('.').slice(0, 3).join('.');
  }
  return ip;
}

export async function voteWithClientIp(itemId: string, windowMinutes = 5): Promise<VoteResult> {
  const localKey = `voted-${itemId}`;
  const last = localStorage.getItem(localKey);
  const cooldown = windowMinutes * 60 * 1000;
  
  if (last && (Date.now() - Number(last) < cooldown)) {
    return { status: 'local_cooldown' };
  }

  try {
    const ip = await getPublicIp();
    const truncated = truncateIp(ip);
    const ipHash = await sha256Hex(truncated);
    
    const { data, error } = await supabase.rpc('vote_if_allowed_by_iphash', {
      p_ip_hash: ipHash,
      p_item: itemId,
      p_window_minutes: windowMinutes
    });

    if (error) {
      console.error('Voting error:', error);
      return { status: 'error', error };
    }

    if (data === 'ok') {
      localStorage.setItem(localKey, Date.now().toString());
      return { status: 'ok' };
    } else if (data === 'rate_limited') {
      return { status: 'rate_limited' };
    }

    return { status: 'error', error: 'Unexpected response from server' };
  } catch (error) {
    console.error('Voting failed:', error);
    return { status: 'error', error };
  }
}
