import { stream } from "@/data/stream";

/* ───────────────────────────────────────────────────────────────────────
   Le vrai statut de la chaîne Twitch (API officielle « Helix »).
   Il faut une application Twitch (gratuite, https://dev.twitch.tv/console)
   et ses deux clés : TWITCH_CLIENT_ID et TWITCH_CLIENT_SECRET.
   Sans elles, le site se fie aux horaires de data/stream.ts.
   ─────────────────────────────────────────────────────────────────────── */

export interface StatutTwitch {
  /** "twitch" : statut réel ; "horaires" : Twitch non configuré ou injoignable */
  source: "twitch" | "horaires";
  enDirect: boolean;
  jeu?: string;
  titre?: string;
  spectateurs?: number;
  /** début du live (ISO) */
  depuis?: string;
}

const ID = process.env.TWITCH_CLIENT_ID;
const SECRET = process.env.TWITCH_CLIENT_SECRET;

/** Jeton d'application, gardé en mémoire jusqu'à son expiration */
let jeton: { valeur: string; expire: number } | null = null;

async function jetonApplication() {
  if (jeton && jeton.expire > Date.now()) return jeton.valeur;
  const res = await fetch("https://id.twitch.tv/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_id: ID!, client_secret: SECRET!, grant_type: "client_credentials" }),
  });
  if (!res.ok) throw new Error(`Twitch (jeton) : ${res.status}`);
  const json = (await res.json()) as { access_token: string; expires_in: number };
  jeton = { valeur: json.access_token, expire: Date.now() + (json.expires_in - 300) * 1000 };
  return jeton.valeur;
}

interface LiveHelix {
  type: string;
  game_name: string;
  title: string;
  viewer_count: number;
  started_at: string;
}

async function interrogerTwitch(nouvelEssai = true): Promise<StatutTwitch> {
  const res = await fetch(`https://api.twitch.tv/helix/streams?user_login=${encodeURIComponent(stream.pseudo)}`, {
    headers: { "Client-Id": ID!, Authorization: `Bearer ${await jetonApplication()}` },
    next: { revalidate: 60 },
  });
  // jeton révoqué ou expiré : on en redemande un, une seule fois
  if (res.status === 401 && nouvelEssai) {
    jeton = null;
    return interrogerTwitch(false);
  }
  if (!res.ok) throw new Error(`Twitch (streams) : ${res.status}`);
  const live = ((await res.json()) as { data?: LiveHelix[] }).data?.[0];
  if (live?.type !== "live") return { source: "twitch", enDirect: false };
  return {
    source: "twitch",
    enDirect: true,
    jeu: live.game_name || undefined,
    titre: live.title || undefined,
    spectateurs: live.viewer_count,
    depuis: live.started_at,
  };
}

export async function statutTwitch(): Promise<StatutTwitch> {
  if (!ID || !SECRET) return { source: "horaires", enDirect: false };
  try {
    return await interrogerTwitch();
  } catch (err) {
    console.error("Statut Twitch indisponible :", err);
    return { source: "horaires", enDirect: false };
  }
}
