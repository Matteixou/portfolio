import { changerStatut, lire, verifier, type Action } from "@/lib/livre-dor";

/* ───────────────────────────────────────────────────────────────────────
   Modération du livre d'or, depuis l'email reçu par Matthieu.
   GET  : page de confirmation (les antivirus de messagerie « cliquent »
          parfois les liens : un simple GET ne publie donc rien)
   POST : publie ou refuse le post-it, si le jeton signé est valide.
   ─────────────────────────────────────────────────────────────────────── */

const echapper = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

function page(titre: string, corps: string, statut = 200) {
  return new Response(
    `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${titre}</title>
<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#1c140f;font:16px/1.5 system-ui,sans-serif;color:#3a281d}
main{background:#f6efe4;border-radius:22px;padding:28px 32px;max-width:440px;margin:16px;box-shadow:0 24px 60px -24px #000}
h1{font:600 26px Georgia,serif;margin:0 0 12px}.postit{background:#fff3b8;padding:14px 16px;border-radius:4px;transform:rotate(-1.5deg);margin:16px 0}
button{font:600 15px system-ui;border:0;border-radius:999px;padding:12px 20px;cursor:pointer;color:#f6efe4;background:#a3431f}button.non{background:#6a4b36}
a{color:#8a5530}</style></head><body><main>${corps}</main></body></html>`,
    { status: statut, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } },
  );
}

function lireParametres(params: URLSearchParams) {
  const id = params.get("id") ?? "";
  const action = params.get("action") as Action | null;
  const jeton = params.get("jeton") ?? "";
  const valide = (action === "publier" || action === "refuser") && id && jeton && verifier(id, action, jeton);
  return valide ? { id, action: action as Action, jeton } : null;
}

export async function GET(req: Request) {
  const demande = lireParametres(new URL(req.url).searchParams);
  if (!demande) return page("Lien invalide", "<h1>Lien invalide</h1><p>Ce lien de modération n'est pas valide.</p>", 400);
  const postit = await lire(demande.id);
  if (!postit) return page("Introuvable", "<h1>Post-it introuvable</h1>", 404);
  const verbe = demande.action === "publier" ? "Publier" : "Refuser";
  return page(
    `${verbe} ce post-it ?`,
    `<h1>${verbe} ce post-it ?</h1>
     <div class="postit"><strong>${echapper(postit.pseudo)}</strong><br>${echapper(postit.message)}</div>
     <p>Statut actuel : ${postit.statut === "attente" ? "en attente" : postit.statut === "publie" ? "publié" : "refusé"}.</p>
     <form method="post">
       <input type="hidden" name="id" value="${demande.id}"><input type="hidden" name="action" value="${demande.action}"><input type="hidden" name="jeton" value="${demande.jeton}">
       <button type="submit" class="${demande.action === "refuser" ? "non" : ""}">${verbe}</button>
     </form>`,
  );
}

export async function POST(req: Request) {
  const formulaire = await req.formData();
  const params = new URLSearchParams();
  for (const cle of ["id", "action", "jeton"]) params.set(cle, String(formulaire.get(cle) ?? ""));
  const demande = lireParametres(params);
  if (!demande) return page("Lien invalide", "<h1>Lien invalide</h1>", 400);
  const maj = await changerStatut(demande.id, demande.action === "publier" ? "publie" : "refuse");
  if (!maj) return page("Introuvable", "<h1>Post-it introuvable</h1>", 404);
  return page(
    "C'est fait",
    demande.action === "publier"
      ? `<h1>Collé sur le frigo !</h1><p>Le post-it de <strong>${echapper(maj.pseudo)}</strong> est maintenant visible (d'ici une minute).</p>`
      : `<h1>Post-it refusé</h1><p>Il ne sera pas affiché.</p>`,
  );
}
