import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";

/* ───────────────────────────────────────────────────────────────────────
   Le livre d'or : les post-its que les visiteurs collent sur le frigo.

   Stockage : Upstash Redis, via son API REST (pas de dépendance).
   Variables : UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN.
   Sans elles, en développement, les post-its vivent en mémoire (perdus au
   redémarrage) ; en production, le livre d'or reste fermé.

   Modération : chaque post-it arrive « en attente ». Matthieu reçoit un
   email avec deux liens signés (LIVRE_DOR_SECRET) pour le publier ou le
   refuser. Rien n'est affiché sans son accord.
   On ne garde que le pseudo, le message, la couleur et la date.
   ─────────────────────────────────────────────────────────────────────── */

export const COULEURS = ["jaune", "rose", "bleu", "vert"] as const;
export type Couleur = (typeof COULEURS)[number];
export type Statut = "attente" | "publie" | "refuse";
export type Action = "publier" | "refuser";

export interface PostIt {
  id: string;
  pseudo: string;
  message: string;
  couleur: Couleur;
  date: string;
  statut: Statut;
}

/** Ce que le public voit d'un post-it */
export type PostItPublic = Omit<PostIt, "statut">;

export const LIMITES = { pseudo: 30, message: 240 } as const;

const CLE = "livredor:postits";
// noms d'Upstash, ou ceux que pose la base « Upstash for Redis » créée depuis Vercel (onglet Storage)
const URL_REDIS = (process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL)?.replace(/\/+$/, "");
const JETON_REDIS = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
// sans LIVRE_DOR_SECRET, un secret est dérivé de la clé Resend (déjà
// secrète, et indispensable à la modération) : une variable de moins à poser
const SECRET =
  process.env.LIVRE_DOR_SECRET ||
  (process.env.RESEND_API_KEY ? createHmac("sha256", process.env.RESEND_API_KEY).update("livre-dor").digest("hex") : undefined);

export const enProduction = process.env.NODE_ENV === "production";

export function stockageDisponible() {
  return Boolean(URL_REDIS && JETON_REDIS) || !enProduction;
}

export function moderationDisponible() {
  return Boolean(SECRET) || !enProduction;
}

/* ─── Stockage ─────────────────────────────────────────────────────── */

async function redis<T>(commande: (string | number)[]): Promise<T> {
  const res = await fetch(URL_REDIS!, {
    method: "POST",
    headers: { Authorization: `Bearer ${JETON_REDIS}`, "Content-Type": "application/json" },
    body: JSON.stringify(commande),
    cache: "no-store",
  });
  const json = (await res.json()) as { result?: T; error?: string };
  if (!res.ok || json.error) throw new Error(json.error ?? `Redis ${res.status}`);
  return json.result as T;
}

/* Repli en mémoire pour le développement (survit au rechargement à chaud) */
const memoire = ((globalThis as { __livreDor?: Map<string, PostIt> }).__livreDor ??= new Map<string, PostIt>());
const compteurs = ((globalThis as { __livreDorLimites?: Map<string, { n: number; fin: number }> }).__livreDorLimites ??=
  new Map());

const avecRedis = () => Boolean(URL_REDIS && JETON_REDIS);

export async function enregistrer(postit: PostIt) {
  if (avecRedis()) await redis(["HSET", CLE, postit.id, JSON.stringify(postit)]);
  else memoire.set(postit.id, postit);
}

export async function lireTous(): Promise<PostIt[]> {
  if (!avecRedis()) return [...memoire.values()];
  const plat = await redis<string[]>(["HGETALL", CLE]);
  const liste: PostIt[] = [];
  for (let i = 1; i < plat.length; i += 2) {
    try {
      liste.push(JSON.parse(plat[i]) as PostIt);
    } catch {
      // entrée illisible : ignorée
    }
  }
  return liste;
}

export async function lire(id: string): Promise<PostIt | null> {
  if (!avecRedis()) return memoire.get(id) ?? null;
  const brut = await redis<string | null>(["HGET", CLE, id]);
  return brut ? (JSON.parse(brut) as PostIt) : null;
}

export async function publies(): Promise<PostItPublic[]> {
  return (await lireTous())
    .filter((p) => p.statut === "publie")
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 60)
    .map((p) => ({ id: p.id, pseudo: p.pseudo, message: p.message, couleur: p.couleur, date: p.date }));
}

export async function changerStatut(id: string, statut: Statut) {
  const postit = await lire(id);
  if (!postit) return null;
  const maj = { ...postit, statut };
  await enregistrer(maj);
  return maj;
}

/** Au plus 3 post-its par heure et par visiteur (adresse IP hachée) */
export async function autoriser(ip: string) {
  const cle = `livredor:limite:${createHmac("sha256", SECRET ?? "dev").update(ip).digest("hex").slice(0, 24)}`;
  if (avecRedis()) {
    const n = await redis<number>(["INCR", cle]);
    if (n === 1) await redis(["EXPIRE", cle, 3600]);
    return n <= 3;
  }
  const maintenant = Date.now();
  const c = compteurs.get(cle);
  if (!c || c.fin < maintenant) {
    compteurs.set(cle, { n: 1, fin: maintenant + 3_600_000 });
    return true;
  }
  c.n += 1;
  return c.n <= 3;
}

export function nouvelId() {
  return randomUUID();
}

/* ─── Liens de modération signés ───────────────────────────────────── */

export function signer(id: string, action: Action) {
  return createHmac("sha256", SECRET ?? "dev-seulement").update(`${id}:${action}`).digest("hex");
}

export function verifier(id: string, action: Action, jeton: string) {
  const attendu = Buffer.from(signer(id, action));
  const recu = Buffer.from(jeton);
  return attendu.length === recu.length && timingSafeEqual(attendu, recu);
}
