/* ───────────────────────────────────────────────────────────────────────
   Infos globales du site — métadonnées, sitemap, robots, image OpenGraph
   et données structurées.

   L'URL publique vient de NEXT_PUBLIC_SITE_URL (.env.local / Vercel).
   À défaut, Vercel fournit VERCEL_PROJECT_PRODUCTION_URL automatiquement.
   ─────────────────────────────────────────────────────────────────────── */

const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, "");
const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : undefined;

export const siteUrl = envUrl || vercelUrl || "http://localhost:3000";

export const siteName = "Matthieu Feracho";

export const siteTitle = "Matthieu Feracho — Bienvenue chez moi";

export const siteDescription =
  "Le portfolio de Matthieu Feracho, co-fondateur de Krylos, agence web à Villejuif. Entrez dans son appartement : ses réalisations passent à la télé, ses outils sont accrochés au mur.";

export const ogDescription =
  "Co-fondateur de Krylos, agence web à Villejuif. Un portfolio qui se visite comme un appartement.";
