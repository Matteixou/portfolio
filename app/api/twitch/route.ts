import { statutTwitch } from "@/lib/twitch";

/* ───────────────────────────────────────────────────────────────────────
   La chaîne Twitch est-elle en live ? Réponse mise en cache une minute :
   un seul appel à Twitch par minute, quel que soit le nombre de visiteurs.
   ─────────────────────────────────────────────────────────────────────── */

export const dynamic = "force-static";
export const revalidate = 60;

export async function GET() {
  return Response.json(await statutTwitch());
}
