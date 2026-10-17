/* ───────────────────────────────────────────────────────────────────────
   npm run salon — fabrique les images du décor fixe.

   Les dessins de components/appart/scene/decor.tsx sont rendus en fichiers
   autonomes dans public/salon/. Chaque nom porte une empreinte du contenu
   (cache navigateur d'un an sans risque), et salon.json indique à la scène
   quel fichier charger.

   Les calques chargés de détails (feuilles, motifs, disques…) deviennent
   des WebP en double définition : agrandir un bitmap au zoom de la caméra
   ne coûte presque rien, alors que redessiner un SVG complexe fige l'écran.
   Les calques simples (dégradés, ciel) restent en SVG, plus légers.
   ─────────────────────────────────────────────────────────────────────── */

import sharp from "sharp";
import { build } from "esbuild";
import { createHash } from "node:crypto";
import { mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const racine = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dossier = path.join(racine, "public", "salon");
const temporaire = path.join(racine, "scripts", ".salon.tmp.mjs");

/** Calques rendus en bitmap. Définition ×1,5 : affichés à plus de la moitié de
    leur taille, Chrome les décode en entier dès le départ (sinon il les
    re-décode au zoom de la caméra, ce qui fige l'écran), et ils restent nets. */
const BITMAPS = new Set(["fond", "meubles", "meubles-noel", "avant", "masque-vitre", "gymnase-fond", "studio-fond", "studio-meubles"]);
const DEFINITION = 1.5;

await build({
  entryPoints: [path.join(racine, "components/appart/scene/statiques.tsx")],
  bundle: true,
  platform: "node",
  format: "esm",
  jsx: "automatic",
  outfile: temporaire,
  alias: { "@": racine },
  external: ["react", "react-dom"],
  logLevel: "warning",
});

try {
  const { CALQUES } = await import(pathToFileURL(temporaire).href);
  const { renderToStaticMarkup } = await import("react-dom/server");
  const { createElement } = await import("react");

  mkdirSync(dossier, { recursive: true });
  for (const ancien of readdirSync(dossier)) rmSync(path.join(dossier, ancien));

  const manifeste = {};
  for (const [nom, Calque] of Object.entries(CALQUES)) {
    const svg = renderToStaticMarkup(createElement(Calque));
    const empreinte = createHash("sha1").update(svg).digest("hex").slice(0, 10);
    const enBitmap = BITMAPS.has(nom);
    const fichier = `${nom}.${empreinte}.${enBitmap ? "webp" : "svg"}`;
    const contenu = enBitmap
      ? await sharp(Buffer.from(svg), { density: 72 * DEFINITION }).webp({ quality: 84, effort: 6 }).toBuffer()
      : svg;
    writeFileSync(path.join(dossier, fichier), contenu);
    manifeste[nom] = `/salon/${fichier}`;
    console.log(`  ${fichier.padEnd(34)} ${(contenu.length / 1024).toFixed(1)} Ko`);
  }
  writeFileSync(
    path.join(racine, "components/appart/scene/salon.json"),
    `${JSON.stringify(manifeste, null, 2)}\n`,
  );
  console.log("salon.json mis à jour.");
} finally {
  rmSync(temporaire, { force: true });
}
